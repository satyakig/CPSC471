const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.database();
const auth = admin.auth();

const http = require('request');
const compare = require('secure-compare');
const cors = require('cors')({origin: true});
const moment = require('moment');

const clientKey = functions.config().client.key;


exports.userCreate = functions.auth.user().onCreate((userRecord) => {
    const now = moment().unix();
    const uid = userRecord.uid;

    var mid = db.ref('users/' + uid + '/messages').push().key;
    var messsage = {
        date: now,
        title: "Welcome to Cinexpress",
        message: "Thank you for signing up to Cinexpress!",
        read: false,
        messageID: mid
    }

    var updates = {};
    updates['users/' + uid + '/access'] = 2;
    updates['users/' + uid + '/messages/' + mid] = messsage;
    updates['users/' + uid + '/createdOn'] = now;

    return db.ref().update(updates);
});

exports.setUserAccess = functions.database.ref('/users/{uid}/access').onWrite((data, context) => {
    const access = data.after.val();
    const uid = context.params.uid;

    if(access === 0)
        return auth.setCustomUserClaims(uid, {access: 0});
    else if(access === 1)
        return auth.setCustomUserClaims(uid, {access: 1});
    else
        return auth.setCustomUserClaims(uid, {access: 2});
});

exports.userDelete = functions.auth.user().onDelete((userRecord) => {
    return db.ref('users/' + userRecord.uid).remove();
});

exports.orderTicket = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        if(compare(request.query.key, clientKey)) {  
            const info = request.body;           
            
            if(!isTicketValid(info))
                return response.status(400).send("Invalid data.");
            else {
                const seats = info.seats;
                const date = info.show.unixDate; 
                const locationID = info.location.locationID;
                const showID = info.show.showID;

                const prom1 = auth.getUserByEmail(info.customerEmail);
                const prom2 = db.ref('locations/' + locationID + '/bookedSeats/' + date + '/' + showID).once('value');

                return Promise.all([prom1, prom2]).then(results => {
                    const uid = results[0].uid;
                    const bookSeatsSnap = results[1];

                    bookSeatsSnap.forEach(seatSnap => {
                        let seat = seatSnap.val();
                        for(let i = 0; i < seats.length; i++) {
                            if(seats[i].col == seat.col && seats[i].row == seat.row)
                                return response.status(400).send("Sorry, these seats have already been taken."); 
                        }
                    });

                    const now = moment().unix();
                    const tid = db.ref('tickets').push().key;  
                    const mid = db.ref('users/' + uid + '/messages').push().key;

                    var updates = {};
                    var ticket = {
                        ticketID: tid,
                        orderedOn: now,                        
                        customerEmail: info.customerEmail,
                        customerName: info.customerName,                    
                        movieName: info.movieName,
                        movieID: info.movieID,                    
                        show: info.show,
                        seats: info.seats,                    
                        quantity: info.quantity,
                        price: info.price,                    
                        location: info.location
                    }

                    updates['users/' + uid + '/tickets/' + tid] = ticket;
                    updates['users/' + uid + '/messages/' + mid] = {
                        message: 'Thank you for purchasing ticket(s) to ' + ticket.movieName + '.',
                        title: 'New Ticket',
                        date: now,
                        read: false,
                        messageID: mid
                    }
                    for(seat of seats) {
                        let pKey = db.ref('locations/' + locationID + '/bookedSeats/' + date + '/' + showID).push().key;
                        updates['locations/' + locationID + '/bookedSeats/' + date + '/' + showID + '/' + pKey] = {
                            col: seat.col,
                            row: seat.row
                        }    
                    }                   
                    
                    const prom3 = response.status(200).send("Your ticket has been booked!");
                    const prom4 = db.ref().update(updates);

                    return Promise.all([prom3, prom4]);
                }).catch(err => {
                    return response.status(400).send(err.message);
                });
            }
        }
        else
            return response.status(400).send("Invalid authentication key");
    });
});

exports.ticketRefund = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        if(compare(request.query.key, clientKey)) {  
            const ticket = request.body;           
            
            if(!isTicketValid2(ticket))
                return response.status(400).send("Invalid ticket");
            else {
                const ticketID = ticket.ticketID;
                const locationID = ticket.location.locationID;
                const custSeats = ticket.seats;
                const show = ticket.show;

                const prom1 = auth.getUserByEmail(ticket.customerEmail);
                const prom2 = db.ref('locations/' + locationID + '/bookedSeats/' + show.unixDate + '/' + show.showID).once('value');

                return Promise.all([prom1, prom2]).then(results => {
                    const uid = results[0].uid;
                    const bookedSeatsSnap = results[1];
                    
                    var updates = {};
                    updates['users/' + uid + '/tickets/' + ticketID] = null;

                    bookedSeatsSnap.forEach(seatSnap => {
                        let bkSeat = seatSnap.val();
                        let seatID = seatSnap.key;
                        
                        for(cSeat of custSeats) {
                            if(cSeat.col == bkSeat.col && cSeat.row == bkSeat.row)
                                updates['locations/' + locationID + '/bookedSeats/' + show.unixDate + '/' + show.showID + '/' + seatID] = null;
                        }                          
                    });              
                    
                    const prom3 = response.status(200).send("Your ticket has been refunded.");
                    const prom4 = db.ref().update(updates);

                    return Promise.all([prom3, prom4]);
                }).catch(err => {
                    return response.status(400).send(err.message);
                });
            }
        }
        else
            return response.status(400).send("Invalid authentication key");
    });
});

exports.orderConcession = functions.database.ref('/users/{uid}/orders/{oid}').onCreate((data, context) => {
    const uid = context.params.uid;
    const oid = context.params.oid;
    const now = moment().unix();
    const mid = db.ref('users/' + uid + '/messages').push().key;
    const order = data.val();

    var updates = { };
    updates['locations/' + order.location.locationID + '/orders/' + oid] = order;
    updates['users/' + uid + '/messages/' + mid] = {
        message: 'Please let us know when you would like us to start preparing your order.',
        title: 'New Order',
        date: now,
        read: false,
        messageID: mid
    }

    return db.ref().update(updates);
});

exports.prepareConcession = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        if(compare(request.query.key, clientKey)) {  
            const info = request.body;           
            
            if(!isOrderValid(info))
                return response.status(400).send("Invalid order");
            else {
                const locationID = info.location.locationID;
                const oid = info.orderID;
                const email = info.customerEmail;
                return auth.getUserByEmail(email).then(userRec => {
                    const uid = userRec.uid;
                    const mid = db.ref('users/' + uid + '/messages').push().key;
                    const now = moment().unix();

                    var updates = {};
                    updates['locations/' + locationID + '/orders/' + oid + '/status'] = 1;
                    updates['users/' + uid + '/orders/' + oid + '/status'] = 1;
                    updates['users/' + uid + '/messages/' + mid] = {
                        message: 'Your order is now being prepared.',
                        title: 'Preparing Order',
                        date: now,
                        read: false,
                        messageID: mid
                    }
                    
                    const prom3 = response.status(200).send("Your order is now being prepared.");
                    const prom4 = db.ref().update(updates);

                    return Promise.all([prom3, prom4]);
                }).catch(err => {
                    return response.status(400).send(err.message);
                });
            }
        }
        else
            return response.status(400).send("Invalid authentication key");
    });
});

exports.concessionPrepared = functions.database.ref('/locations/{lid}/orders/{oid}/status').onUpdate((data, context) => {
    const status = data.after.val();
    const lid = context.params.lid;
    const oid = context.params.oid;

    if(status == 2) {
        return db.ref('locations/' + lid + '/orders/' + oid).once('value', snap => {
            const email = snap.val().customerEmail;
            return auth.getUserByEmail(email).then(userRec => {
                const uid = userRec.uid;
                const mid = db.ref('users/' + uid + '/messages').push().key;
                const now = moment().unix();

                var updates = {};
                updates['users/' + uid + '/orders/' + oid + '/status'] = 2;
                updates['users/' + uid + '/messages/' + mid] = {
                    message: 'Your order is ready to be picked up!',
                    title: 'Order Prepared',
                    date: now,
                    read: false,
                    messageID: mid
                }

                return db.ref().update(updates);
            });
        }).catch(err => {
            console.log(err.message);
        });
    }
    else
        return null;
});

function isTicketValid(ticket) {
    if(!ticket.customerEmail || !ticket.customerName || !ticket.movieName || !ticket.movieName)
        return false;
    else if(!ticket.quantity || ticket.quantity <= 0 || !ticket.price || ticket.price <= 0)
        return false;
    else if(!ticket.location || !ticket.location.address || !ticket.location.name || !ticket.location.locationID)
        return false;
    else if(!ticket.seats || ticket.seats.length <= 0)
        return false;
    else if(!ticket.show || !ticket.show.showID || !ticket.show.time || !ticket.show.type)
        return false;
    else if(ticket.show.theatreNum < 0 || ticket.show.price <= 0 || ticket.show.unixDate <= 0 || ticket.show.unixDateTime <= 0)
        return false;
    else
        return true;
}

function isTicketValid2(ticket) {
    if(!ticket.ticketID || !ticket.orderedOn)
        return false;
    else if(!ticket.customerEmail || !ticket.customerName || !ticket.movieName || !ticket.movieName)
        return false;
    else if(!ticket.quantity || ticket.quantity <= 0 || !ticket.price || ticket.price <= 0)
        return false;
    else if(!ticket.location || !ticket.location.address || !ticket.location.name || !ticket.location.locationID)
        return false;
    else if(!ticket.seats || ticket.seats.length <= 0)
        return false;
    else if(!ticket.show || !ticket.show.showID || !ticket.show.time || !ticket.show.type)
        return false;
    else if(ticket.show.theatreNum < 0 || ticket.show.price <= 0 || ticket.show.unixDate <= 0 || ticket.show.unixDateTime <= 0)
        return false;
    else
        return true;
}

function isOrderValid(order) {
    if(!order.orderID || !order.ticketID || !order.customerEmail || !order.customerName) 
        return false;
    else if(order.orderedOn < 0|| order.status < 0 || order.totalPrice < 0)
        return false;
    else if(!order.location || !order.location.address || !order.location.name || !order.location.locationID)
        return false;
    else if(!order.items || order.items.length <= 0)
        return false;
    else 
        return true;
}








/**
 * methods to fix up the database
 */
exports.fixNumbers = functions.https.onRequest((request, response) => {
    const cur = db.ref('/currentMovies').once('value');
    const upc = db.ref('/upcomingMovies').once('value');

    return Promise.all([cur, upc]).then(results => {
        var curSnap = results[0];
        var upcSnap = results[1];

        var updates = {};
        var message = "";

        let i = 0, j = 0;
        curSnap.forEach(childSnap => {
            i++;
            let movie = childSnap.val();

            try {
                let unix = Number(movie.Runtime.split(" ")[0]);

                if(movie.Released == null || movie.Released == undefined || movie.Released.includes("N/A"))
                    updates['/currentMovies/' + childSnap.key] = null;     
                else
                    updates['/currentMovies/' + childSnap.key + '/Released'] = moment(movie.Released, "DD MMM YYYY").unix();
            
                if(unix == null || unix == undefined || movie.Runtime.includes("N/A"))
                    updates['/currentMovies/' + childSnap.key] = null;     
                else
                    updates['/currentMovies/' + childSnap.key + '/Runtime'] = unix;
                j++;
            }
            catch(err) {                
                console.log(childSnap.key, err);
            }    
        });
        message = (j + " current movies passed, " + (i-j) + " movies failed, " + i + ". ");


        i = 0, j = 0;
        upcSnap.forEach(childSnap => {
            let movie = childSnap.val();
            i++;

            try {
                if(movie.Released == null || movie.Released == undefined || movie.Released.includes("N/A"))
                    updates['/upcomingMovies/' + childSnap.key] = null;     
                else
                    updates['/upcomingMovies/' + childSnap.key + '/Released'] = moment(movie.Released, "DD MMM YYYY").unix();
                j++;
            }
            catch(err) {
                console.log(childSnap.key, err);
            }
                 
        });
        message += (j + " upcoming movies passed, " + (i-j) + " movies failed, " + i + ".");

        return Promise.all([db.ref().update(updates), response.status(200).send(message)]);
    }).catch(err => {
        console.log(err.message);
    });
});

exports.addCurTrailers = functions.https.onRequest((request, response) => {
    const body = request.body;
    var updates = {};
    var i = 0;
    for(; i < body.length; i++) {
        updates['currentMovies/' + body[i].id + '/Videos'] = body[i].videos;
    }

    return Promise.all([db.ref().update(updates), response.status(200).send(i + " movies wrote")]);
});

exports.addUpcTrailers = functions.https.onRequest((request, response) => {
    const body = request.body;
    var updates = {};
    var i = 0;
    for(; i < body.length; i++) {
        updates['upcomingMovies/' + body[i].id + '/Videos'] = body[i].videos;
    }

    return Promise.all([db.ref().update(updates), response.status(200).send(i + " movies wrote")]);
});

exports.getMovies = functions.https.onRequest((request, response) => {
    const prom1 = db.ref('currentMovies').once('value');
    const prom2 = db.ref('upcomingMovies').once('value');

    return Promise.all([prom1, prom2]).then(values => {
        var curSnap = values[0];
        var upcSnap = values[1];

        var curArr = [];
        var upcArr = [];

        var cur = "";
        var upc = ""

        curSnap.forEach(movie => {
            cur += (movie.key + "\n");
        });

        upcSnap.forEach(movie => {
            upc += (movie.key + "\n");
        });

        var obj = {
            current: curArr,
            upcoming: upcArr
        };

        response.status(200).send(cur + "-hello-\n" + upc);
    });
});

exports.fixTrailerKeys = functions.https.onRequest((request, response) => {

    const prom1 = db.ref('/currentMovies').once('value');
    const prom2 = db.ref('/upcomingMovies').once('value')

    return Promise.all([prom1, prom2]).then(values => {
        const snapCur = values[0];
        const snapUpc = values[1];
        
        var updates = {};
        let curTOT = 0, curPAS = 0, curDNE = 0, upcTOT = 0, upcPAS = 0, upcDNE = 0;

        snapCur.forEach(childMovie => {
            curTOT++;
            if(childMovie.child('Videos').exists()) {
                curPAS++;

                childMovie.child('Videos').forEach(childTrailer => {
                    let newLink = 'https://www.youtube.com/embed/' + childTrailer.val().key;
                    updates['currentMovies/' + childMovie.key + '/Videos/' + childTrailer.key + '/key'] = newLink;
                });
            }
            else
                curDNE++;
        });

        snapUpc.forEach(childMovie => {
            upcTOT++;
            if(childMovie.child('Videos').exists()) {
                upcPAS++;

                childMovie.child('Videos').forEach(childTrailer => {
                    let newLink = 'https://www.youtube.com/embed/' + childTrailer.val().key;
                    updates['upcomingMovies/' + childMovie.key + '/Videos/' + childTrailer.key + '/key'] = newLink;
                });
            }
            else
                upcDNE++;
        });

        return db.ref().update(updates).then(() => {
            return response.status(200).send(curTOT + ", " + curPAS + ", " + curDNE + ", " + upcTOT + ", " + upcPAS + ", " + upcDNE);
        }).catch(err => console.log(err.message));
    }).catch(err => {
        console.log(err.message);
    });
});

exports.addLocations = functions.https.onRequest((request, response) => {
    const body = request.body;
    var updates = {};
    var i = 0;
    for(location of body) {
        updates['locations/' + location.key] = location.value;
        i++
    }

    return Promise.all([db.ref().update(updates), response.status(200).send(i + " locations wrote")])
});

exports.addMoviesToLocation = functions.https.onRequest((request, response) => {
    const prom1 = db.ref('currentMovies').once('value');
    const keys = ["Eau Claire", "Chinook", "Sunridge", "Westhills", "Crowfoot", "CrossIron Mills"];

    var updates1 = {};
    for(location of keys) {
        updates1['locations/' + location + '/movies'] = null;
    }

    return db.ref().update(updates1).then(() => {
        return Promise.all([prom1]).then(values => {
            var arr = [0, 0, 0, 0, 0, 0];

            var curSnap = values[0];
            var updates2 = {};
            var i = 0;
    
            curSnap.forEach(movieSnap => {
                let movie = movieSnap.val();
                let random = Math.floor(Math.random() * Math.floor(6));
                let temp = arr[random];
                temp++;
                arr[random] = temp;

                updates2['locations/' + keys[random] + '/movies/' + movieSnap.key] = movie;
                i++;
            });

            var message = ("Chinook - " + arr[1] + ",\nCrossIron Mills - " + arr[5] + ",\nCrowfoot - " + arr[4]);
            message += (",\nEau Claire - " + arr[0] + ",\nSunridge - " + arr[2] + ",\nWesthills - " + arr[3]);
            return Promise.all([db.ref().update(updates2), response.status(200).send(message)]);
        });
    });    
});

exports.addShowings = functions.https.onRequest((request, response) => {
    const locationsRef = db.ref('locations').once('value');
    const types = ["Regular", "3D", "UltraAVX", "IMAX"];
    const prices = [5, 10, 15, 20];
    const times = ["900", "1130", "1400", "1630", "1900", "2130", "2359"];

    return locationsRef.then(locationsSnap => {
        var updates = {};

        locationsSnap.forEach(locationSnap => {
            var locationId = locationSnap.key;

            var theatreShows = [];
            var movieIds = [];

            locationSnap.child('theatres').forEach(theatreSnap => {
                for(time of times) {
                    theatreShows.push({
                        theatreNum: theatreSnap.val().theatreNum,
                        time: time,
                        movieId: ""
                    });
                }
            });

            var i = 0;
            locationSnap.child('movies').forEach(movieSnap => {
                movieIds.push(movieSnap.key);
                theatreShows[i].movieId = movieSnap.key;
                i++;
            });

            for(; i < theatreShows.length; i++) {
                let random = Math.floor(Math.random() * Math.floor(movieIds.length));
                theatreShows[i].movieId = movieIds[random];
            }

            for(let j = 0; j < movieIds.length; j++) {
                let id = movieIds[j];
                let shows = [];

                for(let k = 0; k < theatreShows.length; k++) {
                    if(theatreShows[k].movieId == id) {
                        let showID = db.ref('xyz').push().key;
                        let rand = Math.floor(Math.random() * Math.floor(types.length));

                        shows.push({
                            theatreNum: theatreShows[k].theatreNum,
                            time: theatreShows[k].time,
                            showID: showID,
                            type: types[rand],
                            price: prices[rand]
                        });
                    }
                }

                shows.sort(function(a, b) {
                    return Number(a.time) - Number(b.time);
                });

                updates['/locations/' + locationId + '/movies/' + id + '/Shows'] = shows;
            }

        });

        return Promise.all([db.ref().update(updates), response.status(200).send("done")]);
    });
});

exports.deleteAllData = functions.https.onRequest((request, response) => {
    const usersRef = db.ref('users').once('value');
    const locationsRef = db.ref('locations').once('value');

    return Promise.all([usersRef, locationsRef]).then(values => {
        const userSnap = values[0];
        const locationSnap = values[1];

        var updates = { };

        userSnap.forEach(uSnap => {
            updates['users/' + uSnap.key + '/messages'] = null;
            updates['users/' + uSnap.key + '/orders'] = null;
            updates['users/' + uSnap.key + '/tickets'] = null;
        });

        locationSnap.forEach(lSnap => {
            updates['locations/' + lSnap.key + '/bookedSeats'] = null;
            updates['locations/' + lSnap.key + '/orders'] = null;
        });
        
        return Promise.all([db.ref().update(updates), response.status(200).send("Done")]);
    }).catch(err => {
        console.log(err.message);
    });    
});

exports.updateCurrentMovies = functions.https.onRequest((request, response) => {
    const now = moment().unix();

    return db.ref('upcomingMovies').once('value').then(snap => {
        var updates = { };
        var valid = "";
        var invalid = "";

        snap.forEach(mSnap => {
            let movie = mSnap.val();

            if(movie.Released < now) {
                if(movie.Rated == "N/A" || movie.Runtime == "N/A" || movie.imdbRating == "N/A" || movie.BoxOffice == "N/A" || !movie.Videos || movie.Videos.length == 0) {
                    updates['upcomingMovies/' + mSnap.key] = null;
                    invalid += (mSnap.key + " - " + movie.Title + "\n");
                }
                else {
                    try {
                        let unix = Number(movie.Runtime.split(" ")[0]);

                        if(unix == null || unix == undefined || movie.Runtime.includes("N/A")) {
                            invalid += (mSnap.key + " - " + movie.Title + "\n");
                            updates['/upcomingMovies/' + mSnap.key] = null;     
                        }
                        else {
                            movie.Runtime = unix;
                            updates['currentMovies/' + mSnap.key] = movie;
                            valid += (mSnap.key + " - " + movie.Title + "\n");
                        }
                    }
                    catch(err) {                
                        console.log(mSnap.key, err);
                        invalid += (mSnap.key + " - " + movie.Title + "\n");
                        updates['upcomingMovies/' + mSnap.key] = null;
                    }   
                }
            }
        });

        var message = {
            valid: valid,
            invalid: invalid
        }
        
        return Promise.all([db.ref().update(updates), response.status(200).send(JSON.stringify(message))]);
    }).catch(err => {
        console.log(err.message);
    });   
});
