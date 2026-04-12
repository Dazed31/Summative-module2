let form = document.getElementById("search-form");
let input = document.getElementById("word-input");
let result = document.getElementById("result");


form.addEventListener("submit", function(e){
    e.preventDefault();

    let word = input.value.trim();

    if (word === ""){
        result.innerHTML = "<p>Please enter a word</p>"
        return;
    }

    fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word)
      .then(function(res){
        return res.json();
      })

      .then(function(data){
         
        let wordData = data[0];
        let meaning = wordData.meanings[0];
        let definitionData = meaning.definitions[0];
        let definition = definitionData.definition;
        let part = meaning.partOfSpeech;

        let example;

        if(definitionData.example){
            example = definitionData.example;
        } else {
            example = " No example available";
        }

        result.innerHTML = `
           <h2>${word}</h2>
           <p><strong>Part of Speech: </strong>${part}</p>
           <p><strong>Definition: </strong>${definition}</p>
           <p><strong>Example: </strong>${example}</p>
        `;
      })
      .catch(function(){
        result.innerHTML = "<p>Word not found</p>"
      });

});