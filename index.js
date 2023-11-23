const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const mime = require("mime-types");
const fs = require("fs");
const middleware = require("./middleware");
const functions = require("./functions");

const port = process.env.PORT || 1150;
// Common
const d = new Date();
const year = d.getFullYear();
const month = d.getMonth() + 1;
const base_path = "static/upload/" + year + "/" + month;
const crt_path = multer({
  dest: base_path,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(file.mimetype);
    cb(null, base_path);
  },
  filename: function (req, file, cb) {
    // console.log(file.originalname);
    const extension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + functions.randomCode() + "." + extension);
  },
});

const upload = multer({ storage: storage });

app.post("/upload/file", upload.array("files"), middleware, (req, res) => {
  res.json(req.files);
});

app.get("/file/?", (req, res) => {
  let path = req.query.f;
  const mimeType = mime.lookup(path);
  //   console.log(mimeType);
  // const extension = mimeType.split("/")[0];
  //   console.log(extension);
  let file = path;
  fileToLoad = fs.readFileSync(file);
  res.writeHead(200, { "Content-Type": mimeType });
  res.end(fileToLoad, "binary");
});

app.delete("/file/?", (req, res) => {
  let path = req.query.f;
  var filePath = path;
  fs.unlinkSync(filePath);
  res.end();
});

app.use(express.json(), cors());
app.get("/", (req, res) => {
  res.send("Hello! Node.js");
});

app.listen(port, () => {
  console.log("Starting node.js at port " + port);
});
