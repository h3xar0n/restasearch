var applicationID = 'JAGVPL8KNV';
var apiKey = 'deca419d14859b6b0f0db8a4dfbc21c8';
var indexName = 'merged-data';

var client = algoliasearch(applicationID, apiKey);
var helper = algoliasearchHelper(client, indexName);

helper.on('result', function(content) {
    renderHits(content);
});

function renderHits(content) {
    $('#container').html(JSON.stringify(content, null, 2));
}

helper.search();