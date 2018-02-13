const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.database();
const auth = admin.auth();

const http = require('request');
const momentTz = require('moment-timezone');
const moment = require('moment');


/**
 * methods to fix up the database
 */
exports.fixCurrentNumbers = functions.https.onRequest((request, response) => {        

    return db.ref('/currentMovies').once('value', snap => {
        var updates = {};

        let i = 0, j = 0;
        snap.forEach(childSnap => {
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

        return Promise.all([db.ref().update(updates), response.status(200).send(j + " current movies passed, " + (i-j) + " movies failed, " + i)]);
    }).catch(err => {
        console.log(err.message);
    });
});

exports.fixUpcomingNumbers = functions.https.onRequest((request, response) => {    
    return db.ref('/upcomingMovies').once('value', snap => {
        var updates = {};

        let i = 0, j = 0;
        snap.forEach(childSnap => {
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

        return Promise.all([db.ref().update(updates), response.status(200).send(j + " upcoming movies passed, " + (i-j) + " movies failed, " + i)]);
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
    })
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