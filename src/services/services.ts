import { Injectable } from '@angular/core'

import { AuthService } from './authService';
import { TheatreService } from './theatreService';
import { DateService } from './dateService';

@Injectable()
export class Services {

    constructor(public auth: AuthService, public theatre: TheatreService, public date: DateService) 
    { }   
}