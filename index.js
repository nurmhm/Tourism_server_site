const express = require('express');
const bodyParser = require('body-parser');


const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
const corsOptions = {
    origin: ['http://localhost:5173','https://tourist-68a80.web.app'],
    credentials: true,
    optionSuccessStatus: 200,
  }
  app.use(cors(corsOptions))
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
  })
app.use(express.json());

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kv4807a.mongodb.net/your-database-name?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const tourestCollection = client.db('tourestCollectionDB').collection('spot');
        const countryCollection = client.db('countryCollectionDB').collection('country');


        app.post('/addspot', async (req, res) => {
            const newSpot = req.body;
            console.log(newSpot);
            const result = await tourestCollection.insertOne(newSpot);
            const results = await countryCollection.insertOne(newSpot);

            res.json({ result ,results});
        });
        //   update is here 

        app.put('/addspot/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const filter = { _id: new ObjectId(id) };
                const options = { upsert: true };
                const updateSpot = req.body;
        
                const product = {
                    $set: {
                        tourists_spot_name: updateSpot.tourists_spot_name,
                        country_name: updateSpot.country_name,
                        location: updateSpot.location,
                        short_description: updateSpot.short_description,
                        average_cost: updateSpot.average_cost,
                        seasonality: updateSpot.seasonality,
                        travel_time: updateSpot.travel_time,
                        total_visitors_per_year: updateSpot.total_visitors_per_year,
                    },
                };
        
                const result = await tourestCollection.updateOne(filter, product ,options);
                res.json(result);
            } catch (error) {
                console.error('Error updating tourist spot:', error);
                res.status(500).json({ error: 'An error occurred while updating the tourist spot.' });
            }
        });
        


        app.delete('/addspot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            console.log('ID to delete:', id);
            console.log('Query:', query);
            const result = await tourestCollection.deleteOne(query);
            console.log('Delete result:', result);

            res.send(result);
        });


        app.get('/addspot', async (req, res) => {
            try {
                const email = req.query.email;
                const query = { email: email };
                const result = await tourestCollection.find(query).toArray();
                res.send(result);

            } catch (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
            }
        });

        app.get('/addspot', async (req, res) => {
            const spots = await tourestCollection.find({}).toArray();
            res.json(spots);
        });
        app.get('/country', async (req, res) => {
            const spots = await countryCollection.find({}).toArray();
            res.json(spots);
        });

        app.get('/addspot', async (req, res) => {
            const spots = await tourestCollection.find({}).toArray();
            res.json(spots);
        });
        app.get('/addspot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await tourestCollection.findOne(query);
            res.send(result);
        });

        app.get('/', (req, res) => {
            res.send('It is working');
        });

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });



        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Don't close the client here to keep the connection open
    }
}

run().catch(console.dir);

