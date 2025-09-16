import weatherAPIS from "../apis/weathersApi";
import { useState, useEffect, useRef } from "react";
import Loader from "./loader";
import { TbTemperature } from "react-icons/tb";
import { WiHumidity } from "react-icons/wi";
import { BsWind } from "react-icons/bs";
import { IoLocationSharp } from "react-icons/io5";

export default function DefualtCities(){
    const [loading, setLoading] = useState(false);
    const [citiesWeather, setMyCitiesWeather] = useState([])
    const [responseWeather, setResponseWeather] = useState("")

    const defaualtCities = ["Los Angeles", "Lagos", "Phoenix", "Incheon", "Ibadan", "Osogbo", "Dallas", "Seongnam", "Paris", "London", "Dubai", "Tokyo", "New York", "Durban" , "Porto Alegre", "Pune", "Quanzhou",]

    const getCitiesWeather = async (city) => {
        setLoading(true);
        try {
            const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIS.apikeys}&units=metric`);
            if(!weatherRes.ok) {
                alert("Location weather not found");
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
        const loadDefualtCities = async () => {
            const defaualtCitiesResponse = await  Promise.all(defaualtCities.map((city) => getCitiesWeather(city)));

            setMyCitiesWeather(defaualtCitiesResponse.filter(Boolean))
        }
        loadDefualtCities()
    },[])

    function getDateTimeZOne(dt, timezone){
        if(!dt || !timezone) return;
        const getDateTimeZOne = new Date((dt + timezone) * 1000)
        const getDayTime = getDateTimeZOne.getUTCHours();


        return getDayTime >= 5 && getDayTime < 12 ?  "Morning" : getDayTime >= 12 && getDayTime < 17 ?  "Afternoon" : getDayTime >= 17 && getDayTime < 21 ?  "Evening" :  "Night";
    }

    return(<>
        <section className="w-full h-full overflow-hidden p-2">
            <div className="lg:w-[95%] w-full h-full mx-auto overflow-x-scroll scrollbar">
                {loading ? (<div className="w-full h-full flex items-center justify-center">
                    <Loader />
                    </div>) : citiesWeather ? (<div className="w-full h-full flex justify-start items-center gap-4 lg:gap-6">
                            {citiesWeather.map((city, index)=>(
                            <div key={index} className="text-white bg-[#000000] lg:min-w-[350px] min-w-[280px] h-full rounded-lg flex items-center justify-center flex-col pb-4 pt-2">
                                <div className="flex items-center gap-1">
                                    <h2 className="text-blue-400 font-bold font-[mulish] tracking-wide lg:text-xl text-base uppercase flex items-center"> <IoLocationSharp /> {city.name}</h2>
                                    <span>-</span>
                                    <span className="text-yellow-400 font-semibold text-[15px] tracking-wide font-[Montserrat]">{getDateTimeZOne(city.dt, city.timezone)}</span>
                                </div>
                                <img src={`https://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`} alt="weather Icon"/>

                                 <p className="text-yellow-400 font-semibold font-[mulish] text-xl tracking-wide">{city.weather[0].description}</p>

                                <div className="flex items-center justify-between w-[80%] mx-auto mt-2">
                                    <div className="">
                                        <span className="flex items-center flex-col text-base font-semibold font-[mulish]"><TbTemperature size={25} className="text-red-600"/> Temperature</span>
                                        <p className="text-center font-[mulish] font-semibold">{city.main.temp}&nbsp;&deg;C</p>
                                    </div>
                                    <div>
                                        <span className="flex items-center flex-col text-base font-semibold font-[mulish]"><WiHumidity size={30} className="text-blue-600"/> Humidity</span>
                                        <p className="text-center font-[mulish] font-semibold">{city.main.humidity}&nbsp;%</p>
                                    </div>
                                </div>
                                <div>
                                    <span className="flex items-center flex-col text-base font-semibold font-[mulish]"><BsWind size={30} className="text-green-600"/> Wind</span>
                                    <p className="text-center font-[mulish] font-semibold">{city.wind.speed} m/s</p>
                                </div>
                            </div>
                        ))}
                    </div>) : "Error"}
            </div>
        </section>
    </>)
}