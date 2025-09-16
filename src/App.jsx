import weatherAPIS from "./apis/weathersApi" 
import Header from "./components/header"
import WeatherComponent from "./components/locationWeather"
import DefualtCities from "./components/citiesWeather"
import NearbyCity from "./components/nearbyCity"
function App() {
  
  return (
    <>
     <Header />
     <div className="lg:w-[95%] w-full lg:h-[400px] h-auto flex items-center justify-center lg:flex-row flex-col gap-10 mt-5 mx-auto">
      <div className="lg:w-[30%] w-full md:w-[60%]">
        <WeatherComponent />
      </div>
      <div className="lg:w-[70%] lg:h-[400px] w-[95%] h-auto bg-[#02025886] rounded-lg">
        <DefualtCities />
      </div>
     </div>
     <NearbyCity />
    </>
  )
}

export default App
