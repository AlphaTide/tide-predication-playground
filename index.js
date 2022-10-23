import TidePrediction from 'aquadamus';
import got from 'got';



async function CalcExtremes() {
    const {HarmonicConstituents} = await got.get('https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/9413450/harcon.json?units=metric').json();

    const highLowTides = TidePrediction(HarmonicConstituents, {
        phaseKey: 'phase_GMT'
    }).getExtremesPrediction({
        start: new Date('2019-01-01'),
        end: new Date('2019-01-10')
    });
    console.log(highLowTides);
}

main();