const request = require('request');
const constants = require('../config');

const dictData =  function(definition, callback) {
    const url = constants.openDictApp.BASE_URL + encodeURIComponent(definition) + '?key=' + constants.openDictApp.API_KEY;
    request({url, json:true}, (error, {body}) => {
        if(error){
            callback("Can't fetch data from MERRIAM-WEBSTER'S COLLEGIATE DICTIONARY API.", undefined)
        } else {
            if (!body[0].art){
                callback(undefined, {
                    definition: body[0].shortdef,
                    artwork: null
                })
            } else {
                callback(undefined, {
                    definition: body[0].shortdef,
                    artwork: body[0].art.artid
                })
            }
        }
    })
}
module.exports = dictData;