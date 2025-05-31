import db from '../config/db.js';

export const Attendance = {
    createAttendance: async (userId, attendanceAt, imgUrl) => {
        const trx = await db.transaction();

        try {
            const getUser = await trx('user').select('id', 'username', 'password').where('id', userId).first()

            if (!getUser) {
                throw new Error("User doesn't exists");
            }

            const existingAttendance = await trx('user_attendance')
                .where('user_id', userId)
                .andWhereRaw('DATE(attendance_at) = DATE(?)', [attendanceAt])
                .first();

            if (existingAttendance) {
                throw new Error('Attendance for today already exists');
            }

            const [insertedId] = await trx('user_attendance').insert({
                user_id: userId,
                attendance_at: attendanceAt,
                img_url: imgUrl
            });

            await trx.commit();

            const createdAttendance = await db('user_attendance').where('id', insertedId).first();
            return createdAttendance;
        } catch (error) {
            await trx.rollback();
            console.error('Manual transaction rollback:', error);
            throw error;
            return null
        }
    },

    getUserAttendance: async (userId, limit, offset) => {
        try {
            return db('user_attendance').select('*').where('user_id', userId).limit(limit).offset(offset);
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
                'user_attendance.attendance_at',
                'user_attendance.img_url',
                'user.id as user_id',
                'user.first_name',
                'user.last_name',
                'user.username',
            )
            .limit(limit)
            .offset(offset);
        }
        catch (error) {
            console.error('Error fetching attendances:', error);
            throw new Error('Failed to retrieve attendances');
        }
    },

    deleteAttendanceByUser: async (userId, date) => {
        const trx = await db.transaction();

        try {
            const getUser = await trx('user').select('id').where('id', userId).first()

            if (!getUser) {
                throw new Error("User doesn't exists");
            }

            const deletedAttendance = await trx('user_attendance').where('user_id', userId).whereRaw('DATE(attendance_at) = ?', [date]).del();

            await trx.commit();

            return deletedAttendance;
        } catch (error) {
            console.error('Failed to delete attendance:', error);
            throw error;
            return null;
        }
    },
}