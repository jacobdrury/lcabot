const mongoose = require('mongoose');

exports.init = () => {
    const dbOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    const connectionString = process.env.DB_CONNECTION_STRING;

    mongoose.connect(connectionString, dbOptions);
    mongoose.Promise = global.Promise;

    mongoose.connection.on('connected', () => {});
    mongoose.connection.on('err', console.error);
    mongoose.connection.on('disconnected', () => console.log('Mongoose connection disconnected'));
};
