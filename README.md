To convert the CSV (delimited by semicolons) to JSON:

``` powershell
import-csv -Delimiter "`;"  "restaurants_info.csv" | ConvertTo-Json | Add-Content -Path "restaurants_info.json"
```

Then, to execute a script that meges the relevant location data:

Made a script merge-info.js that creates a new file, new_list.json, by iterating through the restaurants_info.json and adds missing information to restaurants_list.json.

Time and space complexity are O(n). 

To avoid O(n^2) time complexity, I stored one list's indices into an object with the ID as the key, then checked the key against the IDs in the other list and instantly looked up the corresponding object.

``` javascript
const info = require('./restaurants_info.json');
const list = require('./restaurants_list.json');
const fs = require('fs');

function mergeJson(json1, json2) {
    const presort = {};
    for (let i = 0; i < json1.length; i++) {
        presort[json1[i]["objectID"]] = i;
    }
    for (let j = 0; j < json2.length; j++) {
        let idToCheck = json2[j]["objectID"];
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
```

``` powershell
node merge-info.js
```

