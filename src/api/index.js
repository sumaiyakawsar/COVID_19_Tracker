import axios from 'axios';

const BASE_URL = 'https://disease.sh/v3/covid-19';

// 🌍 Global & country data
export const fetchData = async (country) => {
  try {
    const url = country
      ? `${BASE_URL}/countries/${country}`
      : `${BASE_URL}/all`;

    const { data } = await axios.get(url);

    return {
      confirmed: { value: data.cases || 0 },
      recovered: { value: data.recovered || 0 },
      deaths: { value: data.deaths || 0 },
      lastUpdate: data.updated,
      countryInfo: data.countryInfo || {}
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {};
  }
};


// 📈 Daily data
export const fetchDailyData = async () => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/historical/all?lastdays=all`
    );

    return Object.keys(data.cases).map((date) => ({
      date,
      confirmed: data.cases[date],
      deaths: data.deaths[date],
      recovered: data.recovered[date] || 0,  
    }));
  } catch (error) {
    console.error('Error fetching daily data:', error);
    return [];
  }
};


// 🌐 Countries list
export const fetchCountries = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/countries`);
    return data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};



