import React,{useEffect, useState} from 'react';
import WeatherCard from './weatherCard';
import './temp.css';
import {WEATHER_API_URL} from '../Utilities/Constants'

const Temperature = () => {
    const [searchValue, setSearchValue] = useState("");
    const [tempInfo,setTempInfo] = useState(()=>{
        const storedData = localStorage.getItem('WeatherData');
        return storedData? JSON.parse(storedData) : {};
    });

    function gotLocation(position){
        const {longitude, latitude } = position.coords;
        getWeather(longitude, latitude);
    }
    
    function failedToGet(){
        alert("Please allow to get current location!");
    }
    const getCurrentLocation = async ()=>{
        if(navigator.geolocation){
            await navigator.geolocation.getCurrentPosition(gotLocation, failedToGet);
        }   
        
    }

    const getWeather = async (longitude, latitude) => {

        try{
            const CURRENT_LOC_WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=6c92d5035bca136f069317e8cfe34434`
            const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&units=metric&appid=6c92d5035bca136f069317e8cfe34434`;
            let url = searchValue? WEATHER_API_URL : CURRENT_LOC_WEATHER_API_URL;
            const response = await fetch(url);
            const data = await response.json();
            
            const {temp,humidity,pressure} = data.main;
            const {main:weathermood} = data.weather[0];
            const {name} = data;
            const {speed} = data.wind;
            const {country,sunset} = data.sys;
            const myNewWeatherInfo = {
                temp,
                humidity,
                pressure,
                weathermood,
                name,
                speed,
                country,
                sunset,
            };
            //set these values in state hook
            setTempInfo(myNewWeatherInfo);
            localStorage.setItem('WeatherData', JSON.stringify(myNewWeatherInfo))
        }
        catch(err){
            console.log(err);
        }
    }
    useEffect(()=>{
        getWeather();
        if(!searchValue){
            getCurrentLocation();
        }
    }, [] );

    return (
        <>
            <div className="wrap">
                <div className="search">
                    <input type="search" name="" id="search"
                        className='searchTerm' autoFocus placeholder='search ...' value={searchValue} onChange={(e)=> setSearchValue(e.target.value)} />
                    <button className='searchButton' type='button' onClick={getWeather}>Search</button>
                </div>
            </div>
            
            {/* our weatherCard  */}
           <WeatherCard tempInfo={tempInfo}/>
        </>
    )
}

export default Temperature;