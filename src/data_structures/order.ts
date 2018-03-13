import { Item } from './item';

export interface Order {
    orderID: string,
    ticketID: string,
    orderedOn: number,

    customerEmail: string,
    customerName: string,

    status: number,

    items: Item[],
    totalPrice: number,

    location: {
        address: string,
        name: string,
        locationID: string
    }
}
 