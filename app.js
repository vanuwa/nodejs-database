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
          .then(() => resolve(record))
          .catch(reject);
      });
    });
  }

  _generateId (obj) {
    const hash = crypto.createHash('sha256');
    const salt = `${obj.name}|${obj.phone}`;

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

  update (id, value) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.file_path, 'utf8', (err, content) => {
        if (err) {
          return reject(err);
        }

        const db_obj = this._fromStringToObj(content);

        if (!db_obj[id]) {
          const error = new Error(`Record with id ${id} does not exist.`);

          return reject(error);
        }

        const new_id = this._generateId(value);
        const record = Object.assign({}, value, { id: new_id });

        delete db_obj[id];
        db_obj[record.id] = record;

        const combined = this._fromObjToString(db_obj);

        return this._write(combined)
          .then(() => resolve(record))
          .catch(reject);
      });
    });
  }

  read (id) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.file_path, 'utf8', (err, content) => {
        if (err) {
          return reject(err);
        }

        const db_obj = this._fromStringToObj(content);

        return resolve(db_obj[id]);
      });
    });
  }

  find (query) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.file_path, 'utf8', (err, content) => {
        if (err) {
          if (err.code === 'ENOENT') {
            return resolve([]);
          }

          return reject(err);
        }

        const db_obj = this._fromStringToObj(content);

        const found_records = Object.keys(db_obj).reduce((result, key) => {
          const record = db_obj[key];

          if (record.name.indexOf(query) > -1 || record.phone.indexOf(query) > -1) {
            result.push(record);
          }

          return result;
        }, []);

        return resolve(found_records);
      });
    });
  }

  remove (id) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.file_path, 'utf8', (err, content) => {
        if (err) {
          return reject(err);
        }

        const db_obj = this._fromStringToObj(content);

        if (!db_obj[id]) {
          const error = new Error(`Nothing to remove. Record with id ${id} does not exist.`);

          return reject(error);
        }

        const record = db_obj[id];
        delete db_obj[id];

        const modified = this._fromObjToString(db_obj);

        return this._write(modified)
          .then(() => resolve(record))
          .catch(reject);
      });
    });
  }

  list () {
    return new Promise((resolve, reject) => {
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

instance.find('Vasil')
  .then((records) => {
    console.log('[ FIND ] ', records);
  })
  .catch((exception) => {
    console.log('[ FIND ][ EXCEPTION ] ', exception);
  });

instance.read('8d5027f341c83b21e7077f4b511f99a7181f0b1143deac7322ed1b52751ac5b1')
  .then((record) => {
    console.log('[ READ ] ', record);
  })
  .catch((exception) => {
    console.log('[ READ ][ EXCEPTION ]', exception);
  });

instance.list()
  .then((content) => {
    console.log('[ LIST ]', content || '~nothing to show~' );

    instance.create({ name: 'Vasil', phone: '023456' })
      .then((result) => {
        console.log('[ CREATE ] ', result);

        instance.update('b69f1c5bbbb1ddd43f3fbb2b66a7d5566cf5f5335f29c50956d803fb84f91ae9', { name: 'Petro', phone: '023456' })
          .then((result) => {
            console.log('[ UPDATE ] ', result);

            instance.find('Vasil')
              .then((records) => {
                console.log('[ FIND ] ', records);
              })
              .catch((exception) => {
                console.log('[ FIND ][ EXCEPTION ] ', exception);
              });

            instance.remove('8d5027f341c83b21e7077f4b511f99a7181f0b1143deac7322ed1b52751ac5b1')
              .then((record) => {
                console.log('[ REMOVE ] ', record);
              })
              .catch((exception) => {
                console.log('[ REMOVE ][ EXCEPTION ]', exception);
              });
          })
          .catch((exception) => {
            console.log('[ UPDATE ][ EXCEPTION ]', exception);
          });
      })
      .catch((exception) => {
        console.log('[ CREATE ][ EXCEPTION ]', exception);
      });
  })
  .catch((exception) => {
    console.log('[ LIST ][ EXCEPTION ]', exception);
  });
