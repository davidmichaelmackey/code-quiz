// welc
const welcome = document.querySelector("#welcome");
const startQuizBtn = document.querySelector("#startQuiz");

// quiz
const quiz = document.querySelector("#quiz");
const question = document.querySelector("#question");
const answers = document.querySelector("#answers");

// inputscore
const inputScore = document.querySelector("#inputScore");
const initials = document.querySelector("#initials");
const submitInitialsBtn = document.querySelector("#submitInitials");
const usrScore = document.querySelector("#score");

// highscore
const highscores = document.querySelector("#highScores");
const scores = document.querySelector("#scores");
const goBackBtn = document.querySelector("#goBack");
const clearScoresBtn = document.querySelector("#clearScores");

// univariables
const seeHighScoresBtn = document.querySelector("#viewHighScores");
const timer = document.querySelector("#timer");
let score = 0;
let currentQ = 0;
let highScores = [];
let interval;
let timeGiven = 75;
let secondsElapsed = 0;

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// start/update time
function startTime() {
    timer.textContent = timeGiven;
    interval = setInterval(function () {
        secondsElapsed++;
        timer.textContent = timeGiven - secondsElapsed;
        if (secondsElapsed >= timeGiven) {
            currentQ = questions.length;
            nextQuestion();
        }
    }, 1000);
}

// stoptimer
function stopTime() {
    clearInterval(interval);
}

// next question
// call for inputscore if last ?
function nextQuestion() {
    currentQ++;
    if (currentQ < questions.length) {
        renderQuestion();
    } else {
        stopTime();
        if ((timeGiven - secondsElapsed) > 0)
            score += (timeGiven - secondsElapsed);
        usrScore.textContent = score;
        hide(quiz);
        show(inputScore);
        timer.textContent = 0;
    }
}

// check answer of current ? and update user's score
function checkAnswer(answer) {
    if (questions[currentQ].answer == questions[currentQ].choices[answer.id]) {
        score += 5;
        displayMessage("Correct! ✅");
    }
    else {
        secondsElapsed += 10;
        displayMessage("Wrong! ❌");
    }
}

// display a message - 1 sec
function displayMessage(m) {
    let messageHr = document.createElement("hr");
    let messageEl = document.createElement("div");
    messageEl.textContent = m;
    document.querySelector(".jumbotron").appendChild(messageHr);
    document.querySelector(".jumbotron").appendChild(messageEl);
    setTimeout(function () {
        messageHr.remove();
        messageEl.remove();
    }, 1000);

}

// hide elmnt
function hide(element) {
    element.style.display = "none";
}

// display elmnt
function show(element) {
    element.style.display = "block";
}

// reset local vars
function reset() {
    score = 0;
    currentQ = 0;
    secondsElapsed = 0;
    timer.textContent = 0;
}

// render question
function renderQuestion() {
    question.textContent = questions[currentQ].title;
    for (i = 0; i < answers.children.length; i++) {
        answers.children[i].children[0].textContent = `${(i + 1)}: ${questions[currentQ].choices[i]}`;
    }
}

// render high scores in local storage
function renderHighScores() {
    // clear
    scores.innerHTML = "";
    show(highscores);
    highScores = JSON.parse(localStorage.getItem("scores"));
    for (let i = 0; i < highScores.length; i++) {
        let scoreItem = document.createElement("div");
        scoreItem.className += "row mb-3 p-2";
        console.log(scoreItem)
        scoreItem.setAttribute("style", "background-color:#FFDBE9;");
        scoreItem.textContent = `${(i + 1)}. ${highScores[i].username} - ${highScores[i].usrScore}`;
        scores.appendChild(scoreItem);
    }
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// show high score
seeHighScoresBtn.addEventListener("click", function () {
    hide(welcome);
    hide(quiz);
    hide(inputScore);
    renderHighScores();
    stopTime();
    reset();
});

// start quiz
startQuizBtn.addEventListener("click", function () {
    hide(welcome);
    startTime();
    renderQuestion();
    show(quiz);
});

// call to check answer & call next question if button clicked
answers.addEventListener("click", function (e) {
    if (e.target.matches("button")) {
        checkAnswer(e.target);
        nextQuestion();
    }
});

// call to render high scores
submitInitialsBtn.addEventListener("click", function () {
    let initValue = initials.value.trim();
    if (initValue) {
        let usrScore = { username: initValue, usrScore: score };
        initials.value = '';
        highScores = JSON.parse(localStorage.getItem("scores")) || [];
        highScores.push(usrScore)
        localStorage.setItem("scores", JSON.stringify(highScores));
        hide(inputScore);
        renderHighScores();
        reset();
    }
});

// go back to welc page from highscores
goBackBtn.addEventListener("click", function () {
    hide(highscores);
    show(welcome);
});

// clear scores within local storage
clearScoresBtn.addEventListener("click", function () {
    highScores = [];
    localStorage.setItem("scores", JSON.stringify(highScores));
    renderHighScores();
});
