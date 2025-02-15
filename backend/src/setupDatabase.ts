import mongoose from 'mongoose'

export default () => {
    const connect = () => {
        mongoose.connect('mongodb://127.0.0.1:27017/socialapp')
               .then(() => {
                console.log("Successfully connected to database")
               })
               .catch((error) => {
                console.log('Error connecting to database', error);
                return process.exit(1);
               });
    }
    connect();


    mongoose.connection.on('disconnected', connect);

};