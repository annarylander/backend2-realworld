const express = require("express");
const path = require("path");

const app = express()
const PORT = 3000;

app.use(express.static("dist"));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get("/test", (_req, res) => {
  res.send("test");
});

app.listen(PORT, () => {
  console.log(`Started Express server on port ${PORT}`);
});

// nolle