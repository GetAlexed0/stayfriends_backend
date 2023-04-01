const mongoose = require('mongoose');

function connect() {
  return new Promise((resolve, reject) => {
    mongoose.connect('mongodb://localhost/stayfriends', { useNewUrlParser: true });
    const db = mongoose.connection;
    db.on('error', (error) => {
      console.error('Error while connecting database :', error);
      reject(error);
    });
    db.once('open', () => {
      console.log('Connection established');
      resolve();
    });
  });
}

module.exports = connect;
