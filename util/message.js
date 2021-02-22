const mongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
var dbUrl = "mongodb://localhost:27017/";

function addMessageToDb(obj, callback)
{
    mongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, dbHost) => {
        if(err)
        {
            console.log("Error connecting to the server: ", err);
            callback(false);
        }
        else
        {
            db = dbHost.db("simplilearnDb");
            db.collection("messageStore", (err, myColl) => {
                if(err)
                {
                    console.log("Error connecting to the collection: ", err);
                    callback(false);
                }
                else
                {
                    myColl.insertOne(obj, (err, result) => {
                        if(err)
                        {
                            console.log("Error inserting the document");
                            callback(false);
                        }
                        else
                        {
                            console.log("Number of documents inserted: ", result.insertedCount);
                            console.log("Inserted _id: ", result.insertedId);
                            console.log("Inserted document: ", result.ops);
                            callback(true);
                        }
                    })
                }
            })
        }
    })
}

function getMessages(dateOfJoining, callback)
{
    mongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, dbHost) => {
        if(err)
        {
            console.log("Error connecting to the server: ", err);
            callback(false);
        }
        else
        {
            db = dbHost.db("simplilearnDb");
            db.collection("messageStore", (err, myColl) => {
                if(err)
                {
                    console.log("Error connecting to the collection: ", err);
                    callback(false);
                }
                else
                {
                    var obj = {messageTime: {$gt: dateOfJoining}}
                    myColl.find(obj, {projection: {_id: 0}}).toArray((err, result) => {
                        if(err)
                        {
                            console.log("Error inserting the document");
                            callback(false);
                        }
                        else
                        {
                            console.log("Number of documents inserted: ", result.insertedCount);
                            console.log("Inserted _id: ", result.insertedId);
                            console.log("Inserted document: ", result.ops);
                            callback(result);
                        }
                    })
                }
            })
        }
    })
}

module.exports = { addMessageToDb, getMessages }