import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { Services } from './../../services/services';
import { Theatre } from './../../data_structures/theatre';
import { Movie } from './../../data_structures/movie';
import { Showtime } from './../../data_structures/showtime';
import { Seat } from './../../data_structures/seat';

@IonicPage()
@Component({
  selector: 'page-theatre',
  templateUrl: 'theatre.html',
})
export class TheatrePage {

  showtime: Showtime = {
    time: "",
    theatreNum: -1
  }

  location = {
    address: "",
    locationID: "",
    name: ""
  }

  movie: Movie = {
    imdbID: '',
    Title: '',
    Year: '',
    Released: 0,
    Runtime: 0,
    Rated: '',
    Genre: '',
    Director: '',
    Writer: '',
    Actors: '',
    Plot: '',
    Awards: 'N/A',
    BoxOffice: 'N/A',
    Production: 'N/A',
    Website: 'N/A',
    Language: '',
    Country: '',
    Ratings: [],
    Metascore: '',
    imdbRating: '',
    imdbVotes: '',
    Type: '',
    DVD: '',
    Response: '',
    Poster: '',
    Videos: [],
    Showtimes: []    
  }; 
  date: string = "";
  seats: Seat[] = [];
  selected: boolean = false;
  rows = [];
  cols = [];

  constructor(public navParams: NavParams, public viewCtrl: ViewController, public loader: LoadingController,
  public services: Services, public db: AngularFireDatabase ) { }

  ionViewWillEnter() {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Fetching theatre info...',
    });
    loader.present();

    this.location = this.services.theatre.getLocation();
    this.seats = this.services.theatre.getSeats();
    this.showtime = this.services.theatre.getShow();
    this.movie = this.services.theatre.getMovie();
    this.date = this.services.date.getSelectedDate();

    this.db.object<Theatre>('locations/' + this.location.locationID + '/theatres/' + this.showtime.theatreNum).valueChanges().subscribe(data => {
      for(let i = 0; i < data.totalRows; i++)
        this.rows.push(i);
      for(let i = 0; i < data.totalCols; i++)
        this.cols.push(i);
    });
    loader.dismiss();
  }

  clickSeat(row: number, col: number) {
    console.log(row, col, this.seats);
    this.seats = this.services.theatre.seatSelected(row, col);
    console.log(this.seats);
  }

  containsSeat(row: number, col: number) {
    for(let seat of this.seats) {
      if(seat.row == row && seat.col == col)
        return true;
    }
    return false;
  }

  swiped(event) {
    this.viewCtrl.dismiss();
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
