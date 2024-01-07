var arr = [];
arr.push(["hello", allAlbums[0].musics]);
arr.push(["second artist", allAlbums[2].musics]);
function getArtists() {
    menuContent.innerHTML = '';
    var len = allAlbums.length;
    for (var i = 0; i < len; i++) {
        var album = allAlbums[i].album;
        if (album.album_name != "") {
            var li = document.createElement('li');
            li.className = "album";
            li.id = "".concat(i);
            li.innerHTML = "\n        <img src=\"".concat(album.album_thumb, "\"  class=\"album-img\">\n        <P>").concat(album.album_composer, "</P>");
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
