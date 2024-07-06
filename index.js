const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

require('dotenv').config();
const app = express()
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello Mates !')
})

app.use(express.json());
app.use(cors());

connectToMongo();


app.use("/api/auth", require("./routes/auth"));
app.use("/api/question", require("./routes/questions"));
app.use("/api/answer", require("./routes/answers"));


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})