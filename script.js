let BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

let form = document.getElementById("search-term");
let input = document.getElementById("word-input");
let result = document.getElementById("result");

let synonymsBox = document.getElementById("synonyms");
let savedList = document.getElementById("saved-words");

let wotdWord = document.getElementById("wotd-word");
let wotdDef = document.getElementById("wotd-def");

let loading = document.getElementById("loading");

/* ---------------- THEME ---------------- */
document.getElementById("theme-toggle").addEventListener("click", function () {
    document.body.classList.toggle("dark");
});

/* ---------------- LOADING ---------------- */
function showLoading() {
    loading.classList.remove("hidden");
}

function hideLoading() {
    loading.classList.add("hidden");
}

/* ---------------- WORD OF THE DAY ---------------- */
let words = ["happy", "focus", "dream", "brave", "create"];

function getWordOfDay() {
    let random = Math.floor(Math.random() * words.length);
    let word = words[random];

    fetch(BASE_URL + word)
        .then(res => res.json())
        .then(data => {
            wotdWord.textContent = word;
            wotdDef.textContent = data[0].meanings[0].definitions[0].definition;
        });
}

getWordOfDay();

/* ---------------- SEARCH ---------------- */
form.addEventListener("submit", function (e) {
    e.preventDefault();

    let word = input.value.trim();
    result.innerHTML = "";

    if (word === "") {
        result.innerHTML = "<p>Please enter a word</p>";
        return;
    }

    showLoading();

    fetch(BASE_URL + word)
        .then(res => {
            if (!res.ok) throw new Error("Word not found");
            return res.json();
        })
        .then(data => {

            hideLoading();

            let wordData = data[0];
            let meaning = wordData.meanings[0];
            let def = meaning.definitions[0];

            let definition = def.definition;
            let part = meaning.partOfSpeech;

            let example;

            if (def.example) {
                example = def.example;
            } else {
                example = "No example available";
            }

            /* AUDIO */
            let audio = "";
            if (wordData.phonetics && wordData.phonetics[0] && wordData.phonetics[0].audio) {
                audio = `<audio controls src="${wordData.phonetics[0].audio}"></audio>`;
            }

            /* SYNONYMS */
            let synonyms = "No synonyms available";
            if (meaning.synonyms && meaning.synonyms.length > 0) {
                synonyms = meaning.synonyms.join(", ");
            }

            synonymsBox.textContent = synonyms;

            result.innerHTML =
                "<h2 class='clickable'>" + word + "</h2>" +
                "<p><strong>Part of Speech:</strong> " + part + "</p>" +
                "<p><strong>Definition:</strong> " + definition + "</p>" +
                "<p><strong>Example:</strong> " + example + "</p>" +
                audio;

            saveWord(word);
            enableClick(word);

        })
        .catch(() => {
            hideLoading();
            result.innerHTML = "<p>Word not found</p>";
        });
});

/* ---------------- CLICK WORD TO RESEARCH ---------------- */
function enableClick(word) {
    let h2 = document.querySelector(".clickable");

    if (h2) {
        h2.style.cursor = "pointer";

        h2.addEventListener("click", function () {
            input.value = word;
            form.dispatchEvent(new Event("submit"));
        });
    }
}

/* ---------------- SAVE WORDS ---------------- */
function saveWord(word) {
    let saved = JSON.parse(localStorage.getItem("words")) || [];

    if (!saved.includes(word)) {
        saved.push(word);
        localStorage.setItem("words", JSON.stringify(saved));
        displaySaved();
    }
}

function displaySaved() {
    let saved = JSON.parse(localStorage.getItem("words")) || [];

    savedList.innerHTML = "";

    saved.forEach(word => {
        let li = document.createElement("li");
        li.textContent = word;

        li.addEventListener("click", function () {
            input.value = word;
        });

        savedList.appendChild(li);
    });
}

displaySaved();