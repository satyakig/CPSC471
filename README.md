## Getting started and setting up project:
1. Install Node.js
2. Run command:
    npm install -g cordova ionic
3. Move to this project directory and run command:
    npm install -E
4. To run the project:
    ionic serve


## To install all npm modules in package.json, ALWAYS and ONLY use:
npm install -E


## To install a NEW specfic package use:
npm install --save [package name]           # for the latest version
npm install --save [package name@version]   # for a specific version


## To run app with live-reload a.k.a to view the changes you made to the code as you are editing it:
ionic serve


## To view project in mobile view (default browser must be chrome):
1. ionic serve
2. Wait for chrome to open
3. Press ctrl + shift + j
4. Click on the "Toggle Device toolbar" button at the top right beside the "Elements" button (looks like a Tablet and a Phone)
5. You can select what kind of phone you want to view as frop the dropdown at the top
