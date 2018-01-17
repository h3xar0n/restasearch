# Special Notes

## Convert the CSV (delimited by semicolons) to JSON:

``` powershell
import-csv -Delimiter "`;"  "restaurants_info.csv" | ConvertTo-Json | Add-Content -Path "restaurants_info.json"
```

## Merge both JSON files

To get the relevant location data, I made a script merge-info.js that creates a new file, new_list.json, by iterating through the restaurants_info.json. It adds all missing keys to restaurants_list.json, just in case we need other ones later.

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

## Star Ratings as a Facet

Due to an issue with displaying star ratings as decimal points, I also added an attribute by finding the floor in rater.js:

```javascript
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
```

I still used the decimal star rating to illustrate the number of stars, which go down to 0.5.

## Dirty Money

Finally, to resolve the issue with unwanted credit cards and payment forms appearing as facets, I sifted back through all the payment options and filtered them to the 4 we want. I realized later that this could be done in the dashboard.

```javascript
const newList = require('./new_list.json');
const fs = require('fs');

function hidePayments(newList) {
    for (let i = 0; i < newList.length; i++) {
        newList[i].approved_pay = [];
        let check = {};
        for (let j = 0; j < newList[i].payment_options.length; j++) {
            switch(newList[i].payment_options[j]) {
                case 'Cash Only':
                    break;
                case 'JCB':
                    break;
                case 'Pay with OpenTable':
                    break;
                case 'Diners Club':
                    check.Discover = true;
                    break;
                case 'Carte Blanche':
                    check.Discover = true;
                    break;
                default:
                    check[newList[i].payment_options[j]] = true
            }
        }
        for (var key in check) {
            newList[i].approved_pay.push(key);
        }
    }
    return newList;
}

let updatedList = JSON.stringify(hidePayments(newList));

fs.writeFile('new_list.json', updatedList, function (err) {
    if (err) return console.log(err);
    console.log('Wrote list with base rating in the same file, new_list.json');
});
```

## The Files are IN the Computer!

To import the code, I simple dropped a refreshed JSON file in each time. I will learn other ways, though.