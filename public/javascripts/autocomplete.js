var engine = new Bloodhound({
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    datumTokenizer: function(datum){
        console.log(datum['_source'].title);
        return Bloodhound.tokenizers.whitespace(datum['_source'].title)
    },
    remote: {
        url: 'http://capstone.aroraakshay.in/amazon/products?token=asdkjfq34wefsdcx&q=%QUERY',
        wildcard: '%QUERY',
        filter: function(response){
            return response.data.res;
        }
    }
});

$searchSelect = $('#search-box').find('.search-input');

engine.initialize();

$searchSelect.typeahead({
    minLength: 1,
    highlight: true,
    hint: true,
    limit: 10
}, {
    name: 'products',
    source: engine,
    displayKey: function(product){
        return product['_source'].title;
    },
    templates: {
        empty: [
            '<div class="empty-message">',
            'No results found :(',
            '</div>'
        ].join('\n'),
        suggestion: function(item){
            var title = item['_source'].title;
            if(title.length > 35){
                title = title.substring(0, 33);
                title += '...';
            }
            var price = item['_source'].price;
            if(price){
               price = '$' + price.toString();
            }else{
                price = '';
            }

            var imUrl = item['_source'].imUrl;
            var category;
            if(item['_source'].categories){
                category = item['_source'].categories[0];
            }
            if(category.length > 35){
                category = category.substring(0,33);
                category += '...';
            }

            return '<div class="mdl-grid"><div style="text-align: left" class="mdl-cell mdl-cell--7-col mdl-cell--stretch"><div><b>' + title + '</b></div><div>in ' + category + '</div></div><div style="text-align: right; font-size: 130%; color:#f44336" class="mdl-cell mdl-cell--2-col">' + price + '</div><div class="mdl-cell mdl-cell--3-col"><img style="height:90px; width:100%" src="' + imUrl + '"/></div></div>';
        }
    }
});
