const notes = require("express").Router();
const { readFromFile, readAndAppend } = require("../helpers/fsUtils");
const uniqid = require("uniqid");
const fs = require("fs");

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
      id: uniqid(),
    };

    readAndAppend(newNote, "./db/db.json");
    res.json(`Note added successfully`);
  } else {
    res.error("Error in adding note");
  }
});

// DELETE Route that deletes a note
notes.delete("/:id", (req, res) => {
  const noteId = req.params.id;
  console.info(`${req.method} request received to delete note ${noteId}`);

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      let parsedNotes = JSON.parse(data);

      // Filter and return an array of JSON object that does not contain the item with the specified note ID
      parsedNotes = parsedNotes.filter((item) => item.id !== noteId);

      // Write updated notes back to the file
      fs.writeFile(
        "./db/db.json",
        JSON.stringify(parsedNotes, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info("No error detected while writing!")
      );
    }
  });

  res.json(`Successfully deleted note ${noteId}!`);
});

module.exports = notes;
