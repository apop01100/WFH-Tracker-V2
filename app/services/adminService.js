import db from '../config/db.js'

export const Admin = {
    createAdmin: async (username, password) => {
        const trx = await db.transaction();

        try {
            const [insertedId] = await trx('admin').insert({
                username: username,
                password: password,
            }).returning('id');

            await trx.commit();
            console.log('Admin created successfully');

            const createdAdmin = await db('admin').where('id', insertedId.id).first();
            return createdAdmin;
        } catch (error) {
            await trx.rollback();
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Username already exists');
            }
            console.error('Manual transaction rollback:', error);
            throw error;
            return null;
        }
    },

    getAdminByUsername: async (username) => {
        return db('admin').select('id', 'username', 'password').where('username', username).first()
    },

    getAdminrById: async (userId) => {
        return db('admin').select('id', 'username', 'password').where('id', userId).first()
    },

    getAllAdmin: async (limit, offset) => {
        try {
            return db('admin').select('*').limit(limit).offset(offset);
        }
        catch (error) {
            console.error('Error fetching admin:', error);
            throw new Error('Failed to retrieve admin');
        }
    },
}