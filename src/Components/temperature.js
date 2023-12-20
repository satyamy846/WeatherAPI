import React,{useEffect, useState} from 'react';
import WeatherCard from './weatherCard';
import './temp.css';

const Temperature = () => {
    const [searchValue, setSearchValue] = useState("");
    const [tempInfo,setTempInfo] = useState(()=>{
        const storedData = localStorage.getItem('weather');
        return storedData? JSON.parse(storedData) : {};
    });
    const showInfo = ()=>{
        console.log('temp  info -- ', tempInfo)
    }
    const getWeather = async () => {
        try{
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&units=metric&appid=6c92d5035bca136f069317e8cfe34434`;
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            
            const {temp,humidity,pressure} = data.main;
            const {main:weathermood} = data.weather[0];
            const {name} = data;
            const {speed} = data.wind;
            const {country,sunset} = data.sys;
            // console.log("temp- ",temp,"humidity- ",humidity,"pressure- ",pressure,"weathermood- ",weathermood,"name- ",name,"speed- ",speed,"country- ",country,"sunset- ",sunset)
            // console.log(`temperatue = ${temp}`)
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
            localStorage.setItem('weather', JSON.stringify(myNewWeatherInfo))
        }
        catch(err){
            console.log(err);
        }
    }
    useEffect(()=>{
        getWeather();
        
    }, [] );
    console.log(`temperature info - ${tempInfo}`)
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