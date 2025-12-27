import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert
} from "@mui/material";


import { Cards, Chart, Header, Footer } from "./components";
import styles from "./App.module.css";
import { fetchData } from "./api";

const App = () => {
  const [data, setData] = useState({});
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const getInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedData = await fetchData();
        setData(fetchedData);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getInitialData();
  }, []);

  const handleCountryChange = async (selectedCountry) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedData = await fetchData(selectedCountry);
      setData(fetchedData);
      setCountry(selectedCountry);
    } catch (err) {
      setError(`Failed to load data for ${selectedCountry || "Global"}. Please try again.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className={styles.container}>
      {loading ? (
        <Box className={styles.loadingContainer}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading COVID-19 Data...
          </Typography>
        </Box>
      ) : (
        <>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Header
            lastUpdate={data.lastUpdate}
            darkMode={darkMode}
            toggleDarkMode={() => setDarkMode(!darkMode)}
            handleCountryChange={handleCountryChange}
            selectedCountry={country}
            disabled={false}
          />

          <Cards data={data} country={country} darkMode={darkMode} />
          <Chart data={data} country={country} darkMode={darkMode} />
          <Footer darkMode={darkMode} />
        </>
      )}
    </div>
  );

};

export default App;