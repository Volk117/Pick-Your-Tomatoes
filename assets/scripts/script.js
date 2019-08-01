//this will hold information to match the movies with their trailers
var trailerArray = [];

//Evan: this function takes user input and gets suggestions from tastedive api
function getSuggestions(searchTerm) {
    //reset everything
    reset();
    //Evan: this holds the number of movies for it to suggest
    var movieLimit = 5;
    //Evan: this grabs the searchterm from the user input
    searchTerm = $(".form-control").val();
    //Evan: the API URL with searchterm and limit
    console.log(searchTerm);
    var queryURL = "https://tastedive.com/api/similar?q=" + searchTerm + "&type=movies&info=1&limit=" + movieLimit + "&k=341271-NatalieU-75CWR9WB";

    //Evan: taken from one of the API activities
    //takes the user input and queries Tastedive to return a nummber of suggestions
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        dataType: "jsonp",
        method: "GET"
    }).done(function(response) {
        //Evan: error handler
        if (response.Response === "False") {
            alert(response.Error);
            //Evan: this runs if call is succesful
        } else {
            console.log(response);
            console.log(response.Similar.Results[0].Name);
            //Evan: calls the omdb api to get more information on the suggestion
            getInfo(response);
        }
    })
}

//Evan: this takes the suggestions from tastedive and loops through them to get more information on each one
function getInfo(response) {
    //takes array of suggestions, to access in another function
    trailerArray = response.Similar.Results;
    console.log(trailerArray);
    //Evan: loops through the array and queries OMDB for each title
    for (var i = 0; i < response.Similar.Results.length; i++) {
        //Evan: gets movie name from the object
        var movie = response.Similar.Results[i].Name;

        //Evan: creates URL for OMDB search
        var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";
        //Evan: api call gets information for each movie
        $.ajax({
            url: queryURL,
            dataType: "jsonp",
            method: "GET"
        }).done(function(response) {
            if (response.Response === "False") {
                // alert(response.Error);

            } else {
                //Evan: this is what will get executed if it works
                //Evan: calls createElemts to display the html for the movie

                createElements(response);

            }
        })

    }
}

//Evan: creates the html for each movie
function createElements(movieInfo) {


    //Evan: create variables for information to display
    var title = movieInfo.Title;
    var poster = movieInfo.Poster;
    var description = movieInfo.Plot;
    var rating = movieInfo.imdbRating;
    var trailer;

    //loop to match trailer with info
    //! loop not consistently working. maybe something with special character?
    for (var i = 0; i < trailerArray.length; i++) {
        if (trailerArray[i].Name.toLowerCase() === title.toLowerCase()) {
            trailer = trailerArray[i].yUrl;
            console.log(trailer, trailerArray[i].yUrl)
        }
    }

    //Evan: creating elements to display with movie information
    //create movie-division div which will hold everything else, append to movie section
    var movieDivision = $("<div>").addClass("movie-division");
    $("#movie-section").append(movieDivision);

    //placing the rating
    var rottenRating = $("<div>").html("<img src='assets/tomato.png' class='icon'>" + rating);
    rottenRating.addClass("rotten-rating");
    movieDivision.append(rottenRating);

    //creating the section that holds eeverything else
    var movieInfo = $("<div>").addClass("movie-info row");
    movieDivision.append(movieInfo);

    //creating the poster
    var $posterDiv = $("<div>").addClass("col-md-2 poster");
    movieInfo.append($posterDiv);
    var image = $("<img>").attr("src", poster).addClass("img-fluid");
    $posterDiv.append(image);

    //creating the title and description
    var descriptionTitle = $("<div>").addClass("col-md-6 description title");
    var $title = $("<h1>").text(title);
    var $description = $("<p>").text(description);
    descriptionTitle.append($title, $description);
    movieInfo.append(descriptionTitle);

    //creating the trailer
    var $trailerDiv = $("<div>").addClass("col-md-4 trailer-section");
    $trailerDiv.html("<iframe src='" + trailer + "' frameborder='0' autoplay; encrypted-media; gyroscope; picture-in-picture class='trailer' allowfullscreen></iframe>");
    movieInfo.append($trailerDiv);

}

//function to reset everything
function reset() {
    trailerArray = [];
    $("#movie-section").html("");

}

$("#search").on("click", getSuggestions);