
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd');
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const preBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $(".playlist");


const app = {
    currentIndex : 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
        name: "1",
        singer: "Raftaar x Fortnite",
        path: "./music/song1 (1).mp3",
        image: "img/img (1).jpg"
        },
        {
        name: "Tu Phir Se Aana",
        singer: "Raftaar x Salim Merchant x Karma",
        path: "./music/song1 (2).mp3",
        image:
        "img/img (2).jpg"
        },
        {
        name: "Naachne Ka Shaunq",
        singer: "Raftaar x Brobha V",
        path:
            "./music/song1 (3).mp3",
        image: "img/img (3).jpg"
        },
        {
        name: "Mantoiyat",
        singer: "Raftaar x Nawazuddin Siddiqui",
        path: "./music/song1 (4).mp3",
        image:
            "img/img (4).jpg"
        },
        {
        name: "Aage Chal",
        singer: "Raftaar",
        path: "./music/song1 (5).mp3",
        image:
            "img/img (5).jpg"
        },
        {
        name: "Damn",
        singer: "Raftaar x kr$na",
        path:
            "./music/song1 (6).mp3",
        image:
            "img/img (6).jpg"
        },
        {
        name: "Feeling You",
        singer: "Raftaar x Harjas",
        path: "./music/song1 (7).mp3",
        image:
            "img/img (8).jpg"
        }
    ],

    render: function(){
    const htmls = this.songs.map((song,index) => {
        return `
        <div class="song ${index === this.currentIndex ? "active" : ""}"data-index="${index}">
        <div class="thumb" style="background-image: url('${song.image}')">
        </div>
        <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
        </div>
        <div class="option">
            <i class="fas fa-ellipsis-h"></i>
        </div>
    </div>`
    })
    playlist.innerHTML = htmls.join('')
    },
    defineProperties: function(){
    Object.defineProperty(this,'currentSong', {
        get: function() {
            return this.songs[this.currentIndex]
        }
    })
    },
    handleEvents: function(){
        const _this = this;
        const cdWidth = cd.offsetWidth;

        //xử lý CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, // 10 seconds
            iterations: Infinity
          });
          cdThumbAnimate.pause();
        //xử lý phóng to
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };
            //xử lý chạy audio
            playBtn.onclick = function(){
                if (_this.isPlaying){
                    audio.pause();
                } else{
                    audio.play();
                }
            }
            //khi Song play
            audio.onplay = function(){
                _this.isPlaying = true;
                //them class nè
                player.classList.add('playing');
                cdThumbAnimate.play()
            }
            //khi Song pause
            audio.onpause = function(){
                _this.isPlaying = false;
                player.classList.remove('playing');
                cdThumbAnimate.pause()

            }
            //tiến độ bài hát
            audio.ontimeupdate = function(){
                if (audio.duration) {
                    const progressPercent = Math.floor(
                      (audio.currentTime / audio.duration) * 100
                    );
                    progress.value = progressPercent;
                  }
            }
            //tua song
            progress.onchange = function(e){
                const seekTime = (audio.duration / 100) * e.target.value;
                audio.currentTime = seekTime;
            }
            //next
            nextBtn.onclick  = function(){
                if(_this.isRandom) {
                    _this.playRandomSong()
                } else {
                    _this.nextSong();
                }
                audio.play();
                _this.render();
            }
            //pre
            preBtn.onclick = function(){
                if(_this.isRandom) {
                    _this.playRandomSong()
                } else {
                    _this.preSong();
                }
                audio.play();
                _this.render()

            }
            // random
            randomBtn.onclick = function() {
                _this.isRandom = !_this.isRandom;
                randomBtn.classList.toggle('active',_this.isRandom)
            }
            //repeat
            repeatBtn.onclick = function(e){
                _this.isRepeat = !_this.isRepeat
                repeatBtn.classList.toggle('active',_this.isRepeat)

            }
            //Xử lý next song khi audio ended
            audio.onended = function(){
                if(_this.isRepeat){
                    audio.play();
                }else{
                    nextBtn.click();
                }
            }
            //click vào playclick
            playlist.onclick = function (e) {
                const songNode = e.target.closest(".song:not(.active)");
          
                if (songNode || e.target.closest(".option")) {
                  // Xử lý khi click vào song
                  // Handle when clicking on the song
                  if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                  }
          
                  // Xử lý khi click vào song option
                  // Handle when clicking on the song option
                  if (e.target.closest(".option")) {
                  }
                }
              };
    },
    loadCurrentSong: function(){

            heading.textContent = this.currentSong.name;
            cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
            audio.src = this.currentSong.path;
        },

    nextSong: function(){
            this.currentIndex++
            if(this.currentIndex >= this.songs.length ){
                this.currentIndex = 0
            }
            this.loadCurrentSong()
    },
    preSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1;
        }
        this.loadCurrentSong()
    },
    playRandomSong: function(){
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while (newIndex == this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong()
    },
    start: function() {
        this.defineProperties();
        this.handleEvents();
        //tải thông tin bài hát đầu tiên khi chạy
        this.loadCurrentSong();
        this.render();
    },
}
app.start()

