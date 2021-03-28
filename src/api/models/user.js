import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'must have a name'],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'must have a email'],
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Enter valid email');
        }
      },
    },
    password: {
      type: String,
      required: [true, 'must have a name'],
      trim: true,
      validate(value) {
        if (value.length < 7) {
          throw new Error('Password should be greater than 6 digit');
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: [true, 'must have a name'],
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    reward: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: '',
    },
    account: {
      type: String,
    },
    phrase: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: 'email',
  foreignField: 'sender',
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  delete userObject.otp;
  delete userObject.phrase;

  return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Unable to Login');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Unable to Login');
  }
  return user;
};

userSchema.statics.findByOTP = async (email, otp) => {
  const user = await User.findOne({ email, otp });
  if (!user) {
    throw new Error('Unable to Login');
  }
  return user;
};

userSchema.statics.findByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Wrong Email Id');
  }
  return user;
};

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// pending task add post schema for deteting transaction
// foreign keys

const User = mongoose.model('User', userSchema);

module.exports = User;
