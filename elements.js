/*
 * (C) 2015 Seth Lakowske
 */

var dbutil   = require('warped-db/db-util');


module.exports.elementFields = [
    {name : 'id', type: 'text', predicate : 'primary key'},
    {name : 'name', type: 'text', predicate : 'not null'},
    {name : 'description', type : 'text'},    
    {name : 'seconds', type : 'float(53)'}
]

var elFields = module.exports.imageFields.map(function(field) {return field.name});

module.exports.programFields = [
    {name : 'id', type: 'text', predicate : 'primary key'},
    {name : 'name', type: 'text', predicate : 'not null'},
    {name : 'description', type : 'text'},
    {name : 'type', type : 'text'},
    {name : 'child', type : 'text'}
]

var pgFields = module.exports.programFields.map(function(field) {return field.name});


    
