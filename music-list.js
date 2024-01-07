var musicListWrapper = document.querySelector(".music-list-wrapper");
var musicLiBackBtn = musicListWrapper.querySelector(".album-back");
var albumCover = musicListWrapper.querySelector(".album-cover");
var albumName = musicListWrapper.querySelector(".album-name");
var albumArtist = musicListWrapper.querySelector(".album-artist");
var albumPlayBtn = musicListWrapper.querySelector(".album-play-btn");
var musicLiContent = musicListWrapper.querySelector(".music-list-content");
musicLiContent.innerHTML = "";
albumPlayBtn.addEventListener("click", function () {
    nowPlayingAlbum = currAlbumIndex;
    currMusicIndex = 0;
    renderMusicc(currAlbumIndex, currMusicIndex);
});
function renderAlbum(album) {
    musicLiContent.innerHTML = "";
    albumCover.src = "".concat(album.album.album_thumb);
    albumName.innerHTML = "".concat(album.album.album_name);
    albumArtist.innerHTML = "".concat(album.album.album_composer);
    renderMuics(album.album.album_composer, album.musics);
}
function renderMuics(artist, musics) {
    var len = musics.length;
    for (var j = 0; j < len; j++) {
        var li = document.createElement("li");
        li.className = "music";
        li.id = "".concat(j);
        if (j === currMusicIndex &&
            nowPlayingAlbum === currAlbumIndex &&
            isPlaying) {
            li.innerHTML = "<div class=\"sss\">\n    <img src=\"".concat(musics[j].track_thumb, "\" alt=\"\" class=\"music-cover-img\">\n    <div class=\"music-details\">\n      <h3 class=\"music-name\">").concat(musics[j].track_name, " </h3>\n      <h5 class=\"music-artist\">").concat(artist, "</h5>\n      <h6 style=\"color:var(--green)\">Now Playing</h6>\n    </div>\n  </div>");
        }
        else {
            li.innerHTML = "<div class=\"sss\">\n    <img src=\"".concat(musics[j].track_thumb, "\" alt=\"\" class=\"music-cover-img\">\n    <div class=\"music-details\">\n      <h3 class=\"music-name\">").concat(musics[j].track_name, "</h3>\n      <h5 class=\"music-artist\">").concat(artist, "</h5>\n    </div>\n  </div>");
        }
        var i = document.createElement("i");
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
            if (tt === "i") {
                return;
            }
            var id = +this.id;
            if (id === currMusicIndex && nowPlayingAlbum === currAlbumIndex) {
                playerPage.classList.add("active");
                menuPage === null || menuPage === void 0 ? void 0 : menuPage.classList.remove("active");
                musicLiPage === null || musicLiPage === void 0 ? void 0 : musicLiPage.classList.remove("active");
            }
            else {
                renderMusicc(currAlbumIndex, id);
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
