const socket = io();

//elements
const $leaveForm = document.querySelector('#leave-form');
const $messages = document.querySelector('#messages');
const $dodoMessage = document.querySelector('#dodoMessage');

// Templates
const queueTemplate = document.querySelector('#queue-template').innerHTML;
const messageTemplate = document.querySelector('#message-template').innerHTML;
const dodoMessageTemplate = document.querySelector('#dodo-message-template').innerHTML;

//Options
const {
  username,
  id,
  hostID,
  createdAt
} = Qs.parse(location.search, {ignoreQueryPrefix: true});

const visitor ={ username, id, hostID, createdAt }



// Join the Queue
socket.emit('joinQueue', {...visitor}, (error)=>{
  if(error){
    alert(error);
    location.href='/';
  }
});

//Leave the Queue
$leaveForm.addEventListener('submit', (e)=>{
  e.preventDefault();

  socket.emit('leaveQueue', (error)=>{
    if(error){
      alert(error);
      location.href='/';
    }
  });
  location.href='/';
  console.log('Left The Queue');
});

// see visitor data
socket.on('visitorData',({
  ...visitor
})=>{
  const html = Mustache.render(queueTemplate, {
    ...visitor
  });
  console.log(visitor);
  document.querySelector('#queuebox').innerHTML = html;
})

//see queue data
socket.on('queueData',({
  ...host
})=>{
  const html = Mustache.render(queueTemplate, {
    ...host
  });
  document.querySelector('#queuebox').innerHTML = html;
})

// recieve messahe from host
socket.on('message', (message)=>{
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

// Receive dodo Code from host
socket.on('dodoCode', (message)=>{
  console.log(message);
  const html = Mustache.render(dodoMessageTemplate, {
    username: message.dodoCode,
    islandName: message.islandName,
    dodoCode: message.dodoCode
  });
  $dodoMessage.innerHTML = html;
})

//Host Disconneted
socket.on('hostDisconnected', (disconnectHostError)=>{
  if(disconnectHostError){
    alert(disconnectHostError);
    location.href='/';
  }
})
