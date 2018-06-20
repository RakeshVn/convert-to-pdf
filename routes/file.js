var express = require('express');
var _router = express.Router();
var multer = require('multer');
var path = require('path');
var toPdf = require("office-to-pdf")
var fs = require("fs")


var store = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});


var upload = multer({
    storage: store
}).single('file');

_router.post('/upload', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return res.status(501).json({
                error: err
            });
        }
        var wordBuffer = fs.readFileSync("./uploads/" + req.file.filename)
        toPdf(wordBuffer).then(
            (pdfBuffer) => {
                filename = req.file.filename
                filename = filename.split('.')
                newfile = filename[0] + '.pdf'
                fs.writeFileSync("./uploads/" + newfile, pdfBuffer)
                return res.json({
                    originalname: newfile,
                    uploadname: newfile
                });

            }, (err) => {
                console.log(err)
            }
        )
    });
});


_router.post('/download', function (req, res, next) {
    filepath = path.join(__dirname, '../uploads') + '/' + req.body.filename;
    res.sendFile(filepath);
});

module.exports = _router;