let
	Player = require("./player.js"),
	game = {
		players:[],
		hasStarted:false,
		activePlayer:-1,
		winner:false,
		isOver:false
	},
	isGameOver = () => {
		return false
	}

module.exports = {
	handle: (socket) => {
		socket.on('new player', (name) => {
			if(!game.hasStarted) {
				game.players.push(Player.newPlayer(socket.id, name))
				socket.server.emit('update game', game)
			}
		})

		socket.on('pass turn', () => {
			if(!game.isOver) {
				game.hasStarted = true
				game.activePlayer = (game.activePlayer+1) % game.players.length
				socket.server.emit('update game', game)
			}
		})
	}
}