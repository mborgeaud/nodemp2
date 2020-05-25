const 
	express = require('express'),
	http = require('http'),
	app = express(),
	server = http.Server(app),
	socketIO = require('socket.io'),
	io = socketIO(server),
	game = process.argv[2] || 'demo',
	controller = require(__dirname + '/games/' + game + '/controller/game.js')

app.use('/', express.static(__dirname + '/games/' + game + '/client'))
app.get('/', function(request, response) {
	response.sendFile(__dirname + '/games/' + game + '/client/index.html')
})

server.listen(8080, function() {
	console.log('Starting nodemp2 on port 8080')
})

io.on('connection', (socket) => {
	controller.handle(socket)
})