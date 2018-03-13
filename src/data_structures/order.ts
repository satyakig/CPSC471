import { Item } from './item';

// status = 0: just ordered, not set to prepare
// status = 1: prepare
// status = 2: prepared

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
 