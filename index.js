console.log("Welcome to varun music list");

// Select elements
const songItems = document.querySelectorAll('.SongItem');
const playIcons = document.querySelectorAll('.fa-circle-play');
const gifImage = document.querySelector('.gif img');
const progressBar = document.getElementById('progressbar');
const masterPlayButton = document.querySelector('.fa-circle-play.fa-2x');
const nextButton = document.querySelector('.fa-forward-fast');
const prevButton = document.querySelector('.fa-backward-fast');

// Song data (ensure these paths are correct)
const songs = [
    { title: "Tere Hoke Rahenge x infinity", file: "song1.mp3", duration: "2:56" },
    { title: "Struggler", file: "song2.mp3", duration: "4:55" },
    { title: "The Winner of Power", file: "song3.mp3", duration: "4:00" },
    { title: "Ekdantaya Vakrakundaye", file: "song4.mp3", duration: "6:45" },
    { title: "Pata Chalgea", file: "song5.mp3", duration: "4:45" },
    { title: "Baari", file: "song6.mp3", duration: "3:55" },
    { title: "Let me Love you", file: "song7.mp3", duration: "3:25" },
    { title: "Warriyo-Mortals", file: "song8.mp3", duration: "3:50" }
    
];

// State variables
let currentSongIndex = 0;
let isPlaying = false;
let audio = new Audio();

// Functions
function loadSong(index) {
    audio.src = songs[index].file;
    audio.load();
    console.log(`Loaded song: ${songs[index].title}, File path: ${audio.src}`);
}

function playSong() {
    audio.play()
        .then(() => {
            isPlaying = true;
            updatePlayIcons();
            masterPlayButton.classList.remove('fa-circle-play');
            masterPlayButton.classList.add('fa-pause');
            gifImage.style.opacity = 1;
            console.log(`Playing song: ${songs[currentSongIndex].title}`);
        })
        .catch(error => {
            console.error("Error playing song:", error);
            alert("Audio file couldn't be played. Check the file path and permissions.");
        });
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    updatePlayIcons();
    masterPlayButton.classList.add('fa-circle-play');
    masterPlayButton.classList.remove('fa-pause');
    gifImage.style.opacity = 0;
    console.log(`Paused song: ${songs[currentSongIndex].title}`);
}

function updatePlayIcons() {
    playIcons.forEach((icon, index) => {
        if (index === currentSongIndex) {
            icon.classList.toggle('fa-circle-play', !isPlaying);
            icon.classList.toggle('fa-pause', isPlaying);
        } else {
            icon.classList.add('fa-circle-play');
            icon.classList.remove('fa-pause');
        }
    });
}

function togglePlayPause() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

// Event Listeners
// Master Play Button
masterPlayButton.addEventListener('click', togglePlayPause);

// Previous Button
prevButton.addEventListener('click', () => {
    if (currentSongIndex > 0) {
        currentSongIndex--;
    } else {
        currentSongIndex = songs.length - 1; // Loop back to last song
    }
    loadSong(currentSongIndex);
    playSong();
});

// Next Button
nextButton.addEventListener('click', () => {
    if (currentSongIndex < songs.length - 1) {
        currentSongIndex++;
    } else {
        currentSongIndex = 0; // Loop back to first song
    }
    loadSong(currentSongIndex);
    playSong();
});

// Play individual song
songItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        if (isPlaying && currentSongIndex === index) {
            // If the current song is already playing, toggle play/pause
            togglePlayPause();
        } else {
            // Pause the current song if playing
            if (isPlaying) pauseSong();
            
            // Set the new song index and play it
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        }
    });
});

// Update progress bar as song plays
audio.addEventListener('timeupdate', () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progressPercent;
});

// Change song time by adjusting progress bar
progressBar.addEventListener('input', () => {
    const newTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = newTime;
});

// End song and move to the next one automatically
audio.addEventListener('ended', () => {
    if (currentSongIndex < songs.length - 1) {
        currentSongIndex++;
    } else {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    playSong();
});

// Select the timestamp display element
const timestampDisplay = document.getElementById('timestamp');

// Helper function to format time in minutes:seconds
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update timestamp during playback
audio.addEventListener('timeupdate', () => {
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    const progressPercent = (currentTime / duration) * 100;

    // Update progress bar
    progressBar.value = progressPercent;

    // Update timestamp display
    timestampDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
});

// Ensure total duration displays correctly when song loads
audio.addEventListener('loadedmetadata', () => {
    timestampDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
});
