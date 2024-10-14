import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // Make sure to import the CSS file

const CombinedFilter = () => {
  const [sheetData, setSheetData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTemperature, setSelectedTemperature] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [error, setError] = useState(null);

  const apiKey = 'AIzaSyBitWQWU-maZdcyWgjLIRLZ2ouFj9q9UHE';
  const sheetId = '17DiWX5VnYeeMGNIMGUBuGnuDAwlCAzwuUGXYDmsDy-8';
  const range = 'clothing_database!A1:Z100';

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const response = await axios.get(
          `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`
        );
        const rows = response.data.values;
        setSheetData(rows);
        setFilteredData(rows);
      } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
        setError(error);
      }
    };

    fetchSheetData();
  }, [apiKey, sheetId, range]);

  const handleFiltersChange = () => {
    const filtered = sheetData.filter((row) => {
      const temperature = row[7] ? row[7].toLowerCase() : ''; // Temperature data (ensure it's lowercase)
      const occasion = row[6] ? row[6].toLowerCase() : ''; // Occasion data (ensure it's lowercase)

      const matchesTemperature =
        selectedTemperature === '' || temperature.includes(selectedTemperature.toLowerCase());
      const matchesOccasion =
        selectedOccasion === '' || occasion.includes(selectedOccasion.toLowerCase());

      return matchesTemperature && matchesOccasion;
    });

    setFilteredData(filtered);
  };

  const handleTemperatureChange = (e) => {
    setSelectedTemperature(e.target.value);
  };

  const handleOccasionChange = (e) => {
    setSelectedOccasion(e.target.value);
  };

  const handleImageError = (e) => {
    if (!e.target.dataset.fallback) {
      e.target.src = '/api/placeholder/400/320'; // Fallback to placeholder
      e.target.dataset.fallback = true; // Prevent infinite error loop
    }
  };

  useEffect(() => {
    handleFiltersChange();
  }, [selectedTemperature, selectedOccasion]);

  return (
    <div className="container">
      <h1>Filter Clothing by Temperature & Occasion</h1>

      <div className="filter-section">
        {/* Temperature Filter */}
        <div>
          <label>Select Temperature Range:</label>
          <select
            onChange={handleTemperatureChange}
            value={selectedTemperature}
          >
            <option value="">All</option>
            <option value="15-20°C">15-20°C</option>
            <option value="18-22°C">18-22°C</option>
            <option value="18-25°C">18-25°C</option>
          </select>
        </div>

        {/* Occasion Filter */}
        <div>
          <label>Select Occasion:</label>
          <select
            onChange={handleOccasionChange}
            value={selectedOccasion}
          >
            <option value="">All</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="work">Work</option>
            <option value="party">Party</option>
          </select>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">Error: {error.message}</div>}

      {filteredData.length > 1 ? (
        <div className="grid">
          {filteredData.slice(1).map((row, rowIndex) => {
            return (
              <div key={rowIndex} className="card">
                {row[20] ? (
                  <img
                    src={row[20]}
                    alt={`Clothing item ${rowIndex + 1}`}
                    onError={handleImageError}
                  />
                ) : (
                  <div>No Image Available</div>
                )}
                <div className="card-content">
                  <h3>{row[1]}</h3> {/* Clothing Name */}
                  <p><strong>Temperature:</strong> {row[7]}</p> {/* Assuming column 7 has temperature */}
                  <p><strong>Occasion:</strong> {row[6]}</p> {/* Assuming column 6 has occasion */}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>No items available for the selected filters.</div>
      )}
    </div>
  );
};

export default CombinedFilter;