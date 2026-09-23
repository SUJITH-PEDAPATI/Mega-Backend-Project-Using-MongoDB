import express, { response } from 'express'
import 'dotenv/config'
import logger from './logger.js';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT || 3000;

// Accepting the data from the frontend as well'
app.use(express.json())

// Morgan Format defines how the information needs to come !
const morganFormat = ":method :url :status :response-time ms"

// Middleware is being injected
app.use(morgan(morganFormat, {
    stream: {
        write: (message) => {
            const logObject = {
                // Message is basically a string, we are basically stripping it off to get the required information
                method: message.split(' ')[0],
                url: message.split(' ')[1], // Just the endpoints
                status: message.split(' ')[2],
                responseTime: message.split(' ')[3]
            };
            logger.info(JSON.stringify(logObject));
        }
    }
}));

let teaData = [];
let nextId = 1;

// Add a New Tea
app.post("/teas", (req,res) => {
    logger.info("A POST request is made to add a new tea!")
    const {name,price} = req.body;
    const newTea = {id: nextId++,name,price};
    teaData.push(newTea);
    res.status(201).send(newTea);
});

// Get all Teas
app.get('/teas',(req,res) => {
    res.status(200).send(teaData);
})

// Get a tea with a Id
app.get('/teas/:id',(req,res) => {
    const tea = teaData.find(t => t.id === parseInt(req.params.id));
    if (!tea) {
        return res.status(404).send("Status Not Found!");
    }
    res.status(200).send(tea);
});


// Update the tea
app.put('/teas/:id',(req,res) => {
    const tea = teaData.find(t => t.id === parseInt(req.params.id));
    if (!tea) {
        return res.status(404).send("Status Not Found!");
    }
    const {name,price} = req.body;
    tea.name = name;
    tea.price = price;
    res.status(200).send(tea);
});

// Deletes the Tea
app.delete("/tea/:id",(req,res) => {
    teaData.findIndex( t => t.id === parseInt(req.params.id));
    if (index === -1){
        return res.status(404).send("Tea Not Found!");
    }
    teaData.splice(index, 1);
    res.status(204).send("Deleted the Tea!!!!");
});


app.listen(port,() => {
    console.log(`Server is running at port:${port}....`);
})