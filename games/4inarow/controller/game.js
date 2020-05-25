let
	Player = require("./player.js"),
	game = {
		players:[],
		board:[
			null,null,null,null,null,null,null,
			null,null,null,null,null,null,null,
			null,null,null,null,null,null,null,
			null,null,null,null,null,null,null,
			null,null,null,null,null,null,null,
			null,null,null,null,null,null,null
		],
		hasStarted:false,
		activePlayer:-1,
		winner:false,
		isOver:false
	},
	isGameOver = () => {
		return isWinner(0,1,2,3) || isWinner(41,40,39,38) || isWinner(7,8,9,10) || isWinner(34,33,32,31) || isWinner(14,15,16,17) || isWinner(27,26,25,24) || isWinner(21,22,23,24)
			|| isWinner(20,19,18,17) || isWinner(28,29,30,31) || isWinner(13,12,11,10) || isWinner(35,36,37,38) || isWinner(6,5,4,3) || isWinner(0,7,14,21) || isWinner(41,34,27,20)
			|| isWinner(1,8,15,22) || isWinner(40,33,26,19) || isWinner(2,9,16,23) || isWinner(39,32,25,18) || isWinner(3,10,17,24) || isWinner(38,31,24,17) || isWinner(4,11,18,25)
			|| isWinner(37,30,23,16) || isWinner(5,12,19,26) || isWinner(36,29,22,15) || isWinner(6,13,20,27) || isWinner(35,28,21,14) || isWinner(0,8,16,24) || isWinner(41,33,25,17)
			|| isWinner(7,15,23,31) || isWinner(34,26,18,10) || isWinner(14,22,30,38) || isWinner(27,19,11,3) || isWinner(35,29,23,17) || isWinner(6,12,18,24) || isWinner(28,22,16,10)
			|| isWinner(13,19,25,31) || isWinner(21,15,9,3) || isWinner(20,26,32,38) || isWinner(36,30,24,18) || isWinner(5,11,17,23) || isWinner(37,31,25,19) || isWinner(4,10,16,22)
			|| isWinner(2,10,18,26) || isWinner(39,31,23,15) || isWinner(1,9,17,25) || isWinner(40,32,24,16) || isWinner(9,7,25,33) || isWinner(8,16,24,32) || isWinner(11,7,23,29)
			|| isWinner(12,18,24,30) || isWinner(1,2,3,4) || isWinner(5,4,3,2) || isWinner(8,9,10,11) || isWinner(12,11,10,9) || isWinner(15,16,17,18) || isWinner(19,18,17,16)
			|| isWinner(22,23,24,25) || isWinner(26,25,24,23) || isWinner(29,30,31,32) || isWinner(33,32,31,30) || isWinner(36,37,38,39) || isWinner(40,39,38,37) || isWinner(7,14,21,28)
			|| isWinner(8,15,22,29) || isWinner(9,16,23,30) || isWinner(10,17,24,31) || isWinner(11,18,25,32) || isWinner(12,19,26,33) || isWinner(13,20,27,34)
			|| isStale()
	},
	isWinner = (s1, s2, s3, s4) => {
		let c1 = game.board[s1]
		if (c1 == null) return false
		let c2 = game.board[s2]
		if (c1 != c2) return false
		let c3 = game.board[s3]
		if (c1 != c3) return false
		let c4 = game.board[s4]
		if (c1 != c4) return false
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
				if(square>=35 || game.board[square+7] != null) {
					game.board[square] = game.activePlayer
					game.isOver = isGameOver()
					if(!game.isOver) {
						game.activePlayer = (game.activePlayer+1) % game.players.length
					}
					socket.server.emit('update game', game)
				}
			}
		})
	}
}