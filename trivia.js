// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyB9fDC9MswOZn_HHyR4mUcnaT66dTpHEUU",
      authDomain: "mpm-webdb.firebaseapp.com",
      projectId: "mpm-webdb",
      storageBucket: "mpm-webdb.firebasestorage.app",
      messagingSenderId: "505825453901",
      appId: "1:505825453901:web:9588e60f9702192473f904"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Fetch questions from Firestore
db.collection('triviaQuestions').get().then(snapshot => {
  questions = snapshot.docs.map(doc => doc.data());
  showQuestion();
});

// Show current question
function showQuestion() {
  if(currentQuestionIndex >= questions.length) {
    alert(Trivia over! Your score: ${score});
    return;
  }
  const q = questions[currentQuestionIndex];
  document.getElementById('question').textContent = q.question;

  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';
  q.options.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option);
    optionsDiv.appendChild(btn);
  });
}

// Check answer
function checkAnswer(selected) {
  if(selected === questions[currentQuestionIndex].answer) {
    score++;
    document.getElementById('score').textContent = score;
  }
  currentQuestionIndex++;
  showQuestion();
}

// Submit score to Firestore
document.getElementById('submit-score').addEventListener('click', () => {
  const name = document.getElementById('username').value;
  if(!name) return alert('Enter your name');
  
  db.collection('triviaScores').add({
    name: name,
    score: score,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert('Score submitted!');
    loadLeaderboard();
  });
});

// Load leaderboard
function loadLeaderboard() {
  db.collection('triviaScores').orderBy('score', 'desc').limit(10).get()
    .then(snapshot => {
      const tbody = document.getElementById('leaderboard-body');
      tbody.innerHTML = '';
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const tr = document.createElement('tr');
        tr.innerHTML = <td>${data.name}</td><td>${data.score}</td>;
        tbody.appendChild(tr);
      });
    });
}

// Load leaderboard initially
loadLeaderboard();