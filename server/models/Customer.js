const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


// Define the Customer Schema for Authentication
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date }
}, { timestamps: true });

// Encrypt password before saving customer
customerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match entered password with encrypted password
customerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate reset token
customerSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
  
    // Hash the token and set it to the schema
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
    // Set expiration time for 10 minutes
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};


module.exports = mongoose.model('Customer', customerSchema);
