class Node {
  constructor(visitor){
    this.val = visitor;
    this.next = null;
  }
}
class VisitorQueue{
  constructor(maxQueuesize = 40){
    this.first = null;
    this.last = null;
    this.size = 0;
    this.maxQueuesize = maxQueuesize;
  }
  enqueue(val){
    if (this.size >= this.maxQueuesize) return null;
    let newNode = new Node(val);
    if(!this.first){
      this.first = newNode;
      this.last = newNode;
    } else {
      this.last.next = newNode;
      this.last = newNode;
    }
    return ++this.size;
  }
  dequeue(){
    if(!this.first) return null;
    let temp = this.first;
    if(this.first === this.last) this.last == null;
    this.first = this.first.next;
    this.size--;
    return temp;
  }
  leavequeue(id){
    if(!this.first) return null;
      let current = this.first;
    if(current.val.id === id) return this.dequeue();
    let prev = null;
    while(current && current.val.id!==id){
      prev = current;
      current = current.next;
    }
    if(this.last === current) this.last == prev;
    if(current.val.id!== id) return null;
    prev.next = current.next;
    this.size--;
    return current;
  }
  queuePosition(id){
    if(!this.first) return null;
    let current = this.first;
    let count = 1;
    while(count <= this.size){
      if(current.val.id===id) return count;
      count++;
      current = current.next;
    }
    return null;
  }
  getByID(id){
    if(!this.first) return null;
    let current = this.first;
    while(current!=null && current.val.id!==id){
      current = current.next;
    }
    return current.val.id===id ? current : null;
  }
  readyqueue(islandSize){
    if(!this.first) return null;
    let readyVisitors = [];
    let current = this.first;
    let count = 1;
    while(current!=null && count<=islandSize){
      readyVisitors.push(current.val.id);
      count++;
      current= current.next;
    }
    return readyVisitors;
  }
}

module.exports = { VisitorQueue }
