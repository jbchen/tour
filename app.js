const express = require('express');
const app = express();
app.use(express.static(__dirname)); 
let http = require('http').Server(app);
io = require('socket.io')(http);
const port = 3000;

http.listen(port, function() {
    console.log('listening on: ' + port + ' # ' + Date());
});
