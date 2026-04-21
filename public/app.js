const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const submitButton = chatForm.querySelector('button');

const userid = `app name-${crypto.randomUUID()}`;
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userInput = chatInput.value.trim();
    if (!userInput) return;

    addMessage(userInput, 'user');
    chatInput.value = '';
    submitButton.disabled = true;

    try {

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({message: userInput, userid}),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const serverResponse = data.response;
        addMessage(serverResponse, 'server');

    } catch (error) {
        console.error('Error fetching from server:', error);
        addMessage('Sorry, something went wrong. Please try again.', 'server');
    } finally {
        submitButton.disabled = false;
        chatInput.focus();
    }

});

function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
