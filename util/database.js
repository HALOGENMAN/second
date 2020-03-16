const mongodb = require("mongodb");
const MongoClint = mongodb.MongoClient;

let _db;

const MongoConnect = (callBack) => {
    MongoClint
        .connect("mongodb+srv://shayak:159951sm357753@cluster0-fidtq.mongodb.net/shop?retryWrites=true&w=majority")
        .then(client => {
            console.log("Connected!");
            _db = client.db()
            callBack();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

const getDb = ()=>{
    if(_db){
        return _db;
    }
    throw "NO DATABASE FOUNR!"
}

exports.MongoConnect = MongoConnect;
exports.getDb = getDb;