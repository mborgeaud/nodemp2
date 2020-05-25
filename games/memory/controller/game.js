let
	Player = require("./player.js"),
	game = {
		players:[],
		board:[],
		hasStarted:false,
		activePlayer:-1,
		winner:false,
		isOver:false
	},
	cards = ['alligator','bear','bird','buffalo','camel','cat','cow','dog',
	'duck','elephant','fish','frog','giraffe','goat','gorilla','hippopotamus',
	'horse','kangaroo','koala','lion','monkey','panda','pig','rabbit',
	'rhinoceros','rooster','sheep','snake','squirrel','tiger','toucan','zebra'],
	isMatch = (cards) => {
		return game.board[cards[0]] == game.board[cards[1]]
	}
	isGameOver = () => {
		return game.board.filter(card => card).length == 0
	}

(() => {
	cards = cards.map(card => card+=' back')
	game.board = cards.concat(cards)
	game.board.sort(() => 0.5 - Math.random())
})()

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
			if(!game.isOver && game.players[game.activePlayer].cards.length < 2) {
				game.board[square] = game.board[square].replace('back','').trim()
				game.players[game.activePlayer].cards.push(square)

				socket.server.emit('update game', game)

				if(game.players[game.activePlayer].cards.length == 2) {
					setTimeout(() => {
						if(isMatch(game.players[game.activePlayer].cards)) {
							game.players[game.activePlayer].score++
							game.board[game.players[game.activePlayer].cards[0]] = ''
							game.board[game.players[game.activePlayer].cards[1]] = ''
						}
						else
						{
							game.board[game.players[game.activePlayer].cards[0]] += ' back'
							game.board[game.players[game.activePlayer].cards[1]] += ' back'
						}

						game.players[game.activePlayer].cards = []
						
						if(game.isOver = isGameOver()) {
							game.winner = game.players[0].score > game.players[1].score ? game.players[0].name : game.players[0].score < game.players[1].score ? game.players[1].name : false
						}
						else
						{
							game.activePlayer = (game.activePlayer+1) % game.players.length
						}

						socket.server.emit('update game', game)
					}, 1500)
				}
			}
		})
	}
}