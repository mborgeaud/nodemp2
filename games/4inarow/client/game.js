document.addEventListener('DOMContentLoaded', () => {
	let
		socket = io(),
		playername = document.querySelector('input[name="name"]'),
		btnJoin = document.querySelector('#btnJoin'),
		btnStart = document.querySelector('#btnStart'),
		btnPass = document.querySelector('#btnPass'),
		currentPlayer = document.querySelector('#currentPlayer'),
		gameContainer = document.querySelector('#gameContainer'),
		squares = document.querySelectorAll('.grid div')

	btnJoin.addEventListener('click', () => {
		btnJoin.classList.add('hidden')
		socket.emit('new player', playername.value)
	});

	[btnStart, btnPass].forEach(button => {
		button.addEventListener('click', () => {
			socket.emit('pass turn')
		})
	});

	squares.forEach((elem, square) => {
		elem.addEventListener('click', () => {
			if(!elem.classList.contains('taken') && playername.value == currentPlayer.textContent) {
				socket.emit('action', square)
			}
		})
	})

	socket.on('update game', (game) => {
		let me = game.players.filter(player => player.id == socket.id)[0]

		if(game.hasStarted) {
			let active = game.players[game.activePlayer]
			currentPlayer.textContent = active.name

			if(gameContainer.classList.contains("hidden")) {
				btnStart.classList.add("hidden")
				gameContainer.classList.remove("hidden")
			}

			squares.forEach((s, index) => {
				if((p = game.board[index]) != null) {
					s.classList.add('taken', 'player-' + p)
				}
			})

			if(game.isOver) {
				if(!game.winner) setTimeout(() => {alert('Game is a draw')})
				else             setTimeout(() => {alert(game.winner + ' wins!')})
			}
		}
		else 
		{
			if(game.players[0].id == me.id) btnStart.classList.remove("hidden")
		}
	})
})