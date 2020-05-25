let
	Player = require("./player.js"),
    game = {
        players:[],
        hasStarted:false,
        activePlayer:-1,
        winner:false,
        isOver:false
    },
    Scoring = require("./scoring.js"),
    isGameOver = () => {
        if(game.players.map(player => player.scores).flat().filter(score => score == null).length == 0) {
            let topScore = game.players.map(player => player.scores[15]).sort().slice(-1)[0],
                winners  = game.players.map(player => player.scores[15]==topScore?player.name:null).filter(player => player)
            if(winners.length < game.players.length) {
                game.winner = winners.join(" and ")
            }
            return true
        }
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
                Player.reset(game.players[game.activePlayer])
                socket.server.emit('update game', game)
            }
        })

        socket.on('selected dice', (dice) => {
            game.players[game.activePlayer].selectedDices[dice] = ! game.players[game.activePlayer].selectedDices[dice]
            socket.server.emit('update game', game)
        })

        socket.on('threw dices', (dices) => {
            game.players[game.activePlayer].shots --
            game.players[game.activePlayer].dices = dices
            game.players[game.activePlayer].selectedDices.fill(false)
            socket.server.emit('update game', game)
        })

        socket.on('selected score', (score) => {
            Scoring.calculate(game.players[game.activePlayer], score)
            game.isOver = isGameOver()
            socket.server.emit('update game', game)
        })
    }
}