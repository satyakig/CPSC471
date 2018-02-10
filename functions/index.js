const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.database();
const auth = admin.auth();

const http = require('request');
const momentTz = require('moment-timezone');
const moment = require('moment');



exports.fixCurrentNumbers = functions.https.onRequest((request, response) => {        

    return db.ref('/currentMovies').once('value', snap => {
        var updates = {};

        snap.forEach(childSnap => {
            i++;
            let movie = childSnap.val();

            updates['/currentMovies/' + childSnap.key + '/Runtime'] = Number(movie.Runtime.split(" ")[0]);
            updates['/currentMovies/' + childSnap.key + '/Released'] = moment(movie.Released, "DD MMM YYYY").unix();     
        });

        return Promise.all([db.ref().update(updates), response.status(200).send("done2")]);
    });
});

exports.fixUpcomingNumbers = functions.https.onRequest((request, response) => {    
    return db.ref('/upcomingMovies').once('value', snap => {
        var updates = {};

        snap.forEach(childSnap => {
            i++;
            let movie = childSnap.val();
            updates['/upcomingMovies/' + childSnap.key + '/Released'] = moment(movie.Released, "DD MMM YYYY").unix();     
        });

        return Promise.all([db.ref().update(updates), response.status(200).send("done2")]);
    });
});