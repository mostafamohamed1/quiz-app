// Select Elements
let countSpan = document.querySelector('.quiz-app .count span');
let bullets = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz-area');
let answerArea = document.querySelector('.answer-area');
let submitButton = document.querySelector('.submit-answer');
let bulletsContainer = document.querySelector('.bullets');
let results = document.querySelector('.results');
let countdownElement = document.querySelector('.countdown');

// Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let questionObject = JSON.parse(this.responseText);
      let questionCount = questionObject.length;
      createBullets(questionCount);

      addQuestionData(questionObject[currentIndex], questionCount);

      countdown(5, questionCount);

      submitButton.onclick = function () {
        let rightAnswer = questionObject[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(rightAnswer, questionCount);
        quizArea.innerHTML = '';
        answerArea.innerHTML = '';
        addQuestionData(questionObject[currentIndex], questionCount);

        handleBullets();

        clearInterval(countdownInterval);
        countdown(5, questionCount);
        showResults(questionCount);
      };
    }
  };

  myRequest.open('GET', 'question.json', true);
  myRequest.send();
}

getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let createSpan = document.createElement('span');
    if (i == 0) createSpan.className = 'on';
    bullets.appendChild(createSpan);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let qTitle = document.createElement('h2');
    let qText = document.createTextNode(obj.title);
    qTitle.appendChild(qText);
    quizArea.appendChild(qTitle);

    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement('div');
      mainDiv.className = 'answer';

      let radioInput = document.createElement('input');
      radioInput.type = 'radio';
      radioInput.name = 'question';
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      if (i == 1) radioInput.checked = true;
      let label = document.createElement('label');
      label.htmlFor = `answer_${i}`;
      let labelText = document.createTextNode(obj[`answer_${i}`]);
      label.appendChild(labelText);

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(label);

      answerArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rightAnswer, count) {
  let answers = document.getElementsByName('question');
  let theChosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) theChosenAnswer = answers[i].dataset.answer;
  }

  if (rightAnswer === theChosenAnswer) {
    rightAnswers++;
    console.log('Good Answer');
  }
}

function handleBullets() {
  let bulletsSpans = Array.from(
    document.querySelectorAll('.bullets .spans span'),
  );
  bulletsSpans.forEach((el, i) =>
    currentIndex === i ? (el.className = 'on') : '',
  );
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answerArea.remove();
    submitButton.remove();
    bulletsContainer.remove();
    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count} Is Good`;
    } else if (rightAnswers == count) {
      theResults = `<span class="perfect">Perfect</span>, ${rightAnswers} From ${count} Is Perfect`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count} Is Bad Bad Bad`;
    }

    results.innerHTML = theResults;
    results.style.padding = '20px';
    results.style.backgroundColor = 'white';
    results.style.marginTop = '10px';
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;

    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
