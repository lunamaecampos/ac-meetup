const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Design = require('./design');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate(value){
      if(!validator.isEmail(value)) throw new Error('Email is invalid');
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
    trim: true,
    validate(value){
      if(value.toLowerCase().includes('password')) throw new Error('Password cannot contain "password"');
    }
  },
  nsxid: {
    type: String,
    trim: true
  },
  securityAnswer: {
    type: String,
    required: true,
    trim: true
  },
  karma: {
    type: Number,
    default: 0
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
});

//user's reference to designs
userSchema.virtual('designs', {
  ref: 'Design',
  localField: '_id',
  foreignField: 'owner'
});

//create user JSON
userSchema.methods.toJSON = function(){
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
}

// generate authentication token for login
userSchema.methods.generateAuthToken = async function(){
  const user = this;
  const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({token});
  await user.save();
  return token;
}

//login authentication
userSchema.statics.findByCredentials = async (email, password)=>{
  const user = await User.findOne({ email });
  if(!user) throw new Error('Unable to login');
  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) throw new Error('Unable to login');

  return user;
}


//hash the plain text password
userSchema.pre('save', async function(next){
  const user = this;
  if(user.isModified('password')) user.password = await bcrypt.hash(user.password, 8);

  next();
})

// Delete the user's designs when user deletes their account
userSchema.pre('remove', async function(next){
  const user = this;
  await Design.deleteMany({owner: user._id})
  next();
})
const User = mongoose.model('User', userSchema);

module.exports = User;
