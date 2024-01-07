const menuContent = document.querySelector(".menu-content") as HTMLDivElement;
let likedMusics: Array<Array<any>> = [];


function renderLikedList() {
  menuContent.innerHTML = "";
  const li = document.createElement("li");
  li.className = "album";
  li.innerHTML = `
      <img src="${allAlbums[0].album.album_thumb}"  class="album-img">
      <P>Liked Songs</P>`;
  li.addEventListener("click", getLikedMusics);
  menuContent.appendChild(li);
}
function getLikedMusics() {
  likedMusics = [];
  menuContent.innerHTML = "";
  const len = allAlbums.length;
  
  for (let i = 0; i < len; i++) {
    const musicsLen = allAlbums[i].musics.length;
    for (let j = 0; j < musicsLen; j++) {
      if (allAlbums[i].musics[j].is_favorited === 1) {
        renderLikedSong(i, j);
        likedMusics.push([allAlbums[i].musics[j].track_name, i, j]);
      }
    }
  }
}

function renderLikedSong(albumIdx: number, musicIdx: number) {
  const li = document.createElement("li");
  li.className = "music";
  li.dataset.albumidx = `${albumIdx}`;
  li.dataset.musicidx = `${musicIdx}`;
  li.innerHTML = `<div class="sss">
    <img src="${allAlbums[albumIdx].musics[musicIdx].track_thumb}" alt="" class="music-cover-img">
    <div class="music-details">
      <h3 class="music-name">${allAlbums[albumIdx].musics[musicIdx].track_name}</h3>
      <h5 class="music-artist">${allAlbums[albumIdx].album.album_composer}</h5>
    </div>
  </div>`;
  const i = document.createElement("i");
  i.classList.add("material-icons");
  i.classList.add("favorite");
  i.dataset.ialbumidx = `${albumIdx}`;
  i.dataset.imusicidx = `${musicIdx}`;
  i.innerHTML = "favorite";
  i.classList.add("liked");

  li.addEventListener("click", function (e) {
    let ee = <HTMLElement>e.target;
    let tt = ee.tagName.toLowerCase();
    if (tt === "i") {
      return;
    }
    const alb = +(<string>this.dataset.albumidx);
    const msc = +(<string>this.dataset.musicidx);
    if (msc === currMusicIndex && nowPlayingAlbum === alb) {
      playerPage.classList.add("active");
      menuPage?.classList.remove("active");
      musicLiPage?.classList.remove("active");
    } else {
      renderMusicc(alb, msc);
    }
  });

  i.addEventListener("click", function (e) {
    console.log("silly");
    const alb = +(<string>this.dataset.ialbumidx);
    const msc = +(<string>this.dataset.imusicidx);
    allAlbums[alb].musics[msc].is_favorited = 0;
    saveData();
    getLikedMusics();
  });
  li.appendChild(i);
  menuContent.appendChild(li);
}

//////search bar
const searchArea = document.querySelector(".search-bar") as HTMLElement;
const searchInput = searchArea.querySelector(
  "#search-input"
) as HTMLInputElement;
const searchBtn = searchArea.querySelector(".search-btn") as HTMLButtonElement;

if (tabNum === 0) {
} else if (tabNum === 1) {
  searchInput.placeholder = "search in artists";
}

searchInput.addEventListener("keyup", (e) => {
  
  if (tabNum === 0) searchInLiked();
  else if (tabNum === 1) searchInArtists();
  else searchInAlbums();
});

function searchInLiked() {
  menuContent.innerHTML = "";
  const value = searchInput.value;
  likedMusics.forEach((element) => {
    if (element[0].toLowerCase().includes(value.toLowerCase())) {
      const li = document.createElement("li");
      li.className = "music";
      li.dataset.albumidx = `${element[1]}`;
      li.dataset.musicidx = `${element[2]}`;
      li.innerHTML = `<div class="sss">
      <img src="${
        allAlbums[element[1]].musics[element[2]].track_thumb
      }" alt="" class="music-cover-img">
      <div class="music-details">
        <h3 class="music-name">${
          allAlbums[element[1]].musics[element[2]].track_name
        }</h3>
        <h5 class="music-artist">${
          allAlbums[element[1]].album.album_composer
        }</h5>
      </div>
      </div>`;
      const i = document.createElement("i");
      i.classList.add("material-icons");
      i.classList.add("favorite");
      i.dataset.ialbumidx = `${element[1]}`;
      i.dataset.imusicidx = `${element[2]}`;
      i.innerHTML = "favorite";
      i.classList.add("liked");

      li.addEventListener("click", function (e) {
        let ee = <HTMLElement>e.target;
        let tt = ee.tagName.toLowerCase();
        if (tt === "i") {
          return;
        }
        const alb = +(<string>this.dataset.albumidx);
        const msc = +(<string>this.dataset.musicidx);
        if (msc === currMusicIndex && nowPlayingAlbum === alb) {
          playerPage.classList.add("active");
          menuPage?.classList.remove("active");
          musicLiPage?.classList.remove("active");
        } else {
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
  const value = searchInput.value;
  allAlbums.forEach((album) => {
    if (
      album.album.album_composer.toLowerCase().includes(value.toLowerCase())
    ) {
      const li = document.createElement("li");
      li.className = "album";
      li.id = `${allAlbums.indexOf(album)}`;
      li.innerHTML = `
        <img src="${album.album.album_thumb}"  class="album-img">
        <P>${album.album.album_composer}</P>`;
      li.addEventListener("click", function (e) {
        window.scrollTo(0, 0);
        currAlbumIndex = +this.id;
        renderAlbum(allAlbums[currAlbumIndex]);
        playerPage?.classList.remove("active");
        menuPage?.classList.remove("active");
        musicLiPage?.classList.add("active");
      });
      menuContent.appendChild(li);
    }
  });
}

function searchInAlbums() {
  menuContent.innerHTML = "";
  const value = searchInput.value;
  allAlbums.forEach((album) => {
    if (album.album.album_name.toLowerCase().includes(value.toLowerCase())) {
      const li = document.createElement("li");
      li.className = "album";
      li.id = `${allAlbums.indexOf(album)}`;
      li.innerHTML = `
        <img src="${album.album.album_thumb}"  class="album-img">
        <P>${album.album.album_name}</P>`;
      li.addEventListener("click", function (e) {
        window.scrollTo(0, 0);
        currAlbumIndex = +this.id;
        renderAlbum(allAlbums[currAlbumIndex]);
        playerPage?.classList.remove("active");
        menuPage?.classList.remove("active");
        musicLiPage?.classList.add("active");
      });
      menuContent.appendChild(li);
    }
  });
}
