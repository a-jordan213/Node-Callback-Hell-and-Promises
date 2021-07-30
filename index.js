const MongoClient = require('mongodb').MongoClient;
const dboper = require('./operations');

const url = 'mongodb://localhost:27017/'; //custom form, port#
const dbname = 'nucampsite'; //database name

MongoClient.connect(url, { useUnifiedTopology: true }).then(client => { //chain with then method but takes callback fn lol going to min in nesting way

    console.log('Connected correctly to server');

    const db = client.db(dbname);

    db.dropCollection('campsites') //now returns promise can use then meth
    .then(result => {
        console.log('Dropped Collection:', result); //still want to consol
    })
    .catch(err => console.log('No collection to drop.')); //if does not exist then this catch will consol but not close connection

    dboper.insertDocument(db, {name: "Breadcrumb Trail Campground", description: "Test"}, 'campsites') //3 argu
    .then(result => { //use a chain then metho
        console.log('Insert Document:', result.ops);

        return dboper.findDocuments(db, 'campsites'); //if that meth
    })
    .then(docs => {
        console.log('Found Documents:', docs);

        return dboper.updateDocument(db, { name: "Breadcrumb Trail Campground" }, //
            { description: "Updated Test Description" }, 'campsites');
    })
    .then(result => { //new then meth that
        console.log('Updated Document Count:', result.result.nModified);

        return dboper.findDocuments(db, 'campsites');
    })
    .then(docs => {
        console.log('Found Documents:', docs);

        return dboper.removeDocument(db, { name: "Breadcrumb Trail Campground" },
            'campsites');
    })
    .then(result => {
        console.log('Deleted Document Count:', result.deletedCount);

        return client.close();
    })
    .catch(err => {
        console.log(err);
        client.close();
    });
})
.catch(err => console.log(err)); //promises that will run if rejected, the err obj and contents