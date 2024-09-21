var mongoose = require('mongoose');

var MONGODB_URI = 'mongodb://localhost:27017/test';

if (!MONGODB_URI) {
  throw new Error(
    'يرجى تعيين MONGODB_URI في ملف .env.local'
  );
}

var cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(function(mongoose) {
      return mongoose;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectToDatabase;