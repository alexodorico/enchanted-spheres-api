var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000;

let gameId = new Array();

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/joingame", (req, res) => {
  if (gameId.length < 1) {
    gameId.push((Math.random() + 1).toString(36).slice(2, 18));
    res.json({ id: gameId[0] });
  } else {
    res.json({ id: gameId[0] });
    gameId = new Array();
  }

  const room = io.of(`/${gameId[0]}`);
  room.on("connection", socket => {
    console.log(socket.nsp.name);
    socket.on("action", msg => {
      socket.broadcast.emit("action", msg);
    });
  });
});

http.listen(port, function() {
  console.log("listening on *:" + port);
});
