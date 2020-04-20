const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');

// Create User
router.post('/users', async(request, response)=>{
  const user = new User(request.body);
  try{
    await user.save();
    const token = await user.generateAuthToken();
    response.status(201).send({ user, token });
  } catch (error){
    response.status(400).send(error);
  }
});


//User Login and Logout
router.post('/users/login', async(request, response)=>{
  try {
    const user = await User.findByCredentials(request.body.email, request.body.password);
    const token = await user.generateAuthToken();
    response.send({ user, token });
  } catch (error) {
    response.status(400).send();
  }
})

router.post('/users/logout', auth, async(request, response)=>{
  try {
    request.user.tokens = request.user.tokens.filter(
      (token)=> token.token !== request.token
    );
    await request.user.save();
    response.send();
  } catch (error) {
    response.status(500).send();
  }
});

router.post('/users/logoutAll', auth, async (request, response) =>{
  try {
    request.user.tokens = [];
    await request.user.save();
    response.send();
  } catch (error) {
    response.status(500).send();
  }
});

// Read User profile
router.get('/users/me', auth, async (request, response)=>{
  response.send(request.user);
})

//Update User profile
router.patch('/users/me', auth, async (request, response)=>{
  const updates = Object.keys(request.body);
  const allowedUpdates = ['username', 'email', 'password', 'nsxid'];
  const isValidOperation = updates.every(
    (update)=> allowedUpdates.includes(update)
  );
  if(!isValidOperation) return response.status(400).send({error: 'Invalid Updates'});
  try {
    const user = request.user;
    updates.forEach((update)=> user[update] = request.body[update]);
    await user.save();
    if(!user) return response.status(404).send();
    response.send(user);
  } catch (error) {
    response.status(400).send(error);
  }
});

//Delete User Profile
router.delete('/users/me', auth, async(request, response)=>{
  const user = request.user;
  try {
    await request.user.remove();
    response.send(request.user);
  } catch(error) {
    response.status(500).send(error);
  }
})

// CRUD User avatar
const upload = multer({
  limits: {
    fileSize: 1000000
  }, fileFilter(request, file, callback){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      return callback(new Error('Your file must be a jpg, jpeg, or png'));
    }
    callback(undefined, true)
  }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async(request, response)=>{
  const buffer = await sharp(request.file.buffer).resize({ width:250, height: 250 }).png().toBuffer();
  request.user.avatar = buffer;
  await request.user.save();
  response.send();
}, (error, request, response, next)=>{
  response.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async(request, response)=>{
  if(!request.user.avatar) response.send(400).send('no avatar');
  request.user.avatar = undefined;
  await request.user.save();
  response.send();
})

router.get('/users/:id/avatar', async(request, response)=>{
  try {
    const user = await User.findById(request.params.id);
    if(!user || !user.avatar) throw new Error();
    response.set('Content-Type', 'image/png');
    response.send(user.avatar);
  } catch (error) {
    response.status(404).send();
  }
})
module.exports = router;
