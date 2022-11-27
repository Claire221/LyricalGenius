let time = 30;

function timer() {
    let timer = document.getElementById("timer")
    timer.innerHTML = time

    let setTimer =  setInterval(function() {
        if (time === 0) {
            endGame()
        } else {
            time--
            timer.innerHTML = time
        }
    },1000);
}