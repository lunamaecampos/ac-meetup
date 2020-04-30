const { VisitorQueue } = require('./dataStructures/visitorQueue');
const hosts = [];
// give host a token to authenticate hosting listing actions

// Create Host Listing Object
const addHost = (
  {
    id,
    dodoCode, // 5-digit dodo code '54DMZ'
    username, //username
    islandName, //island name
    nativeFruit, // apple, cherry, orange, peach, pear
    turnipPrice, //how many bells are timmy tommy paying
    hemisphere, // North or South
    villager, // Daisy or Celeste or Neither
    islandTime, // Current Time and Date On Your Island,
    about, // share more details
    twitter, // optional @
    discord, //optional @
    twitch, // optional @
    islandSize, // how many visitors in queue will receive DODO code
    queueSize, // how many visitors can wait in queue
    entryFee, // do you charge a fee to let islanders visit
    privateRoom // omit from public listings? return private code
  }) =>{
    console.log('hello');
  username = username.trim().toLowerCase();
  islandName = islandName.trim().toLowerCase();

  //validate data
  if(!username || !islandName) {
    return {
      error: 'Username and Island are required!'
    }
  }
  //Check for existing dodo Code
  const existingDodoCode = hosts.find((host)=>{
    return host.dodoCode === dodoCode;
  })
  if(existingDodoCode) {
    return {
      error: 'Dodo Code is already in use!'
    }
  }
  //create visitor Queue
  const visitorQueue = new VisitorQueue(queueSize);

  //Store Host
  const host = {
    id, dodoCode, username, islandName, nativeFruit, turnipPrice,
    hemisphere, villager, islandTime, about, twitter, discord,
    twitch, islandSize, queueSize, entryFee, privateRoom,
    visitorQueue, //values not passed in
    queueLock: false, //values not passed in
    createdAt: new Date().getTime()
  }
  hosts.push(host);
  console.log(hosts);
  return { host };
}

// Edit Host Listing Object
const editHost = (
  id, dodoCode, username, islandName, nativeFruit, turnipPrice,
  hemisphere, villager, islandTime, about, twitter, discord,
  twitch, islandSize, queueSize, entryFee, privateRoom,
  queueLock
) => {
  const host = hosts.find((host) => host.id === id);
  return host = {
    id, dodoCode, username, islandName, nativeFruit, turnipPrice,
    hemisphere, villager, islandTime, about, twitter, discord,
    twitch, islandSize, queueSize, entryFee, privateRoom,
    queueLock
  }
}

// Remove Host from Listings
const removeHost = (id) => {
  const index = hosts.findIndex((host)=> host.id === id);
  if(index !== -1) return hosts.splice(index, 1)[0];
}

//  Get Host by ID if private listing
const getHost = (id) =>{
  return hosts.find((host)=> host.id === id);

}

// Get all visitors in Queue
const getVisitorsInQueue = (id) =>{
  return visitorQueue = hosts.filter((host)=>{
    if(host.id===id) return host.visitorQueue;
  })
}

// Send Dodo Code to all users who are ready in queue
const sendDodoCode = (hostID, io, generateDodoCode)=>{
  console.log(sendDodoCode);
  const host = getHost(hostID);
  const visitors = host.visitorQueue;
  const readyVisitors = visitors.readyqueue(host.islandSize);
  if(readyVisitors){
    readyVisitors.forEach((id)=>{
      io.to(id).emit('dodoCode', generateDodoCode(host.username, host.islandName, host.dodoCode));
    });
  }
}

module.exports = {
  addHost,
  editHost,
  removeHost,
  getHost,
  getVisitorsInQueue,
  sendDodoCode,
  hosts
}
