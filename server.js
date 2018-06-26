const request = require('request');
const yargs = require('yargs');
const express = require('express');
const hbs = require('hbs');

const app = express();
app.set('view engine', 'hbs');

app.get('/', (request, response) => {
    response.render('index.hbs', {
        
    });    
});

app.get('/weather', (req, res) => {
    const GoogleAPI = 'AIzaSyDMgsp68WJ4MwNY9u66TY2nuDGiTtaS9gc';
    const DarkSky = '85693fe78a243ea6c99ec85b0f8263ef';

    var address = req.query.cidade; //a é o nome da cena, tem de ter sempre um nome
//para verificar node app.js -a "*coisas*"
//para chamar metemos o nome na console e a rua
/*"D. Sancho I, Vila do Conde";*/
var addressEncoded = encodeURIComponent(address);

request({
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${addressEncoded}&key=${GoogleAPI}`,
    json: true
}, (error, response, body) => {
    var lat = body.results[0].geometry.location.lat; //chama a latitude
    var lng = body.results[0].geometry.location.lng;
    var formatted_address = body.results[0].formatted_address;

    console.log(formatted_address); //imprimi o adereço todo bonito

    request({
        url: `https://api.darksky.net/forecast/${DarkSky}/${lat},${lng}?units=si`,
        json: true
    }, (DSerror, Dresponse, DSbody)=> {

        var temperature = DSbody.currently.temperature;
        var apparentTemperature = DSbody.currently.apparentTemperature;
        var precipProbability = DSbody.currently.precipProbability;
        var highestTemperature = DSbody.daily.data[0].temperatureMax;
        var lowestTemperature = DSbody.daily.data[0].temperatureLow;

        console.log(temperature, apparentTemperature, precipProbability, highestTemperature, lowestTemperature);
        res.render('resposta.hbs', {
            text01: highestTemperature,
            text02: lowestTemperature,
            text03: temperature,
            text04: apparentTemperature,
            text05: precipProbability
        })
    })
});
    
    //res.send(req.query.cidade);
});

app.listen(3002);

//PARA A LOCAL STORAGE IR À APP DA NOTEAPP

//ERROS

/*app.use((req, res, next) => {
    res.status(404).send("Desculpa! Não há ligação à internet!")
  })
  
  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })*/