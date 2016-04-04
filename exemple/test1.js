var hogClass = require("../src/index.js");

/*
var hog = new hogClass();
hog.getJPGImage(__dirname + "/imgTest/chat1.jpg");
hog.gardient();
hog.exportJpg(__dirname + "/imgResult/chat1.jpg");

var hog = new hogClass();
hog.getJPGImage(__dirname + "/imgTest/chat2.jpg");
hog.gardient();
hog.exportJpg(__dirname + "/imgResult/chat2.jpg");

var hog = new hogClass();
hog.getJPGImage(__dirname + "/imgTest/lapin1.jpg");
hog.gardient();
hog.exportJpg(__dirname + "/imgResult/lapin1.jpg");

var hog = new hogClass();
hog.getJPGImage(__dirname + "/imgTest/chien1.jpg");
hog.gardient();
hog.exportJpg(__dirname + "/imgResult/chien1.jpg");

var hog = new hogClass();
hog.getJPGImage(__dirname + "/imgTest/passant1.jpg");
hog.gardient();
hog.exportJpg(__dirname + "/imgResult/passant1.jpg");
*/
var hog = new hogClass();
hog.getJPGImage(__dirname + "/imgTest/chien2.jpg");
hog.extractHOG();
//hog.exportJpg(__dirname + "/imgResult/chien2.jpg");