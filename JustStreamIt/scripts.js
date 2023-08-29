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
};

function moveCarrouselRight(category) {

    let carrouselContent = document.querySelector("#" + category + "-movies");
    let carrouselLeftBtn = document.querySelector("#" + category + "-left");
    let carrouselRightBtn = document.querySelector("#" + category + "-right");
    let carrouselBtn = document.querySelector(".btn." + category);
  
    carrouselContent.style.left = "-680px";
    carrouselRightBtn.classList.remove("show");
    carrouselLeftBtn.classList.add("show");
    carrouselBtn.style.left = "680"; // Move the button to the right
};


// Fetch data : to query fetch and mange data

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
	});
};

function fetchBestDescription(url) {

    let bestDesc = document.getElementsByClassName('best-desc')[0];
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
      bestDesc.innerHTML = data["description"];
    });
};

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
            };
        });
    });
};

// Modal control and fetch data

// function openModal(category, num)

// function fetchModalData(id)

// function hasClass(classList, searchedClass)

// function setCarouselsSlides()

// function setModalsPopup() {
//     // récupération de la fenetre modal par son id
//     let modalWindow = document.getElementById('modal-info');
  
//     // récupération du bouton de ferméture de la fenetre modale
//     let modalCloseBtn = document.getElementById('modal-close-btn');
    
//     //Ajout de l'écouteur d'évenement click pour fermer la fenetre modale
//     modalCloseBtn.addEventListener('click',function(event){
//         modalWindow.style.display = 'none';
//     })
  
//     // Récupération de tous le boutons munis de la classe  overlay-button
//     let allOverlayButtons = document.getElementsByClassName('overlay_button');
  
//     let overlayButton ;
//     let clsList;
//     // Traitement des boutons avec la classe overlay-button ayant la classe show-more
//     if (allOverlayButtons.length > 0){
//         for(let i = 0; i < allOverlayButtons.length; i++){
//             // recupération de cahque occurence de bouton ayant la classe overlay-button
//             overlayButton = allOverlayButtons[i];
//             // extraction de la liste des classes de chaque bouton
//             clsList = overlayButton.className;
//             // vérification si la classe pup-more fait partie de la liste des classes du bouton
//             if(hasClass(clsList,'pup-more')){ //oui ce qui confirme que le bouton déclanche l'affichage de la fenetre modal
//                 // ajout de l'évenement d'ouverture de  la fenetre modal
//                 overlayButton.addEventListener('click', function(event){
//                     modalWindow.style.display = 'block';
//                 });
  
            
//             }
//         }
//     }
  
//   }


// // Initial fetch calls

// fetchCategories('');
// fetchCategories('horror');
// fetchCategories('history');
// fetchCategories('romance');
// fetchBestMovie();
