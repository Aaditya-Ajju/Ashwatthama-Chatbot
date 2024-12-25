let prompt = document.querySelector("#prompt");
let btn = document.querySelector("#btn");
let chatContainer = document.querySelector(".chat-container");
let userMessage = null;
let container = document.querySelector(".container"); // Select the container with h1 and h2
let Api_Url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyC5Dx7bV9ZvKcILMXGQlD3y-09seJTNILI';

function createChatBox(html, className) {
    let div = document.createElement("div");
    div.classList.add(className);
    div.innerHTML = html;
    return div;
}

async function getApiResponse(aiChatBox) {
    try {
        let response = await fetch(Api_Url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        "role": "user",
                        "parts": [{ text: userMessage }]
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        let apiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!apiResponse) {
            throw new Error("Unexpected response format from API.");
        }

        aiChatBox.querySelector(".text").innerText = apiResponse;
        let loadingGif = aiChatBox.querySelector(".loading");
        if (loadingGif) {
            loadingGif.remove();
        }

    } catch (error) {
        console.log("Error:", error);
        aiChatBox.querySelector(".text").innerText = "Error: Failed to get response.";
    }
}

function showLoading() {
    let html = `<div class="img">
                    <img src="Images/ai-generated-8327396_1920.png" alt="" width="50">
                </div>
                <p class="text">Thinking...</p>
                <img class="loading" src="Images/loading.gif" alt="loading" height="50">`;
    let aiChatBox = createChatBox(html, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);
    getApiResponse(aiChatBox);
}

btn.addEventListener("click", () => {
    userMessage = prompt.value;

    if (!userMessage) {
        // Show the container with h1 and h2 if the input is empty
        container.style.display = "flex";
        return;
    }

    // Hide the container when the user enters a valid message
    container.style.display = "none";

    let html = `<div class="img">
                    <img src="Images/avatar-3637425_1920.png" alt="" width="50">
                </div>
                <p class="text"></p>`;
    let userChatBox = createChatBox(html, "user-chat-box");
    userChatBox.querySelector(".text").innerText = userMessage;
    chatContainer.appendChild(userChatBox);
    prompt.value = "";
    setTimeout(showLoading, 500);
});
