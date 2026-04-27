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
        const toolsUsed = data.toolsUsed;
        const sources = data.sources
        addMessage(serverResponse, 'server');

        if (toolsUsed && toolsUsed.length > 0) {
            addMessage(`🔧 Used tools: ${toolsUsed.join(', ')}`, 'server');
        }
        if (sources && sources.length > 0) {
            addMessage(`📄 Sources found: ${sources.join(', ')}`, 'server');
        }

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

    if (sender === 'user') {
        messageElement.className = 'flex justify-end';
        messageElement.innerHTML = `
            <div class="bg-amber-600/80 border border-amber-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-sm max-w-[75%]">
                ${text}
            </div>`;
    } else {
        messageElement.className = 'flex justify-start';
        messageElement.innerHTML = `
            <div class="border border-slate-600 bg-black/60 backdrop-blur-sm text-white/90 text-sm px-4 py-2.5 rounded-2xl rounded-bl-sm max-w-[75%]">
                ${text}
            </div>`;
    }

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}