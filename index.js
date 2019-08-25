const app = require("express")();
const cors = require("cors");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

app.use(cors());

let gameId = new Array();

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
    socket.broadcast.emit("connection");

    socket.on("action", msg => {
      socket.broadcast.emit("action", msg);
    });

    socket.on("disconnect", _ => {
      socket.broadcast.emit("playerLeft");
    });
  });
});

http.listen(port, _ => {
  console.log(`Listenin' on port ${port} 🔥`);
});
