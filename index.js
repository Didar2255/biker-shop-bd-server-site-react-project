const express = require('express')
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const { MongoClient } = require('mongodb');
const { query } = require('express');
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
        const ordersCollection = database.collection('orders')

        // get all product get api
        app.get("/products", async (req, res) => {
            const allProduct = productsCollection.find({})
            const result = await allProduct.toArray()
            res.send(result)
        })

        //get product by id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id
            const result = await productsCollection.find({ _id: ObjectId(id) }).toArray()
            res.send(result[0])
        })

        // get all order api
        app.get('/allOrder', async (req, res) => {
            const orders = ordersCollection.find({})
            const result = await orders.toArray()
            res.send(result)
        })

        // get order by email 
        app.get('/allOrder', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await ordersCollection.find(query).toArray()
            res.send(result)
        })

        // post api
        app.post('/products', async (req, res) => {
            const products = req.body;
            const result = await productsCollection.insertOne(products)
            res.json(result)
        })

        // ordered post api
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            res.json(result)
        })

        // delete Order api
        app.delete('/deleteOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query)
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