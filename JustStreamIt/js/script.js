// Source de données URL API

const mainUrl = "http://localhost:8000/api/v1/titles/";

// Récupérer les données

function fetchBestMovie() {
  let bestTitle = document.getElementById("top-title");
  let bestImg = document
    .getElementsByClassName("best-cover")[0]
    .getElementsByTagName("img")[0];
  let bestMoreBtn = document
  .getElementsByClassName("overlay_button")[1];
  

  fetch(mainUrl + "?sort_by=-imdb_score")
    .then((response) => response.json())
    .then((data) => {
      bestTitle.innerHTML = data["results"][0]["title"];
      bestImg.src = data["results"][0]["image_url"];
      bestImg.id = data["results"][0]["id"];
      bestMoreBtn.id = data["results"][0]["id"];
      let url = data["results"][0]["url"];
      fetchBestDescription(url);
    });
}

function fetchBestDescription(url) {
  let bestDesc = document.getElementsByClassName("best-desc")[0];

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      bestDesc.innerHTML = data["description"];
    });
}

function fetchCategories(category) {
  let urlPage1 = mainUrl + "?sort_by=-imdb_score&genre=" + category;
  let urlPage2 = mainUrl + "?sort_by=-imdb_score&genre=" + category + "&page=2";

  fetch(urlPage1)
    .then((response) => response.json())
    .then((data) => {
      let dataPage1 = data["results"];

      fetch(urlPage2)
        .then((response) => response.json())
        .then((data) => {
          let dataPage2 = data["results"];

          let dataAll = dataPage1.concat(dataPage2);

          if (category == "") dataAll.shift(); // Pour la catégorie des meilleurs films, sauter le premier film

          for (i = 0; i < 7; i++) {
            let movieCover = dataAll[i]["image_url"];
            let movieTitle = dataAll[i]["title"];
            let movieId = dataAll[i]["id"];
            let currentMovieTitle = document
              .getElementById(category + (i + 1).toString())
              .getElementsByTagName("p")[0];
            let currentMovieCover = document
              .getElementById(category + (i + 1).toString())
              .getElementsByTagName("img")[0];
            let currentMovieMoreBtn = document
              .getElementById(category + (i + 1).toString())
              .getElementsByClassName("overlay_button")[1];

            currentMovieCover.src = movieCover;
            currentMovieCover.id = movieId;
            currentMovieTitle.innerHTML = movieTitle;
            currentMovieMoreBtn.id = movieId;
          }
        });
    });
}

function fetchModalData(id) {

  let jobDone = true; // valeur retounée indiquant qu'un résultat à été trouvé ou non
  
  fetch(mainUrl + id)
    .then((response) => response.json())
    .then((data) => {    
      
      document.getElementById("modal-cover").src = data["image_url"];
      document.getElementById("modal-title").innerHTML = data["title"];

      document.getElementById("modal-year").innerHTML = data["year"];
      document.getElementById("modal-duration").innerHTML =
        data["duration"] + " min";
      document.getElementById("modal-genres").innerHTML = data["genres"];
      document.getElementById("modal-imdb").innerHTML =
        data["imdb_score"] + " / 10";

      document.getElementById("modal-directors").innerHTML = data["directors"];
      document.getElementById("modal-cast").innerHTML = data["actors"] + "...";
      document.getElementById("modal-country").innerHTML = data["countries"];

      if (typeof data["rated"] === "string" || data["rated"] instanceof String)
        document.getElementById("modal-rating").innerHTML = data["rated"];
      else
        document.getElementById("modal-rating").innerHTML = data["rated"] + "+"; // Ajouter "+" si l'âge est un nombre

      let modalBoxOffice = document.getElementById("modal-box-office");
      if (data["worldwide_gross_income"] == null)
        modalBoxOffice.innerHTML = "N/A"; // espace réservé pour le box-office non spécifié
      else
        modalBoxOffice.innerHTML =
          data["worldwide_gross_income"] + " " + data["budget_currency"];

      let regExp = /[a-zA-Z]/g;
      if (regExp.test(data["long_description"]))
        document.getElementById("modal-desc").innerHTML =
          data["long_description"];
      else document.getElementById("modal-desc").innerHTML = "N/A"; // Remplaçant de la description manquante
     
    });

    return jobDone;
}

function hasClass(listOfClasses, searchedClass) {
  /*  Paramètre 1: liste de classes
      Paramètre 2: classe rechechée
      fonction : renvoie vraie si la liste de classe passée en paramètre contient la classe recherchée en paramètre
   */
  let searchResult = false;
  if (listOfClasses) {
    let lstClss = listOfClasses.split(" ");
    if (lstClss.length > 0 && searchedClass !== "") {
      for (let i = 0; i < lstClss.length; i++) {
        if (lstClss[i] == searchedClass) {
           //console.info(lstClss[i]);
          searchResult = true;
          break;
        } else {
          // console.info(lstClss[i]);
          // console.info(searchedClass);
          // console.info(false);
        }
      }
    }
  }

  return searchResult;
}

function setCarouselsSildes() {
  // Récupération de tous les champs carrousel disposant de la classe carousel-container
  let carouselFields = document.getElementsByClassName("carrousel--container");

  // Variables utiles
  let carouselField;
  let leftPedale;
  let rightPedale;
  let content;
  let listClass;

  if (carouselFields.length > 0) {
    // si oui des élément HTML ayant la classe carousel-container ont été récupérés

    for (let i = 0; i < carouselFields.length; i++) {
      // parcours pour le traitement des champs un par un

      // Récupération de chaque occurence de champ carousel
      carouselField = carouselFields[i];
      //Espion : console.info(carouselField);

      if (carouselField.childNodes.length > 0) {
        // vérifie si OUI l'occurance de champs carousel récupérée possède des éléments fils
        //Espion : console.info("got child!!!");

        for (let j = 0; j < carouselField.childNodes.length; j++) {
          // Parcours des éléments fils du champ carousel

          //Espion :console.info(carouselField.childNodes[j].className);

          // Récupération de la liste des classe de chaque élément fils du champ carousel
          listClass = carouselField.childNodes[j].className;

          if (hasClass(listClass, "left")) {
            // Vérifie si Oui l'élement fils du champ carousel en cours  possède la classe 'left' désignant le bouton left du carousel
            // dans lequel cas on doit lui ajouter un écouteur dévènement qui déclenchera le déplacement à gauche du champ carousel
            leftPedale = carouselField.childNodes[j];
            // console.info(leftPedale);
          } else if (hasClass(listClass, "right")) {
            // Vérifie si Oui l'élement fils du champ carousel en cours  possède la classe 'right' désignant le bouton right du carousel
            // dans lequel cas on doit lui ajouter un écouteur dévènement qui déclenchera le déplacement à droite du champ carousel
            rightPedale = carouselField.childNodes[j];
            //console.info(rightPedale);
          }
        }

        if (
          leftPedale !== "undefined" &&
          leftPedale !== "null" &&
          rightPedale !== "undefined" &&
          rightPedale !== "null"
        ) {
          // vérifie si nous disposons effectivement de deux boutons gauche et droite d'un champ carousel

          //Ajout de l'écouteur d'évenements click sur la pédale gauche
          document.getElementById(leftPedale.id).addEventListener("click", function (event) {
           
            // récupération de la DIV parent du bouton gauche su lequel le click a eu lieu
            let lbtnclicked = document.getElementById(event.target.id);
            let rbtnstby;
            let parentDiv = lbtnclicked.parentNode;
            if (parentDiv.childNodes.length > 0) {
             
              // Parcours des éléments fils
              for (let s = 0; s < parentDiv.childNodes.length; s++) {

                // Pour chaque élément fils récupérer la liste des classes
                listClass = parentDiv.childNodes[s].className;

                //Récupérer le bouton droit par la class right
                if(hasClass(listClass, "right")){
                    rbtnstby = parentDiv.childNodes[s];

                }else if(hasClass(listClass, "carrousel--content")){
                    // Récupérer le contenu à coulisser par la classe carrousel--content
                    content = parentDiv.childNodes[s];
                }
              }

              if(rbtnstby !== "undefined" && rbtnstby !== "null" && content !== "undefined" && content !== "null"){
                  // Application de l'animation de coulissement
                  let divLeftXCoord = content.style.left; // Récupération de la marge gauche du champ à coulisser

                  //console.log("left :"+divLeftXCoord);
                
                  if(divLeftXCoord  == 0 || divLeftXCoord == "" || divLeftXCoord == "0px"){
                    document.getElementById(lbtnclicked.id).style.display = 'none';
                    
                  }else if( divLeftXCoord == '-270px'){
                    content.style.left = '0px';
                    document.getElementById(lbtnclicked.id).style.display = 'none';                
                
                  }else if(divLeftXCoord == '-540px'){
                    content.style.left = '-270px';
                    
                  }else if (divLeftXCoord == '-675px'){
                    content.style.left = '-540px';
                    document.getElementById(rbtnstby.id).style.display = 'block';
                  }
                  //Espion :console.info(content.style.left.value);
              }            
              
            }
          });

          //Ajout de l'écouteur d'évenements click sur la pédale droite
          document.getElementById(rightPedale.id).addEventListener("click", function (event) {
            // récupération de la DIV parent du bouton gauche su lequel le click a eu lieu
            let rbtnclicked = document.getElementById(event.target.id);
            let lbtnstby;
            let parentDiv = rbtnclicked.parentNode;
            if (parentDiv.childNodes.length > 0) {

              // Parcours des éléments fils
              for (let s = 0; s < parentDiv.childNodes.length; s++) {

                // Pour chaque élément fils récupérer la liste des classes
                listClass = parentDiv.childNodes[s].className;

                //Récupérer le bouton droit par la class right
                if(hasClass(listClass, "left")){
                  lbtnstby = parentDiv.childNodes[s];

                }else if(hasClass(listClass, "carrousel--content")){
                    // Vérifier si la liste des classes contient la classe carousel-content, dans le quel cas
                    //la div serait celle qui contient les éléments -box- du carousel
                    content = parentDiv.childNodes[s];
                }
              }

              if(lbtnstby !== "undefined" && lbtnstby !== "null" && content !== "undefined" && content !== "null"){
                // Application de l'animation de coulissement
                let divLeftXCoord = content.style.left; // to know the left margin
            
                if(divLeftXCoord  == 0 || divLeftXCoord == "" || divLeftXCoord == "0px"){
                  content.style.left = '-270px';
                  document.getElementById(lbtnstby.id).style.display = 'block';
            
                }else if(divLeftXCoord == '-270px'){
                  content.style.left = '-540px';
            
                }else if(divLeftXCoord == '-540px'){
                  content.style.left = '-675px';
                  document.getElementById(rbtnclicked.id).style.display = "none";

                }
              } 

            }
          });
        }
      }
    }
  }
}

// Afficheur modal popup avec contenu vidéo cliqué

function setModalsPopup() {
  // récupération de la fenetre modal par son id
  let modalWindow = document.getElementById("modal-info");

  // récupération du bouton de ferméture de la fenetre modale
  let modalCloseBtn = document.getElementById("modal-close-btn");

  //Ajout de l'écouteur d'évenement click pour fermer la fenetre modale
  modalCloseBtn.addEventListener("click", function (event) {
    modalWindow.style.display = "none";
  });

  // Récupération de tous le boutons munis de la classe  overlay-button
  let allOverlayButtons = document.getElementsByClassName("overlay_button");

  let overlayButton;
  let clsList;
  // Traitement des boutons avec la classe overlay-button ayant la classe show-more
  if (allOverlayButtons.length > 0) {
    for (let i = 0; i < allOverlayButtons.length; i++) {
      // recupération de cahque occurence de bouton ayant la classe overlay-button
      overlayButton = allOverlayButtons[i];
      // extraction de la liste des classes de chaque bouton
      clsList = overlayButton.className;
      // vérification si la classe pup-more fait partie de la liste des classes du bouton
      if (hasClass(clsList, "pup-more")) {
        //oui ce qui confirme que le bouton déclanche l'affichage de la fenetre modal
        // ajout de l'évenement d'ouverture de  la fenetre modal
        overlayButton.addEventListener("click", function (event) {
          let mvId = event.target.id;
          //console.info(mvId);
          //console.info(fetchModalData(mvId));

          if(fetchModalData(mvId) === true){
            modalWindow.style.display = "block";
          }else{
            alert("Cette vidéo ne dispose d'aucune information pour l'instant !");
          }
          
        });
      }
    }
  }
}

// Appels initiaux de recherche

fetchCategories("");
fetchCategories("sci-fi");
fetchCategories("history");
fetchCategories("romance");
fetchBestMovie();
