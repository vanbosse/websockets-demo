/**
 * The server!
 *
 * @author Jeroen Van den Bossche <jeroen@vanbosse.be>
 */

var io = require('socket.io').listen(8080);
var users = [];

// a socket got connected.
io.sockets.on('connection', function(socket) {

	// when a socket connects,
	// send them all connected users.
	users.forEach(function(nickname) {
		socket.emit('user', nickname);
	});

	// when a socket is connected and sends the "register nickname" event,
	// we set the nickname to the socket
	// and send a connected message to all sockets.
	socket.on('register nickname', function(nickname) {
		socket.set('nickname', nickname, function() {
			users.push(nickname);
			io.sockets.emit('user connected', nickname);
		});
	});

	// when we receive a message from one of the connected sockets,
	// get its nickname and send the message to all connected sockets.
	socket.on('message', function(message) {
		socket.get('nickname', function(error, nickname) {
			io.sockets.emit('message', {nickname: nickname, message: message});
		});
	});

	// when a socket disconnects,
	// send a message to alert other sockets.
	socket.on('disconnect', function() {
		socket.get('nickname', function(error, nickname) {
			var index = users.indexOf(nickname);
			if(index != -1)
			{
				users.splice(index, 1);
			}
			io.sockets.emit('user disconnected', nickname);
		});
	});
});
