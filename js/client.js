/**
 * The client!
 *
 * @author Jeroen Van den Bossche <jeroen@vanbosse.be>
 */

var socket = io.connect('http://localhost:8080');
var nick = window.prompt('Nickname:');
var form = document.querySelector('#send');
var input = document.querySelector('#message');
var messages = document.querySelector('.messages');
var users = document.querySelector('.users');

// send nickname to server.
socket.emit('register nickname', nick);

// register handler to receive messages.
socket.on('message', function(message) {
	var output = '<p>&lt;' + message.nickname + '&gt; ' + message.message;
	messages.innerHTML += output;
});

// register a handler to receive new connected users.
socket.on('user connected', function(nickname) {
	messages.innerHTML += '<p class="green">' + nickname + ' is connected.</p>';
	users.innerHTML += '<p id="' + nickname + '">' + nickname + '</p>';
});

// register a handler to receive disconnected users.
socket.on('user disconnected', function(nickname) {
	messages.innerHTML += '<p class="red">' + nickname + ' is disconnected.</p>';
	users.removeChild(document.querySelector('#' + nickname));
});

// register the handler to receive all connected users.
socket.on('user', function(nickname) {
	users.innerHTML += '<p id="' + nickname + '">' + nickname + '</p>';
});

// register handler for submission of the form.
form.onsubmit = function(evt)
{
	evt.preventDefault();
	socket.emit('message', input.value);
	input.value = '';
}
