var hogClass = require("../src/index.js");

var hog = new hogClass();
hog.getJPGImage(__dirname + "/img/chat1.jpg");
hog.exportJpg("/test.jpg");


//new hog();