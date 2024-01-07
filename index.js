var allAlbums;
var currAlbumIndex;
var currMusicIndex;
var nowPlayingAlbum;
var tabNum = 2;
var shuffleMode;
shuffleMode = false;
var isPlaying = false;
var albumsStorage = localStorage.getItem("albumsData");
if (albumsStorage === null) {
    allAlbums = loadJSON("./data.json").albums;
    saveData();
}
else {
    allAlbums = JSON.parse(albumsStorage);
}
var menuPage = document.querySelector(".menu-page");
var playlistsTab = menuPage.querySelector(".playlists");
var artistsTab = menuPage.querySelector(".artists");
var albumsTab = menuPage.querySelector(".albums");
playlistsTab.addEventListener("click", function () {
    playlistsTab.classList.add("active");
    artistsTab.classList.remove("active");
    albumsTab.classList.remove("active");
    tabNum = 1;
    getPlaylists();
});
artistsTab.addEventListener("click", function () {
    playlistsTab.classList.remove("active");
    artistsTab.classList.add("active");
    albumsTab.classList.remove("active");
    tabNum = 2;
    getArtists();
});
albumsTab.addEventListener("click", function () {
    console.log("hey");
    playlistsTab.classList.remove("active");
    artistsTab.classList.remove("active");
    albumsTab.classList.add("active");
    tabNum = 3;
    getAlbums();
});
function loadJSON(filePath) {
    var json = loadTextFileAjaxSync(filePath, "application/json");
    return JSON.parse(json);
}
function loadTextFileAjaxSync(filePath, mimeType) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    if (mimeType != null) {
        if (xmlhttp.overrideMimeType) {
            xmlhttp.overrideMimeType(mimeType);
        }
    }
    xmlhttp.send();
    if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
        return xmlhttp.responseText;
    }
    else {
        return null;
    }
}
function saveData() {
    localStorage.setItem("albumsData", JSON.stringify(allAlbums));
    allAlbums = JSON.parse(localStorage.getItem("albumsData"));
}
var db;
function createDB() {
    var request = indexedDB.open("data", 1);
    request.addEventListener("error", function (err) {
        console.log("indexedDB err: ", err);
    });
    request.addEventListener("success", function () {
        db = request.result;
    });
    request.addEventListener("upgradeneeded", function () {
        db = request.result;
        db.createObjectStore("songs");
    });
}
function putInDB(element, key, store) {
    var openReq = indexedDB.open("data");
    openReq.addEventListener("success", function () {
        db = openReq.result;
        var transaction = db.transaction(store, "readwrite");
        var objStore = transaction.objectStore(store);
        var temp = JSON.parse(JSON.stringify(element));
        var request = objStore.add(temp, key);
        request.onerror = function (err) { return console.log(err); };
        transaction.oncomplete = function () { return db.close; };
    });
}
//   type Music = {
//     id: number,
//     track_name: string,
//     track_time: string,
//     track_url: string,
//     track_thumb: string,
//     is_favorited: number,
//     like_status: string,
//     nonce: string
// }
// type Albums = {
//     id: number,
//     album: any,
//     length: number,
//     musics: Music[],
// }
// function getAlbums(){
//   const xhr = new XMLHttpRequest();
//     xhr.open("GET", `http://localhost:3000/albums`, true);
//     xhr.onreadystatechange = function () {
//         if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
//             const albums = JSON.parse(this.responseText) as Albums[];
//             console.log(albums[3].album.musics[3]);
//         }
//   }
// }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// (function () {
//   // IndexedDB
//   var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
//     IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
//     dbVersion = 2.0;
//   // Create/open database
//   var request = indexedDB.open("soundScapeFiles", dbVersion),
//     db,
//     createObjectStore = function (dataBase) {
//       // Create an objectStore
//       console.log("Creating objectStore")
//       dataBase.createObjectStore("sounds");
//     },
//     getImageFile = function () {
//       // Create XHR
//       var xhr = new XMLHttpRequest(),
//         blob;
//       xhr.open("GET", "/media/big.mp3", true);
//       // Set the responseType to blob
//       xhr.responseType = "blob";
//       xhr.addEventListener("load", function () {
//         if (xhr.status === 200) {
//           console.log("Image retrieved");
//           // Blob as response
//           blob = xhr.response;
//           console.log("Blob:" + blob);
//           // Put the received blob into IndexedDB
//           putElephantInDb(blob);
//         }
//       }, false);
//       // Send XHR
//       xhr.send();
//     },
//     putElephantInDb = function (blob) {
//       console.log("Putting elephants in IndexedDB");
//       // Open a transaction to the database
//       var transaction = db.transaction(["sounds"], 'readwrite');
//       // Put the blob into the dabase
//       var put = transaction.objectStore("sounds").put(blob, "big");
//       // Retrieve the file that was just stored
//       transaction.objectStore("sounds").get("big").onsuccess = function (event) {
//         var soundFile = event.target.result;
//         console.log(soundFile);
//         // Get window.URL object
//         var URL = window.URL || window.webkitURL;
//         // Create and revoke ObjectURL
//         var soundURL = URL.createObjectURL(soundFile);
//         // Set img src to ObjectURL
//         setTimeout(() => {
//           var sound = new Howl({
//             src: [soundURL],
//             format: 'mp3',
//             sprite: { __default: [0, 20000, true] },
//             volume: .9,
//             onload() {
//               setTimeout(() => { sound.play(); }, 500)
//               URL.revokeObjectURL(soundURL);
//             }
//           })
//         }, 3000)
//       };
//     };
//   request.onerror = function (event) {
//     console.log("Error creating/accessing IndexedDB database");
//   };
//   request.onsuccess = function (event) {
//     console.log("Success creating/accessing IndexedDB database");
//     db = request.result;
//     db.onerror = function (event) {
//       console.log("Error creating/accessing IndexedDB database");
//     };
//     getImageFile();
//   }
//   request.onupgradeneeded = function (event) {
//     console.log('Creating store')
//     createObjectStore(event.target.result);
//   };
// })()
var menuWrapper = document.querySelector(".menu-wrappper");
//pages
var playerPage = document.querySelector(".player-page");
var musicLiPage = document.querySelector(".music-list-page");
var albumBack = musicLiPage === null || musicLiPage === void 0 ? void 0 : musicLiPage.querySelector(".album-back");
albumBack.addEventListener("click", function () {
    getAlbums();
    menuPage === null || menuPage === void 0 ? void 0 : menuPage.classList.add("active");
    musicLiPage === null || musicLiPage === void 0 ? void 0 : musicLiPage.classList.remove("active");
    playerPage === null || playerPage === void 0 ? void 0 : playerPage.classList.remove("active");
});
function renderAlbums() {
    var len = allAlbums.length;
    for (var i = 0; i < len; i++) {
        var album = allAlbums[i].album;
        if (album.album_name != "") {
            var li = document.createElement('li');
            li.className = "album";
            li.id = "".concat(i);
            li.innerHTML = "\n      <img src=\"".concat(album.album_thumb, "\"  class=\"album-img\">\n      <P>").concat(album.album_name, "</P>");
            li.addEventListener("click", function (e) {
                window.scrollTo(0, 0);
                currAlbumIndex = +this.id;
                renderAlbum(allAlbums[currAlbumIndex]);
                playerPage === null || playerPage === void 0 ? void 0 : playerPage.classList.remove("active");
                menuPage === null || menuPage === void 0 ? void 0 : menuPage.classList.remove("active");
                musicLiPage === null || musicLiPage === void 0 ? void 0 : musicLiPage.classList.add("active");
            });
            menuContent.appendChild(li);
        }
    }
}
function getAlbums() {
    menuContent.innerHTML = "";
    renderAlbums();
}
function getArtists() {
    menuContent.innerHTML = 'here will be some artists';
}
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
function renderMusicc(id) {
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
    playerPage.classList.remove("active");
    menuPage === null || menuPage === void 0 ? void 0 : menuPage.classList.remove("active");
    musicLiPage === null || musicLiPage === void 0 ? void 0 : musicLiPage.classList.add("active");
    renderAlbum(allAlbums[currAlbumIndex]);
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
    return num.toString().padStart(2, '0');
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
    var randIndex = Math.floor((Math.random() * len));
    do {
        randIndex = Math.floor((Math.random() * len));
    } while (currMusicIndex == randIndex);
    currMusicIndex = randIndex;
    loadAndPlay();
}
var musicListWrapper = document.querySelector(".music-list-wrapper");
var musicLiBackBtn = musicListWrapper.querySelector(".album-back");
var albumCover = musicListWrapper.querySelector(".album-cover");
var albumName = musicListWrapper.querySelector(".album-name");
var albumArtist = musicListWrapper.querySelector(".album-artist");
var albumPlayBtn = musicListWrapper.querySelector(".album-play-btn");
var musicLiContent = musicListWrapper.querySelector(".music-list-content");
musicLiContent.innerHTML = '';
function renderAlbum(album) {
    musicLiContent.innerHTML = '';
    albumCover.src = "".concat(album.album.album_thumb);
    albumName.innerHTML = "".concat(album.album.album_name);
    albumArtist.innerHTML = "".concat(album.album.album_composer);
    renderMuics(album.album.album_composer, album.musics);
}
function renderMuics(artist, musics) {
    var len = musics.length;
    for (var j = 0; j < len; j++) {
        var li = document.createElement('li');
        li.className = "music";
        li.id = "".concat(j);
        li.innerHTML = "<div class=\"sss\">\n    <img src=\"".concat(musics[j].track_thumb, "\" alt=\"\" class=\"music-cover-img\">\n    <div class=\"music-details\">\n      <h3 class=\"music-name\">").concat(musics[j].track_name, "</h3>\n      <h5 class=\"music-artist\">").concat(artist, "</h5>\n    </div>\n  </div>");
        var i = document.createElement('i');
        i.classList.add("material-icons");
        i.classList.add("favorite");
        i.dataset.fId = "".concat(j);
        i.innerHTML = "favorite_outlined";
        if (musics[j].is_favorited === 1) {
            i.classList.add("liked");
            i.innerHTML = "favorite";
        }
        li.addEventListener("click", function (e) {
            var ee = e.target;
            var tt = ee.tagName.toLowerCase();
            if (tt === 'i') {
                return;
            }
            var id = +this.id;
            if (id === currMusicIndex && nowPlayingAlbum === currAlbumIndex) {
                playerPage.classList.add("active");
                menuPage === null || menuPage === void 0 ? void 0 : menuPage.classList.remove("active");
                musicLiPage === null || musicLiPage === void 0 ? void 0 : musicLiPage.classList.remove("active");
            }
            else {
                renderMusicc(id);
            }
        });
        i.addEventListener("click", function (e) {
            var musicInx = this.dataset.fId;
            console.log(+musicInx);
            if (allAlbums[currAlbumIndex].musics[+musicInx].is_favorited === 1) {
                allAlbums[currAlbumIndex].musics[+musicInx].is_favorited = 0;
                this.classList.remove("liked");
                this.innerHTML = "favorite_outlined";
            }
            else {
                allAlbums[currAlbumIndex].musics[+musicInx].is_favorited = 1;
                this.classList.add("liked");
                this.innerHTML = "favorite";
            }
            saveData();
        });
        li.appendChild(i);
        musicLiContent.appendChild(li);
    }
}
