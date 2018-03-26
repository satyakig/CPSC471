import { Message } from './message';
import { Ticket } from './ticket';

export interface User {
    userID: string,
    name: string,
    email: string,
    access: number,
    card: string,
    createdOn: number

    messages: Message[],
    tickets: Ticket[]
}
