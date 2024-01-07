let arr:any=[]
arr.push(["hello",allAlbums[0].musics]);
arr.push(["second artist",allAlbums[2].musics]);

function getArtists(){
    menuContent.innerHTML='';
    const len=allAlbums.length;
    for(let i=0;i<len;i++){
      let album=allAlbums[i].album
      if(album.album_name!=""){
        const li =  document.createElement('li');
        li.className="album";
        li.id=`${i}`;
        li.innerHTML = `
        <img src="${album.album_thumb}"  class="album-img">
        <P>${album.album_composer}</P>`;
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