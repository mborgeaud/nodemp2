let Player = require("./player.js"),
	game = {
		players:[],
		board:[
			null,null,null,
			null,null,null,
			null,null,null
		],
		hasStarted:false,
		activePlayer:-1,
		winner:false,
		isOver:false
	},
	isGameOver = () => {
		return isWinner(0,1,2)
			|| isWinner(3,4,5)
			|| isWinner(6,7,8)
			|| isWinner(0,3,6)
			|| isWinner(1,4,7)
			|| isWinner(2,5,8)
			|| isWinner(0,4,8)
			|| isWinner(6,4,2)
			|| isStale()
	},
	isWinner = (s1, s2, s3) => {
		let c1 = game.board[s1]
		if (c1 == null) return false
		let c2 = game.board[s2]
		if (c1 != c2) return false
		let c3 = game.board[s3]
		if (c1 != c3) return false
		game.winner = game.players[c1].name
		return true
	},
	isStale = () => {
		return game.board.filter(c => c == null).length == 0
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

		socket.on('action', (square) => {
			if(!game.isOver) {
				game.board[square] = game.activePlayer
				game.isOver = isGameOver()
				socket.server.emit('update game', game)
			}
		})
	}
}