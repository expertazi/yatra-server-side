const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
// const axios = require("axios").default;

const app = express();
const port = process.env.PORT || 5000;

// Middlewar
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h7zca.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("insertEventDB");
    const eventCollection = database.collection("events");
    const usersCollection = database.collection("users");

    // get api
    app.get("/events", async (req, res) => {
      const cursor = eventCollection.find({});
      const events = await cursor.toArray();
      res.send(events);
    });
    // get api
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const events = await cursor.toArray();
      res.send(events);
    });
    // get api for users
    app.get("/users/:email", async (req, res) => {
      const cursor = usersCollection.find({ email: req.params.email });
      const events = await cursor.toArray();
      res.send(events);
    });

    // Post Api
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log("hit the api", user);
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    // Get one User
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.findOne(query);
      console.log("finding one User", result);
      res.send(result);
    });

    // Update Api
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      console.log(updatedUser);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updatedUser.status,
        },
      };
      console.log(updateDoc);
      const resut = await usersCollection.updateOne(filter, updateDoc, options);

      console.log("Updating User", id);
      res.json(resut);
    });

    // Delete Api
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      console.log("deleteing the User", result);

      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running My Curd Server");
});

app.listen(port, () => {
  console.log("Running server On port", port);
});
