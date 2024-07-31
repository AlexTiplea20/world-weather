// src/components/CountryTable.jsx
import React, { useEffect, useState } from 'react';
import Weather from './Weather';
import '../styles/App.css';

const CountryTable = () => {
    const [countries, setCountries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState('name');
    const [weatherData, setWeatherData] = useState({});

    const fetchCountries = async () => {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        setCountries(data);
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    const sortedCountries = [...countries].sort((a, b) => {
        if (sortOption === 'name') {
            return a.name.common.localeCompare(b.name.common);
        } else if (sortOption === 'population') {
            return b.population - a.population;
        } else if (sortOption === 'languages') {
            return Object.keys(b.languages || {}).length - Object.keys(a.languages || {}).length;
        }
        return 0;
    });

    const countriesPerPage = 10;
    const indexOfLastCountry = currentPage * countriesPerPage;
    const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
    const currentCountries = sortedCountries.slice(indexOfFirstCountry, indexOfLastCountry);

    const handleNextPage = () => {
        if (indexOfLastCountry < sortedCountries.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleGetWeather = (countryCode, city) => {
        setWeatherData(prevState => ({ ...prevState, [countryCode]: { loading: true } }));
        const fetchWeather = async () => {
            try {
                const apiKey = import.meta.env.VITE_APP_API_ID;
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
                const response = await fetch(url);
                const data = await response.json();
                if (response.ok) {
                    setWeatherData(prevState => ({ ...prevState, [countryCode]: { temperature: data.main.temp, loading: false } }));
                } else {
                    console.error('Error fetching weather data:', data.message);
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };
        fetchWeather();
    };


    return (
        <div className="App">
            <h1>World Weather App</h1>
            <div className="select-container">
                <select onChange={(e) => setSortOption(e.target.value)}>
                    <option value="name">Country Name Alphabetical</option>
                    <option value="population">Population</option>
                    <option value="languages">Number of Languages</option>
                </select>
            </div>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>UN Member</th>
                    <th>Capital</th>
                    <th>{sortOption === 'population' ? 'Population' : sortOption === 'languages' ? 'Languages' : 'Weather'}</th>
                </tr>
                </thead>
                <tbody>
                {currentCountries.map((country) => (
                    <tr key={country.cca3}>
                        <td>{country.name.common}</td>
                        <td>{country.unMember ? 'Yes' : 'No'}</td>
                        <td>{country.capital ? country.capital[0] : 'N/A'}</td>
                        <td>
                            {sortOption === 'population' ? (
                                'No data to display'
                            ) : sortOption === 'languages' ? (
                                'No data to display'
                            ) : country.capital ? (
                                weatherData[country.cca3]?.loading ? (
                                    'Loading...'
                                ) : weatherData[country.cca3]?.temperature !== undefined ? (
                                    `${weatherData[country.cca3].temperature}°C`
                                ) : (
                                    <button onClick={() => handleGetWeather(country.cca3, country.capital[0])}>
                                        Get Capital Weather
                                    </button>
                                )
                            ) : (
                                'N/A'
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                <span>{currentPage}</span>
                <button onClick={handleNextPage} disabled={indexOfLastCountry >= sortedCountries.length}>Next</button>
            </div>
        </div>
    );
};

export default CountryTable;
