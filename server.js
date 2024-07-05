const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;


app.use(cors());


app.use(express.static('public'));


const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /pdf|docx|jpg|jpeg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: File type not supported!');
        }
    }
}).single('file');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).send(err);
        } else {
            if (req.file == undefined) {
                return res.status(400).send('Error: No file selected!');
            } else {
                console.log(`Document Type: ${req.body['document-type']}`);
                return res.send('File uploaded successfully!');
            }
        }
    });
});

app.listen(port, () => console.log(`Server running on port ${port}`));



