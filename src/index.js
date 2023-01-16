const express = require('express');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // esta v4 genera un id aleatorio

// inizializacion
const app = express();

//settings
app.set('port', 4000);
app.set('views', path.join(__dirname, 'views')); // indicar donde esta la carpeta 
app.set('view engine', 'ejs'); // motor de platillas

// middlewares
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/images'),
    filename: (req, file, cb) => { 
        //  cb(null, file.originalname); ----> guarde los archivos con el nombre original
        cb(null, uuidv4() + path.extname(file.originalname) // guarde la img con id aleatorio y su extension
        .toLocaleLowerCase()); //pase a minusculas
    }
});

app.use(multer({
    storage,
    dest: path.join(__dirname, 'public/images'),
    limits: {fileSize: 1000000}, //tamaño de la img MB 
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; //Tipo de img q quiero
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: El archivo debe ser una img valida");
    }
}).single('image'));

// Rutas
app.use(require('./routes/index.routes'));

// archivos estaticos  (para q la carpeta pueda ser accedida desde el navegador)
app.use(express.static(path.join(__dirname, 'public')));
// iniciar el servidor
app.listen(app.get('port'), () =>{
    console.log(`servidor listening on port ${app.get('port')}`);
});