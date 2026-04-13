import mongoose, { Mongoose } from 'mongoose';

declare global {
    var mongoose: {
      conn: Mongoose | null,
      promise: Promise<Mongoose> | null
    }
  }

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then(async (mongoose) => {
      try {
        const db = mongoose.connection.db;
        if (db) {
          await db.collection('binshare.files').createIndex(
            { "metadata.expiresAt": 1 }, // The field to watch
            { expireAfterSeconds: 0 }    // Delete exactly at the timestamp
          );
          console.log("Database initialized: TTL Index ensured.");
        }
      } catch (err) {
        console.error("Failed to ensure TTL index:", err);
      }
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;