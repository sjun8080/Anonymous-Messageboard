'use strict';

const BoardModel = require("../models").Board;
const ThreadModel = require("../models").Thread;
const ReplyModel = require("../models").Reply;


module.exports = function (app) {
  //This defines a POST route for creating a thread. //
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
