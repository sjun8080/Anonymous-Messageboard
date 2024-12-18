Example Workflow:
Request Path:

A user makes a request to the endpoint /api/threads/sports.
In this case, :board in the route /api/threads/:board captures "sports" and stores it in req.params.board.
Setting board variable:

The board variable is then set to req.params.board, which means board will now contain "sports".
Database Query:

The findOne() query is used to find a board document in the database where the name field matches the value of board (which is "sports").
So the query { name: board } translates to { name: "sports" } and checks if there's a board in the database with that name.
