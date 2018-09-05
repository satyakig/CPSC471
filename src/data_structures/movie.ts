import { Show } from './show';

export interface Movie {
    imdbID: string,

    Title: string,
    Year: string,

    Released?: number,
    Runtime?: number,
    Rated: string,

    Genre: string,
    Director: string,
    Writer: string,
    Actors: string,
    Plot: string,

    Awards: string,
    BoxOffice: string,
    Production: string,
    Website: string,

    Language: string,
    Country: string,

    Ratings: any[],
    Metascore: string,
    imdbRating: string,
    imdbVotes: string,

    Type: string,
    DVD: string,
    Response: string,

    Poster: string,
    Videos?: any[],
    Shows: Show[]
}
