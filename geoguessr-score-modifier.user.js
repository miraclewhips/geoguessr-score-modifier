// ==UserScript==
// @name         GeoGuessr Score Modifier
// @description  Adds a new scoring system that rewards guessing in the right regions/states of countries
// @version      0.1.1
// @author       miraclewhips
// @match        *://*.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @grant        none
// @copyright    2022, miraclewhips (https://github.com/miraclewhips)
// @license      MIT
// @downloadURL    https://github.com/miraclewhips/geoguessr-score-modifier/raw/master/geoguessr-score-modifier.user.js
// @updateURL    https://github.com/miraclewhips/geoguessr-score-modifier/raw/master/geoguessr-score-modifier.user.js
// ==/UserScript==


// default ratios
const RATIO_GEOGUESSR = 0.5;
const RATIO_COUNTRY = 0.5;

// region ratio is currently ununsed
const RATIO_REGION = 0;

// language to return results in from OpenStreetMaps
const LANGUAGE = 'en';

// custom defined bounding boxes for countries
// https://docs.google.com/spreadsheets/d/1iYxFcZcKM2i9BBDbjwbmoddv2UwkCdXuGv4PGl2eNy8
const BB_COUNTRY = {
	"nz": {
		 "north": -34.39322,
		 "south": -47.29025,
		 "west": 166.43051,
		 "east": 178.55049
	},
	"au": {
		 "north": -10.69382,
		 "south": -43.63373,
		 "west": 112.9248,
		 "east": 153.63846
	},
	"us": {
		 "north": 49.38403,
		 "south": 24.54405,
		 "west": -124.5663,
		 "east": -66.95
	},
	"tw": {
		 "north": 25.29955,
		 "south": 21.89645,
		 "west": 120.0347,
		 "east": 122.00639
	},
	"jp": {
		 "north": 45.52263,
		 "south": 30.99169,
		 "west": 128.5903,
		 "east": 145.81706
	}
}

const BB_REGION = {};

let DATA = {};

const load = () => {
	// default vals
	DATA = {
		round: 0,
		round_started: false,
		game_finished: false,
		checking_api: false,
		last_guess: [0, 0],
		game_score: [],
		game_score_total: 0,
		score_data: {},
	}

	let data = JSON.parse(window.localStorage.getItem('geoScoringRedux'));

	if(data) {
		// reset these vals when the page loads, so it will trigger a round start event when loading a round
		data.round = 0;
		data.round_started = false;
		data.game_finished = false;
		data.checking_api = false;

		// combine with default vals
		Object.assign(DATA, data);
		save();
	}
}

const save = () => {
	window.localStorage.setItem('geoScoringRedux', JSON.stringify(DATA));
}

const bounds = (box) => {
	if(!box) return false;
	return [box.north, box.south, box.west, box.east];
}

// get current round number from the page element in the top right of the game screen
const getCurrentRound = () => {
	const roundNode = document.querySelector('div[class^="status_inner__"]>div[data-qa="round-number"]');

	if(!roundNode) return null;

	return parseInt(roundNode.children[1].textContent.split(/\//gi)[0].trim(), 10);
}

// get the current game ID from the URL
const getGameId = () => {
	// if we are not on the right URL just return null
	if(window.location.href.indexOf('/game/') === -1 && window.location.href.indexOf('/challenge/') === -1) {
		return null;
	}

	return window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
}

// show the score in the panel in the top right of the game screen
const updateRoundPanel = () => {
	let panel = document.getElementById('redux-score-panel');

	if(!panel) {
		let gameScore = document.querySelector('.game-layout__status div[class^="status_section"][data-qa="score"]');

		if(gameScore) {
			let panel = document.createElement('div');
			panel.id = 'redux-score-panel';
			panel.style.display = 'flex';

			let classLabel = gameScore.querySelector('div[class^="status_label"]').className;
			let valueLabel = gameScore.querySelector('div[class^="status_value"]').className;

			panel.innerHTML = `
				<div class="${gameScore.getAttribute('class')}">
					<div class="${classLabel}">REDUX SCORE</div>
					<div id="redux-score-value" class="${valueLabel}"></div>
				</div>
			`;

			gameScore.parentNode.append(panel);
		}
	}
	
	let streak = document.getElementById('redux-score-value');

	if(streak) {
		streak.innerText = DATA.game_score_total.toLocaleString();
	}
}

// show the debug table on the results screen
const updateSummaryPanel = () => {
	if(DATA.checking_api) return;

	calcTotalScore();
}

// convert lat/lng coords to a distance in metres
const latLngToMetres = (loc1, loc2) => {
	loc1[0] = parseFloat(loc1[0]);
	loc1[1] = parseFloat(loc1[1]);
	loc2[0] = parseFloat(loc2[0]);
	loc2[1] = parseFloat(loc2[1]);

	var R = 6378.137; // Radius of earth in KM
	var dLat = loc2[0] * Math.PI / 180 - loc1[0] * Math.PI / 180;
	var dLon = loc2[1] * Math.PI / 180 - loc1[1] * Math.PI / 180;
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	Math.cos(loc1[0] * Math.PI / 180) * Math.cos(loc2[0] * Math.PI / 180) *
	Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	return d * 1000; // metres
}

// return a val from 0-1 representing the score as a percentage
const distancePercentage = (guess, target, region) => {
	// get distance between the guess and the correct location
	let guessDistance = latLngToMetres(guess, target);

	// if it's within 25m, return a perfect score
	if(guessDistance <= 25) return 1;

	// get the size of the region
	// currently just calcs the distance between the top left/bottom right of the bounding box diagonal
	let regionDistance = latLngToMetres([region[0], region[2]], [region[1], region[3]]);
	
	let percent = 1 - guessDistance / regionDistance;

	// perfect score tolerance
	if(percent >= 0.9997) {
		percent = 1;
	}

	// clamp vals between 0 and 1
	return Math.max(0, Math.min(percent, 1));
}

// create the debug table
const calcTotalScore = () => {
	let data = DATA.score_data;
	let scoreGeo = 5000 * RATIO_GEOGUESSR * data.scoreGeoguessr || 0;
	let scoreCountry = 5000 * RATIO_COUNTRY * data.scoreCountry || 0;
	let scoreRegion = 5000 * RATIO_REGION * data.scoreRegion || 0;

	let total = Math.round(scoreGeo + scoreCountry + scoreRegion);
	DATA.game_score[DATA.round] = total;
	DATA.game_score_total = DATA.game_score.reduce((a,b) => a+=b);
	save();

	if(!document.getElementById('scoring-redux-debug')) {
		let debug = document.createElement('div');
		debug.id = 'scoring-redux-debug';
		debug.style.padding = '5px';
		debug.style.background = 'rgba(0,0,0,0.9)';
		debug.style.color = '#fff';
		debug.style.fontFamily = 'monospace';
		debug.style.fontSize = '14px';
		debug.style.position = 'absolute';
		debug.style.zIndex = '999999';
		debug.style.top = '10px';
		debug.style.left = '10px';
		document.body.append(debug);
	}

	let debug = document.getElementById('scoring-redux-debug');
	debug.innerHTML = `
		<table cellpadding="4" border="1" borderColor="#666">
			<tr>
				<td><strong>Type</strong></td>
				<td style="text-align:right"><strong>Amount</strong></td>
				<td style="text-align:right"><strong>Proximity</strong></td>
				<td style="text-align:right"><strong>Ratio</strong></td>
				<td><strong>Guess Location</strong></td>
				<td><strong>Correct Location</strong></td>
				<td style="text-align:right"><strong>Score</strong></td>
			</tr>
			<tr>
				<td>GeoGuessr Score</td>
				<td style="text-align:right">${Math.round(5000 * data.scoreGeoguessr)}</td>
				<td style="text-align:right">${Math.round(data.scoreGeoguessr * 100)}%</td>
				<td style="text-align:right">${RATIO_GEOGUESSR.toFixed(2)}</td>
				<td>N/A</td>
				<td>N/A</td>
				<td style="text-align:right">${Math.round(5000 * data.scoreGeoguessr * RATIO_GEOGUESSR)}</td>
			</tr>
			<tr>
				<td>Country Score</td>
				<td style="text-align:right">${Math.round(5000 * data.scoreCountry)}</td>
				<td style="text-align:right">${Math.round(data.scoreCountry * 100)}%</td>
				<td style="text-align:right">${RATIO_COUNTRY.toFixed(2)}</td>
				<td style="color: ${data.guessCountry == data.targetCountry ? '#8f8' : '#f88'}">${data.guessCountry}</td>
				<td style="color: ${data.guessCountry == data.targetCountry ? '#8f8' : '#f88'}">${data.targetCountry}</td>
				<td style="text-align:right">${Math.round(5000 * data.scoreCountry * RATIO_COUNTRY)}</td>
			</tr>
			<tr>
				<td colspan="7" style="text-align:right"><strong>Round Score Total: ${total}</strong></td>
			</tr>
			<tr>
				<td colspan="7" style="text-align:right"><strong>Game Score Total: ${DATA.game_score_total}</strong></td>
			</tr>
		</table>
	`;
	debug.style.display = 'block';

	return total;
}

// get game data from the GeoGuessr API
const queryGeoguessrGameData = async (id) => {
	let apiUrl = `https://www.geoguessr.com/api/v3/games/${id}`;

	if(location.pathname.startsWith("/challenge/")) {
		apiUrl = `https://www.geoguessr.com/api/v3/challenges/${id}/game`;
	}

	return await fetch(apiUrl).then(res => res.json());
}

// get coord data from OpenStreetMaps
const queryAPI = async (location, zoom) => {
	let apiUrl = `https://nominatim.openstreetmap.org/reverse.php?lat=${location[0]}&lon=${location[1]}&zoom=${zoom}&format=jsonv2&accept-language=${LANGUAGE}`;

	return await fetch(apiUrl).then(res => res.json());
}

const startRound = () => {
	let gameId = getGameId();
	let currentRound = getCurrentRound();

	// don't start the round if we are not currently in a game or there is no round num
	if(!gameId || !currentRound) {
		return false;
	}

	DATA.round = currentRound;
	DATA.round_started = true;
	DATA.game_finished = false;
	DATA.gameId = gameId;

	// if it's round 1 it's the start of a new game so clear the scores from the previous game
	if(DATA.round === 1) {
		DATA.game_score = [];
		DATA.game_score_total = 0;
	}

	updateRoundPanel();

	// hide the debug table when round starts
	if(document.getElementById('scoring-redux-debug')) {
		document.getElementById('scoring-redux-debug').style.display = 'none';
	}
}

const stopRound = async () => {
	DATA.round_started = false;
	DATA.checking_api = true;
	updatePanels();

	// get current game data from GeoGuessr API
	let gameDetails = await await queryGeoguessrGameData(DATA.gameId);

	// get the most recent guess/location coords
	let guess_counter = gameDetails.player.guesses.length;
	let guess = [gameDetails.player.guesses[guess_counter-1].lat, gameDetails.player.guesses[guess_counter-1].lng];
	let target = [gameDetails.rounds[guess_counter-1].lat, gameDetails.rounds[guess_counter-1].lng];

	// if we have already gotten the data for these coords, just return
	if (guess[0] == DATA.last_guess[0] && guess[1] == DATA.last_guess[1]) {
		DATA.checking_api = false;
		updatePanels();
		return;
	}

	DATA.last_guess = guess;

	let scoreData = {
		scoreGeoguessr: gameDetails.player.guesses[guess_counter-1].roundScoreInPoints / 5000,
		scoreCountry: 0,
		scoreRegion: 0,
		guessCC: null,
		targetCC: null,
		guessCountry: null,
		targetCountry: null,
		guessRegion: null,
		targetRegion: null,
	}

	// get country data for the guess and location from OSM
	let guessCountry = await queryAPI(guess, 3);
	let targetCountry = await queryAPI(target, 3);
	console.log('guess: ', guessCountry);
	console.log('location: ', targetCountry);
	
	scoreData.guessCC = guessCountry?.address?.country_code;
	scoreData.targetCC = targetCountry?.address?.country_code;
	scoreData.guessCountry = guessCountry?.address?.country;
	scoreData.targetCountry = targetCountry?.address?.country;

	// get bounding box if defined, or use the one from OSM
	let bb = bounds(BB_COUNTRY[scoreData.targetCC]) || targetCountry.boundingbox;

	// score x^4 if the country is wrong so you don't get 0 points, but also get punished for getting country wrong
	let pow = scoreData.guessCC === scoreData.targetCC ? 1 : 4;
	scoreData.scoreCountry = Math.pow(distancePercentage(guess, target, bb), pow);

	// region score
	// let guessRegion = await queryAPI(guess, 5);
	// let targetRegion = await queryAPI(target, 5);

	// scoreData.guessRegion = guessRegion?.name;
	// scoreData.targetRegion = targetRegion?.name;
	
	// if(scoreData.guessCC === scoreData.targetCC) {
	// 	let bb = bounds(BB_REGION[scoreData.targetCC]) || targetRegion.boundingbox;
	// 	scoreData.scoreRegion = distancePercentage(guess, target, bb);
	// }

	DATA.checking_api = false;
	DATA.score_data = scoreData;
	save();

	updatePanels();
}

const updatePanels = () => {
	updateRoundPanel();
	updateSummaryPanel();
}

const init = () => {
	load();

	const observer = new MutationObserver(() => {
		// if we are not in a game, hide the debug table
		if(window.location.href.indexOf('/game/') === -1 && window.location.href.indexOf('/challenge/') === -1) {
			if(document.getElementById('scoring-redux-debug')) {
				document.getElementById('scoring-redux-debug').style.display = 'none';
			}
		}

		const gameLayout = document.querySelector('.game-layout');
		const resultLayout = document.querySelector('div[class^="result-layout_root"]');
		const finalScoreLayout = document.querySelector('div[class^="result-layout_root"] div[class^="standard-final-result_score__"]');

		if(gameLayout) {
			// if the round or game ID has changed, start a new round
			if (DATA.round !== getCurrentRound() || DATA.gameId !== getGameId()) {
				// if the previous round is still in progress, stop it first
				if(DATA.round_started) {
					stopRound();
				}

				startRound();
			}else if(resultLayout && DATA.round_started) {
				stopRound();
			}else if(finalScoreLayout && !DATA.game_finished) {
				DATA.game_finished = true;
				updatePanels();
			}
		}
	});

	observer.observe(document.querySelector('#__next'), { subtree: true, childList: true });
}

init();