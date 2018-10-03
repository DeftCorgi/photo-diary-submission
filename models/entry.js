const gstore = require('gstore-node')();

const { Schema } = gstore;

// Schema
const entrySchema = new Schema({
  title: { type: String, required: true },
  photoUrl: { type: String, required: true },
  description: { type: Text, required: true }
});

// export model
module.exports = gstore.model('Entry', entrySchema);
