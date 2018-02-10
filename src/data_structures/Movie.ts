export interface Movie {
    Title: string,
    Year: string,
    Rated: string,
    Released?: number,
    Runtime?: number,
    Genre: string,
    Director: string,
    Writer: string,
    Actors: string,
    Plot: string,

    Language: string,
    Country: string,

    Awards: string,
    Poster: string,

    Ratings: any[],
    Metascore: string,
    imdbRating: string,
    imdbVotes: string,

    imdbID: string,

    Type: string,
    DVD: string,

    BoxOffice: string,
    Production: string,

    Website: string,
    Response: string,
    
    TMDB?: any
}
