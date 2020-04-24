export class MovieListItemDataModel {
  Title;
  Year;
  imdbID;
  Type;
  Poster;
}

export class MovieListItemViewModel {
  id = "";
  title = "";
  poster = "";
  constructor(data) {
    this.id = data.imdbID;
    this.title = data.Title;
    this.poster = data.Poster;
  }
}

export class MovieDetailDataModel {
  Title;
  Year;
  Rated;
  Released;
  Runtime;
  Genre;
  Director;
  Writer;
  Actors;
  Plot;
  Language;
  Country;
  Awards;
  Poster;
  Ratings;
  Metascore;
  imdbRating;
  imdbVotes;
  imdbID;
  Type;
  DVD;
  BoxOffice;
  Production;
  Website;
  Response;
}

export class MovieDetailViewModel {
  id = "";
  title = "";
  rating = 0.0;
  plot = "";
  genre = "";
  year = "";
  constructor(data) {
    this.id = data.imdbID;
    this.title = data.Title;
    this.year = data.Year;
    this.rating = data.imdbRating ? parseFloat(data.imdbRating) : 0.0;
    this.plot = data.Plot;
    this.genre = data.Genre;
  }
}

export class MovieFilter {
  s;
  y;
  type;
  constructor(s = "black", y = "", type = "movie") {
    this.s = s;
    this.y = y;
    this.type = type;
  }
}
