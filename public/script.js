function search(keyword) {
  var url = 'https://www.omdbapi.com/?s='+escape(keyword);

  $.getJSON(url)
  .done(function(imdbResponse){
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
    $('#movie-detail').html("<h2 class='fail'>" + message + "</h2>");
  });
}

function imdbDone(searchKeyword, imdbSearchData) {
  var display = '<option value="">Movies matching "'+ searchKeyword +'"...</option>';
  for (var i=0; i < imdbSearchData.Search.length; i++) {
    var movie = imdbSearchData.Search[i];
    display += ['<option value="', movie.imdbID, '">', movie.Title, '</option>'].join('');
  };
  $('#movie-list').show().html(display);
}


function show(imdbId) {
  if (!imdbId) return;
  var url = 'https://www.omdbapi.com/?i='+imdbId;
  $.getJSON(url).then(function(imdbMovieData) {
    var movieData = {
      "Title": imdbMovieData.Title,
      "Year": imdbMovieData.Year,
      "Plot": imdbMovieData.Plot,
      "Poster": imdbMovieData.Poster,
      "imdbRating": imdbMovieData.imdbRating,
      "imdbID": imdbId
    };
    var detail = '<h2>Title: ' + imdbMovieData.Title + '</h2>';
    detail += '<form method="post" action="/favorites">'
    detail += '<input type="hidden" name="Title" value="' + imdbMovieData.Title + '">'
    detail += '<input type="hidden" name="Year" value="' + imdbMovieData.Year + '">'
    detail += '<input type="hidden" name="Plot" value="' + imdbMovieData.Plot + '">'
    detail += '<input type="hidden" name="Poster" value="' + imdbMovieData.Poster + '">'
    detail += '<input type="hidden" name="imdbRating" value="' + imdbMovieData.imdbRating + '">'
    detail += '<input type="hidden" name="imdbID" value="' + imdbId + '">'
    detail += '<input type="submit" value="Add to Favorites">';
    detail += '<p>Year Released: ' + imdbMovieData.Year + '</p>';
    detail += '<p>Summary: ' + imdbMovieData.Plot + '</p>';
    detail += '<p>IMDB Rating: ' + imdbMovieData.imdbRating + '</p>';
    detail += '<img src="'+ imdbMovieData.Poster +'" alt="'+ imdbMovieData.Title +'">';
    $('#movie-detail').html(detail);
    });
  }

// Add Movie to Favorites


// Search form:

$('#search').on('submit', function(evt) {
  evt.preventDefault();
  var $search = $('#movie-search');
  var keyword = $search.val();
  $search.val('');

  search(keyword);
});


// Movie selector:

$('#movie-list').hide().on('change', function() {
  show(this.value);
});
