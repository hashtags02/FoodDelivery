import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { searchRestaurants, searchMenuItems } from '../data/restaurantsData';
import './GlobalSearch.css';

const GlobalSearch = ({ placeholder = "Search for restaurants, dishes, or cuisines...", showFilters = true }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ restaurants: [], menuItems: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [filters, setFilters] = useState({
    isVeg: undefined,
    cuisine: ''
  });
  const [activeTab, setActiveTab] = useState('restaurants');

  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (query.trim().length === 0) {
      setSearchResults({ restaurants: [], menuItems: [] });
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const restaurants = searchRestaurants(query, filters);
      const menuItems = searchMenuItems(query, filters);
      
      setSearchResults({ restaurants, menuItems });
      setShowResults(true);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filters]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults({ restaurants: [], menuItems: [] });
    setShowResults(false);
  };

  const handleResultClick = () => {
    setShowResults(false);
  };

  const cuisineOptions = [
    '', 'French', 'Italian', 'Indian', 'Chinese', 'South Indian', 'North Indian', 
    'Punjabi', 'Street Food', 'Pizza', 'Continental', 'Healthy', 'Rajasthani',
    'Maharashtrian', 'Chaat', 'Momos', 'Tibetan'
  ];

  return (
    <div className="global-search" ref={searchRef}>
      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="search-input"
        />
        {query && (
          <button className="clear-search" onClick={clearSearch}>
            ×
          </button>
        )}
        {isSearching && <div className="search-loading">⏳</div>}
      </div>

      {showFilters && (
        <div className="search-filters">
          <select 
            value={filters.cuisine} 
            onChange={(e) => handleFilterChange('cuisine', e.target.value)}
            className="filter-select"
          >
            <option value="">All Cuisines</option>
            {cuisineOptions.slice(1).map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
          
          <div className="veg-filter">
            <label>
              <input
                type="radio"
                name="vegFilter"
                checked={filters.isVeg === undefined}
                onChange={() => handleFilterChange('isVeg', undefined)}
              />
              All
            </label>
            <label>
              <input
                type="radio"
                name="vegFilter"
                checked={filters.isVeg === true}
                onChange={() => handleFilterChange('isVeg', true)}
              />
              Veg Only
            </label>
            <label>
              <input
                type="radio"
                name="vegFilter"
                checked={filters.isVeg === false}
                onChange={() => handleFilterChange('isVeg', false)}
              />
              Non-Veg
            </label>
          </div>
        </div>
      )}

      {showResults && (query.trim().length > 0) && (
        <div className="search-results" ref={resultsRef}>
          <div className="search-results-tabs">
            <button 
              className={`tab ${activeTab === 'restaurants' ? 'active' : ''}`}
              onClick={() => setActiveTab('restaurants')}
            >
              Restaurants ({searchResults.restaurants.length})
            </button>
            <button 
              className={`tab ${activeTab === 'menuItems' ? 'active' : ''}`}
              onClick={() => setActiveTab('menuItems')}
            >
              Dishes ({searchResults.menuItems.length})
            </button>
          </div>

          <div className="search-results-content">
            {activeTab === 'restaurants' && (
              <div className="restaurants-results">
                {searchResults.restaurants.length === 0 ? (
                  <div className="no-results">No restaurants found</div>
                ) : (
                  searchResults.restaurants.map(restaurant => (
                    <Link 
                      key={restaurant.id} 
                      to={restaurant.route} 
                      className="restaurant-result"
                      onClick={handleResultClick}
                    >
                      <img src={restaurant.photo} alt={restaurant.name} className="result-image" />
                      <div className="result-info">
                        <h4>{restaurant.name}</h4>
                        <p className="cuisines">{restaurant.cuisines.join(', ')}</p>
                        <div className="restaurant-meta">
                          <span className="rating">{restaurant.rating}★</span>
                          <span className="delivery-time">{restaurant.deliveryTime}</span>
                          {restaurant.isVeg && <span className="veg-badge">🌱</span>}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {activeTab === 'menuItems' && (
              <div className="menu-items-results">
                {searchResults.menuItems.length === 0 ? (
                  <div className="no-results">No dishes found</div>
                ) : (
                  searchResults.menuItems.map((item, index) => (
                    <Link 
                      key={`${item.restaurantId}-${index}`} 
                      to={item.restaurantRoute} 
                      className="menu-item-result"
                      onClick={handleResultClick}
                    >
                      <img src={item.photo} alt={item.name} className="result-image" />
                      <div className="result-info">
                        <h4>{item.name}</h4>
                        <p className="description">{item.description}</p>
                        <div className="item-meta">
                          <span className="price">₹{item.price}</span>
                          <span className="restaurant">{item.restaurantName}</span>
                          <span className="category">{item.category}</span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {(searchResults.restaurants.length > 0 || searchResults.menuItems.length > 0) && (
            <div className="view-all-results">
              <Link to={`/search?q=${encodeURIComponent(query)}&veg=${filters.isVeg}&cuisine=${filters.cuisine}`} onClick={handleResultClick}>
                View all results →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;