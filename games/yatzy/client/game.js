document.addEventListener('DOMContentLoaded', () => {
	let
		socket = io(),
		playername = document.querySelector('input[name="name"]'),
		btnJoin = document.querySelector('#btnJoin'),
		btnStart = document.querySelector('#btnStart'),
		btnPass = document.querySelector('#btnPass'),
		currentPlayer = document.querySelector('#currentPlayer'),
		gameContainer = document.querySelector('#gameContainer'),
		btnsDice = document.querySelectorAll('.btnDice'),
		btnThrowDices = document.querySelector('#btnThrowDices'),
		scoreBoard = document.querySelector('#scoreBoard'),
		btnsScore = scoreBoard.querySelectorAll('.btnScore')

	btnJoin.addEventListener('click', () => {
		btnJoin.classList.add('hidden')
		socket.emit('new player', playername.value)
	});

	[btnStart, btnPass].forEach(button => {
		button.addEventListener('click', () => {
			socket.emit('pass turn')
		})
	});

	btnThrowDices.addEventListener('click', () => {
		let dices = []
		btnsDice.forEach((dice, i) => {
			if(dice.classList.contains('selected') ||
			   dice.attributes['data-id'].value == "0") {
					dices[i] = 1 + Math.floor(Math.random() * 6)
			}
			else 	dices[i] = Number.parseInt(dice.attributes['data-id'].value)
		})
		socket.emit('threw dices', dices)
	});

	btnsDice.forEach((btnDice, i) => {
		btnDice.addEventListener('click', () => {
			socket.emit('selected dice', i)
		})
	});

	btnsScore.forEach((btnScore) => {
		btnScore.addEventListener('click', (e) => {
			socket.emit('selected score', e.srcElement.attributes['data-id'].value)
			socket.emit('pass turn');
		})
	});

	socket.on('update game', (game) => {
		let me = game.players.filter(player => player.id == socket.id)[0]

		if(game.hasStarted) {
			let active = game.players[game.activePlayer]
			currentPlayer.textContent = active.name

			let scoreCells = scoreBoard.querySelectorAll('div')

			if(gameContainer.classList.contains("hidden")) {
				scoreCells.forEach(cell => {
					game.players.forEach(() => cell.after(document.createElement('div')))
				})
				scoreCells = scoreBoard.querySelectorAll('div')
				scoreBoard.style.setProperty("--numCols", game.players.length+1)
				game.players.forEach((player, i) => scoreCells[i+1].innerText = player.name)
				btnStart.classList.add("hidden")
				gameContainer.classList.remove("hidden")
			}

			btnsScore.forEach((score) => score.setAttribute('disabled', 'disabled'))

			game.players.forEach((player, i) => {
				player.scores.forEach((score, j) => {
					scoreCells[(i+1)+((j+1)*(game.players.length+1))].innerText = score
				})
			})

			btnsDice.forEach((dice, i) => {
				dice.classList = 'btnDice dice-' + (active.dices[i])
				dice.setAttribute('data-id', active.dices[i])
				dice.setAttribute('disabled', 'disabled')
				if((active.selectedDices[i]) && (active.shots > 0)) {
					dice.classList.add('selected')
				} else {
					dice.classList.remove('selected')
				}
			})

			btnThrowDices.setAttribute('disabled', 'disabled')
			if(me.id == active.id) {
				if(me.dices.filter(dice => dice).length > 0) {
					btnsScore.forEach((score, i) => {
						if(me.scores[i] == null) score.removeAttribute('disabled')
					})
				}

				if(me.shots > 0) {
					btnsDice.forEach(dice => dice.removeAttribute('disabled'))

					if(me.dices.filter(dice => dice).length == 0 ||
					   me.selectedDices.filter(dice => dice).length > 0) {
						btnThrowDices.removeAttribute('disabled')
					}
				}
				else
				{
					btnsDice.forEach((dice) => dice.setAttribute('disabled', 'disabled'))
				}
			}

			if(game.isOver) {
				if(!game.winner) setTimeout(() => { alert('Game is a draw') })
				else			 setTimeout(() => { alert(game.winner + ' wins!') })
			}
		}
		else
		{
			if(game.players[0].id == me.id) btnStart.classList.remove("hidden")
		}
	})
})