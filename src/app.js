const express = require('express');

const app = express();

app.use("/",(req,res)=> {
    res.send("Hello from Server");
});

app.listen(3000 , ()=> {
    console.log("Server is Listening on port 3000 ");
}); 