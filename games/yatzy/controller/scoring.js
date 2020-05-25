let
	sum = function(dices, value) {
		return dices.reduce((a, b) => (value === undefined) ? 
			(a + b) : 
			(b == value ? (a + b) : a)
		, 0)
	},
	mode = function(arr) {
		return arr.sort().sort((a,b) =>
			arr.filter(v => v===a).length
			- arr.filter(v => v===b).length
		).slice(-1)[0]
	},
	sumdups = function(dices, limit, isYatzee, isPoker) {
		let mode1 = mode(dices),
			times1 = dices.filter(i => i==mode1).length

		if(times1 == limit) {
			if (isYatzee)		return 50
			else if (isPoker)	return 40
			else				return times1*mode1
		}	else				return 0
	},
	sum2pairs = function(dices) {
		let mode1 = mode(dices),
			times1 = dices.filter(i => i==mode1).length,
			mode2 = mode(dices.filter(i => i!=mode1)),
			times2 = dices.filter(i => i==mode2).length

		if(times1>=2 && times2>=2)	return 2*(mode1+mode2)
		else						return 0
	},
	sumfull = function(dices) {
		let mode1 = mode(dices),
			times1 = dices.filter(i => i==mode1).length,
			mode2 = mode(dices.filter(i => i!=mode1)),
			times2 = dices.filter(i => i==mode2).length

		if((times1==2 && times2==3) ||
		   (times1==3 && times2==2))	return sum(dices)
		else							return 0
	},
	isUnique = function(array) {
		return array.length === new Set(array).size
	},
	sumstraight = function(dices, isLarge) {
		if(isUnique(dices) == true) {
			if (!isLarge && dices.indexOf(1)!=-1 && dices.indexOf(6)==-1)		return 15
			else if (isLarge && dices.indexOf(1)==-1 && dices.indexOf(6)!=-1)	return 20
		}	else																return 0
	}

module.exports = {
	calculate: (player, score) => {
		let isSingles = ["btn1s","btn2s","btn3s","btn4s","btn5s","btn6s"].indexOf(score) + 1,
			isPairs   = ["btn1P", "btn2P"].indexOf(score) + 1,
			is3Kind   = (score == "btn3K"),
			isFull	= (score == "btnF"),
			isPoker   = (score == "btnPk"),
			isSStr	= (score == "btnSS"),
			isLStr	= (score == "btnLS"),
			isChance  = (score == "btnCh"),
			isYatzee  = (score == "btnYz")

		if (isSingles)			player.scores[isSingles - 1] = sum(player.dices, isSingles)
		else if (isPairs == 1)	player.scores[6]  = sumdups(player.dices, 2, false, false)
		else if (isPairs == 2)	player.scores[7]  = sum2pairs(player.dices)
		else if (is3Kind)		player.scores[8]  = sumdups(player.dices, 3, false, false)
		else if (isFull)		player.scores[9]  = sumfull(player.dices)
		else if (isPoker)		player.scores[10] = sumdups(player.dices, 4, false, true)
		else if (isSStr)		player.scores[11] = sumstraight(player.dices, false)
		else if (isLStr)		player.scores[12] = sumstraight(player.dices, true)
		else if (isChance)		player.scores[13] = sum(player.dices)
		else if (isYatzee)		player.scores[14] = sumdups(player.dices, 5, true, false)

		player.scores[15] = player.scores.slice(0,-1).reduce((a, b) => (a+b),0)
	}
}
