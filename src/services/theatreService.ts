import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database';
import * as moment from 'moment';

import { Seat } from './../data_structures/seat';
import { Movie } from './../data_structures/movie';
import { Ticket } from './../data_structures/ticket';
import { Show } from './../data_structures/show';
import { AuthService } from './authService';

@Injectable()
export class TheatreService {
    private movie: Movie = null;

    private location = {
        address: "",
        locationID: "",
        name: ""
    }

    private show: Show = {
        showID: "",
        time: "",
        theatreNum: -1,
        unixDate: 0,
        unixDateTime: 0
    }

    private seats: Seat[] = [];

    constructor(public fDb: AngularFireDatabase, public auth: AuthService) {  }

    clearSeats() {
        this.seats = [];
    }

    clearShow() {
        this.show.showID = "";
        this.show.theatreNum = -1;
        this.show.time = "";
        this.show.unixDateTime = 0;
    }

    clearLocation() {
        this.location.address = "";
        this.location.locationID = "";
        this.location.name = "";
    }

    setMovie(mov: Movie) {
        this.clearShow();
        this.clearSeats();
        this.movie = mov;
    }

    getMovie() {
        return this.movie;
    }    

    getMovieTitle() {
        if(this.movie == null)
            return "";
        else
            return this.movie.Title;
    }

    getMovieRuntime() {
        if(this.movie == null)
            return 0;
        else
            return this.movie.Runtime;
    }

    setLocation(loc: any) {
        this.clearLocation();
        this.clearShow();
        this.clearSeats();
        this.location.name = loc.name;
        this.location.locationID = loc.locationID;
        this.location.address = loc.address;
    }

    getLocation() {
        return this.location;
    }

    getLocationName() {
        return this.location.name;
    }
    
    getLocationAddress() {
        return this.location.address;
    }

    getLocationID() {
        return this.location.locationID;
    }

    setShowDate(date: string) {
        this.show.unixDate = moment(date, 'dddd, MMM DD').unix();
    }
    
    setShow(show: any) {
        let mom = moment(show.time, "Hmm").format("H:mm:ss");

        this.show.showID = show.showID;
        this.show.time = show.time;
        this.show.theatreNum = show.theatreNum;
        this.show.unixDateTime = this.show.unixDate + moment.duration(mom).asSeconds();
    }    

    getShow() {
        return this.show;
    }

    getShowTime() {
        return this.show.time;
    }
    
    getShowTheatreNum() {
        return this.show.theatreNum;
    }

    getShowDate() {
        return moment.unix(this.show.unixDate).format('dddd, MMM DD');
    }

    getShowDateUnix() {
        return this.show.unixDate
    }   
    
    getShowDateTimeUnix() {
        return this.show.unixDateTime
    }

    getShowID() {
        return this.show.showID;
    }

    isValid() {
        if(this.location.address == "" || this.location.locationID == "" || this.location.name == "")
            return false;
        else if(this.show.time == "" || this.show.theatreNum == -1 || this.show.showID == "" || this.show.unixDate == 0 || this.show.unixDateTime == 0)
            return false;
        else if(this.movie == null)
            return false;
        else
            return true;
    }

    selectSeat(row: number, col: number) {
        var i = 0;
        for(; i < this.seats.length; i++) {
            if(this.seats[i].row == row && this.seats[i].col == col)
                break;
        }

        if(i < this.seats.length)
            this.seats.splice(i, 1);
        else
            this.seats.push({row: row, col: col});

        return this.seats;
    }

    removeSeat(row: number, col: number) {
        for(let i = 0; i < this.seats.length; i++) {
            if(this.seats[i].row == row && this.seats[i].col == col)
                this.seats.splice(i, 1);
        }
        return this.seats;
    }

    getSeats() {
        return this.seats;
    }

    writeTicket() {
        let pKey = this.fDb.list('users/' + this.auth.getUID() + '/tickets').push({}).key;

        let ticket: Ticket = {
            ticketID: pKey,
            customerEmail: this.auth.getEmail(),
            customerName: this.auth.getName(),
            movieID: this.movie.imdbID,
            movieName: this.movie.Title,
            show: this.show,
            seats: this.seats,
            quantity: this.seats.length,
            price: this.seats.length * 5,
            location: this.location
        }

        this.fDb.object('users/' + this.auth.getUID() + '/tickets/' + pKey).set(ticket);
        return;
    }
}