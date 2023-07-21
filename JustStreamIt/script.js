const mainUrl = "http://localhost:8000/api/v1/titles/";

// Function to perform a Fetch query
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Error while recovering data.");
    }
    return await response.json();
}

// Best Movie
async function fetchBestMovie() {
    try {
        const data = await fetchData(mainUrl + "?sort_bye=-imdb_score");
        const bestMovie = data.results[0];

        const bestTitle = document.getElementById('top-title');
        bestTitle.innerHTML = bestMovie.title;

        const bestImg = document.querySelector('.best-cover img');
        bestImg.src = bestMovie.image_url;

        const bestDesc = document.querySelector('.best-desc');
        const movieData = await fetchData(bestMovie.url);
        bestDesc.innerHTML = movieData.description;

        const bestButton = document.getElementsByClassName('button')[1];
        bestButton.setAttribute("onclick", `openModal("$(bestMovie.id)")`);
    }   catch (error) {
        console.error("Error while recovering best movie:", error);
    }
}  
  
// Modal control and fetch data
function openModal(id) {
    const modal = document.getElementById("modal");
    const span = document.getElementsByClassName("close")[0];
    fetchModalData(id);
    
    modal.style.display = "block";

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
}

async function fetchModalData(id) {
    try {
        const data = await fetchData(mainUrl + id);

        document.getElementById('modal-cover').src = data.image_url;
        document.getElementById('modal-title').innerHTML = data.title;
        document.getElementById('modal-year').innerHTML = data.year;
        document.getElementById('modal-duration').innerHTML = `${data.duration} min`;
        document.getElementById('modal-genres').innerHTML = data.genres.join(', ');
        document.getElementById('modal-imdb').innerHTML = `${data.imdb_score} / 10`;
        document.getElementById('modal-directors').innerHTML = data.directors.join(', ');
        document.getElementById('modal-cast').innerHTML = data.actors.join(', ') + "...";
        document.getElementById('modal-country').innerHTML = data.countries;

        if (typeof data.rated === 'string') {
            document.getElementById('modal-rating').innerHTML = data.rated;
        } else {
            document.getElementById('modal-rating').innerHTML = data.rated + "+"; // add "+" if age rating is a number
        }

        const modalBoxOffice = document.getElementById('modal-box-office');
        if (data["worldwide_gross_income"] == null) {
            modalBoxOffice.innerHTML = "N/A"; // Placeholder for unspecified bax-office
        } else {
            modalBoxOffice.innerHTML = `${data.worldwide_gross_income} + " " + ${data.budget_currency}`;
        }
            
        const regExp = /[a-zA-Z]/g;
        if (regExp.test(data.long_description)) {
            document.getElementById('modal-desc').innerHTML = data.long_description;
        } else {
            document.getElementById('modal-desc').innerHTML = "N/A"; // Placeholder for missing description
        }
    } catch (error) {
        console.error("Error while retrieving modal data:", error);
    }
}

// Categories
async function fetchCategories(name, skip, total = 7) {
    try {
        const data = await fetchData(mainUrl + "?sort_by=-imdb_score&genre=" + name);

        const moviesData = data.results.slice(skip, skip + total);
        if (moviesData.length < total && data.next) {
            const nextData = await fetchData(data.next);
            moviesData.push(...nextData.results.slice(0, total - moviesData.length));
        }

        return moviesData;
    } catch (error) {
        console.error("Error while retrieving categories:", error);
        return[];
    }
}

// Carousel controls
