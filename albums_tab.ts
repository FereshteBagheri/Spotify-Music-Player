
const menuWrapper = document.querySelector(".menu-wrappper") as HTMLElement;



//pages

const playerPage=document.querySelector(".player-page")as HTMLElement;
const musicLiPage=document.querySelector(".music-list-page")as HTMLElement;

const albumBack=musicLiPage?.querySelector(".album-back") as HTMLElement;

albumBack.addEventListener("click",()=>{
  if(tabNum===1){
    getArtists();
  }
  else{
  getAlbums();
  }
  menuPage?.classList.add("active");
  musicLiPage?.classList.remove("active");
  playerPage?.classList.remove("active");

})


function renderAlbums(){
  const len=allAlbums.length;
  for(let i=0;i<len;i++){
    let album=allAlbums[i].album
    if(album.album_name!=""){
      const li =  document.createElement('li');
      li.className="album";
      li.id=`${i}`;
      if(i===nowPlayingAlbum && isPlaying){
        li.innerHTML = `
      <img src="${album.album_thumb}"  class="album-img">
      <P>${album.album_name} <p style="color:var(--green)">Now Playing</p> </P>`;
      }
      else{
      li.innerHTML = `
      <img src="${album.album_thumb}"  class="album-img">
      <P>${album.album_name}</P>`;
      }
      li.addEventListener("click",function (e){
        window.scrollTo(0, 0);
        currAlbumIndex=+this.id;
        renderAlbum(allAlbums[currAlbumIndex]);
        playerPage?.classList.remove("active");
        menuPage?.classList.remove("active");
        musicLiPage?.classList.add("active");
            })
      menuContent.appendChild(li);
  }
}
}





function getAlbums(){
  menuContent.innerHTML="";
  renderAlbums();

}







