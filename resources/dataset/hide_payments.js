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