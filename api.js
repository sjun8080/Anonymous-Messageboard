
'use strict';

const BoardModel = require("../models").Board;
const ThreadModel = require("../models").Thread;
const ReplyModel = require("../models").Reply;

module.exports = function (app) {

  app.route('/api/threads/:board').post(async (req, res) => {
    try {
      
      const { text, delete_password } = req.body;
      let board = req.body.board;
      if (!board) {
        board = req.params.board;
      }
      console.log("post", req.body);

      const newThread = new ThreadModel({
        text: text,
        delete_password: delete_password,
        replies: [],
      });
      console.log("newThread", newThread);

      let boardData = await BoardModel.findOne({ name: board });
      if (!boardData) {
        const newBoard = new BoardModel({
          name: board,
          threads: [newThread],
        });
        console.log("newBoard", newBoard);

        const data = await newBoard.save();
        console.log("newBoardData", data);
        res.json(newThread);
      } else {
        boardData.threads.push(newThread);
        const data = await boardData.save();
        res.json(newThread);
      }
    } catch (err) {
      console.error(err);
      res.send("There was an error saving in post");
    }
  });

  app.route('/api/threads/:board').get(async (req, res) => {
    try {
      const board = req.params.board; // Fix: Use req.params
      const data = await BoardModel.findOne({ name: board }); // Fix: Use async/await

      if (!data) {
        console.log("No board with this name");
        return res.json({ error: "No board with this name" });
      }

      console.log("data", data);
      const threads = data.threads.map((thread) => {
        const {
          _id,
          text,
          created_on,
          bumped_on,
          replies,
        } = thread;

        return {
          id: _id, // Fix: Correct the reference to _id
          text,
          created_on,
          bumped_on,
          replies,
          replycount: replies.length // Count the number of replies
        };
      });

      res.json(threads);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "There was an error processing your request" });
    }
  });

 
  app.route('/api/threads/:board').put(async (req, res) => {
    try {
      console.log("put", req.body);
      const { report_id } = req.body;
      const board = req.params.board;

      // Find the board asynchronously
      const boardData = await BoardModel.findOne({ name: board });

      if (!boardData) {
        return res.json({ error: "Board not found" });
      }

      const date = new Date();

      // Locate the thread to report
      let reportedThread = boardData.threads.id(report_id);
      if (!reportedThread) {
        return res.json({ error: "Thread not found" });
      }

      // Update the thread fields
      reportedThread.reported = true;
      reportedThread.bumped_on = date;

      // Save the updated board
      await boardData.save();
      res.send("Success");
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "There was an error processing your request" });
    }
  });

  app.route('/api/threads/:board').delete(async (req, res) => {
  try {
    console.log("delete", req.body);
    const { thread_id, delete_password } = req.body; // Fix closing bracket
    const board = req.params.board;

    // Find the board asynchronously
    const boardData = await BoardModel.findOne({ name: board });

    if (!boardData) {
      return res.json({ error: "Board not found" }); // Fixed response format
    }

    // Locate the thread to delete
    const threadToDelete = boardData.threads.id(thread_id);
    if (!threadToDelete) {
      return res.json({ error: "Thread not found" });
    }

    // Check the delete password
    if (threadToDelete.delete_password !== delete_password) {
      return res.send("Incorrect Password");
    }

    // Remove the thread
    threadToDelete.remove();

    // Save the updated board
    await boardData.save();
    res.send("Success");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "There was an error processing your request" });
  }
});
  app.route('/api/replies/:board');
};

//This code block below is the old style code somewhat outdated to the newest version of mongoose//
/*Example Workflow:
Request Path:

A user makes a request to the endpoint /api/threads/sports.
In this case, :board in the route /api/threads/:board captures "sports" and stores it in req.params.board.
Setting board variable:

The board variable is then set to req.params.board, which means board will now contain "sports".
Database Query:

The findOne() query is used to find a board document in the database where the name field matches the value of board (which is "sports").
So the query { name: board } translates to { name: "sports" } and checks if there's a board in the database with that name.*/

 /*'use strict';

  const BoardModel = require("../models").Board;
  const ThreadModel = require("../models").Thread;
  const ReplyModel = require("../models").Reply;


  module.exports = function (app) {

    app.route('/api/threads/:board').post((req, res) => {

      const { text, delete_password } = req.body;
        let board = req.body.board;
        if(!board) {
          board = req.params.board;
        }
      console.log("post", req.body);

      const newThread = new ThreadModel({
        text: text,
        delete_password: delete_password,
        replies: [], 
       }); 
      console.log("newThread", newThread);

      BoardModel.findOne({ name: board}, (err, Boarddata) => {
        if (!Boarddata) {
          const newBoard = new BoardModel({
            name: board,
            thread: []
          });
        console.log("newBoard", newBoard);
        newBoard.threads.push(newThread);
        newBoard.save((err, data) => {
          console.log("newBoardData", data);
          if (err || !data){
            console.log(err);
            res.send("There was an error saving in post");
          }else {
            res.json(newThread);
          }
        });
        }else {
          Boarddata.threads.push(newThread);
          Boarddata.save((err, data) => {
            if(err || !data) {
              res.send("There was an error saving in post");
            }else {
              res.json(newThread);
            }
          });
        }
      });
      });

    app.route('/api/replies/:board');

  };
  */
  /*.get((req, res) => {
    const board = req.params.board;
    BoardModel.findOne({ name: board }, (err, data) => {
      if(!data) {
        console.log("No board with this name");
        res.json({ error: "No board with this name" });
      } else {
        console.log("data", data);
        const threads = data.threads.map((thread) => {
          const {
            _id,
            text,
            created_on,
            bumped_on,
            reported,
            delete_password,
            replies
          } = thread;
        return {id,
            text,
            created_on,
            bumped_on,
            reported,
            delete_password,
            replies,
            replycount: thread.replies.length
          } 
});
        res.json(threads);
      }
    });
});*/
