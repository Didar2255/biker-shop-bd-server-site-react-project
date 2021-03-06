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
        const usersCollection = database.collection('users')
        const reviewsCollection = database.collection('reviews')

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
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = ordersCollection.find(query)
            const orders = await cursor.toArray()
            res.json(orders)
        })

        // get status api
        app.get('/updateStatus/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.findOne(query)
            res.send(result)
        })

        // admin get api
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query)
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true
            }
            res.json({ admin: isAdmin })
        })

        // review get api
        app.get('/reviews', async (req, res) => {
            const reviews = reviewsCollection.find({})
            const result = await reviews.toArray()
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

        // review post api
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review)
            res.json(result)
        })


        // save user post api
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.json(result)
        });

        // update status api
        app.put('/updateStatus/:id', async (req, res) => {
            const id = req.params.id;
            const newStatus = req.body;
            const filter = { _id: ObjectId(id) }
            const updateOrder = { $set: { status: newStatus.status } }
            const result = await ordersCollection.updateOne(filter, updateOrder)
            res.json(result)
        })

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const options = { upsert: true }
            const updateUser = { $set: user }
            const result = await usersCollection.updateOne(filter, updateUser, options)
            res.json(result)
        });

        // create admin api
        app.put('/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updateUser = { $set: { role: 'admin' } }
            const result = await usersCollection.updateOne(filter, updateUser)
            res.json(result)
        })


        // Delete Order api
        app.delete('/deleteOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query)
            res.json(result)
        })

        //Delete Product api 
        app.delete('/deleteProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(query)
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