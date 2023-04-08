import { useEffect, useState } from 'react'
import './CityWeather.css'
import { alert, OpenWeatherResponse } from '../types/OpenWeatherTypes'
import CurrentWeather from './CurrentWeather'
import HourlyWeather from './HourlyWeather'
import DailyWeather from './DailyWeather'
import WeatherAlerts from './WeatherAlerts'
import request from '../utils/request'
import { requestMock } from '../utils/OpenWeatherMock'

type CityWeatherItemType = {
    city: City
    apiKey?: string
    refreshKey: number
    onCityRefreshed: (success: boolean) => void
    onDeleteCity: () => void
}

const RefreshedAt: React.FC<{ dt: number }> = ({ dt }) => (
    <small className="RefreshedAt">
        refreshed at {new Date(dt * 1000).toLocaleTimeString()}
    </small>
)

const CityWeather: React.FC<CityWeatherItemType> = ({
    city,
    apiKey,
    refreshKey,
    onCityRefreshed,
    onDeleteCity,
}) => {
    const [weather, setWeather] = useState<OpenWeatherResponse>()

    useEffect(() => {
        ;(async () => {
            if (apiKey) {
                const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${city.lat}&lon=${city.lng}&exclude=minutely&appid=${apiKey}&units=metric&lang=en`
                console.log('request url', url)

                try {
                    // const data = await request<OpenWeatherResponse>(url)
                    const data = await requestMock(url)
                    setWeather(data)
                    onCityRefreshed(true)
                } catch (e) {
                    console.error(e)
                    onCityRefreshed(false)
                }
            }
        })()
    }, [refreshKey, city, apiKey, setWeather])

    return (
        <div className="CityWeatherItem">
            <div className="CityWeatherItemHeader">
                <h1>
                    {city.city}{' '}
                    <small title={city.country} tabIndex={0}>
                        ({city.code})
                    </small>
                </h1>
                <div className="CityWeatherItemHeaderDetails">
                    <span>
                        <button className="delete" onClick={onDeleteCity}>
                            ❌ delete
                        </button>
                    </span>
                    {weather && <RefreshedAt dt={weather.current.dt} />}
                </div>
            </div>
            {weather && (
                <div>
                    <CurrentWeather current={weather.current} />
                    <HourlyWeather
                        hourly={weather.hourly}
                        listClassName="CityWeatherItemList"
                        itemClassName="CityWeatherItemItem"
                    />
                    <DailyWeather
                        daily={weather.daily}
                        listClassName="CityWeatherItemList"
                        itemClassName="CityWeatherItemItem"
                    />
                    <WeatherAlerts
                        dt={weather.current.dt}
                        alerts={weather.alerts}
                    />
                </div>
            )}
        </div>
    )
}

export default CityWeather
