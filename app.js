/**
 * Created by ivan on 5/8/17.
 */
const Path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const DB_PATH = 'storage';
const DB_FILE_NAME = 'db.dat';

const file_path = Path.resolve(DB_PATH, DB_FILE_NAME);

class DB {
  constructor () {
    this.file_path = file_path;
    this.dir_path = Path.resolve(DB_PATH);

    try {
      fs.mkdirSync(DB_PATH);
      console.log(`[ READY ] Storage path is ${this.dir_path}`);
    } catch (exception) {
      if (exception.code === 'EEXIST') {
        console.log(`[ READY ] Storage path is ${this.dir_path}`);
      } else {
        console.log('[ Exception ] Unhandled', exception);
      }
    }
  }

  create (value) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.file_path, 'utf8', (err, content) => {
        if (err && err.code !== 'ENOENT') {
          return reject(err);
        }

        const id = this._generateId(value);
        const record = Object.assign({}, value, { id });

        if (err && err.code === 'ENOENT') {
          return this._write(JSON.stringify(record))
            .then(resolve)
            .catch(reject);
        }

        const db_obj = this._fromStringToObj(content);

        if (db_obj[record.id]) {
          const error = new Error(`Record ${util.inspect(record)} already exist.`);

          return reject(error);
        }

        db_obj[record.id] = record;

        const combined = this._fromObjToString(db_obj);

        return this._write(combined)
          .then(resolve)
          .catch(reject);
      });
    });
  }

  _generateId (obj) {
    const hash = crypto.createHash('sha256');
    const salt = `${obj.name}|${obj.phone}`;

    // return crypto.randomBytes(16).toString("hex");
    return hash.update(salt).digest('hex');
  }

  _fromStringToObj (content) {
    return content.toString().split('\n').reduce((result, row) => {
      let json = null;

      try {
        if (row) {
          json = JSON.parse(row);
        }
      } catch (exception) {
        console.log('[ Oops ]', exception);
      }

      if (json) {
        result[json.id] = json;
      }

      return result;
    }, {});
  }

  _fromObjToString (obj) {
    let content = '';

    Object.keys(obj).forEach((key) => {
      content = [content, JSON.stringify(obj[key])].join('\n')
    });

    return content;
  }

  _write (content) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.file_path, content, 'utf8', (error) => {
        if (error) {
          return reject(error);
        }

        return resolve(content);
      });
    });
  }

  update (id, record) {
    // sure file exists

    // read content

    // find record

    // update record

    // write content
  }

  read (id) {
    // sure file exists

    // read content

    // find record

    // return record
  }

  find (query) {
    // sure file exists

    // read content

    // find record
  }

  remove (id) {
    // sure file exists

    // read content

    // find record

    // remove record

    // write to file
  }

  list () {
    return new Promise((resolve, reject) => {
      // sure file exists

      // read content
      fs.readFile(this.file_path, 'utf8', (err, content) => {
        if (err) {
          if (err.code === 'ENOENT') {
            return resolve('');
          }

          return reject(err);
        }

        return resolve(content);
      })
    });
  }

}

const instance = new DB();

instance.list()
  .then((content) => {
    console.log('[ LIST ]', content || '~nothing to show~' );
  })
  .catch((exception) => {
    console.log('[ LIST ][ EXCEPTION ]', exception);
  });

instance.create({ name: 'Vasil', phone: '023456' })
  .then((result) => {
    console.log('[ CREATE ] ', result);
  })
  .catch((exception) => {
    console.log('[ CREATE ][ EXCEPTION ]', exception);
  });
