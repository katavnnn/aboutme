document.addEventListener('DOMContentLoaded', () => {
    // Original script content
    const playerArtImg = document.getElementById('player-art-img');
    const songTitle = document.getElementById('player-song-title');
    const songArtist = document.getElementById('player-song-artist');
    const prevBtn = document.getElementById('player-prev-btn');
    const playBtn = document.getElementById('player-play-btn');
    const nextBtn = document.getElementById('player-next-btn');
    const progress = document.getElementById('player-progress');
    const progressBar = document.querySelector('.player-progress-bar');
    const currentTimeEl = document.getElementById('player-current-time');
    const durationEl = document.getElementById('player-duration');
    const playlistList = document.getElementById('playlist-list');
    const playlistTabs = document.querySelectorAll('.playlist-tab-btn');

    const audio = new Audio();

    const playlists = {
        focus: [
            {
                title: 'Lofi Chill',
                artist: 'Ambient Beats',
                audioSrc: 'assets/music/072019.mp3',
                artSrc: 'assets/images/covers/cover-1.jpg'
            },
            // Add more focus songs
        ],
        relax: [
            {
                title: 'Peaceful Piano',
                artist: 'Soft Melodies',
                audioSrc: 'assets/music/072019.mp3', // Placeholder
                artSrc: 'assets/images/covers/cover-1.jpg' // Placeholder
            },
            // Add more relax songs
        ],
        creative: [
            {
                title: 'Synthwave Dreams',
                artist: '80s Vibes',
                audioSrc: 'assets/music/072019.mp3', // Placeholder
                artSrc: 'assets/images/covers/cover-1.jpg' // Placeholder
            },
            // Add more creative songs
        ]
    };

    let currentPlaylistName = 'focus';
    let currentSongIndex = 0;

    function loadPlaylist(playlistName) {
        const playlist = playlists[playlistName];
        playlistList.innerHTML = '';
        playlist.forEach((song, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${song.title}</span><span>${song.artist}</span>`;
            if (index === currentSongIndex) {
                li.classList.add('active');
            }
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(playlist[currentSongIndex]);
                playSong();
            });
            playlistList.appendChild(li);
        });
    }

    function loadSong(song) {
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        audio.src = song.audioSrc;
        playerArtImg.src = song.artSrc;
        updatePlaylistUI();
    }

    function playSong() {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playerArtImg.classList.add('playing');
        audio.play();
    }

    function pauseSong() {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        playerArtImg.classList.remove('playing');
        audio.pause();
    }

    function prevSong() {
        const playlist = playlists[currentPlaylistName];
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(playlist[currentSongIndex]);
        playSong();
    }

    function nextSong() {
        const playlist = playlists[currentPlaylistName];
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(playlist[currentSongIndex]);
        playSong();
    }

    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        durationEl.textContent = formatTime(duration);
        currentTimeEl.textContent = formatTime(currentTime);
    }

    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updatePlaylistUI() {
        const listItems = playlistList.querySelectorAll('li');
        listItems.forEach((item, index) => {
            if (index === currentSongIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Event Listeners
    playBtn.addEventListener('click', () => {
        const isPlaying = audio.paused;
        if (isPlaying) {
            playSong();
        } else {
            pauseSong();
        }
    });

    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    audio.addEventListener('timeupdate', updateProgress);
    progressBar.addEventListener('click', setProgress);
    audio.addEventListener('ended', nextSong);

    playlistTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            playlistTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentPlaylistName = tab.dataset.playlist;
            currentSongIndex = 0; // Reset to first song of new playlist
            loadPlaylist(currentPlaylistName);
            loadSong(playlists[currentPlaylistName][currentSongIndex]);
            pauseSong(); // Pause when switching playlists
        });
    });

    // Initial Load
    loadPlaylist(currentPlaylistName);
    loadSong(playlists[currentPlaylistName][currentSongIndex]);

    // New Intro Music Logic with Typewriter Effect
    const introMusic = document.getElementById('intro-music');
    const lyricsContainer = document.getElementById('lyrics-container');

    const startIntro = () => {
        const lyricLines = [
            "Đôi khi vài giọt nước mắt.",
            "Thay cho cảm xúc trước mặt",
            "Em hỏi vì sao hạnh phúc không sắc không màu mà lại đớn đau."
        ];
        const lyricElements = lyricsContainer.querySelectorAll('p');
        const typingSpeed = 120; // ms per character

        // Clear any existing text (like "Click to begin")
        lyricElements.forEach(p => p.textContent = '');

        lyricsContainer.classList.remove('hidden');
        introMusic.play().catch(error => console.log("Music autoplay failed.", error));

        function typeLine(lineIndex) {
            if (lineIndex >= lyricLines.length) {
                // All lines typed, fade out the container
                setTimeout(() => {
                    lyricsContainer.classList.add('hidden');
                }, 2000); // Wait 2 seconds before fading
                return;
            }

            const p = lyricElements[lineIndex];
            const text = lyricLines[lineIndex];
            let charIndex = 0;
            p.classList.add('typing-cursor');

            const typingInterval = setInterval(() => {
                if (charIndex < text.length) {
                    p.textContent += text.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                    p.classList.remove('typing-cursor');
                    // Move to the next line after a short delay
                    setTimeout(() => typeLine(lineIndex + 1), 500);
                }
            }, typingSpeed);
        }

        // Start the typing sequence
        typeLine(0);

        

        // Clean up interaction listeners
        document.body.removeEventListener('click', startIntro, { once: true });
        document.body.removeEventListener('touchstart', startIntro, { once: true });
    };

    // Try to play automatically, otherwise wait for user interaction.
    // We add a small delay to ensure the page is fully ready.
    setTimeout(() => {
        const playPromise = introMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Autoplay started!
                startIntro();
            }).catch(error => {
                // Autoplay was prevented.
                // Show a message and wait for interaction.
                lyricsContainer.classList.remove('hidden');
                const p = lyricsContainer.querySelector('p');
                if(p) p.textContent = "Click để bắt đầu";
                document.body.addEventListener('click', startIntro, { once: true });
                document.body.addEventListener('touchstart', startIntro, { once: true });
            });
        }
    }, 500);
});