var musicWrapper = document.querySelector(".player-wrapper");
var musicImg = musicWrapper.querySelector(".img-area img");
var musicName = musicWrapper.querySelector(".song-details .name");
var favicon = musicWrapper.querySelector(".song-details .favorite");
var musicArtist = musicWrapper.querySelector(".song-details .artist");
var playPauseBtn = musicWrapper.querySelector(".play-pause");
var prevBtn = musicWrapper.querySelector("#prev");
var nextBtn = musicWrapper.querySelector("#next");
var mainAudio = document.querySelector("#main-audio");
var progressArea = musicWrapper.querySelector(".progress-area");
var progressBar = progressArea.querySelector(".progress-bar");
var currTime = progressArea.querySelector(".current-time");
var maxDuration = progressArea.querySelector(".max-duration");
var repeatBtn = musicWrapper.querySelector("#repeat-plist");
var shuffleBtn = musicWrapper.querySelector("#shuffle-plist");
var moreMusicBtn = musicWrapper.querySelector("#more-music");
var audioctx = new AudioContext();
var backToAlbum = musicWrapper.querySelector(".back-to-album");
// const closemoreMusic = musicList.querySelector("#close") as Element;
// const musicList = wrapper.querySelector(".music-list") as Element;
function renderMusicc(albumIdx, id) {
    currAlbumIndex = albumIdx;
    nowPlayingAlbum = currAlbumIndex;
    currMusicIndex = id;
    loadAndPlay();
    playerPage.classList.add("active");
    menuPage === null || menuPage === void 0 ? void 0 : menuPage.classList.remove("active");
    musicLiPage === null || musicLiPage === void 0 ? void 0 : musicLiPage.classList.remove("active");
}
function loadAndPlay() {
    var currentMusic = allAlbums[currAlbumIndex].musics[currMusicIndex];
    mainAudio.pause();
    mainAudio.currentTime = 0;
    musicName.innerText = currentMusic.track_name;
    musicArtist.innerText = allAlbums[currAlbumIndex].album.album_composer;
    musicImg.src = currentMusic.track_thumb;
    maxDuration.innerText = currentMusic.track_time;
    var a = fetch(currentMusic.track_url)
        .then(function (res) {
        if (res == null || res.body == null)
            return;
        var reader = res.body.getReader();
        return reader.read().then(function (result) {
            return result;
        });
    })
        .then(function (data) {
        if (data == undefined || data.value == undefined)
            return;
        var blob = new Blob([data.value], { type: "audio" });
        var blobUrl = URL.createObjectURL(blob);
        createDB();
        putInDB({ blob: blob }, currentMusic.id, "songs");
        mainAudio.src = blobUrl;
        mainAudio.oncanplay = function () {
            playMusic();
            renderFavicon();
        };
    });
}
function loadMusic(currentMusic, artist) {
    musicName.innerText = currentMusic.track_name;
    musicArtist.innerText = artist;
    musicImg.src = currentMusic.track_thumb;
    mainAudio.src = currentMusic.track_url;
    maxDuration.innerText = currentMusic.track_time;
}
function renderFavicon() {
    var currentMusic = allAlbums[currAlbumIndex].musics[currMusicIndex];
    if (currentMusic.is_favorited === 1) {
        favicon.innerText = "favorite";
        favicon.classList.add("liked");
    }
    else {
        favicon.innerText = "favorite_outlined";
        favicon.classList.remove("liked");
    }
}
favicon.addEventListener("click", function () {
    var currentMusic = allAlbums[currAlbumIndex].musics[currMusicIndex];
    if (currentMusic.is_favorited === 1) {
        allAlbums[currAlbumIndex].musics[currMusicIndex].is_favorited = 0;
    }
    else {
        allAlbums[currAlbumIndex].musics[currMusicIndex].is_favorited = 1;
    }
    saveData();
    renderFavicon();
});
backToAlbum.addEventListener("click", function () {
    searchInput.value = "";
    if (tabNum === 0) {
        playerPage.classList.remove("active");
        menuPage === null || menuPage === void 0 ? void 0 : menuPage.classList.add("active");
        musicLiPage === null || musicLiPage === void 0 ? void 0 : musicLiPage.classList.remove("active");
        getLikedMusics();
    }
    else {
        playerPage.classList.remove("active");
        menuPage === null || menuPage === void 0 ? void 0 : menuPage.classList.remove("active");
        musicLiPage === null || musicLiPage === void 0 ? void 0 : musicLiPage.classList.add("active");
        renderAlbum(allAlbums[currAlbumIndex]);
    }
});
function playMusic() {
    mainAudio.play();
    isPlaying = true;
    musicWrapper.classList.remove("paused");
    var btn = playPauseBtn.querySelector("i");
    btn.innerText = "pause";
}
function pauseMusic() {
    musicWrapper.classList.add("paused");
    var btn = playPauseBtn.querySelector("i");
    btn.innerText = "play_arrow";
    isPlaying = false;
    mainAudio.pause();
}
playPauseBtn.addEventListener("click", function () {
    if (audioctx.state === "suspended") {
        audioctx.resume();
    }
    if (isPlaying === false) {
        resumeMusic();
    }
    else {
        pauseMusic();
    }
});
function resumeMusic() {
    musicWrapper.classList.add("playing");
    var btn = playPauseBtn.querySelector("i");
    btn.innerText = "pause";
    isPlaying = true;
    mainAudio.play();
}
function prevMusic() {
    var len = allAlbums[currAlbumIndex].musics.length;
    currMusicIndex--;
    if (currMusicIndex < 0) {
        currMusicIndex = len - 1;
    }
    loadAndPlay();
}
function nextMusic() {
    var len = allAlbums[currAlbumIndex].musics.length;
    currMusicIndex++;
    if (currMusicIndex === len) {
        currMusicIndex = 0;
    }
    loadAndPlay();
}
nextBtn.addEventListener("click", nextMusic);
prevBtn.addEventListener("click", prevMusic);
mainAudio.addEventListener("timeupdate", function (e) {
    var target = e.target;
    var currentTime = target.currentTime;
    var duration = target.duration;
    var progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = "".concat(progressWidth, "%");
    currTime.innerText = formatTime(currentTime);
    // maxDuration.innerText = formatTime(duration);
});
function formatTime(sec) {
    var minutes = Math.floor(sec / 60);
    var seconds = Math.floor(sec % 60);
    return "".concat(padTo2Digits(minutes), ":").concat(padTo2Digits(seconds));
}
function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
}
progressArea.addEventListener("click", function (e) {
    var ev = e;
    var barWidth = progressArea.clientWidth;
    var clickOffset = ev.offsetX;
    var duration = mainAudio.duration;
    mainAudio.currentTime = (clickOffset / barWidth) * duration;
    playMusic();
});
repeatBtn.addEventListener("click", function () {
    var txt = repeatBtn.innerText;
    switch (txt) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});
mainAudio.addEventListener("ended", function () {
    if (shuffleMode) {
        playShuffled();
    }
    else {
        var txt = repeatBtn.innerText;
        switch (txt) {
            case "repeat":
                nextMusic();
                break;
            case "repeat_one":
                mainAudio.currentTime = 0;
                playMusic();
                break;
        }
    }
    renderAlbum(allAlbums[currAlbumIndex]);
});
shuffleBtn.addEventListener("click", function () {
    shuffleMode = !shuffleMode;
    if (shuffleMode) {
        shuffleBtn.classList.add("active");
    }
    else {
        shuffleBtn.classList.remove("active");
    }
});
function playShuffled() {
    var len = allAlbums[currAlbumIndex].musics.length;
    var randIndex = Math.floor(Math.random() * len);
    do {
        randIndex = Math.floor(Math.random() * len);
    } while (currMusicIndex == randIndex);
    currMusicIndex = randIndex;
    loadAndPlay();
}
