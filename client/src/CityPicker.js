// src/CityPicker.js
import React, { useState, useEffect, useRef } from 'react';
import './CityPicker.css';

// Simplified dataset for major cities and administrative divisions
const cityData = {
  US: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'], // Major US cities
  AE: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'], // Emirates
  CA: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'], // Major Canadian cities
  GB: ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool'], // Major UK cities
  // Add more countries and cities as needed
  // Default fallback for countries without specific data
  DEFAULT: ['City 1', 'City 2', 'City 3', 'City 4', 'City 5'],
};

const CityPicker = ({ country, value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef(null); // Ref for the entire picker
  const dropdownRef = useRef(null); // Ref for the dropdown

  // Fetch cities based on selected country
  useEffect(() => {
    if (country) {
      const countryCode = Object.keys(cityData).find((code) =>
        country.toLowerCase().includes(code.toLowerCase())
      ) || 'DEFAULT';
      setCities(cityData[countryCode] || cityData.DEFAULT);
    } else {
      setCities([]);
    }
  }, [country]);

  // Auto-detect user's country and pre-select city
  useEffect(() => {
    if (!country && !value) {
      fetch('https://ipapi.co/json/')
        .then((response) => response.json())
        .then((data) => {
          const detectedCountry = data.country_name || 'United States'; // Default to US if unavailable
          onChange({ country: detectedCountry, city: '' }); // Update parent with country
          const countryCode = data.country_code || 'US';
          setCities(cityData[countryCode] || cityData.DEFAULT);
        })
        .catch((error) => console.error('Error fetching geolocation:', error));
    }
  }, [country, value, onChange]);

  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleSelect = (city) => {
    onChange(city);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  // Highlight matching text
  const highlightMatch = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <span key={index} className="highlight">{part}</span>
      ) : (
        part
      )
    );
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredCities.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(filteredCities[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const highlightedItem = dropdownRef.current.children[highlightedIndex + 1]; // +1 for search input
      highlightedItem?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="city-picker" ref={wrapperRef} onKeyDown={handleKeyDown}>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        // Removed onBlur to handle closing with click outside
        placeholder={country ? `Select a city in ${country}` : 'Select a country first'}
        className="city-input"
        aria-label="Select your city"
        disabled={!country}
        autoComplete="off"
      />
      {isOpen && country && (
        <div className="city-dropdown" role="listbox" ref={dropdownRef}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search city..."
            className="city-search"
            autoFocus
            aria-label="Search for a city"
          />
          <ul className="city-list">
            {filteredCities.map((city, index) => (
              <li
                key={city}
                onClick={() => handleSelect(city)}
                className={`city-item ${index === highlightedIndex ? 'highlighted' : ''}`}
                role="option"
                aria-selected={index === highlightedIndex}
              >
                <span>{highlightMatch(city, debouncedSearchTerm)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CityPicker;