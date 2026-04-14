let form = document.getElementById("search-term");
let input = document.getElementById("word-input");
let result = document.getElementById("result");

let toggleBtn = document.getElementById("toggle-theme");
let spinner = document.getElementById("spinner");

// theme toggle 
toggleBtn.addEventListener("click", function () {
    if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
        document.body.classList.add("light");
    } else {
        document.body.classList.remove("light");
        document.body.classList.add("dark");
    }
});

// form submit
form.addEventListener("submit", function (e) {
    e.preventDefault();

    let word = input.value.trim();

    if (word === "") {
        result.innerHTML = "<p>please enter a word</p>";
        return;
    }

    spinner.style.display = "block";
    result.innerHTML = "";

    fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word)
        .then(function (res) {
            if (!res.ok) {
                throw new Error("word not found");
            }
            return res.json();
        })
        .then(function (data) {

            let wordData = data[0];
            let meaning = wordData.meanings[0];
            let def = meaning.definitions[0];

            let definition = def.definition;
            let part = meaning.partOfSpeech;

            let example = def.example ? def.example : "no example found";

            let audio = "";
            if (wordData.phonetics && wordData.phonetics[0] && wordData.phonetics[0].audio) {
                audio = `<audio controls src="${wordData.phonetics[0].audio}"></audio>`;
            }

            result.innerHTML =
                "<h2>" + word + "</h2>" +
                "<p><b>part of speech:</b> " + part + "</p>" +
                "<p><b>definition:</b> " + definition + "</p>" +
                "<p><b>example:</b> " + example + "</p>" +
                audio;

        })
        .catch(function (err) {
            result.innerHTML = "<p>" + err.message + "</p>";
        })
        .finally(function () {
            spinner.style.display = "none";
        });

    input.value = "";
});