import moment from 'moment';


export function createTextProduct(stationName, stationId, input) {
    // Output text product --> points only, not on grid
    var mdatum = ' (Height in Feet MLLW)<br>';
    //var textProd = window.name + ' ' + window.st + ' (Height in Feet MLLW)<br>',
    var textProd = stationName + ' ' + stationId + mdatum,
        ss,ti,ob,an,tw,ts;

    textProd = textProd + 'Date(GMT),&nbspSurge, &nbspTide, &nbsp&nbspObs, &nbspFcst,&nbsp Anom<br>';
    for (var i=480; i<input['ts'].length; i += 10) {
        ss = ti = ob = an = tw = '      ';
        var ssdat = String(input['ss'][i].toFixed(1));
        var tidat = String(input['pred'][i].toFixed(1));
        var obdat = String(input['obs'][i].toFixed(1));
        var twdat = String(input['twl'][i].toFixed(1));
        var andat = String(input['anom'][i].toFixed(1));

        ts = moment(input['ts'][i],'YYYYMMDDHHmm').format('MM/DD HH');

        if (input['ss'][i] != '9999') {
            ss = [ss.slice(0,ss.length-ssdat.length),ssdat].join('');
        }
        if (input['pred'][i] != '9999') {
            ti = [ti.slice(0,ti.length-tidat.length),tidat].join('');
        }
        if (input['obs'][i] != '9999') {
            ob = [ob.slice(0,ob.length-obdat.length),obdat].join('');
        }
        if (input['anom'][i] != '9999') {
            an = [an.slice(0,an.length-andat.length),andat].join('');
        }
        if (input['twl'][i] != '9999') {
            tw = [tw.slice(0,tw.length-twdat.length),twdat].join('');
        }

        textProd = textProd + ts + 'Z,' + ss + ',' + ti + ',' + ob + ','
            + tw + ',' + an + ' <br>';
    }
    return textProd;
}

export function createJSONProduct(stationName, stationId, input) {
    var products = [];

    for (var i=480; i<input['ts'].length; i += 10) {
        var product = {};
        product.ts = moment(input['ts'][i],'YYYYMMDDHHmm').format('MM/DD HH');

        product.ss = (input['ss'][i] != '9999') ? parseFloat(input['ss'][i].toFixed(1)) : null;
        product.ti = (input['pred'][i] != '9999') ? parseFloat(input['pred'][i].toFixed(1)) : null;
        product.ob = (input['obs'][i] != '9999') ? parseFloat(input['obs'][i].toFixed(1)) : null;
        product.tw = (input['twl'][i] != '9999') ? parseFloat(input['twl'][i].toFixed(1)) : null;
        product.an = (input['anom'][i] != '9999') ? parseFloat(input['anom'][i].toFixed(1)) : null;

        products.push(product);
    }

    var output = {
        stationName: stationName,
        stationId: stationId,
        mdatum: 'Height in Feet MLLW',
        products: products
    };

    return JSON.stringify(output);
}
