import { Show } from './show';
import { Seat } from './seat';

export interface Ticket {
    ticketID: string,
    customerEmail: string,
    customerName: string,

    movieID: string,
    movieName: string,

    show: Show,
    seats: Seat[],

    quantity: number,
    price: number,

    location: {
        address: string,
        name: string,
        locationID: string
    }
}
 