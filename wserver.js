/* a simple WebSocket Server */
/* notice: just a test server, doesn't include error handle
   . besides, not passed stress test.
   only little data can be handled
*/

var http        = require('http');
var decodeFrame = require('./decode.js');
var encodeFrame = require('./encode.js');
var MAGIC_STRING = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

function callback(req, res){
    res.writeHead('200', {'Content-Type': 'text/html'});
    res.end('a WebSocket Connection test~');
}

function hand_shake(req, socket){
    var key = req.headers['sec-websocket-key'];
    key = require('crypto')
        .createHash('sha1')
        .update(key + MAGIC_STRING)
        .digest('base64');
    var resHeaders = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        'Sec-WebSocket-Accept: ' + key
    ];
    resHeaders = resHeaders.concat('', '').join('\r\n');
    socket.on('data', send_recive);
    socket.write(resHeaders);
}

function send_recive(data){
    var readable_data = decodeFrame(data);
    var response = encodeFrame({
        FIN: 1,
        Opcode: 1,
        Payload_data: 'Server: u just said to me ' + readable_data['Payload_data'].toString()
    });
    console.log(readable_data['Payload_data'].toString());
    socket.write(response);
}

var server = http.createServer(callback).listen(process.argv[2] || 3000);
server.on('upgrade', hand_shake);