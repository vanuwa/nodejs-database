/**
 * Created by ivan on 5/8/17.
 */
const Path = require('path');
const fs = require('fs');
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

  create (record) {
    // sure file exits

    // read content

    // append record

    // write content
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
      fs.readFile(this.file_path, 'UTF-8', (err, content) => {
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
