const mainUrl = "http://localhost:8000/api/v1/titles/";

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
  let bestTitle = document.getElementById("top-title");
  let bestImg = document
    .getElementsByClassName("best-cover")[0]
    .getElementsByTagName("img")[0];

  fetch(mainUrl + "?sort_by=-imdb_score")
    .then((response) => response.json())
    .then((data) => {
      bestTitle.innerHTML = data["results"][0]["title"];
      bestImg.src = data["results"][0]["image_url"];
      bestImg.id = data["results"][0]["id"];

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

          if (category == "") dataAll.shift(); // for best-rated category, skip first movie

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

// Modal control and fetch data

function openModal(category, num) {
  //   let modal = document.getElementById("modal");
  //   let span = document.getElementsByClassName("close")[0];
  //   let modalId = document.querySelector(`#${category}${num}`).getElementsByTagName("img")[0].id;
  //   fetchModalData(modalId)
  //   modal.style.display = "block";
  //   span.addEventListener('click', function() {
  //     modal.style.display = "none";
  //   });
  //   window.addEventListener =('click', function(event) {
  //     if (event.target == modal)
  //       modal.style.display = "none";
  //   });
}

function fetchModalData(id) {
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
        document.getElementById("modal-rating").innerHTML = data["rated"] + "+"; // add "+" if age rating is a number

      let modalBoxOffice = document.getElementById("modal-box-office");
      if (data["worldwide_gross_income"] == null)
        modalBoxOffice.innerHTML = "N/A";
      // placeholder for unspecified box-office
      else
        modalBoxOffice.innerHTML =
          data["worldwide_gross_income"] + " " + data["budget_currency"];

      let regExp = /[a-zA-Z]/g;
      if (regExp.test(data["long_description"]))
        document.getElementById("modal-desc").innerHTML =
          data["long_description"];
      else document.getElementById("modal-desc").innerHTML = "N/A"; // placeholder for missing description
    });
}

// Event listeners for carrousel buttons

// document.querySelector("#best-left").addEventListener('click', function() {
//   moveCarrouselLeft('');
// });

// document.querySelector("#best-right").addEventListener('click', function() {
//   moveCarrouselRight('');
// });

// document.querySelector("#action-left").addEventListener('click', function() {
//   moveCarrouselLeft('action');
// });

// document.querySelector("#action-right").addEventListener('click', function() {
//   moveCarrouselRight('action');
// });

// document.querySelector("#history-left").addEventListener('click', function() {
//   moveCarrouselLeft('history');
// });

// document.querySelector("#history-right").addEventListener('click', function() {
//   moveCarrouselRight('history');
// });

// document.querySelector("#fantasy-left").addEventListener('click', function() {
//   moveCarrouselLeft('fantasy');
// });

// document.querySelector("#fantasy-right").addEventListener('click', function() {
//   moveCarrouselRight('fantasy');
// });

function hasClass(classList, searchedClass) {
  /*  Paramètre 1: liste de classes
      Paramètre 2: classe rechechée
      fonction : renvoie vraie si la liste de classe passée en paramètre contient la classe recherchée en paramètre
   */
  let searchResult = false;
  if (classList) {
    let lstClss = classList.split(" ");
    if (lstClss.length > 0 && searchedClass !== "") {
      for (let i = 0; i < lstClss.length; i++) {
        if (lstClss[i] == searchedClass) {
          // console.info(lstClss[i]);
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
          leftPedale.addEventListener("click", function (event) {
            // récupération de la DIV parent du bouton gauche su lequel le click a eu lieu
            let lbtnclicked = document.getElementById(event.target.id);
            let parentDiv = lbtnclicked.parentNode;
            if (parentDiv.childNodes.length > 0) {
              // Parcours des éléments fils
              for (let s = 0; s < parentDiv.childNodes.length; s++) {
                // Pour chaque élément fils récupérer la liste des classes
                listClass = parentDiv.childNodes[s].className;

                // Vérifier si la liste des classes contient la classe carousel-content, dans le quel cas
                //la div serait celle qui contient les éléments -box- du carousel
                if (hasClass(listClass, "carrousel--content")) {
                  // récupération de la div contenant donc les éléments -box- du champ carousel
                  content = parentDiv.childNodes[s];
                  //Espion : console.info("Requesting to animate from left to right "+content.id) ;

                  // Application de l'animation de coulissement
                  content.animate(
                    {
                      left: "+270px",
                    },
                    {
                      duration: 1000,
                      easing: "ease-in-out",
                      // delay:'',
                      // direction:'',
                      // endDelay:'',
                      // fill:'',
                      // iterationStart:'',
                      // iteration :'',
                      // ...
                    }
                  );
                  //Espion :console.info(content.style.left.value);
                }
              }
            }
          });

          //Ajout de l'écouteur d'évenements click sur la pédale droite
          rightPedale.addEventListener("click", function (event) {
            // récupération de la DIV parent du bouton gauche su lequel le click a eu lieu
            let rbtnclicked = document.getElementById(event.target.id);
            let parentDiv = rbtnclicked.parentNode;
            if (parentDiv.childNodes.length > 0) {
              // Parcours des éléments fils
              for (let s = 0; s < parentDiv.childNodes.length; s++) {
                // Pour chaque élément fils récupérer la liste des classes
                listClass = parentDiv.childNodes[s].className;

                // Vérifier si la liste des classes contient la classe carousel-content, dans le quel cas
                //la div serait celle qui contient les éléments -box- du carousel
                if (hasClass(listClass, "carrousel--content")) {
                  // récupération de la div contenant donc les éléments -box- du champ carousel
                  content = parentDiv.childNodes[s];
                  //Espion : console.info("Requesting to animate from left to right "+content.id) ;

                  // Application de l'animation de coulissement
                  content.animate(
                    {
                      left: "-270px",
                    },
                    {
                      duration: 1000, // number in ms [this would be equiv of your speed].
                      easing: "ease-in-out",
                      // delay:'',
                      // direction:'',
                      // endDelay:'',
                      // fill:'',
                      // iterationStart:'',
                      // iteration :'',
                      // ...
                    }
                  );
                  //Espion : console.info(content.style.right);
                }
              }
            }
          });
        }
      } else {
        // console.info("No child!!!");
      }
    }
  }
}

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
          let mvId = event.id;
          //console.info(mvId);

          modalWindow.style.display = "block";
        });
      }
    }
  }
}

// Initial fetch calls

fetchCategories("");
fetchCategories("action");
fetchCategories("adventure");
fetchCategories("fantasy");
fetchBestMovie();
