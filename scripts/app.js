// Get the different game screens and fave them to variables
const titleScreen = document.getElementById("title-screen")
const gameScreen = document.getElementById("game-screen")
const gameLevels = document.getElementById("level-select")
const gameOver = document.getElementById("game-over")
const gameTitle = document.getElementById("chosen_genre")


// Load Game Genre buttons
const popGenre = document.getElementById("pop-option")
const rockGenre = document.getElementById("rock-option")
const countryGenre = document.getElementById("country-option")
const allGenres = document.getElementById("all-option")

// Get the button the user clicks to submit guess
const answerBtn = document.getElementById("answer-btn")
// Get the span that shows the player their score
const score = document.getElementById("score")
// Get the div displays the lyric
const lyricInfo = document.getElementById("lyric-info")
// Get the div that displays the players answer
const answerinfo = document.getElementById("answer-info")

// Gets HTML form that contains the player answer input
let form = document.getElementById("guess-form");
// Get the players guess
let guessInput = document.getElementById("player-guess")

// Initialized the difficulty of the game
let difficulty;
// Initialized the game genre
let genre
// Initialized the songs array
let songs = []
// Initialized the chosen song
let chosenSong = []

// // Initialized the correctWords so words can be compared individually 
// let correctWords = []
// let wrongWords = []

// Initialized Game Score
let gameScore
// Initialized Player Tries
let tries = 0
// Sets how many lives the player has left
let livesLeft = 5

// Initialized player guess variable
let guess

// Initialized the answer
let difficultyAnswer

let index 

// Adds an event listener to the page to hide game specific game screens only showing the start menu
window.addEventListener('load', (event) =>{
    gameLevels.classList.add("hidden")
    answerinfo.classList.add("hidden")
    gameScreen.classList.add("hidden")
    gameOver.classList.add("hidden")

    // Sets songs to all songs
    songs = loadAllSongs();
});

// // Load All songs
async function loadAllSongs() {
    const res = await fetch("songs.json");
    const data = await res.json();
    songs = data;
    totalSongs = songs.length;
}

// Adds evnt listeners to each game genre button
popGenre.addEventListener("click", function() {
    // updates genre to genre player picked
    genre = "pop"
    gameDifficulty()
})

rockGenre.addEventListener("click", function() {
    // updates genre to genre player picked
    genre = "rock"
    gameDifficulty()
})


countryGenre.addEventListener("click", function() {
    // updates genre to genre player picked
    genre = "country"
    gameDifficulty()
})


allGenres.addEventListener("click", function() {
    // updates genre to genre player picked
    genre = null
    gameDifficulty()
})



function gameDifficulty () {
    // Shows and hides relevent screens
    titleScreen.classList.add("hidden")
    gameLevels.classList.remove("hidden")

    // Adds event listeners to game difficulty buttons
    document.getElementById("easy-option").addEventListener("click", function(){
        // Updates the game dificulty with players chosen difficulty 
        difficulty = "easy"
        startGame()
    })
    document.getElementById("medium-option").addEventListener("click", function(){
        difficulty = "medium"
        startGame()
    })
    document.getElementById("hard-option").addEventListener("click", function(){
        difficulty = "hard"
        startGame()
    })
}

// Function to start game
function startGame() {
    let results; 
    // Shows and hides relevent screens
    gameLevels.classList.add("hidden")
    titleScreen.classList.add("hidden")
    gameScreen.classList.remove("hidden")
    
    // Sets score and lives to 0 with each new game
    gameScore = 0
    lives = 0

    // Filters the songs array to only show songs with the genre the player picked
    if (genre != null) {
        results = songs.filter((song) => {
            return song.genre.toLowerCase() === genre;
        });
    }
    else {
        results = songs
    }

    // Filters down the songs to randomly select 15 of them for the game
    let reduceSongs = [] 
    while (reduceSongs.length < 15) {
        let num = Math.floor(Math.random() * results.length)
        reduceSongs.push(results[num])
    }
    // Updates the songs array with the relevent songs 
    songs = reduceSongs
    chooseSong()
}


// Function to randomly chose a song
function chooseSong() {
    // Updates the timer to 30s for each new song and recalls the function
    time = 30
    timer()
    guess = null;
    // answer = null;

    // Displays the player chosen genre to them
    if (genre) {
        document.getElementById("header-title").innerHTML = `Your Chosen Genre Is ${genre.toUpperCase()}` 
    } else {
        document.getElementById("header-title").innerHTML = `You have selected all songs!`
    }
    // songs = results
    // Randomly gets a number from the length of the songs array and gets relevent song to assign to chosenSong
    index = Math.floor(Math.random() * songs.length)
    chosenSong = songs[index]
    
    displaySong(chosenSong)
    console.log(songs)
}

// Displays the chosen songs artist and song title aswell as the lyric they are guessing
function displaySong() {
    // Display the artist of the song to the player
    document.getElementById("artist").innerHTML = chosenSong["artist"]
    // Display the song title to the player
    document.getElementById("song").innerHTML = chosenSong["title"]
    // Display the lyric to the player
    document.getElementById("lyric").innerHTML = chosenSong["lyric"]
    // guessInput.innerHTML = ""
    // playerAnswer()
    getAnswer()
}

// Function to get the answer
function getAnswer() {
    // Splits the answer removing any spaces or symbols and also converts it to lower case
    answer = chosenSong["answer"].replace(/(,|\s|'|‘|’|`)/g, " ").toLowerCase().split(/\s+/)
    let splitAnswer
    
    // Sets the question answer depending on the difficulty the player selected
    if (difficulty == "easy") {
        splitAnswer = answer.slice(0, 3)
        difficultyAnswer = splitAnswer.join(" ")
    } else if (difficulty == "medium" ) {
        splitAnswer = answer.slice(0, 5)
        difficultyAnswer = splitAnswer.join(" ")
    } else if (difficulty == "hard" ) {
        splitAnswer = answer.slice(0, 8)
        difficultyAnswer = splitAnswer.join(" ")
    }
    // Display the amount of words the player is trying to guess
    document.getElementById("word-count").innerHTML = splitAnswer.length
}

// Event Listener to Get user answer
form.addEventListener("submit", (e) => {
    e.preventDefault();
  //   let playerGuess = document.getElementById("player-guess");
  //   let answer = input.value;
    // Gets the guess the player inputed and then clears out the input feild
    guess = document.getElementById("player-guess").value.toLowerCase();
    guessInput.value = ""
    
    // Checks if the answer is correct or not and calls relevent function
    if (difficultyAnswer == guess) {
        correctAnswer()
    } else {
        wrongAnswer()
    }

});


function correctAnswer() {
    // If the answer is correct a class is added to change font colour
    document.getElementById("guess-reveal").classList.add("correct-answer")
    // Game score is updated
    gameScore += 10
    document.getElementById("score").innerHTML = gameScore
    // song is removed from array so same song doenst apear twice in one game
    songs.splice(index, 1);
    // songs.pop(chosenSong)
    displayAnswers()
}

function wrongAnswer() {
    // If the answer is wrong a class is added to change font colour
    document.getElementById("guess-reveal").classList.add("wrong-answer")

    // get the image tags that have the hearts image in them
    const lives = document.querySelectorAll('.game-life');
    //swaps heart image for lost heart immage
    lives[tries].classList.add("life-lost");
    //adds point to missed variable
    tries++
    livesLeft--
    // time = 30
    // song is removed from array so same song doenst apear twice in one game
    songs.pop(index)
    displayAnswers()
}


function displayAnswers() {
    // Shows screen that displays the answer to the question aswell as the players guess so they can see if it was wright or wrong
    lyricInfo.classList.add("hidden")
    answerinfo.classList.remove("hidden")
    document.getElementById("guess-reveal").innerHTML = guess
    document.getElementById("answer-reveal").innerHTML = difficultyAnswer
    guessInput.classList.add("hidden")
    answerBtn.classList.add("hidden")
    document.getElementById("time-p").classList.add("hidden")

    // Sets a time out to call the hideAnswers function so player has change to read information
    setTimeout(() => {
        hideAnswers()
    }, 2000)
}

function hideAnswers() {
    // if there are no songs left the answer screen is hidden and the endGame function runs
    if (songs.length == 0 || livesLeft == 0) {
        setTimeout(() => {
            endGame()
        }, 1000)
    // If there are still songs in the songs array the game continues
    } else {
        lyricInfo.classList.remove("hidden")
        answerinfo.classList.add("hidden")
        guessInput.classList.remove("hidden")
        answerBtn.classList.remove("hidden")
        document.getElementById("time-p").classList.remove("hidden")
        chooseSong(genre)
    }    
}

// End Game function displaying end score
function endGame() {
    gameOver.classList.remove("hidden")
    // if game is over because there are no songs left it displays a congratulations mesage
    if(songs.length == 0) {
        gameScreen.classList.add("hidden")
        document.getElementById("game-state").innerHTML = "Congratulations you beat the game!"
        document.getElementById("score").innerHTML = `Your score is: ${gameScore}`
        setTimeout(() => {
            location.reload();
        }, 3000)
    // if game is over because there are no lvies left it displays a game over mesage
    } else {
        gameScreen.classList.add("hidden")
        document.getElementById("game-state").innerHTML = "Sorry you have ran out of lives!"
        document.getElementById("score").innerHTML = `Your score is: ${gameScore}`
        setTimeout(() => {
            location.reload();
        }, 3000)
    }
}



// // API Test
// const addSongToIframe = () => {
//     document.getElementById(
//       "spotify-player"
//     ).src = `https://open.spotify.com/embed/track/${currentSong.id}`;
//     noCheating();
// };

// let checkSong = () => {
//     // currentSong.id = 3
//     fetch(`https://kareoke.p.rapidapi.com/v1/song/spotify?id=${currentSong.id}`)
//       .then((jsonData) => jsonData.json())
//       .then((data) => songExists(data));
// };

// const songExists = (song) => {
//     if (song.msg === `We couldn't find a data with this id`) {
//       getSong();
//     }
// };