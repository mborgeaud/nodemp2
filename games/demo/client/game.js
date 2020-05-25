document.addEventListener('DOMContentLoaded', () => {
	let
		socket = io(),
		playername = document.querySelector('input[name="name"]'),
		btnJoin = document.querySelector('#btnJoin'),
		btnStart = document.querySelector('#btnStart'),
		btnPass = document.querySelector('#btnPass'),
		currentPlayer = document.querySelector('#currentPlayer'),
		gameContainer = document.querySelector('#gameContainer')

	btnJoin.addEventListener('click', () => {
		btnJoin.classList.add('hidden')
		socket.emit('new player', playername.value)
	});

	[btnStart, btnPass].forEach(button => {
		button.addEventListener('click', () => {
			socket.emit('pass turn')
		})
	});

	socket.on('update game', (game) => {
		let me = game.players.filter(player => player.id == socket.id)[0]

		if(game.hasStarted) {
			let active = game.players[game.activePlayer]
			currentPlayer.textContent = active.name

			if(gameContainer.classList.contains("hidden")) {
				btnStart.classList.add("hidden")
				gameContainer.classList.remove("hidden")
			}

			active.id == me.id ? btnPass.classList.remove("hidden") : btnPass.classList.add("hidden")
		}
		else
		{
			if(game.players[0].id == me.id) btnStart.classList.remove("hidden")
		}
	})
})