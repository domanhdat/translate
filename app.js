const _ = window._;

let fileTranslateArr = [];
let dataJson         = {};

_.forEach(languages, (value, key) => fileTranslateArr.push({key, value}));
let translating = [];
_.chunk(_.chunk(fileTranslateArr, 500)[4], 5).map(texts => translating.push(mapTranslator(texts)));

Promise.all(translating).then(mapTextTranslated).then(writeFileJson);

function translator(params = {}) {
    const TRANSLATE_API_KEY = ``;
    const TRANSLATE_API_URL = `https://translation.googleapis.com/language/translate/v2`;
    const TARGET            = `hi`;
    
    if (Array.isArray(params['q'])) {
        params['q'] = params['q'].map(encodeURIComponent);
        params['q'] = params['q'].join('&q=');
    }
    
    const options = {
        url : `${TRANSLATE_API_URL}?key=${TRANSLATE_API_KEY}&target=${TARGET}&q=${params['q']}`,
        json: true,
    };
    
    return axios(options).then(res => res['data']['data']['translations']);
}

function mapTranslator(texts) {
    return translator({q: _.map(texts, 'value')}).then(results =>
        results.map((result, index) => ({key: texts[index]['key'], value: result['translatedText']}))
    );
}

function mapTextTranslated(data) {
    data.map(textTranslated => textTranslated.map(text => dataJson[text.key] = text.value));
    return dataJson;
}

function writeFileJson(data) {
    const file = new window.Blob([JSON.stringify(data)], {type: 'text/plain;charset=utf-8'});
    saveAs(file, 'text.txt');
}
