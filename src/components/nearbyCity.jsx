import weatherAPIS from "../apis/weathersApi";
import { useState, useEffect, useRef } from "react";
import Loader from "./loader";
import { TbTemperature } from "react-icons/tb";
import { WiHumidity } from "react-icons/wi";
import { BsWind } from "react-icons/bs";
import { IoLocationSharp } from "react-icons/io5";
import { WiCloud } from "react-icons/wi";
import { MdOutlineNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { WiTime3 } from "react-icons/wi";
import { IoSearch } from "react-icons/io5";

export default function NearbyCity(){
    const [loading, setLoading] = useState(false);
    const [nearByCityWeather, setNearByCityWeather] = useState([])
    const [responseWeather, setResponseWeather] = useState("")
    const [searchNearby, setSearchNearby] = useState("")
    const [holdFiltered, setHoldFiltered] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    const getNearByCityWeather = async (lat, lon) => {
        setLoading(true);
        try {
            const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=50&appid=${weatherAPIS.apikeys}&units=metric`);
            if(!weatherRes.ok) {
                alert("Status: 404 - Endpoint doesn't exsit");
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

                const nearByWeather = await getNearByCityWeather(latitude, longtitude);
                setNearByCityWeather(nearByWeather?.list || []);
            })
        }
    },[])

    useEffect(()=>{
        if(searchNearby.trim()){
            const filterSearchNearby = nearByCityWeather.filter(weather => weather.name?.toLowerCase().includes(searchNearby.toLowerCase()));
            setHoldFiltered(filterSearchNearby);
            setCurrentPage(1);
        }else{
            setHoldFiltered(nearByCityWeather)
        }
    },[searchNearby, nearByCityWeather])

    const paginationPage = holdFiltered.slice((currentPage - 1) * 7, currentPage * 7);
    const totalPage = Math.ceil(holdFiltered.length / 7);

    function getDateTimeZOne(dt){
        if(!dt) return;
        const getDateTimeZOne = new Date((dt) * 1000)
        const getDayTime = getDateTimeZOne.getUTCHours();


        return getDayTime >= 5 && getDayTime < 12 ?  "Morning" : getDayTime >= 12 && getDayTime < 17 ?  "Afternoon" : getDayTime >= 17 && getDayTime < 21 ?  "Evening" :  "Night";
    }

    return(<>
        <section className="w-full h-auto mx-auto my-10">
            <div className="w-[90%] mx-auto flex items-center justify-between lg:flex-row flex-col gap-2 bg-[#000000] p-3">
                <h2 className="text-yellow-400 font-[mulish] font-semibold text-base lg:text-xl">View nearby city weather</h2>

                <div className="flex items-center border-2 border-yellow-400 lg:w-[30%] md:w-[60%] w-full h-[40px] rounded-xl px-3">
                    <IoSearch className="text-white w-[6%] h-full" size={20} />
                    <input type="search" className="w-full h-full border-none outline-none px-3 text-white" placeholder="Search nearyby city" value={searchNearby} onChange={(e)=> setSearchNearby(e.target.value)}/>
                </div>
            </div>
            <div className="w-full h-auto">
                {loading ? (<div className="w-[90%] mx-auto py-4 bg-[#000000] h-full flex items-center justify-center"><Loader/></div>) : nearByCityWeather.length === 0 ? (<p className="w-[90%] mx-auto py-4 px-4 bg-[#000000] h-full flex items-center justify-center text-red-600 font-[mulish] text-sm lg:text-xl">No nearby City weather found, Ensure your devices location is on and allow permission to use your location - if all set refresh your app and give minutes to load</p>) : searchNearby.trim() && holdFiltered.length === 0 ? (<p className="w-[90%] mx-auto py-4 h-full flex items-center justify-center text-red-600 font-[mulish] text-xl bg-[#000000]">No result found for your search</p>) : (<div className="bg-[#000] w-[90%] mx-auto lg:rounded-xl overflow-hidden">
                    <div className="max-w-full overflow-x-scroll scrollbar">
                        <table className="min-w-full text-left lg:text-center overflow-x-auto border-collapse">
                            <thead className="border-b border-red-400">
                                <tr>
                                    <td className="py-6 px-4 text-base font-[mulish] text-blue-400 font-bold tracking-wide "></td>
                                    <td className="py-6 px-4 lg:text-base text-sm font-[mulish] text-blue-400 font-bold tracking-wide">
                                        <div className="flex items-center justify-center gap-1">
                                            <IoLocationSharp size={20}/>    
                                            <span>City</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-4 lg:text-base text-sm font-[mulish] text-blue-400 font-bold tracking-wide">
                                        <div className="flex items-center justify-center gap-1">
                                            <WiTime3 size={20}/>    
                                            <span>Period</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-4 lg:text-base text-sm font-[mulish] text-blue-400 font-bold tracking-wide">
                                        <div className="flex items-center justify-center gap-1">
                                            <TbTemperature size={20}/>
                                            <span>Temperature</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-4 lg:text-base text-sm font-[mulish] text-blue-400 font-bold tracking-wide">
                                        <div className="flex items-center justify-center gap-1">
                                            <WiCloud size={20}/>
                                            <span>Weather</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-4 lg:text-base text-sm font-[mulish] text-blue-400 font-bold tracking-wide">
                                        <div className="flex items-center justify-center gap-1">
                                            <WiHumidity size={20}/>
                                            <span>Humidity</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-4 text-base font-[mulish] text-blue-400 font-bold tracking-wide">
                                        <div className="flex items-center justify-center gap-1">
                                            <BsWind size={20}/>
                                            <span>Wind</span>
                                        </div>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                {paginationPage.map((city, index)=> (
                                <tr key={index} className="border-b border-blue-400">
                                    <td><img src={`https://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`} alt="" /></td>
                                    <td className="font-[mulish] font semibold text-base px-4 py-4 text-center text-white">{city.name}</td>
                                    <td className="font-[mulish] font semibold text-base px-4 py-4 text-center text-white">{getDateTimeZOne(city.dt)}</td>
                                    <td className="font-[mulish] font semibold text-base px-4 py-4 text-center text-white">{city.main.temp}&nbsp;&deg;C</td>
                                    <td className="font-[mulish] font semibold text-base px-4 py-4 text-center text-white">{city.weather[0].description}</td>
                                    <td className="font-[mulish] font semibold text-base px-4 py-4 text-center text-white">{city.main.humidity}&nbsp;%</td>
                                    <td className="font-[mulish] font semibold text-base px-4 py-4 text-center text-white">{city.wind.speed} m/s</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>


                    <div className="w-[95%] mx-auto my-2 py-3 flex items-center justify-between lg:flex-row flex-col-reverse gap-2">
                        <div className="flex items-center gap-4">
                            <button disabled={currentPage === 1} onClick={()=>setCurrentPage((prev)=> prev - 1)} className={`p-2 font-[mulish] font-normal text-sm bg-[#00000044]  flex items-center justify-center border-2 rounded-md ${currentPage === 1 ? "border-[#f5f5f550] text-[#f1f1f19a] cursor-not-allowed" : "border-white text-white cursor-pointer"}`}><GrFormPrevious size={20}/> Previous</button>

                            <button disabled={currentPage === totalPage} onClick={()=>setCurrentPage((prev)=> prev + 1)} className={`p-2 font-[mulish] font-normal text-sm bg-[#00000044] text-white flex items-center justify-center border-2 border-[#f5f5f550] rounded-md ${currentPage === totalPage ? "border-[#f5f5f550] text-[#f1f1f19a] cursor-not-allowed" : "border-white text-white cursor-pointer"}`}>Next <MdOutlineNavigateNext size={20}/></button>
                        </div>

                        <p className="text-white text-sm font-[mulish] font-normal">Page {currentPage} of {totalPage}</p>
                    </div>
                </div>)}
            </div>
        </section>
    
    </>)
}