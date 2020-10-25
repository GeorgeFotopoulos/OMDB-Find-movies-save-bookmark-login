var typingTimer; //timer identifier
var doneTypingInterval = 1000; //time in ms, 1 second for example
var $searchInput = $('#searchText');
var poster_img;
var popup;
var textToShow;
var manage_btn;

//on keyup, start the countdown
$searchInput.on('keyup', function() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
});
var session;
const log_btn = document.getElementById("log");
window.onload = function() {
    session = localStorage.getItem("session");
    if (!this.isEmpty(session)) {
        $.ajax({
            type: 'GET',
            url: '/session/' + session,
            success: function(response) {
                if (response === "true") {
                    const welcome_message = document.getElementById("welcome_message").innerHTML = "User: " + session;
                    log_btn.innerHTML = "Logout";
                } else {
                    localStorage.setItem("session", "");
                    session = localStorage.getItem("session");
                }
            }
        });
    }
}

log_btn.addEventListener('click', clickDiv);

function clickDiv() {
    if (log_btn.innerHTML === "Logout") {
        localStorage.setItem("session", "");
    }
    window.location.replace("login.html");
}

// on keydown, clear the countdown
$searchInput.on("keydown", function() {
    clearTimeout(typingTimer);
});

// user is "finished typing," do something
function doneTyping() {
    let searchText = $('#searchText').val();
    getMovies(searchText);
}

function getMovies(searchText) {
    $.get('http://www.omdbapi.com?apikey=78307739&s=' + searchText)
        .then((rawdata) => {
            var rawstring = JSON.stringify(rawdata);
            var data = JSON.parse(rawstring);
            var movies = data.Search
            let output = '';
            $.each(movies, (index, movie) => {
                var imageSrc;
                if (movie.Poster == "N/A") {
                    imageSrc = "../no_result.png";
                } else {
                    imageSrc = movie.Poster;
                }
                output += `
          <div class="col-md-3">
            <div class="well text-center">
              <img id="test${index}" src="${imageSrc}">
              <h2>${movie.Title}</h2>
              <a onclick="movieSelected('${movie.imdbID}')" class="collapsible" href="#">Movie Details</a>
              <div class="moreinfo"></div>
              <hr>
            </div>
          </div>
        `;
            });
            $('#movies').html(output);
        })
        .catch((err) => {
            console.log(err);
        });
}

function movieSelected(id) {
    sessionStorage.setItem("movieId", id);
    getMovie();
}

function getMovie() {
    let movieId = sessionStorage.getItem('movieId');
    $.get('http://www.omdbapi.com?apikey=78307739&i=' + movieId)
        .then((rawdata) => {
            var rawstring = JSON.stringify(rawdata);
            var data = JSON.parse(rawstring);
            var movie = data;
            var imageSrc;
            if (movie.Poster == "N/A") {
                imageSrc = "../no_result.png";
            } else {
                imageSrc = movie.Poster;
            }
            let output = `
            <img src="${imageSrc}">
            <h2>${movie.Title}</h2>
              <ul class="list-group" style="padding-left: 13px;">
                <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
                <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
                <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
                <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
                <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
                <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
                <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
              </ul>
            <div class="well2">
              <h3>Plot</h3>
              ${movie.Plot}
              <br><br>
              <div class="popup">
                <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="imdbLink">View IMDB</a><br>
                    <span class="popuptext" id="myPopup"><p id="textToShow"></p></span>
              </div>
                <div id="manageBookmarks">Add to Bookmarks</div>
                
            </div>     
        `;
            $('.moreInfo').html(output);
            manage_btn = document.getElementById("manageBookmarks");
            manage_btn.addEventListener('click', manageBookmarks);

            checkifadded(movieId);

            function manageBookmarks() {
                popup = document.getElementById("myPopup");
                textToShow = document.getElementById("textToShow");
                if (!isEmpty(localStorage.getItem("session"))) {
                    if (manage_btn.textContent === "Add to Bookmarks") {
                        addMovie(movieId);
                    } else if (manage_btn.textContent === "Remove from Bookmarks") {
                        removeMovie(movieId)
                    }
                } else {
                    textToShow.innerHTML = "You have to login to add movies in your bookmarks!";
                    popup.style.borderTopColor = "red";
                    popup.classList.toggle("show");
                    setTimeout(function() {
                        popup.classList.toggle("show");
                    }, 3000);
                }
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

function checkifadded(movieId) {
    const manage_btn = document.getElementById("manageBookmarks");
    if (!this.isEmpty(session)) {
        $.ajax({
            type: 'GET',
            url: '/session/' + session + "/" + movieId,
            success: function(response) {
                if (response === "tobeadded") {
                    manage_btn.innerHTML = "Add to Bookmarks";
                } else {
                    manage_btn.innerHTML = "Remove from Bookmarks";
                }
            }
        });
    }
}

function addMovie(movieId) {
    $.ajax({
        type: "POST",
        url: "/" + session + "/addBookmark",
        data: movieId,
        contentType: 'application/json',
        dataType: "text",
        error: function(response) {
            alert("Connection with the server failed!");
        },
        success: function(response) {
            if (response === "Success") {
                textToShow.innerHTML = "Movie added to Bookmarks!";
                popup.style.borderTopColor = "green";
                manage_btn.innerHTML = "Remove from Bookmarks";
                popup.style.borderTopColor = "green";
                popup.classList.toggle("show");
                setTimeout(function() {
                    popup.classList.toggle("show");
                }, 3000);
            } else if (response === "AlreadyExists") {
                alert("Movie already exists in your bookmarks");
            }
        }
    });
}

function removeMovie(movieId) {
    $.ajax({
        type: "DELETE",
        url: "/" + session + "/removeBookmark",
        data: movieId,
        contentType: 'application/json',
        dataType: "text",
        error: function(response) {
            alert("Connection with the server failed!");
        },
        success: function(response) {
            if (response === "success") {
                textToShow.innerHTML = "Movie removed from Bookmarks!";
                popup.style.borderTopColor = "red";
                manage_btn.innerHTML = "Add to Bookmarks";
                popup.style.borderTopColor = "red";
                popup.classList.toggle("show");
                setTimeout(function() {
                    popup.classList.toggle("show");
                }, 3000);
            } else if (response === "failure") {
                alert("Something went wrong!");
            }
        }
    });
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}