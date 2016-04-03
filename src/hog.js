function Hog() {
    this.image = [];
    this.getJPGImage = function(path) {
        var jpeg = require('jpeg-js');
        var fs = require('fs');
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

    }

}

module.exports = Hog;