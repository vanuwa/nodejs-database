/**
 * Created by vanuwa on 5/9/17.
 */
const http = require('http');
const url = require('url');

/* const server = http.createServer((req, res) => {

  console.log('[ REQUEST ][ URL ]', url.parse(req.url));

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: true }));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});*/

class Server {
  constructor (port = 3000, host = 'localhost') {
    this._port = port;
    this._host = host;
    this._server = http.createServer(this._setup.bind(this));
  }

  _setup (request, response) {
    const parsed_url = url.parse(request.url);

    switch (`${request.method} ${parsed_url.pathname}`) {
    case 'GET /records':
      this._respond(response, 200, { code: 'ok' });
      break;
    case 'POST /records':
      this._respond(response, 501, { code: 'not_implemented' });
      break;
    case 'PUT /records':
      this._respond(response, 501, { code: 'not_implemented' });
      break;
    default:
      this._respond(response, 404, { code: 'not_found' });
    }
  }

  _respond (response, status_code, body) {
    response.setHeader('Content-Type', 'application/json');
    response.statusCode = status_code;
    response.end(JSON.stringify(body));
  }

  start () {
    return new Promise((resolve, reject) => {
      if (!this._server) {
        const error = new Error('Internal error. Can\'t start. (_server is not defined)');

        return reject(error);
      }

      this._server.listen(this._port, this._host, () => {
        return resolve({ host: this._host, port: this._port, server: this._server });
      });
    });
  }

  stop () {
    return new Promise((resolve, reject) => {
      if (!this._server) {
        const error = new Error('Internal error. Can\'t stop. (_server is not defined)');

        return reject(error);
      }

      this._server.close(() => {
        return resolve({ host: this._host, port: this._port, server: this._server });
      });
    });
  }
}

module.exports = Server;
