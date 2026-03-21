const mongoose = require("mongoose");

async function connectDatabase() {
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/authentra";

  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DB_NAME || undefined
  });

  console.log(`MongoDB connected for Authentra usage tracking (${mongoUri})`);
}

module.exports = {
  connectDatabase
};
