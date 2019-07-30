const app = require("express")();
const cors = require("cors");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

app.use(cors());

let gameId = new Array();

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/joingame", (req, res) => {
  if (gameId.length < 1) {
    gameId.push((Math.random() + 1).toString(36).slice(2, 18));
    res.json({ id: gameId[0], color: "black" });
  } else {
    res.json({ id: gameId[0], color: "white" });
    gameId = new Array();
  }

  const game = io.of(`/${gameId[0]}`);
  game.on("connection", socket => {
    console.log(socket.nsp.name);
    socket.on("action", msg => {
      console.log(msg);
      socket.broadcast.emit("action", msg);
    });
  });
});

http.listen(port, _ => {
  console.log(`Listenin' on port ${port} 🔥`);
});
