// survey.js

// Define the survey questions
const surveyQuestions = {
    singleChoice: [
        {
            id: 'ai_usage',
            question: 'Did you ever use AI in one of your game projects?',
            options: ['Yes', 'No']
        },
        {
            id: 'ai_feelings',
            question: 'What best describes your current feelings on AI?',
            options: [
                'I haven’t thought much about it',
                'I am completely against anyone using AI in video games',
                'I am completely OK with anyone using AI in video games',
                'I have mixed feelings/comments about AI'
            ]
        }
    ],
    freeForm: [
        {
            id: 'comments_ai_usage',
            question: 'Comments, further thoughts and explanations for the above:',
            placeholder: 'Enter your comments here...'
        },
        {
            id: 'comments_likert',
            question: 'Comments, further thoughts and explanations for the above:',
            placeholder: 'Enter your comments here...'
        }
    ],
    likertScale: [
        'Using AI-generated art for prototyping.',
        'Using AI-generated art in commercial video games.',
        'Using AI-generated art in non-commercial video games.',
        'Using AI-generated art as a baseline or inspiration for manually created art assets.',
        'Using AI-generated art to display dynamically created in-game content (e.g., depending on user input).',
        'Using AI-generated music in commercial video games.',
        'Using AI-generated music in non-commercial video games.',
        'Using AI-generated writing for static dialogue in a video game.',
        'Using AI-generated writing as a baseline or inspiration for writing dialogue.',
        'Using AI-generated writing for dynamic dialogue generation in a video game (e.g., depending on user input).',
        'I care about the energy consumption of AI when training the models.',
        'I care about the energy consumption of AI when using the models live.',
        'I care about the size of the AI model (i.e., parameters).',
        'I care whether the AI model runs locally on my machine or in the cloud.'
    ]
};

// Define Likert Scale Options
const likertOptions = [
    { value: 1, label: 'Strongly Disagree' },
    { value: 2, label: 'Disagree' },
    { value: 3, label: 'Neutral' },
    { value: 4, label: 'Agree' },
    { value: 5, label: 'Strongly Agree' }
];

// Function to shuffle an array (Fisher-Yates Shuffle)
function shuffleArray(array) {
    const shuffled = array.slice(); // Create a copy to avoid mutating the original array
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Function to display a Bootstrap alert
function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

// Function to generate single-choice questions
function generateSingleChoiceQuestions(container, questions) {
    questions.forEach(q => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('mb-4');
        questionDiv.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <label class="form-label fw-bold">${q.question}</label>
                    <div class="mt-2">
                        ${q.options.map((option, idx) => `
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="${q.id}" id="${q.id}-${idx}" value="${option}">
                                <label class="form-check-label" for="${q.id}-${idx}">
                                    ${option}
                                </label>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        container.appendChild(questionDiv);
    });
}

// Function to generate free-form comment questions
function generateFreeFormQuestions(container, comments) {
    comments.forEach(c => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('mb-4');
        commentDiv.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <label for="${c.id}" class="form-label fw-bold">${c.question}</label>
                    <textarea class="form-control mt-2" id="${c.id}" rows="3" placeholder="${c.placeholder}"></textarea>
                </div>
            </div>
        `;
        container.appendChild(commentDiv);
    });
}

// Function to generate Likert scale items
function generateLikertScaleQuestions(container, items) {
    //const shuffledItems = shuffleArray(items);
    items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('mb-4', 'p-3', 'rounded', 'bg-light');
        itemDiv.innerHTML = `
            <label class="form-label fw-bold">${index + 1}. ${item}</label>
            <div class="d-flex justify-content-between align-items-center mt-2 likert-scale">
                ${likertOptions.map(option => `
                    <div class="form-check text-center flex-fill">
                        <input class="form-check-input" type="radio" name="likert_${index}" id="likert_${index}_${option.value}" value="${option.value}">
                        <label class="form-check-label" for="likert_${index}_${option.value}">
                            ${option.label}
                        </label>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(itemDiv);
    });
}

// Function to generate all survey questions
function generateSurvey() {
    const container = document.getElementById('questions-container');
    
    // Generate Single-Choice Questions
    generateSingleChoiceQuestions(container, surveyQuestions.singleChoice);
    
    // Generate First Free-Form Comment
    generateFreeFormQuestions(container, [surveyQuestions.freeForm[0]]);
    
    // Generate Likert Scale Questions
    const likertContainer = document.createElement('div');
    likertContainer.classList.add('mb-4');
    const likertHeader = document.createElement('label');
    likertHeader.classList.add('form-label', 'fw-bold');
    likertHeader.textContent = 'Please indicate your agreement level for each of the following items:';
    likertContainer.appendChild(likertHeader);
    generateLikertScaleQuestions(likertContainer, surveyQuestions.likertScale);
    container.appendChild(likertContainer);
    
    // Generate Second Free-Form Comment
    generateFreeFormQuestions(container, [surveyQuestions.freeForm[1]]);
}

// Function to collect responses and generate JSON
function collectResponses() {
    const responses = {};

    // Collect Single-Choice Responses
    surveyQuestions.singleChoice.forEach(q => {
        const selected = document.querySelector(`input[name="${q.id}"]:checked`);
        responses[q.id] = selected ? selected.value : null;
    });

    // Collect Free-Form Comments
    surveyQuestions.freeForm.forEach(c => {
        const comment = document.getElementById(c.id).value.trim();
        responses[c.id] = comment || null;
    });

    // Collect Likert Scale Responses
    const likertResponses = {};
    const likertQuestions = document.querySelectorAll('.likert-scale');
    likertQuestions.forEach((itemDiv, index) => {
        const selected = itemDiv.querySelector(`input[name="likert_${index}"]:checked`);
        likertResponses[`likert_${index}`] = selected ? selected.value : null;
    });
    responses['likert_scale'] = likertResponses;

    return responses;
}

// Function to validate responses
function validateResponses(responses) {
    // Check Single-Choice Questions
    for (const q of surveyQuestions.singleChoice) {
        if (!responses[q.id]) {
            showAlert('Please answer all single-choice questions before submitting.', 'danger');
            return false;
        }
    }

    // Check Likert Scale Questions
    for (let i = 0; i < surveyQuestions.likertScale.length; i++) {
        if (!responses['likert_scale'][`likert_${i}`]) {
            showAlert('Please answer all Likert scale items before submitting.', 'danger');
            return false;
        }
    }

    // Comments are optional; no validation needed
    return true;
}

// Function to highlight unanswered questions
function highlightUnanswered(responses) {
    // Highlight Single-Choice Questions
    surveyQuestions.singleChoice.forEach(q => {
        const questionDiv = document.querySelector(`input[name="${q.id}"]`)?.closest('.card');
        if (questionDiv) {
            if (!responses[q.id]) {
                questionDiv.classList.add('border', 'border-danger');
            } else {
                questionDiv.classList.remove('border', 'border-danger');
            }
        }
    });

    // Highlight Likert Scale Questions
    for (let i = 0; i < surveyQuestions.likertScale.length; i++) {
        const likertDiv = document.querySelector(`input[name="likert_${i}"]`)?.closest('.likert-scale');
        if (likertDiv) {
            if (!responses['likert_scale'][`likert_${i}`]) {
                likertDiv.parentElement.classList.add('border-danger');
            } else {
                likertDiv.parentElement.classList.remove('border-danger');
            }
        }
    }
}

// Function to display JSON result
function displayResult(jsonData) {
    const resultElement = document.getElementById('result');
    resultElement.textContent = JSON.stringify(jsonData, null, 2);
}

// Function to handle copy to clipboard
function setupCopyButton() {
    const copyBtn = document.getElementById('copy-btn');
    copyBtn.addEventListener('click', () => {
        const resultElement = document.getElementById('result');
        navigator.clipboard.writeText(resultElement.textContent).then(() => {
            showAlert('Results copied to clipboard!', 'success');
        }).catch(err => {
            showAlert('Failed to copy results. Please try again.', 'danger');
        });
    });
}

// Function to handle form submission
function setupSubmitButton() {
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.addEventListener('click', () => {
        const responses = collectResponses();
        highlightUnanswered(responses);
        if (!validateResponses(responses)) {
            return;
        }

        // Display JSON result
        displayResult(responses);

        // Show copy button
        const copyBtn = document.getElementById('copy-btn');
        copyBtn.style.display = 'inline-block';
    });
}

// Initialize the survey on page load
document.addEventListener('DOMContentLoaded', () => {
    generateSurvey();
    setupSubmitButton();
    setupCopyButton();
});
