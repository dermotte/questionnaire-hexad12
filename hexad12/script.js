// HEXAD-12 Questions
const questions = [
    { type: "Philanthropist", text: "It makes me happy if I am able to help others.", val: -1 },
    { type: "Philanthropist", text: "The well-being of others is important to me.", val: -1 },
    { type: "Socializer", text: "I like being part of a team.", val: -1 },
    { type: "Socializer", text: "I enjoy group activities.", val: -1 },
    { type: "Achiever", text: "I like mastering difficult tasks.", val: -1 },
    { type: "Achiever", text: "I enjoy emerging victorious out of difficult circumstances.", val: -1 },
    { type: "Player", text: "If the reward is sufficient, I will put in the effort.", val: -1 },
    { type: "Player", text: "Rewards are a great way to motivate me.", val: -1 },
    { type: "FreeSpirit", text: "It is important to me to follow my own path.", val: -1 },
    { type: "FreeSpirit", text: "Being independent is important to me.", val: -1 },
    { type: "Disruptor", text: "I see myself as a rebel.", val: -1 },
    { type: "Disruptor", text: "I dislike following rules.", val: -1 }
];

// HEXAD User Type Explanations
const userTypeExplanations = {
    Philanthropist: "Philanthropists are altruistic and motivated by purpose. They enjoy helping others.",
    Socializer: "Socializers seek connection and thrive on relationships and teamwork.",
    Achiever: "Achievers are goal-oriented and driven by challenges and personal improvement.",
    Player: "Players are motivated by rewards and will exert effort to achieve them.",
    FreeSpirit: "Free Spirits value autonomy and creativity, preferring to explore and express themselves.",
    Disruptor: "Disruptors challenge norms and enjoy provoking change and breaking rules."
};

// Shuffle questions
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Generate questions dynamically
const container = document.getElementById('questions-container');
shuffle(questions).forEach((question, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('card', 'mb-3');
    questionDiv.setAttribute('data-question-index', index);
    questionDiv.innerHTML = `
        <div class="card-body">
            <p class="card-text fw-bold">${index + 1}. ${question.text}</p>
            <div class="d-flex justify-content-between text-center">
                <div>
                    <label for="q${index}-1" class="d-block">Strongly Disagree</label>
                    <input class="form-check-input" type="radio" name="q${index}" value="1" id="q${index}-1">
                </div>
                <div>
                    <label for="q${index}-2" class="d-block">Disagree</label>
                    <input class="form-check-input" type="radio" name="q${index}" value="2" id="q${index}-2">
                </div>
                <div>
                    <label for="q${index}-3" class="d-block">Neutral</label>
                    <input class="form-check-input" type="radio" name="q${index}" value="3" id="q${index}-3">
                </div>
                <div>
                    <label for="q${index}-4" class="d-block">Agree</label>
                    <input class="form-check-input" type="radio" name="q${index}" value="4" id="q${index}-4">
                </div>
                <div>
                    <label for="q${index}-5" class="d-block">Strongly Agree</label>
                    <input class="form-check-input" type="radio" name="q${index}" value="5" id="q${index}-5">
                </div>
            </div>
        </div>
    `;
    container.appendChild(questionDiv);
});

// Display a Bootstrap alert
function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

// Gather results and calculate HEXAD scores
document.getElementById('submit-btn').addEventListener('click', () => {
    const scores = {
        Philanthropist: 0,
        Socializer: 0,
        Achiever: 0,
        Player: 0,
        FreeSpirit: 0,
        Disruptor: 0
    };
    let allAnswered = true;

    // Reset any previous validation indicators
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('border-danger');
    });

    questions.forEach((question, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected) {
            const value = parseInt(selected.value, 10);
            question.val = value;
            scores[question.type] += value;
        } else {
            allAnswered = false;
            const questionCard = document.querySelector(`.card[data-question-index="${index}"]`);
            questionCard.classList.add('border-danger');
        }
    });

    if (!allAnswered) {
        showAlert("Please answer all questions before submitting.", "danger");
        return;
    }

    // Display scores for each user type
    document.getElementById('result').textContent = JSON.stringify(scores, null, 2) + JSON.stringify(questions, null, 2);

    // Show copy button
    const copyBtn = document.getElementById('copy-btn');
    copyBtn.style.display = 'block';
    

    // Display user type explanations
    const explanationContainer = document.getElementById('user-types-explanation');
    explanationContainer.innerHTML = Object.entries(scores)
        // Sort the entries by score in descending order
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
        // Map each sorted entry to an HTML paragraph
        .map(([type, score]) => `<p><strong>${type} ${score}:</strong> ${userTypeExplanations[type]}</p>`)
        // Join all paragraphs into a single string
        .join('');
});

// Copy to Clipboard Functionality
document.getElementById('copy-btn').addEventListener('click', () => {
    const resultElement = document.getElementById('result');
    navigator.clipboard.writeText(resultElement.textContent).then(() => {
        showAlert("Results copied to clipboard!", "success");
    }).catch(err => {
        showAlert("Failed to copy results. Please try again.", "danger");
    });
});