var jpeg = require('jpeg-js');
var fs = require('fs');


function Hog() {
    this.image = [];
    this.Outputimage = [];

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

        var height = this.Outputimage.length,
            width = this.Outputimage[0].length;

        var frameData = new Buffer(width * height * 4);
        var data = 0;
        while (data < frameData.length) {
            var j = data;
            frameData[data++] = this.Outputimage[Math.floor(j / (width * 4))][(j % (width * 4)) / 4].r; // red
            frameData[data++] = this.Outputimage[Math.floor(j / (width * 4))][(j % (width * 4)) / 4].g; // green
            frameData[data++] = this.Outputimage[Math.floor(j / (width * 4))][(j % (width * 4)) / 4].b; // blue
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



    this.gardient = function() {
        var height = this.image.length,
            width = this.image[0].length;

        for (var heightIndex = 0; heightIndex < height; heightIndex++) {
            this.Outputimage.push([]);
            for (var widthIndex = 0; widthIndex < width; widthIndex++) {
                var pixel = this.image[heightIndex][widthIndex];
                var topPixel = (heightIndex == 0) ? pixel : this.image[heightIndex - 0][widthIndex];
                var bottomPixel = (heightIndex == height - 1) ? pixel : this.image[heightIndex + 1][widthIndex];

                var leftPixel = (widthIndex == 0) ? pixel : this.image[heightIndex][widthIndex - 1];
                var rightPixel = (widthIndex == width - 1) ? pixel : this.image[heightIndex][widthIndex + 1];

                var maxGradientVertical = Math.max(Math.abs(-topPixel.r + bottomPixel.r), Math.abs(-topPixel.g + bottomPixel.g), Math.abs(-topPixel.b + bottomPixel.b));
                if (maxGradient > 255) maxGradient = 255;
                if (maxGradient < 0) maxGradient = 0;

                var maxGradientHorizontal = Math.max(Math.abs(-leftPixel.r + rightPixel.r), Math.abs(-leftPixel.g + rightPixel.g), Math.abs(-leftPixel.b + rightPixel.b));
                if (maxGradient > 255) maxGradient = 255;
                if (maxGradient < 0) maxGradient = 0;

                var maxGradient = Math.max(maxGradientVertical, maxGradientHorizontal)
                    //var maxGradient = Math.sqrt(Math.pow(maxGradientVertical, 2) + Math.pow(maxGradientHorizontal, 2))

                this.Outputimage[heightIndex].push({
                    r: maxGradient,
                    g: maxGradient,
                    b: maxGradient,
                })
            }
        }
    }




}

module.exports = Hog;