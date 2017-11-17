const index = require ('./index')
const state = require('./state');

module.exports = [
    {test : [{type: "keyword", parameter: "east"}], behavior : {type : "move", parameter : "east"}},
    {test : [{type: "keyword", parameter: "west"}], behavior : {type : "move", parameter : "west"}},
    {test : [{type: "keyword", parameter: "north"}], behavior : {type : "move", parameter : "north"}},
    {test : [{type: "keyword", parameter: "south"}], behavior : {type : "move", parameter : "south"}},
    {test : [{type: "keyword", parameter: "exit"}], behavior : { type : "exit", parameter : ""}},
    {test : [{type: "keyword", parameter: "help"}], behavior : { type : "help", parameter : ""}},
    {test : [{type: "keyword", parameter: "knock"}, {type: "location", parameter: "RICKENS_DOOR"}], behavior : { type : "knock", parameter : ""}}
]


