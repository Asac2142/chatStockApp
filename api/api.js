const axios = require('axios');

const getStockInfo = async (stockCode) => {
    try {
        //result = await axios(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockCode}&apikey=demo`);
        let result = await axios(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=demo`);                
        return getLatestStock(result.data['Time Series (Daily)']);        
    } catch (error) {
        console.log(error);
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