import { Message } from './message';
import { Ticket } from './ticket';

export interface User {
    userID: string,
    email: string,
    name: string,
    access: number,

    createdOn: number
    card: string,

    messages: Message[],
    tickets: Ticket[]
}
