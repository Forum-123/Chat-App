var chatMessages = document.getElementById("chatMessages");
var roomHeading = document.getElementById("roomHeading");

// Colours
const customdark = "#0F3057";
const customgrey = "#A6A9B6";
const customlightblue = "#EFF8FF";
const customviolet = "#C9CBFF";

function sendMessageEventHandler() {
    // Triggered when the user clicks on Send button
    var txtMessage = document.getElementById("txtMessage").value;
    document.getElementById("txtMessage").value = "";
    // Send message to server
    socket.emit("chatMessage", { username: username, message: txtMessage, roomName: roomName });
}

function sendMessagePrivatelyEventHandler(){
    var txtMessage = document.getElementById("txtMessagePrivate").value;
    var selectedIndex = document.getElementById("membersDD").selectedIndex;
    var toUsername = document.getElementById("membersDD").options[selectedIndex].value;
    console.log("To username: " + toUsername)
    document.getElementById("txtMessagePrivate").value = "";
    socket.emit("privateChatMessage", { username: username, message: txtMessage, roomName: roomName, toUsername: toUsername });
}

function downloadChat()
{
    socket.emit("downloadChat", {username: username, roomName: roomName})
}

var obj = Qs.parse(location.search, { ignoreQueryPrefix: true });
console.log(obj);
var username = obj.txtUsername;
var roomName = obj.roomName;
roomHeading.innerHTML = roomName

const socket = io();

// Handle the message event in server.js file
socket.on("message", (obj) => {
    var paraElement = document.createElement("p");
    var str1 = `${obj.from}: ${obj.msgDetails}`
    var textElement = document.createTextNode(str1);
    var spanElement = document.createElement("span");
    var messageTime = new Date();
    var messageTimeElement = document.createTextNode(messageTime);
    paraElement.style.backgroundColor = "white";
    paraElement.style.color = "black";
    paraElement.style.border = "2px solid #A6A9B6";
    paraElement.style.borderRadius = "5px";
    paraElement.style.width = "60%";
    paraElement.style.float = "left";
    paraElement.style.marginBottom = "0px";
    paraElement.style.display = "inlineBlock";
    paraElement.style.padding = "5px";
    spanElement.style.color = "#A6A9B6";
    spanElement.style.fontSize = "10px";
    spanElement.style.display = "flex";
    spanElement.style.width = "100%";
    spanElement.style.marginBottom = "1em";

    if (obj.from == username) {
        paraElement.style.backgroundColor = customlightblue;
        paraElement.style.color = "black";
        paraElement.style.border = "2px solid #A6A9B6";
        paraElement.style.borderRadius = "5px";
        paraElement.style.width = "60%";
        paraElement.style.float = "right";
        paraElement.style.marginBottom = "0px";
        paraElement.style.display = "inlineBlock";
        paraElement.style.padding = "5px";
        spanElement.style.flexFlow = "row-reverse";
    };

    if (obj.from == "Admin") {      
        paraElement.style.backgroundColor = customdark;
        paraElement.style.color = "white";
        paraElement.style.border = "2px solid black";
        paraElement.style.borderRadius = "5px";
        paraElement.style.width = "100%";
        paraElement.style.marginBottom = "0px";
        paraElement.style.display = "inlineBlock";
        paraElement.style.padding = "5px";
        spanElement.style.flexFlow = "row-reverse";
    };

    paraElement.appendChild(textElement);
    chatMessages.appendChild(paraElement);

    spanElement.appendChild(messageTimeElement);
    chatMessages.appendChild(spanElement);
});

socket.on("privateMessage", (obj) => {
    var paraElement = document.createElement("p");
    var str1 = `${obj.from} (Privately): ${obj.msgDetails}`
    var textElement = document.createTextNode(str1);
    var spanElement = document.createElement("span");
    var messageTime = new Date();
    var messageTimeElement = document.createTextNode(messageTime);
    paraElement.style.backgroundColor = customviolet;
    paraElement.style.color = "white";
    paraElement.style.border = "2px solid #A6A9B6";
    paraElement.style.borderRadius = "5px";
    paraElement.style.width = "60%";
    paraElement.style.float = "left";
    paraElement.style.marginBottom = "0px";
    paraElement.style.display = "inlineBlock";
    paraElement.style.padding = "5px";
    spanElement.style.color = "#A6A9B6";
    spanElement.style.fontSize = "10px";
    spanElement.style.display = "flex";
    spanElement.style.width = "100%";
    spanElement.style.marginBottom = "1em";

    if (obj.from == username) {
        paraElement.style.backgroundColor = customviolet;
        paraElement.style.color = "white";
        paraElement.style.border = "2px solid #A6A9B6";
        paraElement.style.borderRadius = "5px";
        paraElement.style.width = "60%";
        paraElement.style.float = "right";
        paraElement.style.marginBottom = "0px";
        paraElement.style.display = "inlineBlock";
        paraElement.style.padding = "5px";
        spanElement.style.flexFlow = "row-reverse";
    };

    paraElement.appendChild(textElement);
    chatMessages.appendChild(paraElement);

    spanElement.appendChild(messageTimeElement);
    chatMessages.appendChild(spanElement);
})

socket.emit("joinChatRoom", { username: username, roomName: roomName });

socket.on("usersList", (usersArray) => {
    var ulList = document.getElementById("usernamesUL");
    ulList.innerHTML = "";
    var selectList = document.getElementById("membersDD");
    selectList.innerHTML = ""
    for (var i = 0; i < usersArray.length; i++) {
        var liElement = document.createElement("li")
        var textElement = document.createTextNode(usersArray[i])
        liElement.appendChild(textElement);
        ulList.appendChild(liElement);
    }
    for (var i = 0; i < usersArray.length; i++) {
        if (usersArray[i] != username) {
            var optionElement = document.createElement("option")
            var textElement = document.createTextNode(usersArray[i])
            optionElement.appendChild(textElement)
            selectList.appendChild(optionElement)
        }
    }
});

// Triggered when username already exists in the room
socket.on("usernameExists", (obj) => {
    console.log("Username event triggered");
    location.href = "/";
    alert("Username already exists");
})

socket.on("sendFile", (obj) => {
    location.href = obj.fileUrl;
})
