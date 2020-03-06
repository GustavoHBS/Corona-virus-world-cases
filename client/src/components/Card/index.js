import React, { useState, useEffect } from "react";
import "./style.css";

import { FaAmbulance, FaHeartbeat, FaSkullCrossbones, FaHeart} from "react-icons/fa"
import ReactCountryFlag from "react-country-flag"

export default function Card(props){
	//style={{"--teste": "black"}}
	const [ percentDeaths, setPercentDeaths ] = useState(0);

	useEffect(function(){
		setPercentDeaths(calcPercent(removeComma(props.cases), removeComma(props.deaths)));
	}, []);

	function removeComma(text){
		return text.replace(/,/g, "");
	}

	function calcPercent(total, value){
		return (value * 100) / total;
	}

	return (
		<li className="card">
			<div className="box">
				<div className="title">
					{ props.code ? <ReactCountryFlag className="emojiFlag"
						countryCode={props.code}
						svg  /> : ""} 
					<span className="text">{props.name}</span>
				</div>
				<div className="body">
					<li><span className="cases">Cases: {props.cases}</span> <FaAmbulance size={16}/></li>
					<li><span className="serious">Serious Cases: {props.serious_critical} <FaHeartbeat size={16}/></span></li>
					<li><span className="deaths">Deaths: {props.deaths} <FaSkullCrossbones size={16}/></span></li>
					<li><span className="recovereds">Recovereds: {props.totalRecovered} <FaHeart size={16}/></span></li>
				</div>
				<div className="percent">
					<svg>
						<circle cx="40" cy="40" r="40"></circle>
						<circle cx="41" cy="40" r="38" style={{"--percentDeaths": percentDeaths}}></circle>
					</svg>
					<div className="number">
						<span>{percentDeaths.toFixed(2)}%</span>
					</div>
				</div>
				<div className="percent-legend">
					<span>Deaths/Cases</span>
				</div>
			</div>
		</li>
	);
}