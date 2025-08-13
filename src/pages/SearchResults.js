import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchRestaurants, searchMenuItems } from '../data/restaurantsData';
import GlobalSearch from '../components/GlobalSearch';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState({ restaurants: [], menuItems: [] });
  const [activeTab, setActiveTab] = useState('restaurants');
  const [isLoading, setIsLoading] = useState(true);
  
  const query = searchParams.get('q') || '';
  const vegFilter = searchParams.get('veg');
  const cuisineFilter = searchParams.get('cuisine') || '';

  useEffect(() => {
    setIsLoading(true);
    
    const filters = {
      isVeg: vegFilter === 'true' ? true : vegFilter === 'false' ? false : undefined,
      cuisine: cuisineFilter
    };

    const restaurants = searchRestaurants(query, filters);
    const menuItems = searchMenuItems(query, filters);
    
    setSearchResults({ restaurants, menuItems });
    setIsLoading(false);
  }, [query, vegFilter, cuisineFilter]);

  const formatFilters = () => {
    const filters = [];
    if (vegFilter === 'true') filters.push('Vegetarian');
    if (vegFilter === 'false') filters.push('Non-Vegetarian');
    if (cuisineFilter) filters.push(cuisineFilter);
    return filters.join(', ');
  };

  if (isLoading) {
    return (
      <div className="search-results-page">
        <div className="search-header">
          <div className="container">
            <div className="cravecart-header-row">
              <Link to="/" className="cravecart-title">CraveCart</Link>
              <GlobalSearch showFilters={false} />
            </div>
          </div>
        </div>
        <div className="search-loading-page">
          <div className="loading-spinner">🔄</div>
          <p>Searching for delicious options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <div className="search-header">
        <div className="container">
          <div className="cravecart-header-row">
            <Link to="/" className="cravecart-title">CraveCart</Link>
            <GlobalSearch showFilters={false} />
          </div>
        </div>
      </div>

      <div className="container">
        <div className="search-info">
          <h1>Search Results</h1>
          {query && (
            <p className="search-query">
              Results for "<strong>{query}</strong>"
              {formatFilters() && <span className="applied-filters"> • {formatFilters()}</span>}
            </p>
          )}
          
          <div className="results-summary">
            <span>{searchResults.restaurants.length} restaurants</span>
            <span>•</span>
            <span>{searchResults.menuItems.length} dishes</span>
          </div>
        </div>

        <div className="search-tabs">
          <button 
            className={`search-tab ${activeTab === 'restaurants' ? 'active' : ''}`}
            onClick={() => setActiveTab('restaurants')}
          >
            <span className="tab-icon">🏪</span>
            Restaurants ({searchResults.restaurants.length})
          </button>
          <button 
            className={`search-tab ${activeTab === 'menuItems' ? 'active' : ''}`}
            onClick={() => setActiveTab('menuItems')}
          >
            <span className="tab-icon">🍽️</span>
            Dishes ({searchResults.menuItems.length})
          </button>
        </div>

        <div className="search-content">
          {activeTab === 'restaurants' && (
            <div className="restaurants-grid">
              {searchResults.restaurants.length === 0 ? (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>No restaurants found</h3>
                  <p>Try adjusting your search terms or filters</p>
                  <Link to="/" className="browse-all-btn">Browse All Restaurants</Link>
                </div>
              ) : (
                searchResults.restaurants.map(restaurant => (
                  <Link 
                    key={restaurant.id} 
                    to={restaurant.route} 
                    className="restaurant-card"
                  >
                    <div className="restaurant-image">
                      <img src={restaurant.photo} alt={restaurant.name} />
                      {restaurant.isVeg && <div className="veg-badge">🌱</div>}
                    </div>
                    <div className="restaurant-info">
                      <h3>{restaurant.name}</h3>
                      <p className="cuisines">{restaurant.cuisines.join(', ')}</p>
                      <div className="restaurant-meta">
                        <span className="rating">{restaurant.rating} ★</span>
                        <span className="delivery-time">{restaurant.deliveryTime}</span>
                      </div>
                      <p className="address">{restaurant.address}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {activeTab === 'menuItems' && (
            <div className="menu-items-grid">
              {searchResults.menuItems.length === 0 ? (
                <div className="no-results">
                  <div className="no-results-icon">🍽️</div>
                  <h3>No dishes found</h3>
                  <p>Try searching for different dish names or categories</p>
                  <Link to="/" className="browse-all-btn">Browse All Restaurants</Link>
                </div>
              ) : (
                searchResults.menuItems.map((item, index) => (
                  <Link 
                    key={`${item.restaurantId}-${index}`} 
                    to={item.restaurantRoute} 
                    className="menu-item-card"
                  >
                    <div className="menu-item-image">
                      <img src={item.photo} alt={item.name} />
                      <div className="price-badge">₹{item.price}</div>
                    </div>
                    <div className="menu-item-info">
                      <h3>{item.name}</h3>
                      <p className="description">{item.description}</p>
                      <div className="item-meta">
                        <span className="restaurant-name">{item.restaurantName}</span>
                        <span className="category">{item.category}</span>
                      </div>
                      <div className="restaurant-details">
                        <span className="rating">{item.restaurantRating} ★</span>
                        <span className="delivery-time">{item.deliveryTime}</span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {(searchResults.restaurants.length > 0 || searchResults.menuItems.length > 0) && (
          <div className="search-suggestions">
            <h3>Didn't find what you're looking for?</h3>
            <div className="suggestion-actions">
              <Link to="/" className="action-btn">Browse All Restaurants</Link>
              <button 
                className="action-btn secondary" 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Search Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;