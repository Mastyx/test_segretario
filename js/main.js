let questions = [];
let sbagliate = [];
let currentQuestionIndex = 0;
let score = 0;

// Mappa dei file
const fileMap = {
  data_all: "https://mastyx.github.io/test_segretario/resurces/data_all.json",
  data_v1: "https://mastyx.github.io/test_segretario/resurces/data_v1.json",
  data_v2: "https://mastyx.github.io/test_segretario/resurces/data_v2.json",
  data_v3: "https://mastyx.github.io/test_segretario/resurces/data_v3.json",
};

async function startQuiz() {
  const fileKey = document.getElementById("fileSelect").value;
  if (!fileKey) {
    alert("Seleziona un file per iniziare il quiz!");
    return;
  }

  const fileName = fileMap[fileKey];

  try {
    const response = await fetch(fileName);
    questions = await response.json();

    // Reset variabili
    currentQuestionIndex = 0;
    score = 0;

    // Aggiorna UI
    document.getElementById("setup").classList.add("hidden");
    document.getElementById("quizContainer").classList.remove("hidden");
    document.getElementById("resultsContainer").classList.add("hidden");

    document.getElementById("totalQuestions").innerText = questions.length;
    document.getElementById("score").innerText = score;

    showQuestion();
  } catch (error) {
    console.error("Errore nel caricamento del file:", error);
  }
}

function showQuestion() {
  const q = questions[currentQuestionIndex];

  document.getElementById("currentQuestion").innerText =
    currentQuestionIndex + 1;
  document.getElementById("questionNumber").innerText =
    "Domanda " + (currentQuestionIndex + 1);
  document.getElementById("questionText").innerText = q.question;

  const optionsContainer = document.getElementById("optionsContainer");
  optionsContainer.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.classList.add("btn", "btn-option");
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(opt, q.answer, btn);
    optionsContainer.appendChild(btn);
  });

  document.getElementById("nextBtn").disabled = true;
}

function checkAnswer(selected, correct, btn) {
  const buttons = document.querySelectorAll(".btn-option");

  buttons.forEach((b) => (b.disabled = true));

  if (selected.trim().toUpperCase().startsWith(correct)) {
    btn.classList.add("correct");
    score++;
    document.getElementById("score").innerText = score;
  } else {
    btn.classList.add("wrong");
    // evidenzio la risposta giusta
    buttons.forEach((b) => {
      if (b.innerText.trim().toUpperCase().startsWith(correct)) {
        b.classList.add("correct");
      }
    });
    // salva la domanda sbagliata
    sbagliate.push({
      question: questions[currentQuestionIndex].question,
      correctAnswer: correct,
      options: questions[currentQuestionIndex].options,
      userAnswer: selected,
    });
  }

  document.getElementById("nextBtn").disabled = false;
}

function nextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    showResults();
  }
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
  }
}

function showResults() {
  document.getElementById("quizContainer").classList.add("hidden");
  document.getElementById("resultsContainer").classList.remove("hidden");

  document.getElementById("finalScore").innerText =
    "Hai totalizzato " + score + " punti su " + questions.length;
  document.getElementById("correctAnswers").innerText = score;
  document.getElementById("wrongAnswers").innerText = questions.length - score;
  document.getElementById("percentage").innerText = (
    (score / questions.length) *
    100
  ).toFixed(2);
  // Elenco errori
  const wrongList = document.getElementById("wrongList");
  wrongList.innerHTML = ""; // pulizia prima di scrivere di nuovo

  if (sbagliate.length > 0) {
    let errorList = "<h3>❌ Domande sbagliate</h3><ul>";
    sbagliate.forEach((q) => {
      const correctText = q.options.find((opt) =>
        opt.trim().toUpperCase().startsWith(q.correctAnswer),
      );
      errorList += `<li><strong>${q.question}</strong><br>
                    Tua risposta: ${q.userAnswer}<br>
                    Corretta: ${correctText}</li>`;
    });
    errorList += "</ul>";
    wrongList.innerHTML = errorList;
  } else {
    wrongList.innerHTML = "<p>👏 Nessun errore, ottimo lavoro!</p>";
  }
}
function resetQuiz() {
  document.getElementById("setup").classList.remove("hidden");
  document.getElementById("quizContainer").classList.add("hidden");
  document.getElementById("resultsContainer").classList.add("hidden");
  sbagliate = [];
  document.getElementById("wrongList").innerHTML = "";
}
