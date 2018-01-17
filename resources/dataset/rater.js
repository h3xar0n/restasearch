const newList = require('./new_list.json');
const fs = require('fs');

function baseRate(newList) {
    for (let i = 0; i < newList.length; i++) {
        let baseRating = Math.floor(+newList[i].stars_count);
        newList[i].base_rate = baseRating;
    }
    return newList;
}

let updatedList = JSON.stringify(baseRate(newList));

fs.writeFile('new_list.json', updatedList, function (err) {
    if (err) return console.log(err);
    console.log('Wrote list with base rating in the same file, new_list.json');
});