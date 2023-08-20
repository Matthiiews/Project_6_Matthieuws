const mainUrl = "http://localhost:8000/api/v1/titles/"


// Carrousel controls

function moveCarrouselLeft(category) {

  let carrouselContent = document.querySelector("#" + category + "-movies");
  let carrouselLeftBtn = document.querySelector("#" + category + "-left");
  let carrouselRightBtn = document.querySelector("#" + category + "-right");
  let carrouselBtn = document.querySelector(".btn." + category);
    
  carrouselContent.style.left = "0px";
  carrouselRightBtn.classList.add("show");
  carrouselLeftBtn.classList.remove("show");
  carrouselBtn.style.left = "0"; // Move the button to the left
     
}

function moveCarrouselRight(category) {

  let carrouselContent = document.querySelector("#" + category + "-movies");
  let carrouselLeftBtn = document.querySelector("#" + category + "-left");
  let carrouselRightBtn = document.querySelector("#" + category + "-right");
  let carrouselBtn = document.querySelector(".btn." + category);

  carrouselContent.style.left = "-680px";
  carrouselRightBtn.classList.remove("show");
  carrouselLeftBtn.classList.add("show");
  carrouselBtn.style.left = "680"; // Move the button to the right
}



// Fetch data

function fetchBestMovie() {

	let bestTitle = document.getElementById('top-title');
	let bestImg = document.getElementsByClassName('best-cover')[0].getElementsByTagName("img")[0];

	fetch(mainUrl + "?sort_by=-imdb_score")
	.then(response => response.json())
	.then(data => {
    bestTitle.innerHTML = data["results"][0]["title"];
		bestImg.src = data["results"][0]["image_url"];
    bestImg.id = data["results"][0]["id"];

    let url = data["results"][0]["url"];
    fetchBestDescription(url)
	})
}

function fetchBestDescription(url) {

  let bestDesc = document.getElementsByClassName('best-desc')[0];

  fetch(url)
	.then(response => response.json())
	.then(data => {
    bestDesc.innerHTML = data["description"];
	})
}

function fetchCategories(category) {

  let urlPage1 = mainUrl + "?sort_by=-imdb_score&genre=" + category;
  let urlPage2 = mainUrl + "?sort_by=-imdb_score&genre=" + category + "&page=2";

  fetch(urlPage1)
  .then(response => response.json())
  .then(data => {
    let dataPage1 = data["results"];

    fetch(urlPage2)
    .then(response => response.json())
    .then(data => {
      let dataPage2 = data["results"];
      let dataAll = dataPage1.concat(dataPage2);

      if (category == '')
        dataAll.shift();   // for best-rated category, skip first movie

      for (i=0; i<7; i++) {
        let movieCover = dataAll[i]["image_url"];
        let movieTitle = dataAll[i]["title"];
        let movieId = dataAll[i]["id"];
        let currentMovieTitle = document.getElementById(category + (i+1).toString()).getElementsByTagName("p")[0];
        let currentMovieCover = document.getElementById(category + (i+1).toString()).getElementsByTagName("img")[0];
            
        currentMovieCover.src = movieCover;
        currentMovieCover.id = movieId;
        currentMovieTitle.innerHTML = movieTitle;
      }
    })
  })
}



// Modal control and fetch data

function openModal(category, num) {
  
  let modal = document.getElementById("modal");
  let span = document.getElementsByClassName("close")[0];

  let modalId = document.querySelector(`#${category}${num}`).getElementsByTagName("img")[0].id;

  fetchModalData(modalId)

  modal.style.display = "block";

  span.addEventListener('click', function() {
    modal.style.display = "none";
  });

  window.addEventListener =('click', function(event) {
    if (event.target == modal)
      modal.style.display = "none";
  });
}

function fetchModalData(id) {

	fetch(mainUrl + id)
	.then(response => response.json())
	.then(data => {

    document.getElementById('modal-cover').src = data["image_url"];
		document.getElementById('modal-title').innerHTML = data["title"];

    document.getElementById('modal-year').innerHTML = data["year"];
    document.getElementById('modal-duration').innerHTML = data["duration"] + " min";
    document.getElementById('modal-genres').innerHTML = data["genres"];
    document.getElementById('modal-imdb').innerHTML = data["imdb_score"] + " / 10";

    document.getElementById('modal-directors').innerHTML = data["directors"];
    document.getElementById('modal-cast').innerHTML = data["actors"] + "...";
    document.getElementById('modal-country').innerHTML = data["countries"];


    if (typeof data["rated"] === 'string' || data["rated"] instanceof String)
      document.getElementById('modal-rating').innerHTML = data["rated"];
    else
      document.getElementById('modal-rating').innerHTML = data["rated"] + "+";  // add "+" if age rating is a number

    let modalBoxOffice = document.getElementById('modal-box-office');
    if (data["worldwide_gross_income"] == null)
      modalBoxOffice.innerHTML = "N/A";  // placeholder for unspecified box-office   
    else 
      modalBoxOffice.innerHTML = data["worldwide_gross_income"] + " " + data["budget_currency"];

    let regExp = /[a-zA-Z]/g;
    if (regExp.test(data["long_description"]))
      document.getElementById('modal-desc').innerHTML = data["long_description"]; 
    else
      document.getElementById('modal-desc').innerHTML = "N/A";  // placeholder for missing description
    
	})
}

// Event listeners for carrousel buttons

document.querySelector("#best-left").addEventListener('click', function() {
  moveCarrouselLeft('');
});

document.querySelector("#best-right").addEventListener('click', function() {
  moveCarrouselRight('');
});

document.querySelector("#action-left").addEventListener('click', function() {
  moveCarrouselLeft('action');
});

document.querySelector("#action-right").addEventListener('click', function() {
  moveCarrouselRight('action');
});

document.querySelector("#history-left").addEventListener('click', function() {
  moveCarrouselLeft('history');
});

document.querySelector("#history-right").addEventListener('click', function() {
  moveCarrouselRight('history');
});

document.querySelector("#fantasy-left").addEventListener('click', function() {
  moveCarrouselLeft('fantasy');
});

document.querySelector("#fantasy-right").addEventListener('click', function() {
  moveCarrouselRight('fantasy');
});


// Initial fetch calls

fetchCategories('')
fetchCategories('horror')
fetchCategories('history')
fetchCategories('romance')

fetchBestMovie()