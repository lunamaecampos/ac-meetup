const generateMessage = (username, text) =>{
  return {
    username,
    text,
    createdAt: new Date().getTime()
  }
}
const generateDodoCode = (username, islandName, dodoCode)=>{
  return {
    username,
    islandName,
    dodoCode,
    createdAt: new Date().getTime()
  }
}

module.exports = {
  generateMessage,
  generateDodoCode
}
