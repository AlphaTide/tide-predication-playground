import TidePrediction from 'aquadamus';
import got from 'got';
import * as cheerio from 'cheerio';
import jsdom from 'jsdom';
import {createJSONProduct, createTextProduct} from "./library.js";
const {JSDOM} = jsdom;


const yorkRiverStationID = 8638610;
const backriverStationID = 8638051;


async function main() {
    const stationID = 'est0033';
    const input = await getSloshData(stationID);
    const textProduct = createJSONProduct('Poquoson, VA', stationID, input);

    console.log(textProduct);

}

async function CalcExtremes(stationID = yorkRiverStationID) {
    const {HarmonicConstituents} = await got.get('https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/8638610/harcon.json?units=metric').json();


    const hours_24 = 36 * 60 * 60 * 1000;

    const highLowTides = TidePrediction(HarmonicConstituents, {
        phaseKey: 'phase_local'

    }).getExtremesPrediction({
        start: new Date('2023-06-15'),
        end: new Date('2023-06-16')
    });

    return highLowTides;
}

async function getOffsets(stationID = backriverStationID) {

    const res = got.get('https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/8638051');

    const {stations} = await res.json();
    const {tidepredoffsets: tidepredoffsetsURL} = stations[0];

    const offsetData = await got.get(tidepredoffsetsURL.self).json();

    offsetData.heightOffsetHighTide
    offsetData.heightOffsetLowTide
    return offsetData;
}


async function applyOffsets() {
    const extremes = await CalcExtremes();
    const offsets = await getOffsets();

    for (let i = 0; i < extremes.length; i++) {
        const extreme = extremes[i];
        if (extreme.type === 'High') {
            extreme.height += offsets.heightOffsetHighTide;
        } else if (extreme.type === 'Low') {
            extreme.height += offsets.heightOffsetLowTide;
        }
    }

    return extremes;
}

async function getSloshData(stationID) {
    const req = await fetch("https://slosh.nws.noaa.gov/etsurge2.0/fixed/php/getData.php", {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        "body": `st=${stationID}`,
        "method": "POST"
    });


    return await req.json();
}

async function scrapeSlosh(stationID = 'est0033') {
    const url = `https://slosh.nws.noaa.gov/etsurge2.0/index.php?stid=${stationID}&datum=MLLW&show=1-1-0-1-1`;

    async function getData() {
        const dom = new JSDOM(``, {
            url,
            contentType: "text/html",
            includeNodeLocations: true,
            storageQuota: 10000000,
            pretendToBeVisual: true,
            runScripts: "dangerously",
        });

        const window = dom.window;



        window.requestAnimationFrame(timestamp => {
            console.log(timestamp > 0);
        });

        console.log(window.document.body.innerHTML);
    }

    return getData();
}



main();