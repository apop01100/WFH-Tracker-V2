import db from '../config/db.js'

export const User = {
    createUser: async (first_name, lastName, username, email, position, password) => {
        const trx = await db.transaction();

        try {
            const getPosition = await trx('positions').select('id', 'position').where('position', position).first()

            if (!getPosition) {
                throw new Error("position doesn't exists");
            }

            const [insertedId] = await trx('user').insert({
                first_name: first_name,
                last_name: lastName,
                username: username,
                email: email,
                position: getPosition.id,
                password: password,
            });

            await trx.commit();
            console.log('User created successfully');

            const createdUser = await db('user').where('id', insertedId).first();
            return createdUser;
        } catch (error) {
            await trx.rollback();
            if (error.code === 'ER_DUP_ENTRY') {
                if (error.message.includes('username')) {
                    throw new Error('Username already exists');
                } else if (error.message.includes('email')) {
                    throw new Error('Email already exists');
                }
                throw new Error('Username or email already exists');
            }
            console.error('Manual transaction rollback:', error);
            throw error;
            return null;
        }
    },

    getUserByUsername: async (username) => {
        return db('user').select('id', 'first_name', 'last_name', 'username', 'email', 'position').where('username', username).first()
    },

    getUserForLogin: async (username) => {
        return db('user').select('id', 'username', 'password').where('username', username).first()
    },

    getUserById: async (userId) => {
        return db('user').select('id', 'first_name', 'last_name', 'username', 'email', 'position').where('id', userId).first()
    },

    getAllUser: async (limit, offset) => {
        try {
            return db('user').leftJoin('positions', 'user.position_id', 'positions.id')
                .select(
                    'user.id',
                    'user.first_name',
                    'user.last_name',
                    'user.username',
                    'user.email',
                    'positions.position as position',
                )
                .limit(limit)
                .offset(offset);
        }
        catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Failed to retrieve users');
        }
    },

    updateUser: async (userId, updateData) => {
        const trx = await db.transaction();

        try {
            const existingUser = await trx('user').where('id', userId).first();
            if (!existingUser) {
                throw new Error("User doesn't exist");
            }

            if (updateData.position) {
                const positionExists = await trx('positions')
                .where('position', updateData.position)
                .first();

                
                if (!positionExists) {
                    throw new Error('Position does not exist');
                }

                updateData.position = positionExists.id
            }

            updateData.updated_at = new Date()

            await trx('user').where('id', userId).update(updateData);

            await trx.commit();

            const updatedUser = await db('user').where('id', userId).first();
            return updatedUser;

        } catch (error) {
            await trx.rollback();
            console.error('Transaction rollback during updateUser:', error);
            throw error;
            return null;
        }
    },

    deleteUser: async (username) => {
        const trx = await db.transaction();

        try {
            const getUser = await trx('user').select('id').where('username', username).first();

            if (!getUser) {
                throw new Error("User doesn't exists");
            }

            const deletedUser = await trx('user').where('id', getUser.id).del();
            await trx.commit();

            return deletedUser;
        } catch {
            console.error('Failed to delete user:', error);
            throw error;
            return null;
        }
    },

    me: async (id, role) => {
        try {
            return db(role).select('id', 'username').where({ id: id }).first();
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Failed to retrieve users');
        }
    }
}