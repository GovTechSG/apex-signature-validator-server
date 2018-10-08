const express = require('express');
const bodyParser = require('body-parser');
const request = require('superagent');

const app = express();
const port = 3544

app.use(express.static('dist'))
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile('dist/index.html')
})

app.post('/send-test-request', async (req, res) => {
    let requestParams = req.body.requestOptions;
    let testRequest = request(requestParams.method, requestParams.url)
    let headerKeys = Object.keys(requestParams.headers);
    for (let headerKey of headerKeys) {
        testRequest.set(headerKey, requestParams.headers[headerKey]);
    }
    if (requestParams.data) {
        testRequest.send(requestParams.data);
    }
    testRequest.timeout({
        response: 5000,  // Wait 5s for the server to start sending,
        deadline: 10000, // but allow 10s for the file to finish loading.
    })
    try {
        await testRequest;

        let testResponse = {
            request: {
                method: testRequest.method,
                url: testRequest.url,
                headers: testRequest.header
            },
            response: {
                status: testRequest.response.status,
                headers: testRequest.response.header,
                body: testRequest.response.body,
                text: testRequest.response.text
            }
        }
        res.json(testResponse);
    } catch (err) {
        // Server response
        if (err.response) {
            let testResponse = {
                request: {
                    method: err.response.request.method,
                    url: err.response.request.url,
                    headers: err.response.request.header
                },
                response: {
                    status: err.response.status,
                    headers: err.response.header,
                    body: err.response.body,
                    text: err.response.text
                }
            }
            res.json(testResponse)
        } else if (err.code && err.message && err.stack) {
            // NodeJS error
            res.json({
                request: {
                    method: testRequest.method,
                    url: testRequest.url,
                    headers: testRequest.header
                },
                response: {
                    error: true,
                    code: err.code,
                    text: err.message,
                }
            })
        } else {
            throw err;
        }
    }
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Error encountered')
})

app.use((req, res, next) => {
    res.status(404).send("Not found")
})

app.listen(port, () => {
    console.log(`Listening on ${port}`);
})