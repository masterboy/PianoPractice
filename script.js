// Required static variables and data

// Variation - 5_BLACK_NOTES
var filePath = "wavs/5_BLACK_NOTES/";
var files = "A_FLAT,A_SHARP,B_FLAT,C_SHARP,D_FLAT,D_SHARP,E_FLAT,F_SHARP,G_FLAT,G_SHARP";


var extension = ".wav";
var audio = document.querySelector('audio');
var loadedCount = 0;
var playingKey = null;
var nowPlaying = null;
var audioFilePadding = 500; // miliseconds
var justStarted = false;
var announceTimer = null;
var playTimer = null;
var shouldAnnounceTimer = null;

// Computed variables
var filesArray = files.split(',');
var filesCount = filesArray.length;
var gapBetween = parseInt(getGapBetween()) * 1000;


// Prefetch audio file
function preloadAudio(url) {
	var audio = new Audio();
	// the file will be kept by the browser as cache, so that we don't have to download it on demand
	audio.addEventListener('canplaythrough', function(){
		if (++loadedCount === filesCount){
			console.log("All files loaded");
		}
	}, false);
	audio.src = url;
}

// Prefetch all the audio files
for (var i in filesArray) {
	// console.log(filePath + filesArray[i] + extension);
	preloadAudio(filePath + filesArray[i] + extension);
}

audio.onended = function() {
	var actualGapBetween; // Because the audio files already have few ms of padding with voice
	if(isPlaying){
		random_number = Math.round(Math.random() * 100);
		random_number = random_number % filesCount;
		playingKey = filesArray[random_number];
		nowPlaying = filePath + playingKey + extension;

		// Format key with Musical Notations
		playingKey = musicalFormat(playingKey);

		// gives a 4 second gap if audio file already have 200ms of air paddings and the actual voice plays for only 600ms
		actualGapBetween = gapBetween - audioFilePadding*2; 

		if (justStarted){
			actualGapBetween = 100;
			justStarted = false;
		}

		console.log("Gap for", actualGapBetween, "ms");

		playTimer = setTimeout(function(){ // play the next note after 
			if (!isPlaying){ // Pause button pressed before next audio time
				return;
			}

			audio.src=nowPlaying;
			console.log("Playing", random_number, nowPlaying);
			audio.play();
			announceText(playingKey);
		}, actualGapBetween);

	} else {
		console.log("Practice Finished");
	}
};

function announceText(word){
	clearTimeout(shouldAnnounceTimer);
	if (audio.readyState === HTMLMediaElement.HAVE_FUTURE_DATA || audio.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA){
		// Do nothing, let it announce
	} else { // Or check it after few milisecs and then announce
		shouldAnnounceTimer = setTimeout(function(){
			announceText(word);
		}, 10);
	}

	clearTimeout(announceTimer);
	announceTimer = setTimeout(function(){ // Wait for few ms, then announce the text
		var AAannounce = document.querySelector('#announce');
		AAannounce.classList.remove('announce');
		AAannounce.innerText = word;
		AAannounce.style.display='initial';
		AAannounce.classList.add('announce');
		setTimeout(function(){ // close after few seconds
			AAannounce.classList.remove('announce');
			AAannounce.innerText = '';
			AAannounce.style.display='none';
		}, 400);
	}, 200);
}

function musicalFormat(str){
	// Notation Characters
	var major = "";
	var minor = "m";
	var flat = "b";
	var sharp = "#";
	var returnString = str;

	if (str.endsWith('_MAJOR')){
		returnString = str.replace('_MAJOR', major);
	} 
	else if (str.endsWith('_MINOR')){
		returnString = str.replace('_MINOR', minor);
	}
	else if (str.endsWith('_SHARP')){
		returnString = str.replace('_SHARP', sharp);
	}
	else if (str.endsWith('_FLAT')){
		returnString = str.replace('_FLAT', flat);
	}

	return returnString;
}


function getGapBetween(){
	return document.querySelector('#speed').value;
}

function speedChanged(){
	clearTimeout(announceTimer);
	document.querySelector('#announce').innerText = '';
	gapBetween = parseInt(getGapBetween()) * 1000;
	isPlaying = false;
	audio.pause();
	playPauseButtonClicked();
}

function playPauseButtonClicked(){
	isPlaying = !isPlaying;
	justStarted = true;

	AAanimation.setAttribute("from", isPlaying ? pause : play);
	AAanimation.setAttribute("to", isPlaying ? play : pause);
	AAanimation.beginElement();

	if (isPlaying){ // playing means -> the button says "||" or "Pause"
		audio.onended(); // This function plays the audio
		document.querySelector(".play-pause-button").classList.remove('paused');
	} else {
		audio.pause();
		document.querySelector(".play-pause-button").classList.add('paused');
	}
}



// Pause, Play button related data
var isPlaying = false,
	pause = "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28",
	play = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26",
	AAanimation = document.querySelector('#animation');

// What happens when user clicks the Play button
document.querySelector(".play-pause-button").addEventListener('click', playPauseButtonClicked);