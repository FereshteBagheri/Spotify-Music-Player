let allAlbums: Albums[];
let currAlbumIndex: number;
let currMusicIndex: number;
let nowPlayingAlbum: number;
let tabNum = 2;

let shuffleMode: boolean;
shuffleMode = false;
let isPlaying = false;

window.addEventListener("load",()=>{
  let albumsStorage = localStorage.getItem("albumsData");
if (albumsStorage === null) {
  allAlbums = loadJSON("./data.json").albums;
  saveData();
} else {
  allAlbums = JSON.parse(albumsStorage);
}
})

type Music = {
  id: number;
  track_name: string;
  track_time: string;
  track_url: string;
  track_thumb: string;
  is_favorited: number;
  like_status: string;
  nonce: string;
};

type Albums = {
  length: number;
  musics: Music[];
  album: any;
  id: number;
};

const menuPage = document.querySelector(".menu-page") as HTMLElement;
const playlistsTab = menuPage.querySelector(".playlists") as HTMLElement;
const artistsTab = menuPage.querySelector(".artists") as HTMLElement;
const albumsTab = menuPage.querySelector(".albums") as HTMLElement;

playlistsTab.addEventListener("click", () => {
  playlistsTab.classList.add("active");
  artistsTab.classList.remove("active");
  albumsTab.classList.remove("active");
  tabNum = 0;
  searchInput.placeholder = "seach in liked songs";
  searchInput.value = "";
  renderLikedList();
});

artistsTab.addEventListener("click", () => {
  playlistsTab.classList.remove("active");
  artistsTab.classList.add("active");
  albumsTab.classList.remove("active");
  tabNum = 1;
  searchInput.placeholder = "seach in artists";
  searchInput.value = "";
  getArtists();
});

albumsTab.addEventListener("click", () => {
  playlistsTab.classList.remove("active");
  artistsTab.classList.remove("active");
  albumsTab.classList.add("active");
  tabNum = 2;
  searchInput.placeholder = "seach in albums";
  searchInput.value = "";
  getAlbums();
});

function loadJSON(filePath: any) {
  var json = loadTextFileAjaxSync(filePath, "application/json");
  return JSON.parse(<string>json);
}

function loadTextFileAjaxSync(filePath: any, mimeType: any) {
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
  } else {
    return null;
  }
}

function saveData() {
  localStorage.setItem("albumsData", JSON.stringify(allAlbums));
  allAlbums = JSON.parse(<string>localStorage.getItem("albumsData"));
}
