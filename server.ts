import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

app.listen(5000, () => console.log("Express server running on port 5000"));
