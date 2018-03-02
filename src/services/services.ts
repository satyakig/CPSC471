import { Injectable } from '@angular/core'

import { AuthService } from './authService';
import { TheatreService } from './theatreService';
import { DateService } from './dateService';

@Injectable()
export class Services {
    auth: any;
    theatre: any;
    date: any;

    constructor(private authService: AuthService, private theatreService: TheatreService, private dateService: DateService) { 
        this.auth = authService;
        this.theatre = theatreService;
        this.date = dateService;
    }   
}