const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/paima_atelier';
async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const booking = await db.collection('bookings').findOne({ bookingId: 'PAIMA-BK-65482' });
  console.log('Booking found:', !!booking, booking?.fullName);
  const message = await db.collection('messages').findOne({ subject: { $regex: 'PAIMA-BK-65482' } });
  console.log('Message found:', !!message, message?.subject);
  await client.close();
}
run().catch(console.error);
