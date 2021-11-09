require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const dns = require("dns");

/*
-Gonna need to setup the DB
*/

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/public", express.static(`${process.cwd()}/public`));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const urlSchema = new Schema({ original_url: { type: String, unique: true } });
const Url = mongoose.model("url", urlSchema);

app.post("/api/shorturl", (req, res) => {
  console.log("original_url: " + req.body.url);
  const bodyUrl = req.body.url;
  //dns.lookup(bodyUrl);
  const urlObj = new Url({ original_url: req.body.url });

  urlObj.save((err, data) => {
    if (err) {
      res.json({ error: "Invalid Url" });
    }
    res.json({ original_url: data.original_url, short_url: data.id });
  });
});

app.get("/api/shorturl/:id", (req, res) => {
  //const id = req.params;
  //console.log(id);
  Url.findById(req.params.id, (err, data) => {
    if (err) {
      res.json({ error: "Invalid Url" });
    } else {
      res.redirect(data.url);
    }
  });
});

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
