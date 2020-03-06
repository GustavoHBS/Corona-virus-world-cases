import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { FaSearch, FaHourglassHalf } from "react-icons/fa"
import "./style.css";
import Card from "../../components/Card";


export default function Home(){
	const [ countrySearch, setCountrySearch ] = useState([]);
	const [ countrysData, setCountrysData ] = useState([]);
	const [ countrysShowing, setCountrysShowing ] = useState([]);
	const [ updateDataTime, setUpdateDataTime ] = useState("");

	useEffect(function(){
		async function fetchData(){
			let response = await api.get("/");
			if(response?.data){
				let data = response.data;
				setCountrysData(data.countries_stat);
				setUpdateDataTime(data.statistic_taken_at);
			}
		}
		fetchData();
	}, []);

	useEffect(function(){
		let countrys = countrysData.filter(function(country){
			return country.country_name.toLowerCase().startsWith(countrySearch.toLowerCase());
		});
		setCountrysShowing(countrys)
	}, [countrySearch]);

	useEffect(function(){
		setCountrysShowing(countrysData)
	}, [countrysData]);

	function handleInputCountrySearch(e){
		setCountrySearch(e.target.value);
	}

	return (
		<div>
			<div className="page-title">
				<span>Coronavirus around the world</span>
			</div>
			<div className="last-update-title">
				<span>Last update:</span>
			</div>
			<div className="data-update-box">
				<FaHourglassHalf size={30}/><span>{updateDataTime} (Timezone +0)</span>
			</div>
			<div className="search-box">
				<input type="text" className="search-txt" name="" placeholder="Search for country" value={countrySearch} onChange={handleInputCountrySearch}/>
				<div className="search-btn"><FaSearch size={30} ></FaSearch></div>
			</div>
			<div className="country-box">
				{countrysShowing.map(function(country, index){
					return (
						<Card key={index} name={country.country_name} code={country.code} cases={country.cases} deaths={country.deaths} 
							totalRecovered={country.total_recovered} serious_critical={country.serious_critical}/>
					);
				})}
			</div>
		</div>
	);
}