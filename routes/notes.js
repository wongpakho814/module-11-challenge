const notes = require("express").Router();
const { readFromFile, readAndAppend } = require("../helpers/fsUtils");
const uniqid = require("uniqid");

// GET Route that reads the db.json file and return all saved notes as JSON
notes.get("/", (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// POST Route that receives a new note to save on the request body, add it to the db.json file, and then return the new note to the client
notes.post("/", (req, res) => {
  console.info(`${req.method} request received to add a new note`);
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      tip_id: uniqid(),
    };

    readAndAppend(newNote, "./db/db.json");
    res.json(`Note added successfully 🚀`);
  } else {
    res.error("Error in adding note");
  }
});

module.exports = notes;
