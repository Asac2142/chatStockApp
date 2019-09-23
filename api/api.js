const axios = require('axios');
const csvTpJSON = require('csvtojson');
const fs = require('fs');

const getStockInfo = async (stockCode) => {
    try {
        //result = await axios(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockCode}&apikey=demo`);
        //let result = await axios(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=demo`);                
        // let result = await axios('https://stooq.com/q/l/?s=aapl.us&f=sd2t2ohlcv&h&e=csv');
        
        await axios({
            method: 'GET',
            url: 'https://stooq.com/q/l/?s=aapl.us&f=sd2t2ohlcv&h&e=csv',
            responseType: 'stream'
        }).then((response) => {
            response.data.pipe(fs.createWriteStream('/home/andres/Documents/aFile1.csv'));
            csvTpJSON().fromFile('/home/andres/Documents/aFile1.csv').then((source) => {
                console.log(source);
            });
        });
        
        // console.log(result);
        //let stock = getLatestStock(result.data['Time Series (Daily)']);        
        // stock = parseFloat(stock['4. close']).toFixed(2);
        // return `${stockCode.toUpperCase()} quote is $${stock} per share`;
    } catch (error) {
        console.log(`Somenthig went wrong getting stock info: ${error}`);
    }
};

const getLatestStock = (data) => {
    let year = getYear();
    let month = getFullMonth();
    let day = getDay();
    let date = `${year}-${month}-${day}`;
    
    while (true) {
        if (data[date] === undefined) {
            date = `${year}-${month}-${day}`;
            day -= 1;            
        }
        else {
            return data[date];
        }
    }
};

const getYear = () => {
    return new Date().getFullYear();
};

const getDay = () => {
    let day = new Date().getDate().toString();
    return day.length > 1 ? day : `0${day}`;
};

const getFullMonth = () => {
    let month = (new Date().getMonth() + 1).toString();
    return month.length > 1 ? month : `0${month}`;
};

module.exports.getStockInfo = getStockInfo;