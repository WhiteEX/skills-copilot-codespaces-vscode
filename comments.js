// Create web server
// 1. Create a web server
// 2. Configure the server
// 3. Start the server
// 4. Handle requests
// 5. Return responses

// 1. Create web server
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const comments = require('./comments');
const { json } = require('stream/consumers');

const server = http.createServer();

// 2. Configure the server
server.listen(3000, 'localhost', () => {
    console.log('Server is running at http://localhost:3000/');
});

// 4. Handle requests
server.on('request', (request, response) => {
    const method = request.method;
    const url = new URL(request.url, `http://${request.headers.host}`);
    const pathname = url.pathname;
    const query = url.searchParams;

    if (pathname === '/comments' && method === 'GET') {
        // Send comments
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(comments));
    } else if (pathname === '/comments' && method === 'POST') {
        // Add comment
        let body = '';
        request.on('data', (data) => {
            body += data;
        });
        request.on('end', () => {
            const comment = JSON.parse(body);
            comments.push(comment);
            response.statusCode = 201;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify(comment));
        });
    } else {
        // Not found
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/plain');
        response.end('Not found');
    }
});
