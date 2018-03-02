import { Injectable } from '@angular/core'

import { Seat } from './../data_structures/seat';
import { Movie } from './../data_structures/movie';
import { Showtime } from './../data_structures/showtime';

@Injectable()
export class TheatreService {
    private movie: Movie = null;

    private location = {
        address: "",
        locationID: "",
        name: ""
    }

    private showtime: Showtime = {
        time: "",
        theatreNum: -1
    }

    private seats: Seat[] = [];

    clearSelections() {
        this.location = {
            address: "",
            locationID: "",
            name: ""
        }
        this.showtime = {
            time: "",
            theatreNum: -1
        }
        this.seats = [];
        this.movie = null;
    }

    setLocation(loc: any) {
        this.clearSelections();
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

    getShow() {
        return this.showtime;
    }

    getShowTime() {
        return this.showtime.time;
    }
    
    getShowTheatreNum() {
        return this.showtime.theatreNum;
    }

    setShow(time: any, num: any) {
        this.showtime.time = time;
        this.showtime.theatreNum = num;
    }

    isValid() {
        if(this.location.address == "" || this.location.locationID == "" || this.location.name == "")
            return false;
        else if(this.showtime.time == "" || this.showtime.theatreNum == -1)
            return false;
        else if(this.movie == null)
            return false;
        else if(this.seats.length == 0)
            return false;
        else
            return true;
    }

    seatSelected(row: number, col: number) {
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

    getSeats() {
        return this.seats;
    }

    setMovie(mov: Movie) {
        this.movie = mov;
    }

    getMovie() {
        return this.movie;
    }
}