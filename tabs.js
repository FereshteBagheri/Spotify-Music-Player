var allAlbums;
var currAlbumIndex;
var currMusicIndex;
var nowPlayingAlbum;
var tabNum = 2;
var shuffleMode;
shuffleMode = false;
var isPlaying = false;
window.addEventListener("load", function () {
    var albumsStorage = localStorage.getItem("albumsData");
    if (albumsStorage === null) {
        allAlbums = loadJSON("./data.json").albums;
        saveData();
    }
    else {
        allAlbums = JSON.parse(albumsStorage);
    }
});
var menuPage = document.querySelector(".menu-page");
var playlistsTab = menuPage.querySelector(".playlists");
var artistsTab = menuPage.querySelector(".artists");
var albumsTab = menuPage.querySelector(".albums");
playlistsTab.addEventListener("click", function () {
    playlistsTab.classList.add("active");
    artistsTab.classList.remove("active");
    albumsTab.classList.remove("active");
    tabNum = 0;
    searchInput.placeholder = "seach in liked songs";
    searchInput.value = "";
    renderLikedList();
});
artistsTab.addEventListener("click", function () {
    playlistsTab.classList.remove("active");
    artistsTab.classList.add("active");
    albumsTab.classList.remove("active");
    tabNum = 1;
    searchInput.placeholder = "seach in artists";
    searchInput.value = "";
    getArtists();
});
albumsTab.addEventListener("click", function () {
    playlistsTab.classList.remove("active");
    artistsTab.classList.remove("active");
    albumsTab.classList.add("active");
    tabNum = 2;
    searchInput.placeholder = "seach in albums";
    searchInput.value = "";
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
