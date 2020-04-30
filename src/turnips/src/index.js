const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { addHost, editHost, removeHost, sendMessage, getHost, getVisitorsInQueue, sendDodoCode } = require('./utils/hosts');
const { addVisitor, getVisitorPosition, getHostID, deleteHostIDs, deleteVisitor } = require('./utils/visitors');

const { generateMessage, generateDodoCode } = require('./utils/messages');

const queueApp = express();
const server = http.createServer(queueApp);
const io = socketio(server);

const port = process.env.QUEPORT || 8000;
const publicDirectoryPath = path.join(__dirname, '../public');

queueApp.use(express.static(publicDirectoryPath));

//create socket connection to server
io.on('connection', (socket)=>{
  console.log('New websocket connection');

  // Remove Host or Visitor upon Disconnet
  socket.on('disconnect', ()=>{
    if(getHost(socket.id) !== null){
      const disconnectHostError = 'Host has disconnected their island. Please Visit another queue';
      removeHost(socket.id);
      deleteHostIDs(socket.id);
      io.to(socket.id).emit('hostDisconnected', disconnectHostError);
      socket.leave(socket.id);
    }
    if(getHostID(socket.id)) {
      const hostID = getHostID(socket.id);
      const host = getHost(hostID);
      deleteVisitor(hostID, socket.id);
      // Send Dode code to Visitors when it's their turn
      sendDodoCode(host.id, io, generateDodoCode);
      io.in(hostID).emit('queueData', {...host});
    }
  });

///////////////////////////
// Host connections
///////////////////////////

  // Create Host Listing
  socket.on('createListing', (options, callback)=> {
    console.log('host id length is', socket.id.length);
    const {error, host} = addHost({ id: socket.id, ...options});
    if(error) return callback(error);
    socket.join(host.id);
    io.to(host.id).emit('queueData', { ...host });
    callback();
  });

  // Send Message to all Visitors in Queue
  socket.on('sendMessage', (message, callback)=>{
    const host = getHost(socket.id);
    const filter = new Filter();

    if(filter.isProfane(message)) return callback('Profanity is not allowed!');

    io.in(host.id).emit('message', generateMessage(host.username, message));
    callback();
  });

  ///////////////////////////
  // Visitor connections
  ///////////////////////////

  // Visitor join Queue
  socket.on('joinQueue', (options, callback)=> {
    const {error, visitor} = addVisitor({id:socket.id, ...options});
    if(error) return callback(error);
    const host = getHost(visitor.hostID)
    socket.join(host.id)
    io.to(socket.id).emit('visitorData', { ...visitor
    });

    // Send Queue Data to host
    io.to(host.id).emit('queueData', {...host});

    // Send Dode code to Visitors when it's their turn
    sendDodoCode(host.id, io, generateDodoCode);
    //callback function
    callback();
  });

  // Visitor Leave Queue
  socket.on('leaveQueue', (callback)=>{
    const visitorID = socket.id;
    const hostID = getHostID(visitorID);
    const { error, deletedVisitor } = deleteVisitor(hostID, visitorID);
    if(error) return callback(error);
    socket.leave(hostID);
    // Send Dodo Code to visitors when it's their turn
    // sendDodoCode contains io.to().emit();
    sendDodoCode(hostID, io, generateDodoCode);
    const host = getHost(getHostID);
    io.to(hostID).emit('queueData', {...host});
    callback();
  });

});

server.listen(port, ()=>{
  console.log(`Server is running on port ${port}`);
})
