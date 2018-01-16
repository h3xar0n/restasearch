const info = require('./restaurants_info.json');
const list = require('./restaurants_list.json');
const fs = require('fs');

function mergeJson(json1, json2) {
    const presort = {};
    for (let i = 0; i < json1.length; i++) {
        presort[json1[i].objectID] = i;
    }
    for (let j = 0; j < json2.length; j++) {
        let idToCheck = json2[j].objectID;
        let comparedObject = json1[presort[idToCheck]];
        for (var key in comparedObject) {
            json2[j][key] = comparedObject[key];
        }
    }
    return json2;
}

let newList = JSON.stringify(mergeJson(info, list));

fs.writeFile('new_list.json', newList, function (err) {
    if (err) return console.log(err);
    console.log('Wrote merged list in file new_list.json, just check it');
});