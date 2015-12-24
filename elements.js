/*
 * (C) 2015 Seth Lakowske
 */

var dbutil   = require('warped-db/db-util');
var trumpet  = require('trumpet');

module.exports.elementFields = [
    {name : 'id', type: 'text', predicate : 'primary key'},
    {name : 'name', type: 'text', predicate : 'not null'},
    {name : 'type', type : 'text', predicate : 'not null'},    
    {name : 'description', type : 'text'},    
    {name : 'seconds', type : 'float(53)'},
    {name : 'path', type: 'text'}
]

module.exports.elFields = module.exports.elementFields.map(function(field) {return field.name});

module.exports.bell = {
    'id' : 'bonsho',
    'name' : 'bell',
    'type' : 'audio',
    'description' : 'small bell',
    'seconds' : 8,
    'path' : '/2166__suburban-grilla__bowl-struck.mp3'
}

module.exports.clacker = {
    'id' : 'wood',
    'name' : 'wood block',
    'type' : 'audio',
    'description' : 'wood block',
    'seconds' : 0.1,
    'path' : '/218461__thomasjaunism__wood-block.mp3'
}

module.exports.rest = {
    'id' : 'rest',
    'name' : 'rest',
    'type' : 'rest',
    'description' : 'silence',
    'seconds' : 0,
    'path' : null
}

module.exports.all = [module.exports.bell, module.exports.clacker, module.exports.rest];

module.exports.programFields = [
    {name : 'id', type: 'text', predicate : 'primary key'},
    {name : 'name', type: 'text', predicate : 'not null'},
    {name : 'description', type : 'text'},
    {name : 'type', type : 'text'},
    {name : 'child', type : 'text'}
]

module.exports.pgFields = module.exports.programFields.map(function(field) {return field.name});


function elementToHtml(row) {

    if (row.type === 'audio') {
        var output = '<li>'
                + '<p><input id="add" type="submit" value="Add"></input>'
                + '<audio id="'+row.id+'"><source src="' + row.path + '" type="audio/mpeg"></audio>'
                + '<a href="#" onclick="window.play(\''+row.id+'\')">'
                + row.name
                + '</a></p></li>';
    }

    if (row.type === 'rest') {
        var output = '<li><p><input id="add" type="submit" value="Add"></input>Rest '
                + '<input class="duration" type="input"></input>'
                + ' Minutes <input class="duration" type="input"></input> Seconds</p></li>';
    }
    
    return output;

}

function elementPage(client, source, out) {
    dbutil.all('elements', client, function(err, result) {
        if (err) { console.log(err) };

        var tr = trumpet();

        tr.pipe(out);

        var ws = tr.select('#elementList').createWriteStream();

        result.rows.map(function(row) {
            ws.write(elementToHtml(row));
        });

        ws.end();

        source.pipe(tr);
    })
}

module.exports.elementToHtml = elementToHtml;
module.exports.elementPage   = elementPage;

