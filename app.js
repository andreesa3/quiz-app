const categories = document.querySelectorAll(".category a");

const title = document.getElementById("title");
const categoriesBox = document.querySelector(".box");

/* Questions */
const questionBox = document.getElementById("question-box");
const questionP = document.getElementById("question-text");

/* Buttons */
const backButton = document.getElementById("back-btn");
const buttonsDiv = document.getElementById("question-btns");
const nextButton = document.getElementById("next-btn");

/* Insieme di link con rispettiva categoria */
const links = [
  /* General Knowledge */
  {
    category: "culture",
    url: "./questions/culture.json",
  },
  /* Film */
  {
    category: "film",
    url: "./questions/film.json",
  },
  /* Video Games */
  {
    category: "videogames",
    url: "./questions/videogames.json",
  },
  /* Science */
  {
    category: "science",
    url: "./questions/science.json",
  },
  /* Sports */
  {
    category: "sports",
    url: "./questions/sports.json",
  },
  /* Geo */
  {
    category: "geo",
    url: "./questions/geo.json",
  },
  /* History */
  {
    category: "history",
    url: "./questions/history.json",
  },
  /* Anime & Manga */
  {
    category: "japan",
    url: "./questions/japan.json",
  },
];

let questions,
  shuffledAnswers,
  currentIndex = 0;

/* Quando viene cliccata una categoria inizia il gioco */
categories.forEach((category) => category.addEventListener("click", startGame));
backButton.addEventListener("click", stopGame);
nextButton.addEventListener("click", () => {
  currentIndex++, nextQuestion();
});

async function startGame(e) {
  e.preventDefault();
  /* nome della categoria selezionata */
  let selectedCategory = e.target.className;
  /* Controllo se esiste nell'array links */
  let categoryUrl = links.find((link) => link.category === selectedCategory);
  /* Fetch delle domande per quella categoria */
  await fetch(categoryUrl.url)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Something went wrong!");
      }
    })
    .then((data) => {
      questions = data.questions;
      /* Inserisco la risposta esatta nell'array di risposte */
      nextQuestion();
    });

  // Via le categorie e il titolo e mostro le domande
  title.style.display = "none";
  categoriesBox.style.display = "none";
  questionBox.style.display = "block";
  backButton.style.display = "block";
  nextButton.style.display = "block";
}

function nextQuestion() {
  resetState();
  showQuestion(questions[currentIndex]);
}

function showQuestion(question) {
  /* Imposto il testo della domanda */
  console.log(question);
  questionP.innerText = question.question;
  /* Mischio le risposte */
  shuffledAnswers = question.answers.sort(() => Math.random() - 0.5);
  /* Creo i bottoni per ogni risposta */
  shuffledAnswers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("answer-btn");
    /* Applichiamo l'attributo "correct" solo alla domanda giusta */
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    buttonsDiv.appendChild(button);
  });
}

function resetState() {
  clearStatusClass(document.body);
  nextButton.classList.add("hide");
  while (buttonsDiv.firstChild) {
    buttonsDiv.innerHTML = "";
  }
}

function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct;
  setStatusClass(selectedButton, correct);
  /* Inseriamo la classe di correct o incorrect in base all'attributo "correct" */
  Array.from(buttonsDiv.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct);
  });
  if (currentIndex + 1 < questions.length) {
    nextButton.classList.remove("hide");
  } else {
    nextButton.classList.add("hide");
    buttonsDiv.style.display = "none"
    questionP.innerText = "Hai finito le domande (^_^) \n \n Grazie per aver giocato!";
    currentIndex = 0;
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("incorrect");
  }
}

function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("incorrect");
}

function stopGame(e) {
  e.stopPropagation();
  currentIndex = 0;
  title.style.display = "block";
  categoriesBox.style.display = "grid";
  questionBox.style.display = "none";
  backButton.style.display = "none";
  nextButton.style.display = "none";
  buttonsDiv.style.display = "grid"
}
