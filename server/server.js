const axios = require("axios");
const express = require("express");
const { getCode } = require('country-list');
const fs = require("fs");
const app = express();
const DATA_FILE_PATH = "./database/data.json";
const HOUR_IN_MILISECONDS = 3600000;

const coronaApiOptRequest = {
	method: "get",
	url: "https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php",
	headers: {
		"x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
		"x-rapidapi-key": process.env.CORONA_API_KEY
	}
};

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.get("/", function(req, res){
	let coronaData = readCoronaData();
	
	coronaData.statistic_taken_at = convertUsDateHourToBr(coronaData.statistic_taken_at);
	res.send(coronaData);
});

app.listen(3000, function(){
	console.log("Server started");
	updateHourlyData();
});

function updateHourlyData(){
	requestCoronaUpdates();
	setInterval(requestCoronaUpdates, HOUR_IN_MILISECONDS);
}

function readCoronaData(){
	let coronaData = fs.readFileSync(DATA_FILE_PATH);
	return JSON.parse(coronaData);
}

function requestCoronaUpdates(){
	axios(coronaApiOptRequest).then(function(response){
		if(response.status === 200 && (!fs.existsSync(DATA_FILE_PATH) || !coronaDataHasUpdated(response.data.statistic_taken_at))){
			response.data.countries_stat = insertCountrysCode(response.data.countries_stat);
			saveCoronaUpdate(response.data);
		}
	});
}

function coronaDataHasUpdated(staticTakenTime){
	let data = readCoronaData();
	return staticTakenTime === data.statistic_taken_at;
}

function saveCoronaUpdate(data){
	fs.writeFile(DATA_FILE_PATH, JSON.stringify(data), function(err){
		if(!err){
			console.log("Corona updated!");
		}
	});
}

function convertUsDateHourToBr(dateHour){
	let [date, hour] = dateHour.split(" ");
	date = date.slice(8) + "/" + date.substr(5, 2) + "/" + date.substr(0,4);
	return `${hour} ${date}`;
}

function insertCountrysCode(countrys){
	return countrys.map(function(country){
		country.code = getCode(country.country_name);
		return country;
	});
}
