const mongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
var dbUrl = "mongodb://localhost:27017/";

var usersArray = []

function addUser(obj, socket, callback)
{
    var tempUser = {
        username: obj.username,
        roomName: obj.roomName,
        socketID: socket.id
    }
    usersArray.push(tempUser);
    
    mongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, dbHost) => {
        if(err)
        {
            console.log("Error connecting to the server: ", err);
        }
        else
        {
            db = dbHost.db("simplilearnDb");
            db.collection("users", (err, myColl) => {
                if(err)
                {
                    console.log("Error connecting to the collection: ", err);
                }
                else
                {
                    tempUser.dateOfJoining = new Date();
                    var queryDoc = {username: tempUser.username, roomName: tempUser.roomName}
                    myColl.findOne(queryDoc, (err, result) => {
                        if(err)
                        {
                            console.log("Error during the read operation");
                        }
                        else
                        {
                            if(result)
                            {
                                // Username already exists in the room
                                console.log("Username already taken");
                                socket.emit("usernameExists", {message: "Username already exists"})
                            }
                            else
                            {
                                myColl.insertOne(tempUser, (err, result) => {
                                    if(err)
                                    {
                                        console.log("Error inserting the document");
                                    }
                                    else
                                    {
                                        console.log("Document inserted successfully");
                                        callback(true);
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    })
}

function getAllUsers()
{
    mongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, dbHost) => {
        if(err)
        {
            console.log("Error connecting to the server: ", err);
        }
        else
        {
            db = dbHost.db("simplilearnDb");
            db.collection("users", (err, myColl) => {
                if(err)
                {
                    console.log("Error connecting to the collection: ", err);
                }
                else
                {
                    myColl.find({}).toArray((err, result) => {
                        if(err)
                        {
                            console.log("Error finding the documents");
                        }
                        else
                        {
                            console.log("Document: ", result);
                            return result;
                        }
                    })
                }
            })
        }
    })
}

function getAllUsernames(roomName, io)
{
    // Returns only the usernames of the users in a particular room
    // var tempUserArray = usersArray.filter(item => item.roomName == roomName)
    // var usernameArray = tempUserArray.map(item => item.username)
    
    mongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, dbHost) => {
        if(err)
        {
            console.log("Error connecting to the server: ", err);
        }
        else
        {
            db = dbHost.db("simplilearnDb");
            db.collection("users", (err, myColl) => {
                if(err)
                {
                    console.log("Error connecting to the collection: ", err);
                }
                else
                {
                    myColl.find({roomName: roomName}, {projection: {_id: 0, username: 1}}).toArray((err, result) => {
                        if(err)
                        {
                            console.log("Error finding the documents");
                        }
                        else
                        {
                            console.log("Document: ", result);
                            var nameArray = result.map(item => item.username);
                            io.to(roomName).emit("usersList", nameArray);
                        }
                    })
                }
            })
        }
    })
}

function getUsername(id, callback)
{
    // Returns user corresponding to the socket ID
    // var userDetail = usersArray.find(item => item.socketID == id)
    // return userDetail.username

    mongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, dbHost) => {
        if(err)
        {
            console.log("Error connecting to the server: ", err);
        }
        else
        {
            db = dbHost.db("simplilearnDb");
            db.collection("users", (err, myColl) => {
                if(err)
                {
                    console.log("Error connecting to the collection: ", err);
                }
                else
                {
                    myColl.findOne({socketID: id}, {projection: {_id: 0, username: 1}}, (err, result) => {
                        if(err)
                        {
                            console.log("Error finding the document");
                        }
                        else
                        {
                            console.log("Document: ", result);
                            callback(result.username);
                        }
                    })
                }
            })
        }
    })
}

function getRoomName(id, callback)
{
    // var userDetail = usersArray.find(item => item.socketID == id)
    // return userDetail.roomName

    mongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, dbHost) => {
        if(err)
        {
            console.log("Error connecting to the server: ", err);
        }
        else
        {
            db = dbHost.db("simplilearnDb");
            db.collection("users", (err, myColl) => {
                if(err)
                {
                    console.log("Error connecting to the collection: ", err);
                }
                else
                {
                    myColl.findOne({socketID: id}, {projection: {_id: 0, roomName: 1}}, (err, result) => {
                        if(err)
                        {
                            console.log("Error finding the document");
                        }
                        else
                        {
                            console.log("Document: ", result);
                            callback(result.roomName);
                        }
                    })
                }
            })
        }
    })
}

function removeUser(id, callback)
{
    // Removes user from the usersArray
    mongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, dbHost) => {
        if(err)
        {
            console.log("Error connecting to the server: ", err);
            callback(false);
        }
        else
        {
            db = dbHost.db("simplilearnDb");
            db.collection("users", (err, myColl) => {
                if(err)
                {
                    console.log("Error connecting to the collection: ", err);
                    callback(false);
                }
                else
                {
                    myColl.deleteOne({socketID: id}, (err, result) => {
                        if(err)
                        {
                            console.log("Error finding the document");
                            callback(false);
                        }
                        else
                        {
                            console.log("Document is deleted");
                            callback(true);
                        }
                    })
                }
            })
        }
    })
}

function getSocketId(roomName, username, callback)
{
    // var user = usersArray.find(item => {
    //     if ((item.roomName == roomName) && (item.username == username)) {
    //         return true;
    //     }
    // })
    // return user.socketID
    
    mongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, dbHost) => {
        if(err)
        {
            console.log("Error connecting to the server: ", err);
        }
        else
        {
            db = dbHost.db("simplilearnDb");
            db.collection("users", (err, myColl) => {
                if(err)
                {
                    console.log("Error connecting to the collection: ", err);
                }
                else
                {
                    myColl.findOne({username: username, roomName: roomName}, {projection: {_id: 0, socketID: 1}}, (err, result) => {
                        if(err)
                        {
                            console.log("Error finding the document");
                        }
                        else
                        {
                            callback(result.socketID);
                        }
                    })
                }
            })
        }
    })
}

function getTimeOfJoining(username, roomName, callback)
{
    mongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, dbHost) => {
        if(err)
        {
            console.log("Error connecting to the server: ", err);
        }
        else
        {
            db = dbHost.db("simplilearnDb");
            db.collection("users", (err, myColl) => {
                if(err)
                {
                    console.log("Error connecting to the collection: ", err);
                }
                else
                {
                    myColl.findOne({username: username, roomName: roomName}, {projection: {_id: 0, dateOfJoining: 1}}, (err, result) => {
                        if(err)
                        {
                            console.log("Error finding the document");
                        }
                        else
                        {
                            callback(result.dateOfJoining);
                        }
                    })
                }
            })
        }
    })    
}

module.exports = { addUser, getAllUsers, getAllUsernames, getUsername, getRoomName, removeUser, getSocketId, getTimeOfJoining }