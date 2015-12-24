/*
 * (C) 2015 Seth Lakowske
 */


var pg          = require('pg');
var fs          = require('fs');
var dbutil      = require('warped-db/db-util');
var elements    = require('./elements');
var Router      = require('routes');
var ecstatic    = require('ecstatic');

/* Globals */
var router         = Router();

router.addRoute('/:user/', function(req, res, client, params) {

    if (req.method === 'GET') {
        var zendoPageStream = fs.createReadStream(__dirname + '/html/zendo.html');
        elements.elementPage(client, zendoPageStream, res);
    } else if (req.method === 'POST') {
        console.log(params);
    }
})

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

    var connection = engine+'://'+user+'@'+host+'/'+db;

    if (config && config.pass) {
        connection = engine+'://'+user+':'+config.pass+'@'+host+'/'+db;
    }

    return connection;
}

function dbSeq(client, list, fn) {
    var index = 0;

    var seq = function(err, result) {
        if (err) {console.log(err)};
        index++;
        if (index < list.length) {
            fn(client, list[index], seq);
        }
    }
    
    fn(client, list[index], seq);
}

function initZendo(client) {

    var fn = function(client, element, cb) {
        console.log('inserting ' + element.name);
        dbutil.insertOrUpdate(element, elements.elFields, 'elements', client, cb);
    }
    
    dbSeq(client, elements.all, fn);
}

function getElements(client) {
    console.log('retrieving');
    dbutil.all('elements', client, function(err, result) {
        if (err) { console.log(err) };
        console.log(result);
    })
}

function printElementsAsHtml(client) {
    dbutil.all('elements', client, function(err, result) {
        if (err) { console.log(err) };

        result.rows.map(function(row) {
            console.log(elementToHtml(row));
        });
    })
}

function initTables(client) {
    
    //Setup the environment

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

        });
    });

}

function dropTables(client) {

    dbutil.dropTable('elements', client, function(err, result) {
        if (err) { console.error(err) }
        console.log('dropped elements');
    })

    dbutil.dropTable('programs', client, function(err, result) {
        if (err) { console.error(err) }
        console.log('dropped programs');
    })

}

function buildServer(st) {

    var server = http.createServer(function(req, res) {

        var route = router.match(req.url);

        if (route) {
            route.fn.apply(null, [req, res, client, route.params]);
        } else {
            st(req, res);
        }

    });

    return server;
}


var conn = connection('postgres', 'db', 'zendo');

var client = new pg.Client(conn);

client.connect(function(err) {

    if (err) {
        return console.error('error fetching client from pool', err);
    }

    initTables(client);

    
})

var st = ecstatic({
    root : __dirname
});

var server = buildServer(st);

server.listen(8090);
