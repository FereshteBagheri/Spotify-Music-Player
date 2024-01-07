const musicListWrapper = document.querySelector(
  ".music-list-wrapper"
) as HTMLDivElement;
const musicLiBackBtn = musicListWrapper.querySelector(
  ".album-back"
) as HTMLElement;
const albumCover = musicListWrapper.querySelector(
  ".album-cover"
) as HTMLImageElement;
const albumName = musicListWrapper.querySelector(".album-name") as HTMLElement;
const albumArtist = musicListWrapper.querySelector(
  ".album-artist"
) as HTMLElement;
const albumPlayBtn = musicListWrapper.querySelector(
  ".album-play-btn"
) as HTMLElement;
const musicLiContent = musicListWrapper.querySelector(
  ".music-list-content"
) as HTMLDivElement;
musicLiContent.innerHTML = "";

albumPlayBtn.addEventListener("click", () => {
  nowPlayingAlbum = currAlbumIndex;
  currMusicIndex = 0;
  renderMusicc(currAlbumIndex, currMusicIndex);
});

function renderAlbum(album: Albums) {
  musicLiContent.innerHTML = "";
  albumCover.src = `${album.album.album_thumb}`;
  albumName.innerHTML = `${album.album.album_name}`;
  albumArtist.innerHTML = `${album.album.album_composer}`;
  renderMuics(album.album.album_composer, album.musics);
}

function renderMuics(artist: string, musics: Music[]) {
  const len = musics.length;
  for (let j = 0; j < len; j++) {
    const li = document.createElement("li");
    li.className = "music";
    li.id = `${j}`;
    if (
      j === currMusicIndex &&
      nowPlayingAlbum === currAlbumIndex &&
      isPlaying
    ) {
      li.innerHTML = `<div class="sss">
    <img src="${musics[j].track_thumb}" alt="" class="music-cover-img">
    <div class="music-details">
      <h3 class="music-name">${musics[j].track_name} </h3>
      <h5 class="music-artist">${artist}</h5>
      <h6 style="color:var(--green)">Now Playing</h6>
    </div>
  </div>`;
    } else {
      li.innerHTML = `<div class="sss">
    <img src="${musics[j].track_thumb}" alt="" class="music-cover-img">
    <div class="music-details">
      <h3 class="music-name">${musics[j].track_name}</h3>
      <h5 class="music-artist">${artist}</h5>
    </div>
  </div>`;
    }
    const i = document.createElement("i");
    i.classList.add("material-icons");
    i.classList.add("favorite");
    i.dataset.fId = `${j}`;
    i.innerHTML = "favorite_outlined";
    if (musics[j].is_favorited === 1) {
      i.classList.add("liked");
      i.innerHTML = "favorite";
    }
    li.addEventListener("click", function (e) {
      let ee = <HTMLElement>e.target;
      let tt = ee.tagName.toLowerCase();
      if (tt === "i") {
        return;
      }
      const id = +this.id;
      if (id === currMusicIndex && nowPlayingAlbum === currAlbumIndex) {
        playerPage.classList.add("active");
        menuPage?.classList.remove("active");
        musicLiPage?.classList.remove("active");
      } else {
        renderMusicc(currAlbumIndex, id);
      }
    });

    i.addEventListener("click", function (e) {
      const musicInx = <string>this.dataset.fId;
      console.log(+musicInx);
      if (allAlbums[currAlbumIndex].musics[+musicInx].is_favorited === 1) {
        allAlbums[currAlbumIndex].musics[+musicInx].is_favorited = 0;
        this.classList.remove("liked");
        this.innerHTML = "favorite_outlined";
      } else {
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
