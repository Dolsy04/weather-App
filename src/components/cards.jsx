import weatherAPIS from "../apis/weathersApi";
import { useState, useEffect, useRef } from "react";
import { WiDegrees } from "react-icons/wi";

export default function Cards(){
    const defaualtCities = ["Los Angeles", "Lagos", "Phoenix", "Incheon", "Ibadan", "Osogbo", "Dallas", "Seongnam", "Paris", "London", "Dubai", "Tokyo", "New York", "Durban" , "Porto Alegre", "Pune", "Quanzhou",]
    const [weatherData, setWeatherData] = useState([])
    const [isLoading, setIsLoading] = useState(false)


    const fetchWeather = async (city) => {
        setIsLoading(true);
        try{
            const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIS.apikeys}&units=metric`);

            if(!weatherRes.ok) throw new Error("City not found");
            return await weatherRes.json();
        }catch (error){
            console.log("Error:",error.message);
            return null;
        }finally{
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        const loadDefualtCities = async () =>{
            const response = await Promise.all(
                defaualtCities.map((city)=> fetchWeather(city))
            );
            setWeatherData(response.filter(Boolean));
        }
        loadDefualtCities();
    },[])


    return(<>
        <section className="mt-[0px] w-full h-[350px] bg-black overflow-x-hidden">
            <div className="w-[80%] h-full mx-auto overflow-x-scroll self-start-safe scrollbar">
                {isLoading ? (<p className="text-black">Loading..</p>) : (<div className="flex items-center justify-start gap-5 h-full w-full px-1 py-4">
                    {weatherData.map((city, index)=> {
                        const icons = city.weather[0].icon;
                        const iconUrl = `https://openweathermap.org/img/wn/${icons}@2x.png`;

                        const dayTime = new Date((city.dt + city.timezone) * 1000);
                        const hoursTime = dayTime.getUTCHours();

                        let daysOfTime = "";
                        if(hoursTime >= 5 && hoursTime < 12){
                            daysOfTime = "Morning";
                        }else if(hoursTime >= 5 && hoursTime < 17){
                            daysOfTime = "Afternoon";
                        }else if(hoursTime >= 17 && hoursTime < 21){
                            daysOfTime= "Evening";
                        }else {
                            daysOfTime = "Night";
                        }

                        return (
                            <div key={index} className="min-w-[200px] h-auto bg-[#302929a4] rounded-md flex items-center justify-start flex-col py-4">
                                <p className="font-[mulish] font-semibold text-yellow-400 text-xl">{city.name}</p>
                                <img src={iconUrl} alt="" />
                        
                                <div className="pl-2 text-center">
                                    <p className="font-[mulish] font-semibold text-yellow-400 text-xl">{daysOfTime}</p>
                                    <p className="font-[mulish] font-semibold text-yellow-400 text-base">{city.weather[0].description}</p>
                                    <p className="font-[mulish] font-semibold text-yellow-400 text-sm flex items-center justify-center gap-0">
                                        <span>{city.main.temp}</span>
                                        <span className="text-sm align-super">&nbsp;&deg; C</span>
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>)}
            </div>
        </section>
    </>)
}