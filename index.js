const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ghkwm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // Connecting code with mongobd 
        await client.connect();
        const database = client.db('EGovernance');
        const usersCollection = database.collection('usersInfo');
        const applicationCollection = database.collection('applications');
        //find user by email
        app.get('/users/:email', async (req, res) => {
            const userEmail = req.params.email;
            const query = { email: `${userEmail}` }
            const user = await (usersCollection.findOne(query));
            res.json(user);
        })
        //Find applications by id
        app.get('/applications/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await (applicationCollection.findOne(query));
            res.json(user);
        })
        //find all aplication
        app.get('/applications', async (req, res) => {
            const cursor = await (applicationCollection.find({}));
            const user = await cursor.toArray();
            res.send(user)
        })

        //add user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });
        //UPDATE user
        app.put('/user/:email', async (req, res) => {

            const userEmail = req.params.email;
            const updatedUserInfo = req.body;
            const filter = { email: `${userEmail}` };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    citizenFullName: updatedUserInfo.citizenFullName,
                    DOB: updatedUserInfo.DOB,
                    citizenGender: updatedUserInfo.citizenGender,
                    citizenReligion: updatedUserInfo.citizenReligion,
                    citizenMaritalStatus: updatedUserInfo.citizenMaritalStatus,
                    citizenContactNumber: updatedUserInfo.citizenContactNumber,
                    permanentDistrictName: updatedUserInfo.permanentDistrictName,
                    permanentPoliceStation: updatedUserInfo.permanentPoliceStation,
                    permanentPostOffice: updatedUserInfo.permanentPostOffice,
                    permanentPostalCode: updatedUserInfo.permanentPostalCode,
                    permanentUPName: updatedUserInfo.permanentUPName,
                    permanentCVH: updatedUserInfo.permanentCVH,
                    presentDistrictName: updatedUserInfo.presentDistrictName,
                    presentPoliceStation: updatedUserInfo.presentPoliceStation,
                    presentPostOffice: updatedUserInfo.presentPostOffice,
                    presentPostalCode: updatedUserInfo.presentPostalCode,
                    presentUPName: updatedUserInfo.presentUPName,
                    presentCVH: updatedUserInfo.presentCVH,
                    citizenFatherName: updatedUserInfo.citizenFatherName,
                    citizenFatherNID: updatedUserInfo.citizenFatherNID,
                    citizenMotherName: updatedUserInfo.citizenMotherName,
                    citizenMotherNID: updatedUserInfo.citizenMotherNID
                }
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options)

            res.send(result);
        })
        //Update user info
        app.put('/updateUser/:email', async (req, res) => {

            const userEmail = req.params.email;
            const updatedUserInfo = req.body;
            const filter = { email: `${userEmail}` };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    citizenFullName: updatedUserInfo.citizenFullName,
                    citizenContactNumber: updatedUserInfo.citizenContactNumber,
                    presentDistrictName: updatedUserInfo.presentDistrictName,
                    presentPoliceStation: updatedUserInfo.presentPoliceStation,
                    presentPostOffice: updatedUserInfo.presentPostOffice,
                    presentPostalCode: updatedUserInfo.presentPostalCode,
                    presentUPName: updatedUserInfo.presentUPName,
                    presentCVH: updatedUserInfo.presentCVH,
                }
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options)

            res.send(result);
        })
        //UPDATE Admin
        app.put('/admin/:email', async (req, res) => {

            const userEmail = req.params.email;
            const updatedUserInfo = req.body;
            const filter = { email: `${userEmail}` };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    role: updatedUserInfo.role
                }
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options)

            res.send(result);
        })

        //UPDATE status
        app.put('/applicationStatus/:id', async (req, res) => {
            const id = req.params.id
            const updatedStatusInfo = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    applicationStatus: updatedStatusInfo.applicationStatus,
                    approvedDate: updatedStatusInfo.approvedDate
                }
            };
            const result = await applicationCollection.updateOne(filter, updateDoc, options)

            res.send(result);
        });

        //Add Birth Certificate Applications
        app.post('/allApplications', async (req, res) => {
            const newApplication = req.body;
            const result = await applicationCollection.insertOne(newApplication);
            res.json(result);
        });

        //DELETE application
        app.delete('/applicationDelete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await applicationCollection.deleteOne(query);
            res.json(result);
        });
    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('E-Governance Server is running');
});


app.listen(port, () => {
    console.log("Listing from port = ", port);
})