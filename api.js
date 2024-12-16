'use strict';

const BoardModel = require("../models").Board;
const ThreadModel = require("../models").Thread;
const ReplyModel = require("../models").Reply;

/*When a POST request is made to /api/threads/:board, the backend creates a new thread with the provided text and delete_password.
If the board with the given name doesn’t exist, it creates a new board and saves the thread under it. If the board already exists, the thread is added to the existing board.
The route for replies to threads is defined but not yet implemented.*/

module.exports = function (app) {
  //This defines a POST route for creating a thread. //
  app.route('/api/threads/:board').post((req, res) => {
    const { text, delete_password } = req.body; //Extracts the text and delete_password values from the request body.//
      let board = req.body.board; //it tries to get the board name from req.body.board.
      if(!board) { //If the board name is not provided in the body, it falls back to using the URL parameter.//
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
