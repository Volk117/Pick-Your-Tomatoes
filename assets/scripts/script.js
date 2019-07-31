//Evan: this function takes user input and gets suggestions from tastedive api
function getSuggestions(searchTerm) {
    //Evan: this holds the number of movies for it to suggest
    movieLimit = 5;
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
    //Evan: loops through the array and queries OMDB for each title
    for (var i = 0; i < response.Similar.Results.length; i++) {
        //Evan: gets movie name from the object
        var movie = response.Similar.Results[i].Name;

        var trailer = response.Similar.Results[i].yUrl;
        //Evan: creates URL for OMDB search
        var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";
        //Evan: api call gets information for each movie
        $.ajax({
            url: queryURL,
            dataType: "jsonp",
            method: "GET"
        }).done(function(response) {
            if (response.Response === "False") {
                alert(response.Error);

            } else {
                //Evan: this is what will get executed if it works
                console.log(response);
                //Evan: calls createElemts to display the html for the movie
                createElements(response, trailer);
            }
        })

    }
}
//Evan: creates the html for each movie
function createElements(movieInfo, trailer) {
    //Evan: create variables for information to display
    var title = movieInfo.Title;
    var poster = movieInfo.Poster;
    var description = movieInfo.Plot;
    var rating = movieInfo.imdbRating;

    var template = $("#original").clone();

    $("#movie-section").append(template);
    template.show();

    //Evan: creating elements to display with movie information

    // var movieDivision = $("<div>");
    // $("movie-section").append(movieDivision);
    // movieDivision.addClass("movie-division");

    // console.log(movieDivision);
}
$(".movie-division").hide();
$("#search").on("click", getSuggestions);