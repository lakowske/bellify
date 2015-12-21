/*
 * (C) 2015 Seth Lakowske
 */


var pg          = require('pg');
var fs          = require('fs');
var dbutil      = require('warped-db/db-util');
var elements    = require('./elements');

/*
 * @param db name to use (e.g. myservicedb)
 * @param host to connect to (e.g. localhost)
 * @param engine to use (e.g. postgres, mysql, etc.)
 * @return a connection string.
 */
function connection(engine, host, db) {
    
    try {
        var config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));
    } catch (error) {
        console.log(error);
        console.log("Couldn't loading configuration.");
    }

    var user = process.env['USER']
    if (config && config.user) user = config.user;

    var connection = engine+'://'+user+'@db/image';

    if (config && config.pass) {
        connection = engine+'://'+user+':'+config.pass+'@db/image';
    }

    return connection;
}

var conn = connection('postgres', 'db', 'zendo');

var client = new pg.Client(conn);

//Setup the environment
client.connect(function(err) {

    if (err) {
        return console.error('error fetching client from pool', err);
    }

    dbutil.createTable(client, 'elements', elements.elementFields, function(err, results) {
        if (err) {
            console.log(err)
            process.exit();
        }

        dbutil.createTable(client, 'programs', elements.programFields, function(err, results) {
            if (err) {
                console.log(err)
                process.exit();
            }

        })
    })
    
})
