import mongoose, { Mongoose } from 'mongoose';

// Declare a global variable to cache the Mongoose connection.
// This prevents reconnecting to the database on every API route invocation
// during development, which can be inefficient and lead to connection issues.
declare global {
    var mongoose: {
      conn: Mongoose | null; // Stores the active Mongoose connection instance.
      promise: Promise<Mongoose> | null; // Stores the promise of the Mongoose connection.
    }
  }

// Retrieve the MongoDB URI from environment variables.
// This is crucial for connecting to the database.
const MONGODB_URI = process.env.MONGODB_URI;

// Ensure that the MONGODB_URI environment variable is defined.
// If it's not, throw an error to prevent the application from starting without a database connection string.
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Initialize a cached variable for the Mongoose connection.
// This variable will hold the connection state across hot reloads in development.
let cached = global.mongoose;

// If no cached connection exists, initialize it with null values.
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Asynchronous function to connect to the MongoDB database.
// It utilizes a cached connection to avoid redundant connections.
async function dbConnect() {
  // If a connection is already established and cached, return it immediately.
  if (cached.conn) {
    return cached.conn;
  }

  // If there's no pending connection promise, create a new one.
  if (!cached.promise) {
    // Define Mongoose connection options.
    const opts = {
      bufferCommands: false, // Disable Mongoose's internal buffering.
                            // This means Mongoose will not queue operations if the connection is down,
                            // and will instead throw errors immediately.
    };

    // Establish a new Mongoose connection using the provided URI and options.
    // The connection promise is cached to prevent multiple simultaneous connection attempts.
    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then(async (mongoose) => {
      try {
        // After a successful connection, access the underlying MongoDB database instance.
        const db = mongoose.connection.db;
        if (db) {
          // Create a TTL (Time-To-Live) index on the 'metadata.expiresAt' field
          // of the 'binshare.files' collection.
          // This index automatically deletes documents when their 'expiresAt' value
          // reaches the current time, effectively implementing file expiration.
          // 'expireAfterSeconds: 0' means documents will expire exactly at the
          // timestamp specified in the 'expiresAt' field.
          await db.collection('binshare.files').createIndex(
            { "metadata.expiresAt": 1 }, // The field to watch
            { expireAfterSeconds: 0 }    // Delete exactly at the timestamp
          );
          console.log("Database initialized: TTL Index ensured.");
        }
      } catch (err) {
        // Log any errors encountered during the TTL index creation.
        console.error("Failed to ensure TTL index:", err);
      }
      // Return the Mongoose instance upon successful connection and index setup.
      return mongoose;
    });
  }

  // Await the connection promise and store the resolved Mongoose instance in the cache.
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;