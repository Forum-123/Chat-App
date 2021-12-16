var express = require("express");
var http = require("http");
var socketio = require("socket.io");
var fs = require("fs");
var path = require("path");
var myBuffer = Buffer.alloc(2048);

var { addUser, getAllUsers, getAllUsernames, getUsername, getRoomName, removeUser, getSocketId, getTimeOfJoining } = require("./util/users") // Destructing of the objects in the users.js file
var { addMessageToDb, getMessages } = require("./util/message");
const { json } = require("express");
const PORT = 3002;

var app = express();
var server = http.createServer(app); // Creating a HTTP server with express framework
var io = socketio(server);

app.use(express.static("public")); // Contents of public folder is accessible on front-end

// Event triggered whenever a new client connects (each client has an individual socket) - connection is a built-in event
io.on("connection", (socket) => {
    // Welcome the new user - message is a custom event
    socket.on("joinChatRoom", (obj) => {
        addUser(obj, socket, (p1) => {
            if(p1 == true)
            {
                socket.emit("message", { from: "Admin", msgDetails: "Welcome to " + obj.roomName });
                socket.join(obj.roomName);
                var tempObj = {
                    fromUser: "Admin",
                    message: `${obj.username} joined the conversation`,
                    messageTime: new Date(),
                    toUser: "Public"
                }
                addMessageToDb(tempObj, (flag) => {
                    if(flag == true)
                    {
                        socket.to(obj.roomName).broadcast.emit("message", {from: "Admin", msgDetails: `${obj.username} joined the conversation`}); // All users apart from current user are notified that a new user has joined
                        getAllUsernames(obj.roomName, io);
                    }
                });
            }
        });
    });
    
    // Whenever a user sends a message
    socket.on("chatMessage", (obj) => {
        var tempObj = {
            fromUser: obj.username,
            message: obj.message,
            messageTime: new Date(),
            toUser: "Public"
        }    
        addMessageToDb(tempObj, (flag) => {
            if(flag == true)
            {
                io.to(obj.roomName).emit("message", {from: obj.username, msgDetails: obj.message});
            }
        })
    });

    // Whenever a user sends a private message
    socket.on("privateChatMessage", (obj) => {
        var tempObj = {
            fromUser: obj.username,
            message: obj.message,
            messageTime: new Date(),
            toUser: obj.toUsername
        }
        addMessageToDb(tempObj, (flag) => {
            if(flag == true)
            {
                getSocketId(obj.roomName, obj.toUsername, (p1) => {
                    socketID = p1;
                    io.to(socketID).emit("privateMessage", {from: obj.username, msgDetails: obj.message});
                });
                io.to(socket.id).emit("privateMessage", {from: obj.username, msgDetails: obj.message});
            }
        })
    });

    // Event triggered when download chat button is clicked
    socket.on("downloadChat", (obj) => {
        getTimeOfJoining(obj.username, obj.roomName, (t1) => {
            var dateOfJoining = t1
            getMessages(dateOfJoining, (result) => {
                var fileUrl = path.join(__dirname, "public", "download.txt")
                myBuffer.write(JSON.stringify(result));
                fs.writeFile(fileUrl, myBuffer, (err) => {
                    if(!err)
                    {
                        socket.emit("sendFile", {fileUrl: "/download.txt"})
                    }
                })
            })
        })
    })
    
    // Event triggered whenever a user leaves
    socket.on("disconnect", () => {
        getUsername(socket.id, (p1) => {
            username = p1
            getRoomName(socket.id, (p1) => {
                roomName = p1
                var tempObj = {
                    fromUser: "Admin",
                    message: `${username} has left`,
                    messageTime: new Date(),
                    toUser: "Public"
                }
                addMessageToDb(tempObj, (flag) => {
                    if(flag == true)
                    {
                        socket.to(roomName).broadcast.emit("message", {from: "Admin", msgDetails: `${username} has left`}); // All users apart from current user are notified that a user has left
                        removeUser(socket.id, (flag) => {
                            if(flag == true)
                            {
                                getAllUsernames(roomName, io);
                            }
                        });
                    }
                })
            })
        });
    });
});

// Starts server
server.listen(process.env.PORT, '0.0.0.0', (err) => {
    if (!err)
        console.log(`Server is running on port ${PORT}`);
});
