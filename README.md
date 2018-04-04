## Getting started and setting up the project
1. [Install Node.js](https://nodejs.org/en/)
2. Open the Node.js terminal
3. Run this command using the terminal
    npm install -g cordova ionic
4. Move to the project directory and run this command using the terminal
    npm install -E  
5. Start the application with command (Application will run on localhost) 
    ionic serve  


## The Frontend is built using Ionic and the Backend uses Google Firebase
The backend code is in the functions folder, index.js file. All the code in the index.js file is deployed to Google Firebase which runs on a cloud platform. The code in this file is compiled using Node.js (a.k.a. not pure js)  
The frontend code is in the src folder


## After cloning from GIT, make sure all the Node.js packages are installed correctly
    npm install -E


## To install a new Node.js library use
    npm install --save [library name]


## To run application using cordova plugins on a specific platform i.e. Android, iOS or Browser
1. The Android and iOS platforms must be setup first:   
    * [Android Setup](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html)  
    * [iOS Setup](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html)  
2. Then (browser, android or ios):  
    [ionic cordova run --platform](https://ionicframework.com/docs/cli/cordova/run/)  


## Docs for the framework, platforms, libraries and guides in this project
1. Ionic (UI/Frontend) Docs:  
    * [Getting Started with Ionic](https://ionicframework.com/getting-started)
    * [Ionic Components](https://ionicframework.com/docs/components)
    * [Ionic APIs](https://ionicframework.com/docs/api)

2. Firebase (Authentication/Database/Backend) Docs:  
    * [Firebase Authentication](https://firebase.google.com/docs/auth)
    * [Firebase Database](https://firebase.google.com/docs/database)
    * [Firebase for Ionic/Angular](https://github.com/angular/angularfire2)

3. [Apache Cordova (Cross-platform plugins and libraries)](https://cordova.apache.org/plugins/)

4. [Node Package Manager (npm) Libraries](https://www.npmjs.com/)


## [Demo](https://cpsc471-6d9c6.firebaseapp.com)
    https://cpsc471-6d9c6.firebaseapp.com
