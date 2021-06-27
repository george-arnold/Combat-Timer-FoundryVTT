let timer;
// create reset timer
let div = document.createElement('div');
div.innerHTML = `<p id="timer-p"> Timer </p> 
<label id="minutes">00</label>
<label id="colon">:</label>
<label id="seconds">00</label>`;
div.id = 'combat-timer';
div.className = 'combat-timer';
document.body.appendChild(div);

let minutesLabel = document.getElementById('minutes');
let secondsLabel = document.getElementById('seconds');
let pContent = document.getElementById('timer-p');

// create total timer
// let divTotal = document.createElement('div');
// divTotal.innerHTML = `<p> Actor Total </p>
// <label id="total-minutes">00</label>
// <label id="total-colon">:</label>
// <label id="total-seconds">00</label>`;
// divTotal.id = 'combat-timer-total';
// divTotal.className = 'combat-timer-total';
// document.body.appendChild(divTotal);

let minutesTotalLabel = document.getElementById('total-minutes');
let secondsTotalLabel = document.getElementById('total-seconds');
let currentRound;
Hooks.on('updateCombat', async (e, t, d) => {
	console.log(
		e.combatant,
		'then',
		e,
		'then',
		t,
		'then',
		currentRound,
		'then',
		d
	);

	const { actor, name } = e.combatant;

	t.round ? (currentRound = t.round) : null;

	!e.combatant.timerRoundArray ? (e.combatant.timerRoundArray = []) : null;

	console.error(
		e.combatant.timerRoundArray,
		currentRound,
		'timer array and round after initialization'
	);

	e.combatant.timerRoundArray && currentRound >= 2
		? e.combatant.timerRoundArray.push(e.combatant.timer)
		: null;

	console.error(e.combatant, 'combatant after push');
	// let combatantElement = document.querySelector(
	// 	`[data-combatant-id=${e.combatant._id}]`
	// );
	// let newElement = document.createElement('div');
	// newElement.innerHTML = `<p>TEST</p>`;
	// console.error(newElement, 'new Element');
	// console.error(combatantElement, 'cb elem');

	pContent.innerHTML = `${e.combatant.name}`;
	// console.error(t, 'tttttt');
	// console.error(d, 'ddddd');
	e.combatant.totalTime > 0 ? null : (e.combatant.totalTime = 0);

	e.combatant.timer = 0;

	if (!e.hasTimer && currentRound >= 1) {
		e.hasTimer = true;
		timer = setInterval(() => {
			setTime();
		}, 1000);
	}

	function setTime() {
		++e.combatant.timer;
		e.combatant.timer >= 120
			? pContent.classList.add('bg-dark-red')
			: pContent.classList.remove('bg-dark-red');
		++e.combatant.totalTime;
		secondsLabel.innerHTML = pad(e.combatant.timer % 60);
		minutesLabel.innerHTML = pad(parseInt(e.combatant.timer / 60));
	}
	function pad(val) {
		let valString = val + '';
		if (valString.length < 2) {
			return '0' + valString;
		} else {
			return valString;
		}
	}
});

Hooks.on('deleteCombat', async (e) => {
	console.error(e, 'DELETED');

	secondsLabel.innerHTML = '00';
	minutesLabel.innerHTML = '00';
	pContent.innerHTML = 'Label';

	let timeCard = document.createElement('div');
	timeCard.id = 'time-card-final-report';
	timeCard.innerHTML = `<header class="window-header timer-header flexrow draggable resizable">
		<h4 class="window-title">Time Card</h4>
		<label id="close-timer" class="header-button close"><i class="fas fa-times"></i>Close</label>
	</header> `;

	timeCard.classList.add(
		'app',
		'window-app',
		'image-popout',
		'dark',
		'time-card'
	);

	let totalTimeDocument;
	let recordRounds;
	let finalMinutesReport;
	let finalSecondsReport;
	let avgPerRound;
	e.combatants.forEach((combatant) => {
		console.error(combatant, 'each combatant');

		combatant.timer > 0
			? combatant.timerRoundArray.push(combatant.timer)
			: null;
		if (combatant.totalTime) {
	finalMinutesReport = Math.floor(combatant.totalTime / 60);
	finalSecondsReport = combatant.totalTime % 60;

	finalSecondsReport.toString().length < 2
		? (finalSecondsReport = '0' + finalSecondsReport)
		: null;

	totalTimeDocument = document.createElement('div');
	totalTimeDocument.classList.add('combatant-times');
	totalTimeDocument.innerHTML = `<h5 class="total-combat-time"> ${combatant.name} ${finalMinutesReport}:${finalSecondsReport}</h5>`;

	avgPerRound = Math.floor(
		combatant.totalTime / combatant.timerRoundArray.length / 60
	);

	avgPerRound > 5
		? totalTimeDocument.classList.add('heading-color-red')
		: avgPerRound < 2
		? totalTimeDocument.classList.add('heading-color-green')
		: null;

	combatant.timerRoundArray.forEach((time, index) => {
		recordRounds = document.createElement('span');
		let byRoundMinute = Math.floor(time / 60);
		let byRoundSecond = time % 60;
		byRoundSecond.toString().length < 2
			? (byRoundSecond = '0' + byRoundSecond)
			: null;
		recordRounds.innerHTML = `<p class="round-title"> Round ${
			index + 1
		} </p> <p class="round-time">Time: ${byRoundMinute}:${byRoundSecond} </p>`;

		byRoundMinute >= 4
			? recordRounds.classList.add('bg-dark-red')
			: null;
		byRoundMinute < 1
			? recordRounds.classList.add('bg-dark-green')
			: null;
		totalTimeDocument.appendChild(recordRounds);
	});
	timeCard.appendChild(totalTimeDocument);
}
		

	});
	document.body.appendChild(timeCard);
	clearInterval(timer);

	$('#close-timer').on('click', function () {
		$('#time-card-final-report').remove();
	});
});
