const axios = require('axios');
const csvToJSON = require('csvtojson');
const homedir = require('os').homedir();
const path = require('path');
const fs = require('fs');

const getStockInfo = async (stockCode) => {
    const fileName = `stockInfo_${getRandomNumber()}.csv`;
    const subFolder = `temp${getRandomNumber()}`;
    const pathToFile = path.join(homedir, `/${subFolder}/`);
    const fullPath = `${pathToFile}${fileName}`;
    let quote;

    try {
        await axios({
            method: 'GET',
            url: 'https://stooq.com/q/l/?s=aapl.us&f=sd2t2ohlcv&h&e=csv',
            responseType: 'stream'
        }).then((response) => {
            fs.mkdir(pathToFile, {recursive: true}, (err) => {
                if (err) {
                    throw err;
                } else {
                    response.data.pipe(fs.createWriteStream(fullPath));              
                    parseFile(fullPath).then((res) => {
                        quote = `${stockCode} quote is $${res} per share`;
                        console.log(quote);                       
                    });
                }                             
            });            
        }); 
    } catch (error) {
        console.log(`Somenthig went wrong getting stock info: ${error}`);
    }
    
    return quote;
};

const parseFile = async (thePath) => { 
    let amount;
    await csvToJSON().fromFile(thePath).then((source) => {
        if (source) { 
            amount = source[0].Close;
        }
    });
    return amount;
};

const getRandomNumber = () => {
    return Math.floor((Math.random() * 1000) + 1);
};

module.exports.getStockInfo = getStockInfo;