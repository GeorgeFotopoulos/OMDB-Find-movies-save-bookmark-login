const bookmarksErrorMsgHolder = document.getElementById("bookmarks-error-msg-holder");
const bookmarksErrorMsg = document.getElementById("bookmarks-error-msg");
var session;

const log_btn = document.getElementById("log");
log_btn.addEventListener('click', clickDiv);

function clickDiv() {
    if (log_btn.innerHTML === "Logout") {
        localStorage.setItem("session", "");
    }
    window.location.replace("login.html");
}

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
                    bookmarksErrorMsgHolder.style.display = "none";
                    bookmarksErrorMsg.style.display = "none";
                    getBookmarks(session);
                } else {
                    localStorage.setItem("session", "");
                    session = localStorage.getItem("session");
                    bookmarksErrorMsg.style.opacity = 1;
                    this.setTimeout(function() {
                        window.location.replace("login.html");
                    }, 3000);
                }
            }
        });
    } else {
        bookmarksErrorMsg.style.opacity = 1;
        this.setTimeout(function() {
            window.location.replace("login.html");
        }, 3000);
    }
}

function getBookmarks(email) {
    $.ajax({
        type: "GET",
        url: "/" + session + "/bookmarks",
        dataType: "json",
        error: function(response) {
            alert("Something went wrong!");
        },
        success: function(response) {
            var rawstring = JSON.stringify(response);
            var data = JSON.parse(rawstring);
            let output = '';
            if (data.length === 0) {
                bookmarksErrorMsgHolder.style.display = "grid";
                bookmarksErrorMsg.style.display = "flex";
                bookmarksErrorMsg.innerHTML = "Your Bookmarks are currently empty.\nSearch some movies and add them on bookmarks!";
                bookmarksErrorMsg.style.opacity = 1;
            }
            for (var i = 0, size = data.length; i < size; i++) {
                var item = data[i];
                $.get('http://www.omdbapi.com?apikey=78307739&i=' + item)
                    .then((rawdata) => {
                        var rawstring = JSON.stringify(rawdata);
                        var data = JSON.parse(rawstring);
                        var movie = data;
                        output += `
        	            <div class="col-md-3">
        	            <div class="well text-center">
        	            <img src="${movie.Poster}">
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
        	              <h3>Plot</h3>${movie.Plot}
        	              <br><br>
        	              <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="imdbLink">View IMDB</a><br>
        	              <a onclick="movieSelected('${movie.imdbID}')" class="collapsible" href="javascript:;">Remove from Bookmarks</a>
        	            </div> </div> </div> <hr>
        	        `;
                        $('#movies').html(output);
                    });
            }
        }
    });
}

function movieSelected(id) {
    removeMovie(id);
}

function removeMovie(movieId) {
    $.ajax({
        type: "DELETE",
        url: "/" + session + "/removeBookmark",
        data: movieId,
        contentType: 'application/json',
        dataType: "text",
        error: function(response) {
            alert("Something went wrong!");
        },
        success: function(response) {
            if (response === "success") {
                location.reload();
            } else if (response === "failure") {
                alert("Something went wrong!");
            }
        }
    });
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}