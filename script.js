document.getElementById("predictionForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const button = document.querySelector("button");
    button.disabled = true;
    button.innerText = "Processing...";

    const data = {
        age: document.getElementById("age").value,
        sex: document.getElementById("sex").value,
        cp: document.getElementById("cp").value,
        trestbps: document.getElementById("trestbps").value,
        chol: document.getElementById("chol").value,
        fbs: document.getElementById("fbs").value,
        restecg: document.getElementById("restecg").value,
        thalach: document.getElementById("thalach").value,
        exang: document.getElementById("exang").value,
        oldpeak: document.getElementById("oldpeak").value,
        slope: document.getElementById("slope").value,
        ca: document.getElementById("ca").value,
        thal: document.getElementById("thal").value
    };

    const card = document.getElementById("resultCard");
    const text = document.getElementById("resultText");
    const icon = document.getElementById("icon");
    const progress = document.getElementById("progressFill");
    const aiBox = document.getElementById("aiBox");

    card.classList.add("show");
    text.innerHTML = "Analyzing...";
    icon.innerHTML = "⏳";
    progress.style.width = "50%";
    aiBox.innerHTML = "<p>Generating AI explanation...</p>";

    fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {

            card.classList.remove("green", "red");

            if (result.result.toLowerCase().includes("Possibility chances of heart disease. Please evaluate with doctor.")) {
                card.classList.add("red");
                icon.innerHTML = "⚠️";
                progress.style.width = "85%";
            } else {
                card.classList.add("green");
                icon.innerHTML = "❤️";
                progress.style.width = "30%";
            }

            text.innerHTML = result.result;

            // ✅ FORMAT AI RESPONSE
            function formatAI(text) {
                return text
                    .replace(/Reason:/g, "<h3>Reason</h3>")
                    .replace(/Risk Factors:/g, "<h3>Risk Factors</h3>")
                    .replace(/Advice:/g, "<h3>Advice</h3>")
                    .replace(/- /g, "• ")
                    .replace(/\n/g, "<br>");
            }

            aiBox.innerHTML = `
            <h2>🧠 AI Health Analysis</h2>
            <div class="ai-content">
                ${formatAI(result.ai_response)}
            </div>
        `;

        })
        .catch(error => {
            console.error("Error:", error);

            text.innerHTML = "Something went wrong!";
            icon.innerHTML = "❌";
            progress.style.width = "0%";
            aiBox.innerHTML = "<p>Please try again later.</p>";
        })
        .finally(() => {
            button.disabled = false;
            button.innerText = "Predict";
        });
});