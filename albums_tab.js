var menuWrapper = document.querySelector(".menu-wrappper");
//pages
var playerPage = document.querySelector(".player-page");
var musicLiPage = document.querySelector(".music-list-page");
var albumBack = musicLiPage === null || musicLiPage === void 0 ? void 0 : musicLiPage.querySelector(".album-back");
albumBack.addEventListener("click", function () {
    if (tabNum === 1) {
        getArtists();
    }
    else {
        getAlbums();
    }
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
            if (i === nowPlayingAlbum && isPlaying) {
                li.innerHTML = "\n      <img src=\"".concat(album.album_thumb, "\"  class=\"album-img\">\n      <P>").concat(album.album_name, " <p style=\"color:var(--green)\">Now Playing</p> </P>");
            }
            else {
                li.innerHTML = "\n      <img src=\"".concat(album.album_thumb, "\"  class=\"album-img\">\n      <P>").concat(album.album_name, "</P>");
            }
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
