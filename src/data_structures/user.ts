import { Message } from './message';
import { Ticket } from './ticket';

export interface User {
    userID: string,
    email: string,
    name: string,
    access: number,

    createdOn: number
    billingInfo: any,

    messages: Message[],
    tickets: Ticket[]
}
