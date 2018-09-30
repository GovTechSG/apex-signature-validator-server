const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const superagent = require('superagent');
const version = require('package').version;

const port = 3387;

app.use(bodyParser.urlencoded({extended: false})); // Parse urlencoded bodies
app.use(bodyParser.json()) // Parse json bodies

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
})

app.get('/version', (req, res) => {
    res.send(version);
})

app.post('/test-request', (req, res) => {
    let testRequest = req.body.testRequest;
    
})

app.listen(port, () => {
    console.log(`Listening on ${port}`);
})