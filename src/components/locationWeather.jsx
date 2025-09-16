import weatherAPIS from "../apis/weathersApi";
import { useState, useEffect, useRef } from "react";
import Loader from "./loader";
import { TbTemperature } from "react-icons/tb";
import { WiHumidity } from "react-icons/wi";
import { BsWind } from "react-icons/bs";
import { IoLocationSharp } from "react-icons/io5";

export default function WeatherComponent(){
    const [loading, setLoading] = useState(false);
    const [myLocationWeather, setMyLocationWeather] = useState(null)
    const [responseWeather, setResponseWeather] = useState("")

    const getMyLocationWeather = async (lat, lon) => {
        setLoading(true);
        try {
            const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherAPIS.apikeys}&units=metric`);
            if(!weatherRes.ok) {
                setResponseWeather("Endpoint not found");
                return
            }
            return await weatherRes.json();
        }catch(error) {
            console.error("Error fetching your Location weather:",error.message);
            setResponseWeather(`Error: ${error.message}`)
        }finally {
            setLoading(false);
        }
    }
    useEffect(()=>{
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (p) => {
                const latitude = p.coords.latitude;
                const longtitude = p.coords.longitude;

                const myWeather = await getMyLocationWeather(latitude, longtitude);
                setMyLocationWeather(myWeather);
            })
        }
    },[])

    let getDay = "";
    if(myLocationWeather && myLocationWeather.dt){
        const getDateTimeZOne = new Date((myLocationWeather.dt + myLocationWeather.timezone) * 1000)
        const getDayTime = getDateTimeZOne.getUTCHours();
    
        getDayTime >= 5 && getDayTime < 12 ? getDay = "Morning" : getDayTime >= 12 && getDayTime < 17 ? getDay = "Afternoon" : getDayTime >= 17 && getDayTime < 21 ? getDay = "Evening" : getDay = "Night";
    }

    return(<>
        <section className="lg:w-[90%] h-auto flex items-center gap-10 mx-auto">
            {/* my location weather */}
            <div className="w-full h-auto">
                <div className="bg-[#000000] rounded-lg w-full h-[400px] text-white ">
                    <h2 className="text-center uppercase font-[Montserrat] text-base font-bold tracking-wide pt-3">My location weather</h2>
                    {loading ? (<div className="w-full h-full flex items-center justify-center">
                        <Loader />
                        </div>) : myLocationWeather ? (
                    <div className="flex items-center justify-center flex-col pb-4 pt-2">
                        <div className="flex items-center gap-1">
                            <h2 className="text-blue-400 font-bold font-[mulish] tracking-wide text-xl uppercase flex items-center"> <IoLocationSharp /> {myLocationWeather.name}</h2>
                            <span>-</span>
                            <span className="text-yellow-400 font-semibold text-[15px] tracking-wide font-[Montserrat]">{getDay}</span>
                        </div>

                        <img src={`https://openweathermap.org/img/wn/${myLocationWeather.weather[0].icon}@2x.png`} alt="weather Icon"/>
                        
                        <p className="text-yellow-400 font-semibold font-[mulish] text-xl tracking-wide">{myLocationWeather.weather[0].description}</p>

                        <div className="flex items-center justify-between w-[80%] mx-auto mt-2">
                            <div className="">
                                <span className="flex items-center flex-col text-base font-semibold font-[mulish]"><TbTemperature size={25} className="text-red-600"/> Temperature</span>
                                <p className="text-center font-[mulish] font-semibold">{myLocationWeather.main.temp}&nbsp;&deg;C</p>
                            </div>
                            <div>
                                <span className="flex items-center flex-col text-base font-semibold font-[mulish]"><WiHumidity size={30} className="text-blue-600"/> Humidity</span>
                                <p className="text-center font-[mulish] font-semibold">{myLocationWeather.main.humidity}&nbsp;%</p>
                            </div>
                        </div>
                        <div>
                            <span className="flex items-center flex-col text-base font-semibold font-[mulish]"><BsWind size={30} className="text-green-600"/> Wind</span>
                            <p className="text-center font-[mulish] font-semibold">{myLocationWeather.wind.speed} m/s</p>
                        </div>
                    </div>
                ) : myLocationWeather === null ? (<p className="text-red-400 w-full h-full flex items-center justify-center text-sm lg:text-base  text-center px-4 lg:px-2">Ensure your devices Location is on and allow permission to use your Location - if all set refresh your app and give us minute to load your location.</p>) : (<p className="w-full h-full flex items-center justify-center text-2xl text-red-600">{responseWeather}</p>)}
                </div>
            </div>
        </section>
    
    </>)
}