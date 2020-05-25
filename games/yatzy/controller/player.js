module.exports = {
    newPlayer: (id, name) => {
        return {
            id: id,
            name: name,
            scores: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
            dices: [0,0,0,0,0],
            selectedDices: [false,false,false,false,false],
            shots: 3
        }
    },
    reset: (player) => {
        player.dices.fill(0)
        player.selectedDices.fill(false)
        player.shots = 3
    }
}