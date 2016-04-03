var jpeg = require('jpeg-js');
var fs = require('fs');


function Hog() {
    this.image = [];
    this.getJPGImage = function(path) {
        //todo remove sync
        var jpegData = fs.readFileSync(path);
        var imageTmp = jpeg.decode(jpegData);
        var width = imageTmp.width;
        var heigth = imageTmp.height;
        this.image = [];

        for (var dataIndex = 0; dataIndex < imageTmp.data.length; dataIndex += 4) {
            //new line
            if (dataIndex % (width * 4) == 0) {
                this.image.push([]);
            }
            this.image[this.image.length - 1].push({
                r: imageTmp.data[dataIndex],
                g: imageTmp.data[dataIndex + 1],
                b: imageTmp.data[dataIndex + 2]
                    //TODO a:imageTmp.data[dataIndex + 3]
            })
        }
        return this.image;
    }


    this.exportJpg = function(path) {

        var height = this.image.length,
            width = this.image[0].length;

        var frameData = new Buffer(width * height * 4);
        var data = 0;
        while (data < frameData.length) {
            var j = data;
            frameData[data++] = this.image[Math.floor(j / (width * 4))][(j % (width * 4)) / 4].r; // red
            frameData[data++] = this.image[Math.floor(j / (width * 4))][(j % (width * 4)) / 4].g; // green
            frameData[data++] = this.image[Math.floor(j / (width * 4))][(j % (width * 4)) / 4].b; // blue
            frameData[data++] = 0xFF; // alpha - ignored in JPEGs
        }
        var rawImageData = {
            data: frameData,
            width: width,
            height: height
        };
        var jpegImageData = jpeg.encode(rawImageData, 100);
        fs.writeFileSync(path, jpegImageData.data);

    }



}

module.exports = Hog;