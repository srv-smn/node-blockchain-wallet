import mongoose from 'mongoose';
import validator from 'validator';

const transactionSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: [true, 'Sender not specified'],
      lowercase: true,
      ref: 'User',
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Enter valid email');
        }
      },
    },
    receiver: {
      type: String,
      required: [true, 'Sender not specified'],
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Enter valid email');
        }
      },
    },
    amount: {
      type: Number,
      required: [true, 'amount should be number'],
    },
    senderAddress: {
      type: String,
      required: [true, 'address should be string'],
    },
    receiverAddress: {
      type: String,
      required: [true, 'address should be string'],
    },
    transactionHash: {
      type: String,
      required: [true, 'Hash Should be String'],
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
