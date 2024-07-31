// src/components/Weather.jsx
import React, { useEffect, useState } from 'react';

const Weather = ({ city }) => {
    const [temperature, setTemperature] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchWeather = async () => {
        setLoading(true);
        try {
            const apiKey = import.meta.env.VITE_APP_API_ID;
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            if (response.ok) {
                setTemperature(data.main.temp);
            } else {
                console.error('Error fetching weather data:', data.message);
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, [city]);

    return (
        <div>
            {loading ? 'Loading...' : temperature !== null ? `${temperature}°C` : 'N/A'}
        </div>
    );
};

export default Weather;
