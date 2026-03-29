const songs = [
    {
        id: 1,
        nameSong: "Con co be be",
        singer: "Xuan Mai"
},

];

function renderMusicList () {
    let listSong = document.getElementById("songTable");
    listSong.innerHTML = ``;
    songs.forEach((song) => {
        listSong.innerHTML = `<tr>
                <td>${song.id}</td>
                <td>${song.nameSong}</td>
                <td>${song.singer}</td>
                <b>Sua</b>
            </tr>`
    });
    localStorage.setItem("songs", JSON.stringify(songs));
};

localStorage.getItem("songs", JSON.parse);
renderMusicList();