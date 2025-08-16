import mongoose from 'mongoose';
import 'dotenv/config';

const MongoDB = () =>{
  mongoose.connect(process.env.MONGODB_URL+'/User')
    .then(() => {
      console.log('==========================================');
      console.log('📦 Database is live!');
      console.log('🟢 MongoDB Connected Successfully');
      console.log('==========================================');
    })

    .catch((err) => {
      console.log('==========================================');
      console.error('❌ MongoDB Connection Error:', err);
      console.log('==========================================');
    });

  mongoose.connection.on('disconnected', () => {
    console.log('==========================================');
    console.log('⚠️  MongoDB Disconnected!');
    console.log('==========================================');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('==========================================');
    console.log('🔁 MongoDB Reconnected!');
    console.log('==========================================');
  });

  mongoose.connection.on('error', (err) => {
    console.log('==========================================');
    console.error('❌ MongoDB Runtime Error:', err);
    console.log('==========================================');
  });
};

MongoDB();
export default MongoDB;