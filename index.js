var csv = require("fast-csv");
var fs = require("fs");
var winston = require("winston");
var stream = fs.createReadStream("dataset.csv");

var JsBarcode = require('jsbarcode');
var { createCanvas } = require("canvas");


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'waste.log', level: 'info' })
    ]
});

csv
    .fromStream(stream, {headers : true})
    .on("data", function(data){
            if(data.Error == "True") {
                //logger.log({level: 'info', message: data});
                logger.info(data);
                return;
            } else
                {

                var canvas = createCanvas(data.Width, data.Height);
                JsBarcode(canvas, data.ID);

                var outputStream = canvas.createPNGStream();

                var out = fs.createWriteStream(__dirname + '/img/' + data.ID + '.png');
                outputStream.pipe(out);
                out.on('finish', () => console.log("ok"));



               /*
                outputStream.on('data', (chunk) => {
                    fs.appendFile(__dirname + '/img/' + data.ID + '.png', chunk);
                });
                outputStream.on('end', () => {
                    console.log(__dirname + '/img/' + data.ID + '.png is written')
                })*/
            }
    })
    .on("end", function(){
        console.log("done");
    });
