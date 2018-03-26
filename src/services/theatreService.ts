import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database';
import { Http, Headers, RequestOptions } from '@angular/http';
import * as moment from 'moment';
import 'rxjs/add/operator/map';

import { Seat } from './../data_structures/seat';
import { Movie } from './../data_structures/movie';
import { Show } from './../data_structures/show';
import { Item } from './../data_structures/item';
import { Order } from './../data_structures/order';
import { Ticket } from './../data_structures/ticket';
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
        type: "",
        price: 0,
        unixDate: 0,
        unixDateTime: 0
    }

    private seats: Seat[] = [];

    private headers;
    private options;
    private readonly orderTicket: string = "https://us-central1-cpsc471-6d9c6.cloudfunctions.net/orderTicket?key=f7a1347006a4f17a409e55bdaa5bbb";
    private readonly prepareConcession: string = "https://us-central1-cpsc471-6d9c6.cloudfunctions.net/prepareConcession?key=f7a1347006a4f17a409e55bdaa5bbb";
    private readonly ticketRefund: string = "https://us-central1-cpsc471-6d9c6.cloudfunctions.net/ticketRefund?key=f7a1347006a4f17a409e55bdaa5bbb";

    constructor(public fDb: AngularFireDatabase, public auth: AuthService, public http: Http) { 
        this.headers = new Headers({'Content-Type': 'application/json', 'crossDomain': true});
        this.options = new RequestOptions({ headers: this.headers, method: "post"});
    }

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
        this.show.type = show.type;
        this.show.price = show.price;
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
        else if(this.show.price == 0 || this.show.showID == "" || this.show.theatreNum == -1 || this.show.time == "")
            return false;
        else if(this.show.type == "" || this.show.unixDate == 0 || this.show.unixDateTime == 0)
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

    getTicket() {
        let ticket = {
            customerEmail: this.auth.getEmail(),
            customerName: this.auth.getName(),
            movieID: this.movie.imdbID,
            movieName: this.movie.Title,
            show: this.show,
            seats: this.seats,
            quantity: this.seats.length,
            price: this.seats.length * this.show.price,
            location: this.location
        }
        return ticket;
    }

    orderNewTicket() {
        let body = JSON.stringify(this.getTicket());
        return this.http.post(this.orderTicket, body, this.options);
    } 

    refundTicket(ticket: Ticket) {
        let body = JSON.stringify(ticket);
        return this.http.post(this.ticketRefund, body, this.options);
    }
    
    orderConcessions(order: Order, allItems: Item[]) {
        let sortedItems: Item[] = [];
        let pKey = this.fDb.list('users/' + this.auth.getUID() + '/orders').push({}).key;
        order.orderID = pKey;

        for(let item of allItems) {
            if(item.quantity > 0) {
                sortedItems.push(item);
                order.totalPrice += (item.quantity * item.price);
            }
        }
        order.items = sortedItems;
        order.totalPrice = Math.round(order.totalPrice * 100)/100;
        this.fDb.object('users/' + this.auth.getUID() + '/orders/' + pKey).set(order);      
        return;  
    }

    prepareConcessions(order: Order) {
        order.status = 1;
        let body = JSON.stringify(order);
        return this.http.post(this.prepareConcession, body, this.options);
    }
}