const gstore = require('gstore-node')();

const { Schema } = gstore;

// Schema
const userSchema = new Schema({
  displayName: { type: String, required: true },
  entries: { type: Array, default: [] }
});

// export model
module.exports = gstore.model('User', userSchema);
