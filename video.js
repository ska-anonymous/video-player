//Document objects
const videoPlayer = document.querySelector('.video-player');
const video = videoPlayer.querySelector('.video');
const playButton = videoPlayer.querySelector('.play-button');
const volume = videoPlayer.querySelector('.volume');
const currentTimeElement = videoPlayer.querySelector('.current');
const durationTimeElement = videoPlayer.querySelector('.duration');
const progress = videoPlayer.querySelector('.video-progress');
const progressBar = videoPlayer.querySelector('.video-progress-filled');
const mute = videoPlayer.querySelector('.mute');
const fullscreen = videoPlayer.querySelector('.fullscreen');
const cursorTimeElem = videoPlayer.querySelector('.cursor-time');
const cursorTimeValueElem = videoPlayer.querySelector('.cursor-time-value');
const videoNameElem = videoPlayer.querySelector('.video-name');
const btnMore = videoPlayer.querySelector('.more-button');
const moreMenu = videoPlayer.querySelector('.more-menu');
const pipElem = document.getElementById('pip');
const playbackSpeedElem = document.getElementById('playback-speed');
const playbackSpeedList = videoPlayer.querySelector('.playback-speed-list');
const importVideosButton = document.getElementById('import-videos');
const errorMessageElem = videoPlayer.querySelector('.error-message');
const nextButton = videoPlayer.querySelector('.next-button');
const previousButton = videoPlayer.querySelector('.previous-button');
const audioTrackListEl = videoPlayer.querySelector('.audio-tracks-list');
const btnShowAudioTracks = document.getElementById('audio-tracks');


//Program Variables
let videosList = [];
let currentVideoIndex = 0;

//................////////
function loadVideo(newIndex) {

    if (newIndex == "current") {
        resetVideoProperties();
        video.src = URL.createObjectURL(videosList[currentVideoIndex]);
        videoNameElem.innerHTML = videosList[currentVideoIndex].name;
        // video.load();
        playVideo();
    } else if (newIndex == "next" && currentVideoIndex < (videosList.length - 1)) {
        resetVideoProperties();
        currentVideoIndex++;
        video.src = URL.createObjectURL(videosList[currentVideoIndex]);
        videoNameElem.innerHTML = videosList[currentVideoIndex].name;
        // video.load();
        playVideo();
    } else if (newIndex == "previous" && currentVideoIndex > 0) {
        resetVideoProperties();
        currentVideoIndex--;
        video.src = URL.createObjectURL(videosList[currentVideoIndex]);
        videoNameElem.innerHTML = videosList[currentVideoIndex].name;
        // video.load();
        playVideo();
    }



    if (videosList.length > 0) {
        playButton.style.opacity = "1";
    }
    if (videosList.length > 1 && currentVideoIndex < (videosList.length - 1)) {
        nextButton.style.opacity = "1";
    } else {
        nextButton.style.opacity = "0.5";
    }

    if (currentVideoIndex > 0) {
        previousButton.style.opacity = "1";
    } else {
        previousButton.style.opacity = "0.5";
    }


}


function resetVideoProperties() {
    video.pause();
    durationTimeElement.innerHTML = "00:00";
    video.currentTime = 0;
    progressBar.style.width = "0";
    if (errorMessageElem.style.display = "block") {
        errorMessageElem.style.display = "none";
    }
}


// when the video loads enough to get its metadata
video.addEventListener('loadedmetadata', () => {
    loadAudioTracks();
    setDuration();

});


function loadAudioTracks() {
    if (video.audioTracks != undefined) {
        let audioTracksList = video.audioTracks;
        let html = "";
        Array.from(audioTracksList).forEach((track, index) => {
            html += `
            <div class="audio-track" id="${index}">${index + 1}, label:${track.label != "" ? track.label : "unknown"}, language:${track.language != "" ? track.language : "unknown"}</div>
            `;
        });

        audioTrackListEl.innerHTML = html;
    } else {
        audioTrackListEl.innerHTML = "";

    }

}



function playVideo() {

    if (video.src == "") {
        errorMessageElem.innerHTML = `NO VIDEO FILE SELECTED. CLICK ON &vellip; AND THEN CLICK ON OPEN VIDEOS`;
        errorMessageElem.style.display = "block";
    } else {
        video.play().catch(error => {
            errorMessageElem.innerHTML = `THIS FILE IS NOT SUPPORTED`;
            errorMessageElem.style.display = "block";

            setTimeout(() => {
                errorMessageElem.style.display = "none";
            }, 5000);

        });

    }

    if (errorMessageElem.style.display == "block") {
        setTimeout(() => {
            errorMessageElem.style.display = "none";
        }, 5000);
    }

}





//Play and Pause button
playButton.addEventListener('click', (e) => {
    if (video.paused) {
        playVideo();
    } else {
        video.pause();
    }
});


//next Button
nextButton.addEventListener('click', () => {
    loadVideo("next");
});

//previous Button
previousButton.addEventListener('click', () => {
    loadVideo('previous');
});


//Volume
volume.addEventListener('input', (e) => {
    video.volume = e.target.value;
});



//current time
const currentTime = () => {
    let currentHours = Math.floor(video.currentTime / 3600);
    let currentMinutes = Math.floor((video.currentTime - currentHours * 3600) / 60);
    let currentSeconds = Math.floor(video.currentTime - (currentHours * 3600 + currentMinutes * 60));

    currentTimeElement.innerHTML = `${currentHours}:${currentMinutes}:${currentSeconds < 10 ? '0' + currentSeconds : currentSeconds}`;

}

video.addEventListener('timeupdate', currentTime);


//duration function
function setDuration() {
    let durationHours = Math.floor(video.duration / 3600);
    let durationMinutes = Math.floor((video.duration - durationHours * 3600) / 60);
    let durationSeconds = Math.floor(video.duration - (durationHours * 3600 + durationMinutes * 60));

    durationTimeElement.innerHTML = `${durationHours}:${durationMinutes}:${durationSeconds < 10 ? '0' + durationSeconds : durationSeconds}`;
}



//Progress Bar
video.addEventListener('timeupdate', () => {
    const percentage = (video.currentTime / video.duration) * 100;
    progressBar.style.width = `${percentage}%`;
});


//Change Progress Bar on click
progress.addEventListener('click', (e) => {
    const progressTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = progressTime;
});


//mute button
mute.addEventListener('click', () => {
    video.muted = !video.muted;
    mute.classList.toggle('muted');
    if (mute.classList.contains('muted')) {
        mute.title = "Unmute";
    } else {
        mute.title = "Mute";
    }
});


//fullscreen button
fullscreen.addEventListener('click', () => {
    if (document.webkitIsFullScreen) {
        document.webkitExitFullscreen();
    } else {
        videoPlayer.requestFullscreen();
    }
});


//prevent contextmenu on videoPlayer
videoPlayer.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});



//dbl click on video
video.addEventListener('dblclick', (e) => {
    let clickedSection = (e.offsetX / video.offsetWidth) * 100;

    //if double click is on the left side of the video then seek-bakward 10sec
    if (clickedSection < 30) {
        video.currentTime = video.currentTime - 10;
        showSeekbackwardAnimation();

    }
    //if double click is on the right side of the video then seek-forward 10sec
    if (clickedSection > 70) {
        video.currentTime = video.currentTime + 10;
        showSeekforwardAnimation();
    }
    //if double click is on the mid section of the video then fullscreen the video
    if (clickedSection >= 30 && clickedSection <= 70) {
        if (document.webkitIsFullScreen) {
            document.webkitExitFullscreen();
        } else {
            videoPlayer.requestFullscreen();
        }
    }

});


//seek Animations functons
function showSeekforwardAnimation(){
    videoPlayer.classList.remove('seekforward'); //if already set by another means then remove it in order for animation to take place
    videoPlayer.classList.add('seekforward');
    setTimeout(() => {
        videoPlayer.classList.remove('seekforward');
    }, 500);
}

function showSeekbackwardAnimation(){
    videoPlayer.classList.remove('seekbackward'); //if already set by another means then remove it in order for animation to take place
    videoPlayer.classList.add('seekbackward');
    setTimeout(() => {
        videoPlayer.classList.remove('seekbackward');
    }, 500);
}






// single click on video (play pause)
video.addEventListener('click', () => {
    if (video.paused) {
        playVideo();
    } else {
        video.pause();
    }

});


//play pause on pressing space bar
document.addEventListener('keyup', (e) => {
    if (e.target.tagName == "BODY") {

        if (e.which == 32) {

            if (video.paused) {
                playVideo();

            } else {
                video.pause();
            }

        }

    }
});


document.addEventListener('keydown', (e) => {
    if (e.target.tagName == "BODY") {
            e.preventDefault();
    }

    //seek backward on arrow left button
    if(e.which == 37){ //arrow left button
        video.currentTime --;
    }

    //seek forward
    if(e.which == 39){// right arrow key
        video.currentTime++;
    }

    //volume up
    if(e.which == 38){// arrow up key
        volume.value = (volume.value-0) + 0.01;
        volume.dispatchEvent(new Event('input'));
    }

    //volume down
    if(e.which == 40){ //arrow down key
        volume.value-= 0.01;
        volume.dispatchEvent(new Event('input'));
    }

});



//Change fullScreen button title on fullscreenchange event
videoPlayer.addEventListener('fullscreenchange', () => {
    if (document.webkitIsFullScreen) {
        fullscreen.title = "Collapse";
    } else {
        fullscreen.title = "Expand";
    }
});


//change play pause icon by Adding Event Listener play and pause to video object
video.addEventListener('play', () => {
    playButton.firstElementChild.className = "fas fa-pause";
    playButton.title = "Pause";
    videoPlayer.style.animationName = "shadowchange";
});

video.addEventListener('pause', () => {
    playButton.firstElementChild.className = "fas fa-play";
    playButton.title = "Play";
    videoPlayer.style.animationName = "";
});


//video volumechange event and its function
video.addEventListener('volumechange', () => {

    volume.value = video.volume;
    volume.title = video.volume;
});



//Play next song automatically when the current song is ended
video.addEventListener('ended', () => {
    loadVideo('next');
});

//Change volume on mousewheel over videoPlayer
videoPlayer.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY > 0) {
        volume.value = volume.value - 0.03;
    } else {
        volume.value = (volume.value - 0) + 0.03;
    }
    volume.dispatchEvent(new Event('input'));
});



//set and display cursor time by listening to mousemove on videoprogress
progress.addEventListener('mousemove', (e) => {
    let cursorTime = (e.offsetX / progress.offsetWidth) * video.duration;
    let percentage = (cursorTime / video.duration) * 100;
    let cursorTimeHours = Math.floor((cursorTime / 3600));
    let cursorTimeMinutes = Math.floor((cursorTime - cursorTimeHours * 3600) / 60);
    let cursorTimeSeconds = Math.floor((cursorTime - (cursorTimeHours * 3600 + cursorTimeMinutes * 60)));

    if (cursorTimeHours >= 0) {
        cursorTimeElem.style.display = "block";
        cursorTimeValueElem.innerHTML = `${cursorTimeHours}:${cursorTimeMinutes}:${cursorTimeSeconds}`;
        cursorTimeElem.style.width = `${percentage}%`;

    }
});

progress.addEventListener('mouseleave', () => {
    cursorTimeElem.style.display = "none";
});


//more option button
btnMore.addEventListener('click', () => {
    if (moreMenu.style.display == "block") {
        moreMenu.style.display = "none";
    } else {
        moreMenu.style.display = "block";
    }

});

btnMore.addEventListener('blur', () => {
    //settimeout because even on clicking one of the item in the menu it changes moremenu display to none and as a result the item in the more menu does not fire click event then
    setTimeout(() => {
        moreMenu.style.display = "none";
    }, 200);
});



//pip button (picture-in-picture)
pipElem.addEventListener('click', () => {
    video.requestPictureInPicture();

});


//playbackspeed button
playbackSpeedElem.addEventListener('click', () => {
    playbackSpeedList.style.display = "block";

});

document.addEventListener('click', (e) => {
    // hide playbackspeed list by listenenig to click on document(as blur event does not work on div)
    if (e.target != playbackSpeedElem) { //check if the clicked item is other than the playbackspeed button
        playbackSpeedList.style.display = "none";
    }

    // hide audio Tracks List by listenenig to click on document(as blur event does not work on div)
    if (e.target != btnShowAudioTracks) {
        audioTrackListEl.style.display = "none";
    }

    //hide audioTracks not enabled error message if displayed
    if (e.target != btnShowAudioTracks && document.querySelector('.audio-tracks-error-message').style.display == "block") {
        document.querySelector('.audio-tracks-error-message').style.display = "none";
    }

});



//change playbackrate on clicking one of the item in the playbackspeedList
playbackSpeedList.addEventListener('click', (e) => {
    video.playbackRate = e.target.id;
    let listItems = playbackSpeedList.children;
    Array.from(listItems).forEach(element => {
        element.firstElementChild.className = "";

    });

    if (e.target.tagName == "DIV") {
        e.target.firstElementChild.className = "bi bi-check2";
    } else if (e.target.tagName == "I") {
        e.target.className = "bi bi-check2";
    }


});



//Audio tracks button
btnShowAudioTracks.addEventListener('click', () => {
    if (audioTrackListEl.childElementCount) {
        audioTrackListEl.style.display = "block";
    } else if (video.audioTracks == undefined) {
        document.querySelector('.audio-tracks-error-message').style.display = "block";
    } else {
        //this third condition will only be true if video is not loaded yet or is not supported so that on calling playVideo() function it will display the related error message made in playVideo() function.
        playVideo();
    }
});


//Change Audio Track by clicking one of the track in the list
audioTrackListEl.addEventListener('click', (event) => {
    let audioTrackIndex = event.target.id;
    changeAudioTrack(audioTrackIndex);
});


function changeAudioTrack(newIndex) {
    if (video.audioTracks != undefined) {
        let audioTracksList = video.audioTracks;
        if (audioTracksList.length > 1) {
            Array.from(audioTracksList).forEach((track, index) => {
                if (index == newIndex) {
                    track.enabled = true;
                } else {
                    track.enabled = false;
                }
            });

        }

        //Wait for a little time so that the track is changed succesffully and is ready to play
        // setTimeout(() => {
        //     playVideo();
        // }, 5000);

    } else {
        document.querySelector('.audio-tracks-error-message').style.display = "block";
    }

}

// Add event listner to audioTracks so that on changing audio track execute code given
if(video.audioTracks!= undefined){// make sure audioTracks are enabled in chrome
    video.audioTracks.addEventListener('change', ()=>{
        video.currentTime-=0.1; // to prevent video from beign halted(stucked) due to audio synchronization
    });
}

// Import(open) Videos 
importVideosButton.addEventListener('click', () => {
    let fileInputElement = document.createElement('input');
    fileInputElement.type = "file";
    fileInputElement.multiple = "true";
    fileInputElement.accept = "video/*,audio/*";
    fileInputElement.click();

    fileInputElement.addEventListener('change', () => {
        let filesList = fileInputElement.files;
        videosList = [];
        currentVideoIndex = 0;
        //validate video and audio files and then put valid files in the videos array.
        Array.from(filesList).forEach(file => {
            if (file.type.includes('video/') || file.type.includes('audio/')) {
                videosList.push(file);
            }
        });

        if(videosList.length > 0){
            loadVideo("current");
        }
    });


});

