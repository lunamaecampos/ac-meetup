const socket = io();

//elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $messages = document.querySelector('#messages')

// Templates
const queueTemplate = document.querySelector('#queue-template').innerHTML;
const messageTemplate = document.querySelector('#message-template').innerHTML;

//Options

const {
  id, dodoCode, username, islandName, nativeFruit, turnipPrice,
  hemisphere, villager, islandTime, about, twitter, discord,
  twitch, islandSize, queueSize, entryFee, privateRoom,
  queueLock, createdAt, visitorQueue
} = Qs.parse(location.search, {ignoreQueryPrefix: true});

const host = { id, dodoCode, username, islandName, nativeFruit, turnipPrice:parseInt(turnipPrice),
hemisphere, villager, islandTime, about, twitter, discord,
twitch, islandSize:parseInt(islandSize), queueSize:parseInt(queueSize), entryFee, privateRoom,
queueLock, createdAt, visitorQueue }


//Create Queue Listing
socket.emit('createListing', {...host }, (error)=> {
  if(error){
    alert(error);
    location.href = '/';
  }
});

//Render Queue Data to Template
socket.on('queueData', ({
  ...host
})=> {
  const html = Mustache.render(queueTemplate, {
    ...host
  });
  console.log(host);
  document.querySelector('#queuebox').innerHTML = html;
});

//send message to to everyone in queue
$messageForm.addEventListener('submit', (e)=>{
  e.preventDefault();

  $messageFormButton.setAttribute('disabled', 'disabled');

  const message= e.target.elements.message.value;   //disable

  socket.emit('sendMessage', message, (error)=>{
    $messageFormButton.removeAttribute('disabled')    // enable
    $messageFormInput.value = '';
    $messageFormInput.focus();

    if(error) return console.log(error);
  });
  console.log('Message delivered!');
})

socket.on('message', (message)=>{
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
  });
  $messages.insertAdjacentHTML('beforeend', html);
});
