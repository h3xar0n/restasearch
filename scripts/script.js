var applicationID = 'JAGVPL8KNV';
var apiKey = 'deca419d14859b6b0f0db8a4dfbc21c8';
var indexName = 'merged-data';

var client = algoliasearch(applicationID, apiKey);
var helper = algoliasearchHelper(client, indexName, {
    facets: ['food_type', 'stars_count', 'payment_options']
});

helper.on('result', function (content) {
    renderFacetList(content);
    renderHits(content);
});

function renderHits(content) {
    $('#container').html(function () {
        return $.map(content.hits, function (hit) {
            return '<li>' + hit._highlightResult.name.value + '</li>';
        });
    });
}

$('#facet-list').on('click', 'input[type=checkbox]', function (e) {
    var facetValue = $(this).data('facet');
    helper.toggleFacetRefinement('food_type', facetValue)
        .search();
});

function renderFacetList(content) {
    $('#facet-list').html(function () {
        return $.map(content.getFacetValues('food_type'), function (facet) {
            var checkbox = $('<input type=checkbox>')
                .data('facet', facet.name)
                .attr('id', 'fl-' + facet.name);
            if (facet.isRefined) checkbox.attr('checked', 'checked');
            var label = $('<label>').html(facet.name + ' (' + facet.count + ')')
                .attr('for', 'fl-' + facet.name);
            return $('<li>').append(checkbox).append(label);
        });
    });
}

$('#search-box').on('keyup', function () {
    helper.setQuery($(this).val()).search();
});

helper.search();