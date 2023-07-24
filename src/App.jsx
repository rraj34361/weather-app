 import { useEffect } from 'react';
import './App.css';
 import axios from 'axios';
import { useState } from 'react';
  
let data ;
let day = ['Sun', "Mon", "Tue", "Wed", "Thur", "Fri", 'Sat']
 
let loc = {};
 
  

let options ;
let origin;


function App() {
  const [value, setValue] = useState("")
  const [weather, setWeather] = useState({})
  
  
async function  getLocation() {
  if ("geolocation" in navigator) {
    // Geolocation is available
    navigator.geolocation.getCurrentPosition(
    async  function(position) {
        // Success callback
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        loc = {lon : longitude, lat : latitude}
        // console.log("Latitude: " + latitude + ", Longitude: " + longitude);
        options = {
          method: 'GET',
          url: 'https://weatherapi-com.p.rapidapi.com/current.json',
          params: {q: `${loc.lat},${loc.lon}`},
          headers: {
            'X-RapidAPI-Key': 'cee3ad4fb6msh5611c1ea2f2e940p18edd5jsn628cb519cb3f',
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
          }
       
        }
        try {
          const response = await axios.request(options);
          // console.log(response.data);
          data = response.data
          origin =  data?.location?.region
          setWeather(data)
          
        } catch (error) {
          console.error(error);
        }
      },
      function(error) {
        // Error callback
        console.error("Error getting geolocation:", error.message);
      }
    );
  } else {
    // Geolocation is not available in this browser
    console.error("Geolocation is not supported by this browser.");
  }
}



  
const search = async(value)=>{
  const options = {
    method: 'GET',
    url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
    params: {
      q: `${value}`,
      days: '3'
    },
    headers: {
      'X-RapidAPI-Key': 'cee3ad4fb6msh5611c1ea2f2e940p18edd5jsn628cb519cb3f',
      'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
    }
  };
  
  try {
    const response = await axios.request(options);
    // console.log(response.data);
    data = response.data
    // console.log(data)
    setWeather(data)
   
  } catch (error) {
    console.error(error);
  }


}

 useEffect(()=>{
 
  getLocation()
   setWeather(data)
 
 },[])

  return (
    <>
      <div className="heading"><h1>Welcome to weather app</h1></div>
    <div className="body">
   <div className='container'>
    
         <input className='search__bar' value={value} placeholder='enter city name' onChange={(e)=>setValue(e.target.value)} style={{color: 'blue'}} type="text" />
            {/* searchlogo */}
          
         <div className='container__card'>
             <div className='container__title'>
            <h3> {origin}</h3>
             </div>
         <div className='location'>
          {weather?.location?.region},{weather?.location?.country} <br />
          {weather?.current?.last_updated?.slice(0,11)}|{day[weather?.current?.is_day]}
         </div>

           <div className="card__temperature">
            {weather?.current?.temp_c}°C | {weather?.current?.temp_f}°F
           </div>
          
          <div className="card__weather">
             <p> {weather?.current?.condition?.text}</p>
            <small>Humidity : {weather?.current?.humidity}%</small>
            <small>precipitation : {weather?.current?.precip_in}</small>
            <small>wind Speed : {weather?.current?.wind_kph} Km/h</small>
          </div>
         </div>
      <button className='btn' onClick={()=>search(value)}>Search</button>

      </div>

 
    </div>
    </>
  )
}

export default App
