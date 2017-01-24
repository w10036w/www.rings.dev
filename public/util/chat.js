const qs = require('qs')
let ws, connected = false
function fmtMsg(e) {
  return {
    id: e.id,
    ts: e.ts,
    seq: e.seq,
    uid: e.senderId,
    cid: e.targetId,
    name: e.senderName,
    type: e.isGift ? 1 : 0, //0 text 1 gift
    content: e.isGift ? e.itemId : e.text,
    avatar: e.senderAvatar
  }
}

const chat = {
  connect(room, opts, queue){
    //userID, token, roomID
    const uri = `${room}?${qs.stringify(opts)}`
    ws = new WebSocket(uri)
    ws.onopen = function () {
      connected = true;
      console.log(`ws connected: ${uri}`);
    }
    ws.onerror = function (e) {
      console.log(`ws err: ${e}`);
      connected = false;
    }
    ws.onmessage = function (e) {
      queue.push(fmtMsg(JSON.parse(e.data)));
    }
    ws.onclose = function () {
      console.log('ws closed');
    }
  },
  close() {
    ws.close()
    ws = null
  }
}
module.exports = chat

