//get queue place
// leave queue
// queue notification
const visitorIDs = [];

const { hosts, getHost } = require('./hosts');

// add Visitor
const addVisitor = ({id, username, hostID, createdAt}) =>{
  const host = getHost(hostID);
  if(host==null){
    return {
      error: 'Host not found'
    }
  }
  const visitors = host.visitorQueue;
  if(visitors.size === visitors.maxQueuesize){
    return {
      error: 'Visitor Queue for this host is full. Please visit another queue or t'
    }
  }
  username = username.trim().toLowerCase();
  // validate data
  if(!username || !hostID) {
    return {
      error: 'Username and hostID are required!'
    }
  }

  //Store Visitor
  const visitor = {id, username, hostID, createdAt:new Date().getTime()};
  const visitorID = {id, hostID};
  visitors.enqueue(visitor);
  visitorIDs.push(visitorID);
  return { visitor }
}

// Get Visitor Queue position
const getVisitorPosition =(id, hostID) =>{
  const visitors = getHost(hostID).visitorQueue;
  return visitors.queuePosition(id);
}

// Get Host ID
const getHostID = (visitorID)=>{
  return visitorIDs.find(({ id })=> id===visitorID).hostID;
}


// Delete All instances of objects containing Host ID argument
const deleteHostIDs = (hostIDarg) =>{
  return visitorIDs.filter(({ hostID })=> hostIDarg !== hostID);
}

//Remove visitor from Queue
const deleteVisitor = ( hostID, visitorID ) =>{
  const visitors = getHost(hostID).visitorQueue;
  if(!visitors) return null;
  visitorIDs.filter((visitor)=> visitor.id!==hostID);
  return visitors.leavequeue(visitorID);
}


module.exports = {
  addVisitor,
  getVisitorPosition,
  getHostID,
  deleteHostIDs,
  deleteVisitor
}


/////// v ////////////
//f-n-n-n-n-n-n-l//
//------------p //
//--------------c //
