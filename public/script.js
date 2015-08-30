
// Retrieve external API data based on search field
function search(keyword) {
  var url = 'https://www.omdbapi.com/?s='+escape(keyword);
  var request = new XMLHttpRequest();
  request.open('GET', url, true).done(function(imdbResponse){
    // We want to use both the search keyword and the imdb response in imdbDone
    //   We use an anonymous function to pass both.
    imdbDone(keyword, imdbResponse);
  })
  .fail(function(imdbResponse, textStatus, errorMessage){
    var message = "Sorry, we had issues retrieving movie data for '" + keyword + "'";
    if (errorMessage){
      message += "(" + errorMessage + ")";
    }
    message += ".  Please try again.";
    document.getElementById('movie-detail').innerHTML("<h2 class='fail'>" + message + "</h2>");
  });
}

// Show drop-down list of movies when retrieved
function imdbDone(searchKeyword, imdbSearchData) {
  var display = '<option value="">Movies matching "'+ searchKeyword +'"...</option>';
  for (var i=0; i < imdbSearchData.Search.length; i++) {
    var movie = imdbSearchData.Search[i];
    display += ['<option value="', movie.imdbID, '">', movie.Title, '</option>'].join('');
  };
  document.getElementById('movie-list').show().innerHTML(display);
}

// Show info about selected movie
function show(imdbId) {
  if (!imdbId) return;
  var url = 'https://www.omdbapi.com/?i='+imdbId;
  var request = new XMLHttpRequest();
  request.open('GET', url, true).then(function(imdbMovieData) {
    var movieData = {
      "name": imdbMovieData.Title,
      "year": imdbMovieData.Year,
      "plot": imdbMovieData.Plot,
      "poster": imdbMovieData.Poster,
      "imdbRating": imdbMovieData.imdbRating,
      "oid": imdbId
    };
    var detail = '<h2>Name: ' + imdbMovieData.Title + '</h2>';
    detail += '<form method="post" action="/favorites">'
    detail += '<input type="hidden" name="name" value="' + imdbMovieData.Title + '">'
    detail += '<input type="hidden" name="year" value="' + imdbMovieData.Year + '">'
    detail += '<input type="hidden" name="plot" value="' + imdbMovieData.Plot + '">'
    detail += '<input type="hidden" name="poster" value="' + imdbMovieData.Poster + '">'
    detail += '<input type="hidden" name="imdbRating" value="' + imdbMovieData.imdbRating + '">'
    detail += '<input type="hidden" name="oid" value="' + imdbId + '">'
    detail += '<input type="submit" value="Add to Favorites">';
    detail += '<p>Year Released: ' + imdbMovieData.Year + '</p>';
    detail += '<p>Summary: ' + imdbMovieData.Plot + '</p>';
    detail += '<p>IMDB Rating: ' + imdbMovieData.imdbRating + '</p>';
    detail += '<img src="'+ imdbMovieData.Poster +'" alt="'+ imdbMovieData.Title +'">';
    document.getElementById('movie-detail').innerHTML(detail);
    });
  }

// Add Movie to Favorites


// Search form:

document.getElementById('search').addEventListener('submit', function(evt) {
  evt.preventDefault();
  var movsearch = document.getElementById('movie-search');
  var keyword = movsearch.value;
  search.value = '';
  search(keyword);
});


// Movie selector:

document.getElementById('movie-list').style.display = "none";
document.getElementById('movie-list').addEventListener('change', function() {
  show(this.value);
});
