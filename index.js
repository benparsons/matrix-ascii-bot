var request = require("request");
const frames = require("./frames.js");
const homeserver = "https://matrix.bpulse.org";
const room_id = "%21UpevrrilOuZdxLWcHj:bpulse.org";
const access_token = "";
const url = `${homeserver}/_matrix/client/r0/rooms/${room_id}/send/m.room.message?access_token=${access_token}`;

var frameNumber = 0;
var defaultTimeout = 1000;
console.log("total frames:" + frames.length);
function sendNextFrame() {
const data = {
    "m.new_content": {
        "msgtype": "m.text",
        "format": "org.matrix.custom.html",
        "formatted_body": `<pre><code>${frames[frameNumber]}</code></pre>`
    },
    "m.relates_to": {
        "rel_type": "m.replace",
        "event_id": "$156199266056ESvgM:bpulse.org"
    },
    "msgtype": "m.text",
    "body": "body main",
    "format": "org.matrix.custom.html",
    "formatted_body": `<pre><code>${frames[frameNumber]}</code></pre>`
};
console.log("frameNumber: " + frameNumber);
frameNumber++;

request.post({
    url: url,
    body: data,
    json: true}, function(error, response, body){
        if (error) console.log(error);
        console.log(body);
        var timeToNextFrameSend = defaultTimeout;
        if (body.errcode === "M_UNKNOWN_TOKEN") {
            process.exit(1);
        }
        if (body.errcode === "M_LIMIT_EXCEEDED") {
            timeToNextFrameSend = body.retry_after_ms + defaultTimeout;
            defaultTimeout += 100;
            frameNumber--;
        }
        console.log("Next frame in: " + timeToNextFrameSend);
        setTimeout(sendNextFrame, timeToNextFrameSend);
      });
    }
sendNextFrame();