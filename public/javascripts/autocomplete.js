var startTime;

var request_took = [];

function request_took_stats(){

    var sum = 0;
    var max = 0;
    var min = 99999;
    for(var i = 0; i < request_took.length; ++i){
        request_took[i] = Number(request_took[i]);
        sum += request_took[i];
        if(max < request_took[i]){
            max = request_took[i];
        }
        if(min > request_took[i]){
            min = request_took[i];
        }
    }
    var mean = sum/request_took.length;

    return {
        'mean': mean.toFixed(3),
        'max': max.toFixed(3),
        'min': min.toFixed(3)
    };
}

function update_request_stats(){
    var stats = request_took_stats();
    console.log(stats);

    $('#average_time_taken').html(stats['mean']);
    $('#max_time_taken').html(stats['max']);
    $('#min_time_taken').html(stats['min']);
}

var engine = new Bloodhound({
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    datumTokenizer: function(datum){
        console.log(datum['_source'].title);
        return Bloodhound.tokenizers.whitespace(datum['_source'].title)
    },
    remote: {
        url: 'http://capstone.aroraakshay.in/amazon/products?token=asdkjfq34wefsdcx',
        filter: function(response){
            console.log(response.data.meta);
            request_took.push(response.data.meta.took);
            update_request_stats();
            return response.data.res;
        },
        prepare: function (query, settings) {
            startTime = new Date().getTime();
            console.log("Starting network call..");

            settings.data = {q: query};
            return settings;
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
