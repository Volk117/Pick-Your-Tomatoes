//this will hold information to match the movies with their trailers
var trailerArray = [];
var objectArray = [];

//Evan: this function takes user input and gets suggestions from tastedive api
function getSuggestions(searchTerm) {
    $(".jumbotron").hide();

    // console.log("test");
    //reset everything
    reset();
    trailerArray = [];
    objectArray = [];
    //Evan: this holds the number of movies for it to suggest
    var movieLimit = 5;
    //Evan: this grabs the searchterm from the user input
    searchTerm = $(".form-control").val();
    //Evan: the API URL with searchterm and limit
    // console.log(searchTerm);
    var queryURL = "https://tastedive.com/api/similar?q=" + searchTerm + "&type=movies&info=1&limit=" + movieLimit + "&k=341271-NatalieU-75CWR9WB";

    //Evan: taken from one of the API activities
    //takes the user input and queries Tastedive to return a nummber of suggestions
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

            //Evan: calls the omdb api to get more information on the suggestion
            getInfo(response);
        }
    })
}

//Evan: this takes the suggestions from tastedive and loops through them to get more information on each one
function getInfo(response) {
    //takes array of suggestions, to access in another function
    trailerArray = response.Similar.Results;
    // console.log(trailerArray);

    var length = response.Similar.Results.length;
    var count = 0;
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
                //increases count so it still runs if one or more don't return
                count++;

            } else {
                //Evan: this is what will get executed if it works
                //Evan: calls createElemts to display the html for the movie
                objectArray.push(response);
                count++;
                //calls the sort function once all the movies are grabbed
                if (count === length) {
                    console.log(objectArray);
                    sort(objectArray);
                }
                // createElements(response);
                // console.log(response);
            }
        })

    }
}

//sorts the array of objects, high to low imdb rating
function sort(currentArray) {

    var sorted = currentArray.sort(compareHighest);
    createElements(sorted);
    console.log(sorted);
}

//Evan: creates the html for each movie
function createElements(sortedArray) {
    for (var j = 0; j < sortedArray.length; j++) {
        console.log("test");
        //Evan: create variables for information to display
        var title = sortedArray[j].Title;
        var poster = sortedArray[j].Poster;
        var description = sortedArray[j].Plot;
        var rating = sortedArray[j].imdbRating;
        var year = sortedArray[j].Year;
        var language = sortedArray[j].Language;
        var rated = sortedArray[j].Rated;
        var runTime = sortedArray[j].Runtime;
        var trailer;

        //loop to match trailer with info
        //! loop not consistently working. maybe something with special character?
        for (var i = 0; i < trailerArray.length; i++) {
            if (trailerArray[i].Name.toLowerCase() === title.toLowerCase()) {
                trailer = trailerArray[i].yUrl;
                // console.log(trailer, trailerArray[i].yUrl)
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

        //creating the section that holds everything else
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
        var $year = $("<span>").text(" (" + year + ")");
        var $info = $("<h2>").text(runTime + " -- " + language + " -- " + rated);

        var $description = $("<p>").text(description);
        descriptionTitle.append($title, $year, $info, $description);
        movieInfo.append(descriptionTitle);

        //creating the trailer
        var $trailerDiv = $("<div>").addClass("col-md-4 trailer-section");
        $trailerDiv.html("<iframe src='" + trailer + "' frameborder='0' autoplay; encrypted-media; gyroscope; picture-in-picture class='trailer' allowfullscreen></iframe>");
        movieInfo.append($trailerDiv);
    }
}

//function to reset everything
function reset() {

    $("#movie-section").html("");

}


//compare funciton for sort, high to low imdbrating
//based off of code from https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
function compareHighest(a, b) {
    var aNumber = a.imdbRating;
    var bNumber = b.imdbRating;

    var comparison = 0;
    if (aNumber < bNumber) {
        comparison = 1;
    } else if (aNumber > bNumber) {
        comparison = -1;
    }
    return comparison;
}

$("#search").on("click", getSuggestions);