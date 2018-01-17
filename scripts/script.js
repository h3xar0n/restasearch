var client = algoliasearch('JAGVPL8KNV', 'deca419d14859b6b0f0db8a4dfbc21c8');
var $algoliasearchHelper = algoliasearchHelper(client, 'merged-data', {
    disjunctiveFacets: ['food_type', 'base_rate', 'approved_pay'],
    hitsPerPage: 4,
    maxValuesPerFacet: 10,
    aroundLatLngViaIP: true
});

var SearchBox = Vue.extend({
    template: `
        <div class="search-bar-container">
            <input  type="text"
                    id="search-box"         
                    class="search-bar"
                    placeholder="Search for Restaurants by Name, Cuisine, or Location"
                    v-model="query"/>
        </div>  
    `,
    data: function data() {
        return {
            query: ''
        };
    },
    ready: function ready() {
        this.$watch('query', function (query) {
            $algoliasearchHelper.setQuery(query).search();
        });
        $algoliasearchHelper.search();
    }
});

var FoodTypeList = Vue.extend({
    template: `
        <div class="cuisine">
            <h2>Cuisine/Food Type</h2>
            <ul>
                <li v-for="facet in facets" v-bind:class="{active: facet.isRefined}" v-on:click.prevent="toggleFacet(facet.name, $evt)">
                    <span class="name">{{{facet.name}}}</span> 
                    <span class="count">{{facet.count}}</span>
                </li>
            </ul>
        </div>
    `,
    data: function data() {
        return {
            facets: []
        };
    },
    ready: function ready() {
        var _this = this;

        $algoliasearchHelper.on('result', function (results) {
            _this.facets = results.getFacetValues('food_type', ['selected', 'count:desc']).slice(0, 10);
        });
    },
    methods: {
        toggleFacet: function toggleFacet(facetName) {
            $algoliasearchHelper.toggleRefinement('food_type', facetName).search();
        }
    }
});

var StarRatingList = Vue.extend({
    template: `
        <div>
            <h2>Rating</h2>
            <ul class="star-rating-menu">
                <li v-for="facet in facets" v-bind:class="{active: facet.isRefined}" v-on:click.prevent="toggleFacet(facet.name, $evt)">
                    <span class="stars-container stars-{{{(Math.floor(facet.name * 2) * 10)}}}">\u2605\u2605\u2605\u2605\u2605</span>        
                </li>
            </ul>
        </div>
    `,
    data: function data() {
        return {
            facets: []
        };
    },
    ready: function ready() {
        var _this = this;

        $algoliasearchHelper.on('result', function (results) {
            _this.facets = results.getFacetValues('base_rate', {
                sortBy: ['name:asc']
            }).slice(0, 5);
        });
    },
    methods: {
        toggleFacet: function toggleFacet(facetName) {
            $algoliasearchHelper.toggleRefinement('base_rate', facetName).search();
        }
    }
});

var PaymentOptions = Vue.extend({
    template: `
        <div>
            <h2>Payment Options</h2>
            <ul class="cuisine payments">
                <li v-for="facet in facets" v-bind:class="{active: facet.isRefined}" v-on:click.prevent="toggleFacet(facet.name, $evt)">
                    <span>{{{facet.name}}}</span>
                </li>
            </ul>
        </div>
    `,
    data: function data() {
        return {
            facets: []
        };
    },
    ready: function ready() {
        var _this = this;

        $algoliasearchHelper.on('result', function (results) {
            _this.facets = results.getFacetValues('approved_pay').slice(0, 10);
        });
    },
    methods: {
        toggleFacet: function toggleFacet(facetName) {
            $algoliasearchHelper.toggleRefinement('approved_pay', facetName).search();
        }
    }
});

var Results = Vue.extend({
    template: `
    <div> 
        <div class="result-stats">
            <span><strong>{{numHits}} results found</strong> in {{time * 0.001}} seconds</span>
        </div>
        <div v-if="numHits === 0" class="error">
            <p>Please try to search for something else</p>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Magnifying_glass_icon.svg">
        </div>
        <div class="search-results" v-for="hit in hits">
            <div class="image-container">
                <img src="{{{hit.image_url}}}">
            </div>
            <div class="description">
                <p class="place-name">{{{hit._highlightResult.name.value}}}</p>
                <p>
                    <span class="rating">{{{hit.stars_count}}}</span>
                    <span class="stars-container stars-{{{(Math.floor(hit.stars_count * 2) * 10)}}}">\u2605\u2605\u2605\u2605\u2605</span>              
                    <span>({{{hit.reviews_count}}} reviews)</span>             
                </p>
                <p>
                    <span>{{{hit._highlightResult.food_type.value}}} |</span>
                    <span>{{{hit.neighborhood}}} |</span>
                    <span>{{{hit.price_range}}}</span>
                </p>
            </div>
        </div>
    </div>
    `,
    data: function data() {
        return {
            hits: [],
            numHits: 0,
            time: 0,
        };
    },
    ready: function ready() {
        var _this2 = this;
        this.$resultsListener = $algoliasearchHelper.on('result', function (results) {
            _this2.hits = results.hits;
            _this2.time = results.processingTimeMS;
            _this2.numHits = results.nbHits;
        });
    }
});

var Pager = Vue.extend({
    template: `
        <div class="pager">
            <button class="previous" v-on:click="prevPage">🡠</button>
            <span class="current-page">{{currentPage + 1}}</span>
            <button class="next" v-on:click="nextPage">🡢</button>
        </div>
    `,
    data: function data() {
        return {
            currentPage: 0,
            numHits: 0
        };
    },
    ready: function ready() {
        var _this3 = this;

        $algoliasearchHelper.on('change', function (state) {
            _this3.currentPage = $algoliasearchHelper.getPage();
        });
    },
    methods: {
        prevPage: function prevPage() {
            if (this.currentPage > 0) {
                $algoliasearchHelper.previousPage().search();
            }
        },
        nextPage: function nextPage() {
            $algoliasearchHelper.nextPage().search();
        }
    }

});

var App = Vue.extend({
    template: `
        <div id="app" class="app">
            <search-box></search-box>
            <div class="results-box">
                <div class="refinements">
                    <food-type-list></food-type-list>
                    <star-rating-list></star-rating-list>
                    <payment-options></payment-options>
                </div>
                <div class="results-index">
                    <results></results>
                    <br>
                    <pager></pager>
                </div>
            </div>
        </div>
    `,
    components: {
        SearchBox: SearchBox,
        Results: Results,
        FoodTypeList: FoodTypeList,
        StarRatingList: StarRatingList,
        PaymentOptions: PaymentOptions,
        Pager: Pager
    }
});

new Vue({
    el: 'body',
    components: {
        App: App
    }
});