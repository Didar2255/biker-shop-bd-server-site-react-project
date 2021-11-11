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
        // get all product get api

        app.get("/products", async (req, res) => {
            const allProduct = productsCollection.find({})
            const result = await allProduct.limit(6).toArray()
            console.log(result)
            res.send(result)

        })

        // post api
        app.post('/products', async (req, res) => {
            const products = req.body;
            const result = await productsCollection.insertOne(products)
            console.log(result)
            res.json(result)
        })
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