import knex from 'knex';
import db from '../config/db.js';

export const Attendance = {
    markAttendance: async (userId, dateTime, imgUrl) => {
        const trx = await db.transaction();

        const [date, time] = dateTime.split(' ');

        try {
            const getUser = await trx('user').select('id', 'username', 'password').where('id', userId).first()

            if (!getUser) {
                throw new Error("User doesn't exists");
            }

            const existingAttendance = await trx('user_attendance')
                .where({
                    user_id: userId,
                    date: date,
                })
                .first();

            if (!existingAttendance) {
                throw new Error("Attendance doesn't exist");
            }

            const absentAttendance = await trx('user_attendance')
                .where({
                    user_id: userId,
                    date: date,
                    status: 'present',
                })
                .first();

            if (absentAttendance) {
                throw new Error('You already present');
            }

            const updatedId = await trx('user_attendance')
                .where({
                    user_id: userId,
                    date: date,
                })
                .update({
                    status: 'present',
                    img_url: imgUrl,
                    time: time,
                    updated_at: dateTime,
                });

            await trx.commit();

            const markedAttendance = await db('user_attendance').where('id', updatedId).first();
            return markedAttendance;
        } catch (error) {
            await trx.rollback();
            console.error('Manual transaction rollback:', error);
            throw error;
            return null
        }
    },

    getUserAttendance: async (userId, limit, offset) => {
        try {
            return db('user_attendance')
                .select('*')
                .where('user_id', userId)
                .orderBy([{ column: 'date', order: 'desc' }, { column: 'time', order: 'desc' }])
                .limit(limit).offset(offset);
        }
        catch (error) {
            console.error('Error fetching attendances:', error);
            throw new Error('Failed to retrieve attendances');
        }
    },

    getAllAttendance: async (limit, offset) => {
        try {
            return db('user_attendance').leftJoin('user', 'user_attendance.user_id', 'user.id')
            .select(
                'user_attendance.id as attendance_id',
                'user_attendance.date',
                'user_attendance.time',
                'user_attendance.status',
                'user_attendance.img_url',
                'user.id as user_id',
                'user.first_name',
                'user.last_name',
                'user.username',
            )
            .orderBy([{ column: 'date', order: 'desc' }, { column: 'time', order: 'desc' }])
            .limit(limit)
            .offset(offset);
        }
        catch (error) {
            console.error('Error fetching attendances:', error);
            throw new Error('Failed to retrieve attendances');
        }
    },

    deleteAttendanceByAdmin: async (date) => {
        const trx = await db.transaction();

        try {
            const deletedAttendance = await trx('user_attendance').where('date', date).del();

            await trx.commit();

            return deletedAttendance;
        } catch (error) {
            console.error('Failed to delete attendance:', error);
            throw error;
            return null;
        }
    },

    createAttendance: async (dateTime) => {
        const trx = await db.transaction();
        const [date] = dateTime.split(' ');

        try {
            const users = await trx('user').select('id');

            const insertedAttendance = [];

            for (const user of users) {
            const existing = await trx('user_attendance')
                .where({ user_id: user.id, date })
                .first();

            if (!existing) {
                const [inserted] = await trx('user_attendance')
                .insert({
                    user_id: user.id,
                    date: date,
                })
                .returning('*');

                insertedAttendance.push(inserted);
            }
            }

            await trx.commit();
            return insertedAttendance;
        } catch (error) {
            await trx.rollback();
            console.error('Manual transaction rollback:', error);
            throw error;
        }
    },
}