// const express = require('express');

// const bodyParser = require('body-parser');

// const authRoutes = require('./routes/auth');

// const errorController = require('./controllers/error');

// const app = express();

// const ports = process.env.PORT || 3000;

// var cors = require('cors')

// app.use(cors())

// app.use(bodyParser.json());

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Origin', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Origin', 'Content-Type', 'Authorization');
//     next();
// })

// app.use('/auth', authRoutes);

// app.use(errorController.get404);

// app.use(errorController.get500);

// app.listen(ports, () => console.log(`Listening on port ${ports}`));


require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const errorController = require('./controllers/error');
const cors = require('cors');
const path = require('path');

const app = express();
const ports = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:4200', // frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);

app.use('/products', productsRoutes);

app.use(errorController.get404);
app.use(errorController.get500);

app.listen(ports, () => console.log(`Listening on port ${ports}`));
