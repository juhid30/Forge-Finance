const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelecto111r(".close-btn")

let userMessage;
const API_KEY = "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";
const inputIniHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class = material-symbols-outlined> smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    //this results in the text being displayed as a paragraph regardless of whether it contains html tags
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST", 
        headers: {
            "Content-type" : "application/json", 
            "Authorization" : `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
           model : "gpt-3.5-turbo",
           messages : [{role: "user", content: userMessage}]  
        })
    }

    //send POST request to the API, get response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choice[0].message.content;
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value ="";
    chatInput.style.height = `${inputIniHeight}px`;

    //appending the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    //adding autoflow if the chat is overflowing
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Generating...", "incoming"); 
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);   
        generateResponse(incomingChatLi);
    }, 600);
}


chatInput.addEventListener("input", () => {
    //adjusting height of textarea 
    chatInput.style.height = `${inputIniHeight}px`; 
    chatInput.style.height = `${chatInput.scrollHeight}px`; 
});


chatInput.addEventListener("keydown", () => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth> 800)
    {
        e.preventDefault();
        handleChat();
    }
});

chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
sendChatBtn.addEventListener("click", handleChat);