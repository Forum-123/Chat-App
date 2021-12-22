# Chat Application

Chat application using Node JS, Express JS, Socket.io and MongoDB

- When a user joins a room, the other users already in the room will be notified.
- Users are able to send messages publicly and privately to the other users in the room.
- Users can download the chat history in a `download.txt` file.
- Users will be removed from the database as soon as they leave the room and the other users still in the room will be notified that they have left.

## Installation & Usage

1. Clone the repository
```
git clone https://github.com/Forum-123/Chat-App.git
cd Chat-App/
```
2. Install dependencies with `npm install`
3. Start the application by running `npm run dev` or `npm run start`
4. Navigate to `http://localhost:3002/`

## Bugs

- [ ] Currently, if a user refreshes the page, the application will crash.
- [ ] The download history shows all the messages sent by any user publicly and privately in any room from the moment that user joined the application. However, it should only contain the messages sent by that user publicly or privately in the current room they are in as well as any public or private messages sent to them.
- [ ] When a user clicks the download button, it notifies the other users in the room that the user has left the room when they have not. So that user is unable to send or receive any messages after they click the download button. The other users seem to remain in the room but they cannot leave as the application crashes and they stay in the database. The database has to be cleared manually for the user to rejoin the room with the same name after the application is redeployed.
