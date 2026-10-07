const questions = [

    {
        q: "5 + 7 = ?",
        options: ["10", "11", "12", "13"],
        answer: "12"
    },

    {
        q: "8 × 6 = ?",
        options: ["42", "48", "54", "56"],
        answer: "48"
    },

    {
        q: "100 ÷ 5 = ?",
        options: ["10", "15", "20", "25"],
        answer: "20"
    },

    {
        q: "25 - 9 = ?",
        options: ["14", "15", "16", "17"],
        answer: "16"
    },

    {
        q: "12 × 12 = ?",
        options: ["124", "134", "144", "154"],
        answer: "144"
    },

    {
        q: "√81 = ?",
        options: ["7", "8", "9", "10"],
        answer: "9"
    },

    {
        q: "25% of 200 = ?",
        options: ["25", "40", "50", "75"],
        answer: "50"
    },

    {
        q: "2³ = ?",
        options: ["6", "8", "9", "12"],
        answer: "8"
    },

    {
        q: "15 × 4 = ?",
        options: ["50", "55", "60", "65"],
        answer: "60"
    },

    {
        q: "9 × 9 = ?",
        options: ["72", "81", "90", "99"],
        answer: "81"
    }

];

let current = 0;
let score = 0;
let coins = 0;
let lives = 3;
let level = 1;

let timeLeft = 15;
let timer;

const question = document.getElementById("question");
const optionsBox = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");

function loadQuestion() {

    clearInterval(timer);

    if (current >= questions.length) {
        endGame();
        return;
    }

    const data = questions[current];

    document.getElementById("questionNumber").innerText =
        "Question " + (current + 1);

    question.innerText = data.q;

    document.getElementById("level").innerText = level;

    optionsBox.innerHTML = "";

    nextBtn.style.display = "none";

    timeLeft = 15;

    document.getElementById("time").innerText = timeLeft;

    document.getElementById("timerBar").style.width = "100%";

    data.options.forEach(option => {

        const button = document.createElement("button");

        button.className = "option";

        button.innerText = option;

        button.onclick = () => checkAnswer(button, option);

        optionsBox.appendChild(button);

    });

    startTimer();
}


function startTimer() {

    timer = setInterval(() => {

        timeLeft--;

        document.getElementById("time").innerText = timeLeft;

        document.getElementById("timerBar").style.width =
            (timeLeft / 15 * 100) + "%";

        if (timeLeft <= 0) {

            clearInterval(timer);

            loseLife();

            disableOptions();

            nextBtn.style.display = "block";
        }

    }, 1000);
}


function checkAnswer(button, selected) {

    clearInterval(timer);

    const correct = questions[current].answer;

    disableOptions();

    if (selected === correct) {

        button.classList.add("correct");

        score++;

        coins += 10;

        document.getElementById("coins").innerText = coins;

        playSound(true);

    } else {

        button.classList.add("wrong");

        loseLife();

        playSound(false);

        document.querySelectorAll(".option").forEach(btn => {

            if (btn.innerText === correct) {
                btn.classList.add("correct");
            }

        });
    }

    nextBtn.style.display = "block";
}


function disableOptions() {

    document.querySelectorAll(".option").forEach(btn => {
        btn.disabled = true;
    });
}


function loseLife() {

    lives--;

    document.getElementById("lives").innerText =
        lives > 0 ? "❤️".repeat(lives) : "0";

    if (lives <= 0) {

        setTimeout(endGame, 500);
    }
}


function nextQuestion() {

    if (lives <= 0) {
        endGame();
        return;
    }

    current++;

    if (current % 3 === 0) {
        level++;
    }

    loadQuestion();
}


function endGame() {

    clearInterval(timer);

    document.getElementById("gameScreen").style.display = "none";

    document.getElementById("result").style.display = "block";

    document.getElementById("finalScore").innerText =
        score + " / " + questions.length;

    document.getElementById("finalCoins").innerText = coins;

    let oldScore =
        localStorage.getItem("educationPointHighScore") || 0;

    if (score > oldScore) {

        localStorage.setItem(
            "educationPointHighScore",
            score
        );

        oldScore = score;

        document.getElementById("resultMessage").innerText =
            "🏆 New High Score! Excellent!";

    } else {

        document.getElementById("resultMessage").innerText =
            "👏 Great effort! Keep learning!";
    }

    document.getElementById("highScore").innerText = oldScore;
}


function restartGame() {

    current = 0;
    score = 0;
    coins = 0;
    lives = 3;
    level = 1;

    document.getElementById("coins").innerText = "0";

    document.getElementById("lives").innerText = "3";

    document.getElementById("gameScreen").style.display = "block";

    document.getElementById("result").style.display = "none";

    loadQuestion();
}


function playSound(correct) {

    const AudioContext =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) return;

    const audio = new AudioContext();

    const oscillator = audio.createOscillator();

    const gain = audio.createGain();

    oscillator.connect(gain);

    gain.connect(audio.destination);

    oscillator.frequency.value =
        correct ? 700 : 200;

    oscillator.start();

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audio.currentTime + 0.2
    );

    oscillator.stop(
        audio.currentTime + 0.2
    );
}


loadQuestion();