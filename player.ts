const musicWrapper = document.querySelector(".player-wrapper") as Element;
const musicImg = musicWrapper.querySelector(
  ".img-area img"
) as HTMLImageElement;
const musicName = musicWrapper.querySelector(
  ".song-details .name"
) as HTMLElement;
const favicon = musicWrapper.querySelector(
  ".song-details .favorite"
) as HTMLElement;
const musicArtist = musicWrapper.querySelector(
  ".song-details .artist"
) as HTMLElement;
const playPauseBtn = musicWrapper.querySelector(".play-pause") as Element;
const prevBtn = musicWrapper.querySelector("#prev") as Element;
const nextBtn = musicWrapper.querySelector("#next") as Element;
const mainAudio = document.querySelector("#main-audio") as HTMLAudioElement;
const progressArea = musicWrapper.querySelector(".progress-area") as Element;
const progressBar = progressArea.querySelector(".progress-bar") as HTMLElement;
const currTime = progressArea.querySelector(".current-time") as HTMLSpanElement;
const maxDuration = progressArea.querySelector(
  ".max-duration"
) as HTMLSpanElement;
const repeatBtn = musicWrapper.querySelector("#repeat-plist") as HTMLElement;
const shuffleBtn = musicWrapper.querySelector("#shuffle-plist") as HTMLElement;
const moreMusicBtn = musicWrapper.querySelector("#more-music") as Element;
const audioctx = new AudioContext();
const backToAlbum = musicWrapper.querySelector(".back-to-album") as HTMLElement;
// const closemoreMusic = musicList.querySelector("#close") as Element;
// const musicList = wrapper.querySelector(".music-list") as Element;

function renderMusicc(albumIdx: number, id: number) {
  currAlbumIndex = albumIdx;
  nowPlayingAlbum = currAlbumIndex;
  currMusicIndex = id;
  loadAndPlay();
  playerPage.classList.add("active");
  menuPage?.classList.remove("active");
  musicLiPage?.classList.remove("active");
}

function loadAndPlay() {
  const currentMusic = allAlbums[currAlbumIndex].musics[currMusicIndex];
  mainAudio.pause();
  mainAudio.currentTime = 0;
  musicName.innerText = currentMusic.track_name;
  musicArtist.innerText = allAlbums[currAlbumIndex].album.album_composer;
  musicImg.src = currentMusic.track_thumb;
  maxDuration.innerText = currentMusic.track_time;
  const a = fetch(currentMusic.track_url)
    .then((res) => {
      if (res == null || res.body == null) return;
      var reader = res.body.getReader();
      return reader.read().then((result) => {
        return result;
      });
    })
    .then((data) => {
      if (data == undefined || data.value == undefined) return;

      var blob = new Blob([data.value], { type: "audio" });
      var blobUrl = URL.createObjectURL(blob);

      createDB();
      putInDB({ blob }, currentMusic.id, "songs");
      mainAudio.src = blobUrl;
      mainAudio.oncanplay = () => {
        playMusic();
        renderFavicon();
      };
    });
}

function loadMusic(currentMusic: Music, artist: string) {
  musicName.innerText = currentMusic.track_name;
  musicArtist.innerText = artist;
  musicImg.src = currentMusic.track_thumb;
  mainAudio.src = currentMusic.track_url;
  maxDuration.innerText = currentMusic.track_time;
}

function renderFavicon() {
  const currentMusic = allAlbums[currAlbumIndex].musics[currMusicIndex];
  if (currentMusic.is_favorited === 1) {
    favicon.innerText = "favorite";
    favicon.classList.add("liked");
  } else {
    favicon.innerText = "favorite_outlined";
    favicon.classList.remove("liked");
  }
}

favicon.addEventListener("click", () => {
  const currentMusic = allAlbums[currAlbumIndex].musics[currMusicIndex];
  if (currentMusic.is_favorited === 1) {
    allAlbums[currAlbumIndex].musics[currMusicIndex].is_favorited = 0;
  } else {
    allAlbums[currAlbumIndex].musics[currMusicIndex].is_favorited = 1;
  }
  saveData();
  renderFavicon();
});

backToAlbum.addEventListener("click", () => {
  searchInput.value = "";
  if (tabNum === 0) {
    playerPage.classList.remove("active");
    menuPage?.classList.add("active");
    musicLiPage?.classList.remove("active");
    getLikedMusics();
  } else {
    playerPage.classList.remove("active");
    menuPage?.classList.remove("active");
    musicLiPage?.classList.add("active");
    renderAlbum(allAlbums[currAlbumIndex]);
  }
});

function playMusic() {
  mainAudio.play();
  isPlaying = true;
  musicWrapper.classList.remove("paused");
  const btn = playPauseBtn.querySelector("i") as HTMLElement;
  btn.innerText = "pause";
}

function pauseMusic() {
  musicWrapper.classList.add("paused");
  const btn = playPauseBtn.querySelector("i") as HTMLElement;
  btn.innerText = "play_arrow";
  isPlaying = false;
  mainAudio.pause();
}

playPauseBtn.addEventListener("click", () => {
  if (audioctx.state === "suspended") {
    audioctx.resume();
  }
  if (isPlaying === false) {
    resumeMusic();
  } else {
    pauseMusic();
  }
});

function resumeMusic() {
  musicWrapper.classList.add("playing");
  const btn = playPauseBtn.querySelector("i") as HTMLElement;
  btn.innerText = "pause";
  isPlaying = true;
  mainAudio.play();
}

function prevMusic() {
  const len = allAlbums[currAlbumIndex].musics.length;
  currMusicIndex--;
  if (currMusicIndex < 0) {
    currMusicIndex = len - 1;
  }
  loadAndPlay();
}

function nextMusic() {
  const len = allAlbums[currAlbumIndex].musics.length;
  currMusicIndex++;
  if (currMusicIndex === len) {
    currMusicIndex = 0;
  }
  loadAndPlay();
}

nextBtn.addEventListener("click", nextMusic);
prevBtn.addEventListener("click", prevMusic);

mainAudio.addEventListener("timeupdate", (e) => {
  const target = <HTMLAudioElement>e.target;
  const currentTime = target.currentTime;
  const duration = target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;
  currTime.innerText = formatTime(currentTime);
  // maxDuration.innerText = formatTime(duration);
});

function formatTime(sec: number) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);

  return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
}
function padTo2Digits(num: number): string {
  return num.toString().padStart(2, "0");
}

progressArea.addEventListener("click", (e) => {
  const ev = <MouseEvent>e;
  const barWidth = progressArea.clientWidth;
  const clickOffset = ev.offsetX;
  const duration = mainAudio.duration;
  mainAudio.currentTime = (clickOffset / barWidth) * duration;
  playMusic();
});

repeatBtn.addEventListener("click", () => {
  const txt = repeatBtn.innerText;
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

mainAudio.addEventListener("ended", () => {
  if (shuffleMode) {
    playShuffled();
  } else {
    const txt = repeatBtn.innerText;
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

shuffleBtn.addEventListener("click", () => {
  shuffleMode = !shuffleMode;
  if (shuffleMode) {
    shuffleBtn.classList.add("active");
  } else {
    shuffleBtn.classList.remove("active");
  }
});

function playShuffled() {
  const len = allAlbums[currAlbumIndex].musics.length;
  let randIndex = Math.floor(Math.random() * len);
  do {
    randIndex = Math.floor(Math.random() * len);
  } while (currMusicIndex == randIndex);
  currMusicIndex = randIndex;
  loadAndPlay();
}
