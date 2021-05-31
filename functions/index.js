const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")('sk_test_51IwKKoSF05AI07zE6tnj5WwLl3ffHdanE100kVuAZnD1I2PYCHjJVyENzhin3Eovn6Oz8Sl86zvArXwdsWnZ1LR800X8B5WULz')

//API

//API config
const app = express();

//Middleware
app.use(cors({origin:true}));
app.use(express.json());

//API routes
app.get('/', (request,response) => response.status(200).send('hello world'))

app.post('/payments/create', async(request,response) => {
    const total = request.query.total;

    console.log('payment request received', total)

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total, //subunits of the currency
        currency: "usd",
    });

    //ok- created
    response.status(201).send({
        clientSecret: paymentIntent.client_secret
    })
})


//Listen command
exports.api = functions.https.onRequest(app)

//end point
//http://localhost:5001/app-74e2a/us-central1/api