var menuContent = document.querySelector(".menu-content");
var likedMusics = [];
function renderLikedList() {
    menuContent.innerHTML = "";
    var li = document.createElement("li");
    li.className = "album";
    li.innerHTML = "\n      <img src=\"".concat(allAlbums[0].album.album_thumb, "\"  class=\"album-img\">\n      <P>Liked Songs</P>");
    li.addEventListener("click", getLikedMusics);
    menuContent.appendChild(li);
}
function getLikedMusics() {
    likedMusics = [];
    menuContent.innerHTML = "";
    var len = allAlbums.length;
    for (var i = 0; i < len; i++) {
        var musicsLen = allAlbums[i].musics.length;
        for (var j = 0; j < musicsLen; j++) {
            if (allAlbums[i].musics[j].is_favorited === 1) {
                renderLikedSong(i, j);
                likedMusics.push([allAlbums[i].musics[j].track_name, i, j]);
            }
        }
    }
}
function renderLikedSong(albumIdx, musicIdx) {
    var li = document.createElement("li");
    li.className = "music";
    li.dataset.albumidx = "".concat(albumIdx);
    li.dataset.musicidx = "".concat(musicIdx);
    li.innerHTML = "<div class=\"sss\">\n    <img src=\"".concat(allAlbums[albumIdx].musics[musicIdx].track_thumb, "\" alt=\"\" class=\"music-cover-img\">\n    <div class=\"music-details\">\n      <h3 class=\"music-name\">").concat(allAlbums[albumIdx].musics[musicIdx].track_name, "</h3>\n      <h5 class=\"music-artist\">").concat(allAlbums[albumIdx].album.album_composer, "</h5>\n    </div>\n  </div>");
    var i = document.createElement("i");
    i.classList.add("material-icons");
    i.classList.add("favorite");
    i.dataset.ialbumidx = "".concat(albumIdx);
    i.dataset.imusicidx = "".concat(musicIdx);
    i.innerHTML = "favorite";
    i.classList.add("liked");
    li.addEventListener("click", function (e) {
        var ee = e.target;
        var tt = ee.tagName.toLowerCase();
        if (tt === "i") {
            return;
        }
        var alb = +this.dataset.albumidx;
        var msc = +this.dataset.musicidx;
        if (msc === currMusicIndex && nowPlayingAlbum === alb) {
            playerPage.classList.add("active");
            menuPage === null || menuPage === void 0 ? void 0 : menuPage.classList.remove("active");
            musicLiPage === null || musicLiPage === void 0 ? void 0 : musicLiPage.classList.remove("active");
        }
        else {
            renderMusicc(alb, msc);
        }
    });
    i.addEventListener("click", function (e) {
        console.log("silly");
        var alb = +this.dataset.ialbumidx;
        var msc = +this.dataset.imusicidx;
        allAlbums[alb].musics[msc].is_favorited = 0;
        saveData();
        getLikedMusics();
    });
    li.appendChild(i);
    menuContent.appendChild(li);
}
//////search bar
var searchArea = document.querySelector(".search-bar");
var searchInput = searchArea.querySelector("#search-input");
var searchBtn = searchArea.querySelector(".search-btn");
if (tabNum === 0) {
}
else if (tabNum === 1) {
    searchInput.placeholder = "search in artists";
}
searchInput.addEventListener("keyup", function (e) {
    if (tabNum === 0)
        searchInLiked();
    else if (tabNum === 1)
        searchInArtists();
    else
        searchInAlbums();
});
function searchInLiked() {
    menuContent.innerHTML = "";
    var value = searchInput.value;
    likedMusics.forEach(function (element) {
        if (element[0].toLowerCase().includes(value.toLowerCase())) {
            var li = document.createElement("li");
            li.className = "music";
            li.dataset.albumidx = "".concat(element[1]);
            li.dataset.musicidx = "".concat(element[2]);
            li.innerHTML = "<div class=\"sss\">\n      <img src=\"".concat(allAlbums[element[1]].musics[element[2]].track_thumb, "\" alt=\"\" class=\"music-cover-img\">\n      <div class=\"music-details\">\n        <h3 class=\"music-name\">").concat(allAlbums[element[1]].musics[element[2]].track_name, "</h3>\n        <h5 class=\"music-artist\">").concat(allAlbums[element[1]].album.album_composer, "</h5>\n      </div>\n      </div>");
            var i = document.createElement("i");
            i.classList.add("material-icons");
            i.classList.add("favorite");
            i.dataset.ialbumidx = "".concat(element[1]);
            i.dataset.imusicidx = "".concat(element[2]);
            i.innerHTML = "favorite";
            i.classList.add("liked");
            li.addEventListener("click", function (e) {
                var ee = e.target;
                var tt = ee.tagName.toLowerCase();
                if (tt === "i") {
                    return;
                }
                var alb = +this.dataset.albumidx;
                var msc = +this.dataset.musicidx;
                if (msc === currMusicIndex && nowPlayingAlbum === alb) {
                    playerPage.classList.add("active");
                    menuPage === null || menuPage === void 0 ? void 0 : menuPage.classList.remove("active");
                    musicLiPage === null || musicLiPage === void 0 ? void 0 : musicLiPage.classList.remove("active");
                }
                else {
                    renderMusicc(alb, msc);
                }
            });
            li.appendChild(i);
            menuContent.appendChild(li);
        }
    });
}
function searchInArtists() {
    menuContent.innerHTML = "";
    var value = searchInput.value;
    allAlbums.forEach(function (album) {
        if (album.album.album_composer.toLowerCase().includes(value.toLowerCase())) {
            var li = document.createElement("li");
            li.className = "album";
            li.id = "".concat(allAlbums.indexOf(album));
            li.innerHTML = "\n        <img src=\"".concat(album.album.album_thumb, "\"  class=\"album-img\">\n        <P>").concat(album.album.album_composer, "</P>");
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
    });
}
function searchInAlbums() {
    menuContent.innerHTML = "";
    var value = searchInput.value;
    allAlbums.forEach(function (album) {
        if (album.album.album_name.toLowerCase().includes(value.toLowerCase())) {
            var li = document.createElement("li");
            li.className = "album";
            li.id = "".concat(allAlbums.indexOf(album));
            li.innerHTML = "\n        <img src=\"".concat(album.album.album_thumb, "\"  class=\"album-img\">\n        <P>").concat(album.album.album_name, "</P>");
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
    });
}
