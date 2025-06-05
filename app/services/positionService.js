import db from '../config/db.js'

export const Position = {
    createPosition: async (position) => {
        const trx = await db.transaction();

        try {
            const [insertedId] = await trx('positions').insert({
                position: position
            })
            .returning('id');

            await trx.commit();

            const createdPosition = await db('positions').where('id', insertedId.id).first();
            return createdPosition;
        } catch (error) {
            await trx.rollback();
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Position already exists');
            }
            console.error('Manual transaction rollback:', error);
            throw error;
            return null;
        }
    },

    getAllPosition: async (limit, offset) => {
        try {
            return db('positions').select('id', 'position').limit(limit).offset(offset);
        } catch (error) {
            console.error('Error fetching position:', error);
            throw new Error('Failed to retrieve position');
        }
    },

    getPosition: async (position) => {
        try {
            return db('positions').select('id', 'position').where({ position: position });
        } catch (error) {
            console.error('Error fetching position:', error);
            throw new Error('Failed to retrieve position');
        }
    },

    upadtePosition: async (position) => {
        const trx = await db.transaction();

        try {
            const getPosition = await trx('positions').select('id').where('position', position).first()

            if (!getPosition) {
                throw new Error("Position doesn't exists");
            }


            await trx('positions').where('id', getPosition.id).update({ position: position });

            await trx.commit();

            const updatedPosition = await db('positions').where('id', getPosition.id).first();
            return updatedPosition
        } catch (error) {
            console.error('Failed to update position:', error);
            throw error;
            return null;
        }
    },

    deletePosition: async (position) => {
        const trx = await db.transaction();

        try {
            const getPosition = await trx('positions').select('id').where('position', position).first()

            if (!getPosition) {
                throw new Error("Position doesn't exists");
            }

            const deletePosition = await trx('positions').where('id', getPosition.id).del();

            await trx.commit();

            return deletePosition;
        } catch {
            console.error('Failed to delete position:', error);
            throw error;
            return null;
        }
    },
}