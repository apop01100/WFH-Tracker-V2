import cron from 'node-cron';
import moment from 'moment-timezone';
import db from '../config/db.js';

cron.schedule('* * * * *', async () => {
  const nowWIB = moment().tz('Asia/Jakarta'); // WIB is Asia/Jakarta
  const currentTime = nowWIB.format('HH:mm');

  if (currentTime === '07:00') {
    const today = nowWIB.format('YYYY-MM-DD');

    try {
      const users = await db('user').select('id');

      for (const user of users) {
        const existing = await db('user_attendance')
          .where({ user_id: user.id, date: today })
          .first();

        if (!existing) {
          await db('user_attendance').insert({
            user_id: user.id,
            date: today,
          });
          console.log(`Inserted attendance for user ${user.id} on ${today}`);
        } else {
          console.log(`Attendance already exists for user ${user.id} on ${today}`);
        }
      }

      console.log(`Attendance check completed for ${today}`);
    } catch (error) {
      console.error('Error during attendance cron job:', error);
    }
  }
});
