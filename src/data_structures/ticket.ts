import { Show } from './show';
import { Seat } from './seat';

export interface Ticket {
    ticketID: string,
    orderedOn: number,
    
    customerEmail: string,
    customerName: string,

    movieName: string,
    movieID: string,

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
 