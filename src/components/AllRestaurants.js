import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./AllRestaurants.css";
import { restaurantsData } from '../data/restaurantsData';

const AllRestaurants = () => {
  const [showVegOnly, setShowVegOnly] = useState(false);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const filtered = showVegOnly
      ? restaurantsData.filter((r) => r.isVeg)
      : restaurantsData;
    setRestaurants(filtered.slice(0, 10));
  }, [showVegOnly]);

  const loadMoreRestaurants = useCallback(() => {
    const filtered = showVegOnly
      ? restaurantsData.filter((r) => r.isVeg)
      : restaurantsData;

    const currentLength = restaurants.length;
    const more = filtered.slice(currentLength, currentLength + 10);
    if (more.length > 0) {
      setRestaurants((prev) => [...prev, ...more]);
    }
  }, [restaurants, showVegOnly]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
      ) {
        loadMoreRestaurants();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreRestaurants]);

  const toggleVeg = () => {
    setShowVegOnly((prev) => !prev);
  };

  // No need for routeMap anymore since data includes routes

  return (
    <section className="all-restaurants">
      <div className="all-restaurants-header">
        <h2>All Restaurants</h2>
        <div className="filters" onClick={toggleVeg}>
          <span className="filter-label">
            {showVegOnly ? "Veg: ON" : "Veg: OFF"}
          </span>
          <div className={`filter-toggle ${showVegOnly ? "on" : ""}`}></div>
        </div>
      </div>

      <div className="restaurant-grid">
        {restaurants.map((res, index) => (
          <Link
            to={res.route}
            key={res.id || index}
            className="restaurant-card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img src={res.photo} alt={res.name} />
            <p className="restaurant-name">{res.name}</p>
            <p className="restaurant-time">⏱ {res.deliveryTime}</p>
            {res.isVeg && <div className="veg-indicator">🌱</div>}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default AllRestaurants;
