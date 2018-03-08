import { Movie } from './movie';
import { Theatre } from './theatre';
import { Item } from './item';

export interface Location {
    name: string,
    address: string,
    locationID: string,

    movies: Movie[],
    items: Item[],
    theatres: Theatre[],

    bookedSeats: any[],
    orders: any[]
}
