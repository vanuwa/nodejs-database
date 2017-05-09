/**
 * Created by ivan on 5/8/17.
 */
const DB = require('./src/db');
const Server = require('./src/server');

const instance = new DB();
const server = new Server();

server.start()
  .then((info) => {
    console.log(`[ Ok ] Server running at http://${info.host}:${info.port}/`);
  })
  .catch((error) => {
    console.log('[ Oops ] ', error);
    server.stop();
  });

/* instance.find('Vasil')
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
  });*/
