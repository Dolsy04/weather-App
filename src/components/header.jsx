import { TiWeatherCloudy } from "react-icons/ti";
import { IoSearch } from "react-icons/io5";
import { useState, useEffect } from "react";
import weatherAPIS from "../apis/weathersApi";
import Loader from "./loader";
import { IoLocationSharp } from "react-icons/io5";
import { TbTemperature } from "react-icons/tb";
import { WiHumidity } from "react-icons/wi";
import { BsWind } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import searchImage from "../assets/search.png"

export default function Header(){
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchResponse, setSearchResponse] = useState("");
    const [searchModal, setSearchModal] = useState(false);
    const [holdSearchWeather, setHoldSearchWeather] = useState(null);


    const getCitiesWeather = async (city) => {
        setLoading(true);
        try {
            const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIS.apikeys}&units=metric`);
            if(!weatherRes.ok) {
                setSearchResponse("No city found")
                return;
            }
            return await weatherRes.json();
        }catch(error) {
            console.error("Error fetching your Location weather:",error.message);
            setSearchResponse(`Error: ${error.message}`)
        }finally {
            setLoading(false);
        }
    }
    
    const handleSearch = async (e) =>{
        if(e.key === "Enter" && search.trim() !== ""){
            const weatherResult = await getCitiesWeather(search);
            if(weatherResult){
                setHoldSearchWeather(weatherResult);
            }
        }
    }
    useEffect(()=>{
        if(search.trim() === "") return;
        const timeOut = setTimeout(async()=>{
                const weatherResult = await getCitiesWeather(search);
                if(weatherResult){
                    setHoldSearchWeather(weatherResult);
                }
            },3000)
        return ()=> clearTimeout(timeOut)
    },[search])


    let getDay = "";
    if(holdSearchWeather && holdSearchWeather.dt){
        const getDateTimeZOne = new Date((holdSearchWeather.dt + holdSearchWeather.timezone) * 1000)
        const getDayTime = getDateTimeZOne.getUTCHours();
    
        getDayTime >= 5 && getDayTime < 12 ? getDay = "Morning" : getDayTime >= 12 && getDayTime < 17 ? getDay = "Afternoon" : getDayTime >= 17 && getDayTime < 21 ? getDay = "Evening" : getDay = "Night";
    }


    return (<>
        <header className="w-full py-2 px-6 bg-black flex items-center justify-between gap-3 lg:flex-row flex-col sticky top-0 z-10">
            <div className=" flex items-center gap-4">
                <span><TiWeatherCloudy className="text-yellow-400" size={30}/></span>
                <span className="text-yellow-400 font-[800] font-[Montserrat] tracking-wide">WEATHER APP</span>
            </div>
            <div className="flex items-center border-2 border-yellow-400 lg:w-[25%] w-full md:w-[60%] h-[40px] rounded-xl px-3">
                <IoSearch className="text-white w-[6%] h-full" size={20} />
                <input type="search" className="w-full h-full border-none outline-none px-3 text-white" placeholder="Search City" value={search} onChange={(e) => setSearch(e.target.value)} onFocus={()=> setSearchModal(true)}  onKeyDown={handleSearch}/>
            </div>
        </header>

        <section className={`h-auto w-full relative top-2 mt-3 lg:mt-0 bg-[#083dea79] flex items-center justify-center rounded-md transition-all duration-300 ease-in-out ${searchModal ? "top-2" : "top-[-1800px]"}`}>
            <IoMdClose className="absolute right-2 top-2 cursor-pointer text-white" size={30} onClick={()=>{setSearchModal(false), setHoldSearchWeather(null), setSearch(''), setSearchResponse('')}}/>
            {searchModal && (<div className="w-[300px] h-full text-white bg-black">
                {loading ? (<div className="w-full h-full flex items-center justify-center p-4">
                    <Loader />
                </div>) : searchResponse ? (<p className="w-full h-full flex items-center justify-center p-4 text-red-400 font-[mulish] font-normal text-base">{searchResponse}</p>) : holdSearchWeather ? (<div className="flex items-center justify-center flex-col pb-4 pt-2">
                    <div className="flex items-center gap-1">
                        <h2 className="text-blue-400 font-bold font-[mulish] tracking-wide text-xl uppercase flex items-center"> <IoLocationSharp /> {holdSearchWeather.name}</h2>
                        <span>-</span>
                        <span className="text-yellow-400 font-semibold text-[15px] tracking-wide font-[Montserrat]">{getDay}</span>
                    </div>

                    <img src={`https://openweathermap.org/img/wn/${holdSearchWeather.weather[0].icon}@2x.png`}/>
                    
                    <p className="text-yellow-400 font-semibold font-[mulish] text-xl tracking-wide">{holdSearchWeather.weather[0].description}</p>

                        <div className="flex items-center justify-between w-[80%] mx-auto mt-2">
                            <div className="">
                                <span className="flex items-center flex-col text-base font-semibold font-[mulish]"><TbTemperature size={25} className="text-red-600"/> Temperature</span>
                                <p className="text-center font-[mulish] font-semibold">{holdSearchWeather.main.temp}&nbsp;&deg;C</p>
                            </div>
                            <div>
                                <span className="flex items-center flex-col text-base font-semibold font-[mulish]"><WiHumidity size={30} className="text-blue-600"/> Humidity</span>
                                <p className="text-center font-[mulish] font-semibold">{holdSearchWeather.main.humidity}&nbsp;%</p>
                            </div>
                        </div>
                        <div>
                            <span className="flex items-center flex-col text-base font-semibold font-[mulish]"><BsWind size={30} className="text-green-600"/> Wind</span>
                            <p className="text-center font-[mulish] font-semibold">{holdSearchWeather.wind.speed} m/s</p>
                        </div>
                </div>) : (<div className="w-full h-full flex items-center justify-center flex-col p-4 text-red-400 font-[mulish] font-normal text-base">
                    {/* <div className="w-[70%] h-[50%] rounded-full">
                        <img src={searchImage} alt="search image" className="w-full h-full object-cover rounded-full"/>
                    </div> */}
                    <p>Type city in the searchbar</p>
                    </div>)}
            </div>)}
        </section>
        

    </>)
}
