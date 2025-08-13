import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getRestaurantById } from '../data/restaurantsData';
import RestaurantSearch from './RestaurantSearch';
import GlobalSearch from './GlobalSearch';
import './LePrivePage.css';

const restaurant = getRestaurantById('le-prive');
const categories = Array.from(new Set(restaurant.menu.map(item => item.category)));

export default function LePrivePage() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [filteredMenu, setFilteredMenu] = useState(restaurant.menu);

  const handleAddToCart = (item) => {
    setCart([...cart, item]);
  };

  const handleFilteredMenuChange = useCallback((filtered) => {
    setFilteredMenu(filtered);
  }, []);

  return (
    <div className="restaurant-detail-bg">
      <div
        className="restaurant-header restaurant-header-bgimg"
        style={{ backgroundImage: `url(${restaurant.photo})` }}
      >
        <div className="cravecart-header-row">
          <Link to="/" className="cravecart-title">CraveCart</Link>
          <GlobalSearch showFilters={false} />
          <span className="cravecart-icons">
            <span className="cravecart-cart-icon">🛒</span>
          </span>
        </div>
        <div className="restaurant-header-content-bg">
          <div className="restaurant-header-info">
            <h1 className="restaurant-title">{restaurant.name}</h1>
            <div className="restaurant-cuisines">{restaurant.cuisines.join(', ')}</div>
            <div className="restaurant-address">{restaurant.address}</div>
            <div className="restaurant-meta">
              <span className="restaurant-timings">{restaurant.timings}</span>
              <span className="restaurant-contact">{restaurant.contact}</span>
              <span className="restaurant-rating">
                <span className="rating-badge">{restaurant.rating}★</span>
                <span className="rating-count">{restaurant.ratingCount} ratings</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="restaurant-menu-section menu-flex-layout">
        <h2 className="menu-title">Menu</h2>
        <RestaurantSearch 
          restaurant={restaurant} 
          onFilteredMenuChange={handleFilteredMenuChange}
          placeholder="Search dishes at Le Prive..."
        />
        <div className="menu-flex-row">
          <div className="menu-categories-vertical">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`menu-category-btn${selectedCategory === cat ? ' active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="menu-list-vertical">
            {filteredMenu.filter(item => !selectedCategory || item.category === selectedCategory).length === 0 ? (
              <div className="no-menu-results">
                <p>No dishes found matching your search criteria.</p>
                <p>Try adjusting your search or browse other categories.</p>
              </div>
            ) : (
              filteredMenu.filter(item => !selectedCategory || item.category === selectedCategory).map((item, idx) => (
                <div className="menu-item" key={idx}>
                  <div className="menu-item-main">
                    <div className="menu-item-name-desc">
                      <span className="menu-item-name">{item.name}</span>
                      <div className="menu-item-desc">{item.description}</div>
                      <button className="add-to-cart-btn" onClick={() => handleAddToCart(item)}>
                        Add to Cart
                      </button>
                    </div>
                    <span className="menu-item-price">₹{item.price}</span>
                    <img src={item.photo} alt={item.name} className="menu-item-photo" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 