# CPSC 471 Final Project (Winter 2018)
By: Satyaki Ghosh

## [Demo](https://cpsc471-6d9c6.firebaseapp.com)
    https://cinexpress.ghosh.xyz

#### The entire database for our project can be found in the file titled 'Database.json'. The database is in JSON format and can only be used for NoSQL databases.


## Getting started and setting up the project
1. [Install Node.js](https://nodejs.org/en/)
2. Open the Node.js terminal
3. Run this command using the terminal  
    `npm install -g cordova ionic`
4. Move to the project directory and run this command using the terminal  
    `npm install`
5. Start the application with command (Application will run on localhost)  
    `ionic serve` or   


## The Frontend is built using Ionic and the Backend uses Google Firebase
The backend code is in the functions folder, index.js file. All the code in the index.js file is deployed to Google Firebase which runs on a cloud platform. The code in this file is compiled using Node.js (a.k.a. not pure js). The frontend code is in the src folder.


## After cloning from GIT, make sure all the Node.js packages are installed correctly
    npm install


## To install a new Node.js library use
    npm install --save [library name]


## To run application using cordova plugins on a specific platform i.e. Android, iOS or Browser
1. The Android and iOS platforms must be setup first:   
    * [Android Setup](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html)  
    * [iOS Setup](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html)  
2. Then run command (platform can be: browser, android or ios):  
    [`ionic cordova run [platform]`](https://ionicframework.com/docs/cli/cordova/run/)  


## Docs for the framework, platforms, libraries and guides in this project
1. Ionic (UI/Frontend) Docs:  
    * [Getting Started with Ionic](https://ionicframework.com/getting-started)  
    * [Ionic Components](https://ionicframework.com/docs/components)  
    * [Ionic APIs](https://ionicframework.com/docs/api)  
2. Firebase (Authentication/Database/Backend) Docs:  
    * [Google Firebase](https://firebase.google.com/docs/)  
    * [Firebase Authentication](https://firebase.google.com/docs/auth)  
    * [Firebase Realtime Database](https://firebase.google.com/docs/database)  
    * [Firebase Library for Ionic/Angular](https://github.com/angular/angularfire2)  
3. [Apache Cordova (Cross-platform plugins and libraries)](https://cordova.apache.org/plugins/)  
4. [Node Package Manager (npm) Libraries](https://www.npmjs.com/)  
