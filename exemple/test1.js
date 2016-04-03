var hogClass = require("../src/index.js");


var hog = new hogClass();
hog.getJPGImage(__dirname + "/imgTest/chat1.jpg");
hog.gardient();
hog.exportJpg("/chat1-1.jpg");

var hog = new hogClass();
hog.getJPGImage(__dirname + "/imgTest/chat2.jpg");
hog.gardient();
hog.exportJpg("/chat2-1.jpg");

var hog = new hogClass();
hog.getJPGImage(__dirname + "/imgTest/lapin1.jpg");
hog.gardient();
hog.exportJpg("/lapin1-1.jpg");

var hog = new hogClass();
hog.getJPGImage(__dirname + "/imgTest/ballon1.jpg");
hog.gardient();
hog.exportJpg("/ballon1-1.jpg");




var hog = new hogClass();
hog.getJPGImage(__dirname + "/imgTest/chien1.jpg");
hog.gardient();
hog.exportJpg("/chien1-1.jpg");
//new hog();