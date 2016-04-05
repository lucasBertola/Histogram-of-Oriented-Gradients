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
    this.extractHOG = function() {
        var histograms = this.extractHistograms();
        var a = this.extractHOGFromHistograms(histograms);
        return a;
    }


    this.extractHOGFromHistograms = function(histograms) {
        var blockSize = 2;
        var blockStride = 1;

        var normalize = this.L2;

        var blocks = [];
        var blocksHighMax = histograms.length - blockSize + 1;
        var blocksWideMax = histograms[0].length - blockSize + 1;


        for (var y = 0; y < blocksHighMax; y += blockStride) {
            for (var x = 0; x < blocksWideMax; x += blockStride) {
                var block = this.getBlock(histograms, x, y, blockSize);
                normalize(block);
                blocks.push(block);
            }
        }
        return Array.prototype.concat.apply([], blocks);
    }

    this.getBlock = function(histograms, x, y, blockSIze) {
        var square = [];
        for (var i = y; i < y + blockSIze; i++) {
            for (var j = x; j < x + blockSIze; j++) {
                square.push(histograms[i][j]);
            }
        }
        return Array.prototype.concat.apply([], square);
    }

    this.L2 = function(vector) {
        var epsilon = 0.00001;
        var sum = 0;
        for (var i = 0; i < vector.length; i++) {
            sum += Math.pow(vector[i], 2);
        }
        var denom = Math.sqrt(sum + epsilon);
        for (var i = 0; i < vector.length; i++) {
            vector[i] /= denom;
        }
    }
    this.extractHistograms = function() {
        var vectors = this.gradientVector();
        var cellSize = 8;
        var bins = 9;
        var cellsWide = Math.floor(vectors[0].length / cellSize);
        var cellsHigh = Math.floor(vectors.length / cellSize);

        var histograms = new Array(cellsHigh);

        for (var i = 0; i < cellsHigh; i++) {
            histograms[i] = new Array(cellsWide);

            for (var j = 0; j < cellsWide; j++) {
                histograms[i][j] = this.getHistogram(vectors, j * cellSize, i * cellSize,
                    cellSize, bins);
            }
        }
        return histograms;
    }

    this.getHistogram = function(elements, x, y, size, bins) {
        var histogram = Array.apply(null, Array(bins)).map(Number.prototype.valueOf, 0);

        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                var vector = elements[y + i][x + j];
                var bin = this.binFor(vector.angle, bins);
                histogram[bin] += vector.norme;
            }
        }
        return histogram;
    }

    this.binFor = function(radians, bins) {
        var angle = radians * (180 / Math.PI);
        angle += 180;
        angle %= 360;
        var bin = Math.floor(angle / 360 * bins);
        return bin;
    }


    this.gradientVector = function() {
        var height = this.image.length,
            width = this.image[0].length;

        var vectorArray = new Array(height);
        for (var heightIndex = 0; heightIndex < height; heightIndex++) {
            vectorArray[heightIndex] = new Array(width);
            for (var widthIndex = 0; widthIndex < width; widthIndex++) {
                var pixel = this.image[heightIndex][widthIndex];

                var topPixel = (heightIndex == 0) ? pixel : this.image[heightIndex - 0][widthIndex];
                var bottomPixel = (heightIndex == height - 1) ? pixel : this.image[heightIndex + 1][widthIndex];

                var leftPixel = (widthIndex == 0) ? pixel : this.image[heightIndex][widthIndex - 1];
                var rightPixel = (widthIndex == width - 1) ? pixel : this.image[heightIndex][widthIndex + 1];


                var vectorVerticalRGB = 0;

                switch (Math.max(Math.abs(-topPixel.r + bottomPixel.r), Math.abs(-topPixel.g + bottomPixel.g), Math.abs(-topPixel.b + bottomPixel.b))) {
                    case Math.abs(-topPixel.r + bottomPixel.r):
                        vectorVerticalRGB = -topPixel.r + bottomPixel.r;
                        break;
                    case Math.abs(-topPixel.g + bottomPixel.g):
                        vectorVerticalRGB = -topPixel.g + bottomPixel.g;
                        break;
                    case Math.abs(-topPixel.b + bottomPixel.b):
                        vectorVerticalRGB = -topPixel.b + bottomPixel.b;
                        break;

                }

                var vectorHorizontalRGB = 0;

                switch (Math.max(Math.abs(-leftPixel.r + rightPixel.r), Math.abs(-leftPixel.g + rightPixel.g), Math.abs(-leftPixel.b + rightPixel.b))) {
                    case Math.abs(-leftPixel.r + rightPixel.r):
                        vectorHorizontalRGB = -leftPixel.r + rightPixel.r;
                        break;
                    case Math.abs(-leftPixel.g + rightPixel.g):
                        vectorHorizontalRGB = -leftPixel.g + rightPixel.g;
                        break;
                    case Math.abs(-leftPixel.b + rightPixel.b):
                        vectorHorizontalRGB = -leftPixel.b + rightPixel.b;
                        break;

                }
                //var gradientVerticalNorme = 
                vectorArray[heightIndex][widthIndex] = {
                    norme: Math.sqrt(Math.pow(vectorHorizontalRGB, 2) + Math.pow(vectorVerticalRGB, 2)),
                    angle: Math.atan2(vectorVerticalRGB, vectorHorizontalRGB)
                }
            }
        }

        return vectorArray;
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