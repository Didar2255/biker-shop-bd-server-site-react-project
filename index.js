const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// Middle ware
app.use(cors())
app.use(express.json())

// database Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gzbym.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db('BikerShopDb')
        const productsCollection = database.collection('products')
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Welcome to Biker Shop BD')
})
app.listen(port, () => {
    console.log('Listing port are :', port)
})