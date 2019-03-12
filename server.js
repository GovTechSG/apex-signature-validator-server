const express = require('express');
const bodyParser = require('body-parser');
const request = require('superagent');
const superagentProxy = require('superagent-proxy');
superagentProxy(request);
const morgan = require('morgan');

const app = express();
const port = 3544;

const http_proxy = process.env.http_proxy || process.env.https_proxy || undefined;

app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(morgan('combined'));

app.post('/send-test-request', async (req, res) => {
    let requestParams = req.body.requestOptions;
    let testRequest = request(requestParams.method, requestParams.url);
    let headerKeys = Object.keys(requestParams.headers);
    for (let headerKey of headerKeys) {
        testRequest.set(headerKey, requestParams.headers[headerKey]);
    }
    if (requestParams.data) {
        testRequest.send(requestParams.data);
    }
    if (http_proxy) {
        testRequest.proxy(http_proxy);
    }
    testRequest.timeout({
        response: 15000,  // Wait 15s for the server to start sending,
        deadline: 25000, // but allow 25s for the file to finish loading.
    });
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
        };
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
            };
            res.json(testResponse);
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
            });
        } else {
            throw err;
        }
    }
});

app.use((err, req, res, next) => {
    res.status(500).send('Error encountered');
});

app.use((req, res, next) => {
    res.status(404).send('Not found');
});

app.listen(port, () => {
    process.stdout.write(`Listening on ${port}\n`);
});