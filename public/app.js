const chat = document.getElementById("chat");
const input = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");

function addMessage(text, who) {
  const div = document.createElement("div");
  div.className = who;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  addMessage("ভাবছি... 🤔", "ai");
  const thinking = chat.lastChild;

  try {
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message})
    });

    const data = await r.json();
    thinking.textContent = data.reply || "দুঃখিত, উত্তর দিতে পারিনি।";

    if (data.reply && "speechSynthesis" in window) {
      speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(data.reply);
      speech.lang = "bn-BD";
      speechSynthesis.speak(speech);
    }
  } catch (e) {
    thinking.textContent = "সংযোগে সমস্যা হয়েছে।";
  }
}

sendBtn.onclick = sendMessage;

input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

if ("webkitSpeechRecognition" in window) {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "bn-BD";

  voiceBtn.onclick = () => {
    recognition.start();
    voiceBtn.textContent = "🔴";
  };

  recognition.onresult = e => {
    input.value = e.results[0][0].transcript;
    voiceBtn.textContent = "🎤";
    sendMessage();
  };

  recognition.onend = () => {
    voiceBtn.textContent = "🎤";
  };
} else {
  voiceBtn.onclick = () => alert("এই ব্রাউজারে ভয়েস ইনপুট সাপোর্ট নেই।");
}
