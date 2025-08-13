import React, { useState, useEffect } from 'react';
import './RestaurantSearch.css';

const RestaurantSearch = ({ restaurant, onFilteredMenuChange, placeholder = "Search for dishes..." }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Get unique categories from restaurant menu
  const categories = Array.from(new Set(restaurant.menu.map(item => item.category)));

  useEffect(() => {
    let filteredMenu = restaurant.menu;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredMenu = filteredMenu.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory) {
      filteredMenu = filteredMenu.filter(item => item.category === selectedCategory);
    }

    // Filter by price range
    if (priceRange.min !== '') {
      filteredMenu = filteredMenu.filter(item => item.price >= parseInt(priceRange.min));
    }
    if (priceRange.max !== '') {
      filteredMenu = filteredMenu.filter(item => item.price <= parseInt(priceRange.max));
    }

    onFilteredMenuChange(filteredMenu);
  }, [searchQuery, selectedCategory, priceRange, restaurant.menu, onFilteredMenuChange]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
  };

  const hasActiveFilters = searchQuery || selectedCategory || priceRange.min || priceRange.max;

  return (
    <div className="restaurant-search">
      <div className="search-input-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="restaurant-search-input"
        />
        {searchQuery && (
          <button 
            className="clear-search-btn" 
            onClick={() => setSearchQuery('')}
          >
            ×
          </button>
        )}
      </div>

      <div className="search-filters">
        <div className="filter-group">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="filter-group price-filter">
          <input
            type="number"
            value={priceRange.min}
            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
            placeholder="Min ₹"
            className="price-input"
          />
          <span className="price-separator">-</span>
          <input
            type="number"
            value={priceRange.max}
            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
            placeholder="Max ₹"
            className="price-input"
          />
        </div>

        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default RestaurantSearch;