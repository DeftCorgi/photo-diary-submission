const gstore = require('gstore-node')();

const { Schema } = gstore;

// Schema
const entrySchema = new Schema({
  title: { type: String, required: true },
  photoUrl: { type: String, required: true, validate: 'isURL' },
  description: { type: String, required: true },
  entries: { type: Array }
});

// export model
module.exports = gstore.model('Entry', entrySchema);
