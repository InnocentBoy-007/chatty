import express from 'express'
const app = express();


app.listen(8000, (req, res) => {
    console.log("Server is listening at port 8000");
})
