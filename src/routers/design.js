const express = require('express');
const Design = require('../models/design');
const auth = require('../middleware/auth');
const router = new express.Router();


// Create Design
router.post('/designs', auth, async (request, response)=>{
  const design = new Design({
    ...request.body,
    owner: request.user._id
  });
  try {
    await design.save();
    response.status(201).send(design);
  } catch (error) {
    response.status(400).send(error);
  }
});

// Fetch all user designs
router.get('/designs/me', auth, async(request, response)=>{

  const match = {};
  const sort= {};

  if(request.query.sortBy){
    const parts = request.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1: 1;
  }
  try {
    await request.user.populate({
      path: 'designs',
      match,
      options:{
        limit: parseInt(request.query.limit),
        skip: parseInt(request.query.skip),
        sort
      }
    }).execPopulate();
    response.send(request.user.designs);
  } catch (error) {
    response.status(500).send(error);
  }
})
//Fetch all designs
router.get('/designs', auth, async (request, response)=>{
  const match = {};
  const sort = {};
  if(request.query.sortBy){
    const parts = request.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ?-1: 1;
  }
  try {
    const designs = await Design.find({}, null, {
      match,
      limit: parseInt(request.query.limit),
      skip: parseInt(request.query.skip),
      sort
    });
    response.send(designs);
  } catch (error){
    response.status(500).send(error);
  }
})


// Get User Design by ID
router.get('/designs/:id', auth, async(request, response)=>{
  const _id = request.params.id;
  try {
    const design = await Design.findOne({ _id, owner: request.user._id});
    if(!design) return response.status(404).send();
    response.send(design);
  } catch (error) {
    response.status(500).send();
  }
});

// Owner Delete User Design
router.delete('/designs/:id', auth, async (request, response)=>{
  try {
    const design = await Design.findByIdAndDelete({
      _id: request.params.id,
      owner: request.user._id
    });
    if(!design) return response.status(404).send();
    response.send(design);
  } catch (error) {
    response.status(500).send(error);
  }
});

//Update design
router.patch('/designs/:id', auth, async(request, response)=>{
  const updates = Object.keys(request.body);
  const allowedUpdates = ['name', 'designtype'];
  const isValidOperation = updates.every(
    (update)=> allowedUpdates.includes(update)
  );
  if(!isValidOperation) return response(400).send({error: 'Invalid updates!'});

  try {
    const design = await Design.findOne({_id: request.params.id, owner: request.user._id});
    if(!design) return response.status(404).send();
    updates.forEach((update) => design[update]=request.body[update]);
    await design.save();
    response.send(design);
  } catch(error) {
    response.status(400).send(error);
  }
});

module.exports = router;
