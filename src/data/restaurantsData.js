export const restaurantsData = [
  {
    id: 'le-prive',
    name: 'Le Prive',
    photo: process.env.PUBLIC_URL + '/menu-images/le-prive.jpg',
    cuisines: ['French', 'European', 'Fine Dining', 'Wine', 'Desserts', 'Cocktails'],
    address: '789, Champs-Élysées Avenue, Race Course Road, Vadodara',
    timings: '6pm – 11pm',
    contact: '+919999999999',
    rating: 4.9,
    ratingCount: 432,
    route: '/le-prive',
    isVeg: false,
    deliveryTime: '25 mins',
    menu: [
      { name: 'Escargots de Bourgogne', price: 899, description: 'Burgundy snails in garlic herb butter.', category: 'Appetizers', photo: process.env.PUBLIC_URL + '/menu-images/escargots.jpg' },
      { name: 'Coq au Vin', price: 1299, description: 'Braised chicken in red wine with mushrooms.', category: 'Main Course', photo: process.env.PUBLIC_URL + '/menu-images/coq-au-vin.jpg' },
      { name: 'Beef Bourguignon', price: 1499, description: 'Slow-cooked beef in red wine sauce.', category: 'Main Course', photo: process.env.PUBLIC_URL + '/menu-images/beef-bourguignon.jpg' },
      { name: 'Ratatouille', price: 799, description: 'Provençal vegetable stew with herbs.', category: 'Main Course', photo: process.env.PUBLIC_URL + '/menu-images/ratatouille.jpg' },
      { name: 'Crème Brûlée', price: 399, description: 'Classic French vanilla custard with caramelized sugar.', category: 'Desserts', photo: process.env.PUBLIC_URL + '/menu-images/creme-brulee.jpg' },
      { name: 'French Red Wine', price: 599, description: 'Premium French red wine selection.', category: 'Beverages', photo: process.env.PUBLIC_URL + '/menu-images/french-wine.jpg' },
    ],
  },
  {
    id: 'old-school-eatery',
    name: 'Old School Eatery',
    photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252981/cbf0e26a374f31531096c56671993220_ffd7xy.jpg',
    cuisines: ['Indian', 'North Indian', 'Punjabi', 'Street Food'],
    address: '123, Heritage Street, Vadodara',
    timings: '11am – 11pm',
    contact: '+919888888888',
    rating: 4.2,
    ratingCount: 298,
    route: '/old-school-eatery',
    isVeg: false,
    deliveryTime: '30 mins',
    menu: [
      { name: 'Butter Chicken', price: 450, description: 'Creamy tomato-based chicken curry.', category: 'Main Course', photo: process.env.PUBLIC_URL + '/menu-images/butter-chicken.jpg' },
      { name: 'Dal Makhani', price: 350, description: 'Rich and creamy black lentils.', category: 'Main Course', photo: process.env.PUBLIC_URL + '/menu-images/dal-makhani.jpg' },
      { name: 'Naan', price: 80, description: 'Fresh baked Indian flatbread.', category: 'Breads', photo: process.env.PUBLIC_URL + '/menu-images/naan.jpg' },
      { name: 'Samosa', price: 40, description: 'Crispy fried pastry with spiced filling.', category: 'Appetizers', photo: process.env.PUBLIC_URL + '/menu-images/samosa.jpg' },
      { name: 'Lassi', price: 120, description: 'Traditional yogurt-based drink.', category: 'Beverages', photo: process.env.PUBLIC_URL + '/menu-images/lassi.jpg' },
    ],
  },
  {
    id: 'dominos-pizza',
    name: "Domino's Pizza",
    photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252983/f9007f73da46783cb255a1e621637f27_d26djo.jpg',
    cuisines: ['Pizza', 'Italian', 'Fast Food'],
    address: '456, Commercial Complex, Vadodara',
    timings: '10am – 12am',
    contact: '+919777777777',
    rating: 4.1,
    ratingCount: 856,
    route: '/dominos-pizza',
    isVeg: false,
    deliveryTime: '20 mins',
    menu: [
      { name: 'Margherita Pizza', price: 299, description: 'Classic pizza with tomato sauce and mozzarella.', category: 'Pizza', photo: process.env.PUBLIC_URL + '/menu-images/margherita.jpg' },
      { name: 'Pepperoni Pizza', price: 449, description: 'Spicy pepperoni with cheese and sauce.', category: 'Pizza', photo: process.env.PUBLIC_URL + '/menu-images/pepperoni.jpg' },
      { name: 'Garlic Bread', price: 149, description: 'Crispy bread with garlic butter.', category: 'Sides', photo: process.env.PUBLIC_URL + '/menu-images/garlic-bread.jpg' },
      { name: 'Chicken Wings', price: 299, description: 'Spicy grilled chicken wings.', category: 'Sides', photo: process.env.PUBLIC_URL + '/menu-images/wings.jpg' },
      { name: 'Coca Cola', price: 60, description: 'Chilled soft drink.', category: 'Beverages', photo: process.env.PUBLIC_URL + '/menu-images/coke.jpg' },
    ],
  },
  {
    id: 'south-cafe',
    name: 'The South Cafe',
    photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252984/781c6867d971c5fa7a704c992dc755c3_waxhi9.jpg',
    cuisines: ['South Indian', 'Vegetarian', 'Coffee'],
    address: '789, Temple Road, Vadodara',
    timings: '7am – 10pm',
    contact: '+919666666666',
    rating: 4.5,
    ratingCount: 412,
    route: '/south-cafe',
    isVeg: true,
    deliveryTime: '20 mins',
    menu: [
      { name: 'Masala Dosa', price: 120, description: 'Crispy crepe with spiced potato filling.', category: 'Main Course', photo: process.env.PUBLIC_URL + '/menu-images/dosa.jpg' },
      { name: 'Idli Sambar', price: 80, description: 'Steamed rice cakes with lentil curry.', category: 'Main Course', photo: process.env.PUBLIC_URL + '/menu-images/idli.jpg' },
      { name: 'Filter Coffee', price: 40, description: 'Traditional South Indian coffee.', category: 'Beverages', photo: process.env.PUBLIC_URL + '/menu-images/filter-coffee.jpg' },
      { name: 'Vada', price: 60, description: 'Crispy fried lentil doughnut.', category: 'Snacks', photo: process.env.PUBLIC_URL + '/menu-images/vada.jpg' },
      { name: 'Coconut Chutney', price: 30, description: 'Fresh coconut chutney.', category: 'Sides', photo: process.env.PUBLIC_URL + '/menu-images/chutney.jpg' },
    ],
  },
  {
    id: 'santosh-pav-bhaji',
    name: 'Santosh Pav Bhaji',
    photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252985/a79424d1606a535db91108548167727f_rpmxgv.jpg',
    cuisines: ['Street Food', 'Maharashtrian', 'Vegetarian'],
    address: '321, Street Food Corner, Vadodara',
    timings: '5pm – 11pm',
    contact: '+919555555555',
    rating: 4.3,
    ratingCount: 189,
    route: '/santosh-pav-bhaji',
    isVeg: true,
    deliveryTime: '30 mins',
    menu: [
      { name: 'Pav Bhaji', price: 150, description: 'Spicy vegetable curry with bread rolls.', category: 'Main Course', photo: process.env.PUBLIC_URL + '/menu-images/pav-bhaji.jpg' },
      { name: 'Cheese Pav Bhaji', price: 200, description: 'Pav bhaji topped with cheese.', category: 'Main Course', photo: process.env.PUBLIC_URL + '/menu-images/cheese-pav-bhaji.jpg' },
      { name: 'Vadapav', price: 40, description: 'Spiced potato fritter in bread bun.', category: 'Snacks', photo: process.env.PUBLIC_URL + '/menu-images/vadapav.jpg' },
      { name: 'Bhel Puri', price: 80, description: 'Puffed rice snack with chutneys.', category: 'Snacks', photo: process.env.PUBLIC_URL + '/menu-images/bhel-puri.jpg' },
      { name: 'Buttermilk', price: 50, description: 'Spiced yogurt drink.', category: 'Beverages', photo: process.env.PUBLIC_URL + '/menu-images/buttermilk.jpg' },
    ],
  },
  {
    id: 'urban-bites',
    name: 'Urban Bites',
    photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752397646/ae21f90d2d9471f8d345edfbe03e4ee2_pxltci.jpg',
    cuisines: ['Continental', 'Italian', 'Vegetarian', 'Healthy'],
    address: '654, Urban Plaza, Vadodara',
    timings: '12pm – 11pm',
    contact: '+919444444444',
    rating: 4.4,
    ratingCount: 367,
    route: '/urban-bites',
    isVeg: true,
    deliveryTime: '25 mins',
    menu: [
      { name: 'Quinoa Salad', price: 350, description: 'Healthy quinoa with fresh vegetables.', category: 'Salads', photo: process.env.PUBLIC_URL + '/menu-images/quinoa-salad.jpg' },
      { name: 'Pasta Primavera', price: 450, description: 'Fresh vegetable pasta in white sauce.', category: 'Main Course', photo: process.env.PUBLIC_URL + '/menu-images/pasta-primavera.jpg' },
      { name: 'Avocado Toast', price: 250, description: 'Multigrain bread with avocado spread.', category: 'Appetizers', photo: process.env.PUBLIC_URL + '/menu-images/avocado-toast.jpg' },
      { name: 'Green Smoothie', price: 180, description: 'Healthy green vegetable smoothie.', category: 'Beverages', photo: process.env.PUBLIC_URL + '/menu-images/green-smoothie.jpg' },
      { name: 'Veggie Burger', price: 320, description: 'Plant-based burger with fresh veggies.', category: 'Main Course', photo: process.env.PUBLIC_URL + '/menu-images/veggie-burger.jpg' },
    ],
  },
  {
    id: 'punjabi-dhaba',
    name: 'Punjabi Dhaba',
    photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252985/a79424d1606a535db91108548167727f_rpmxgv.jpg',
    cuisines: ['Punjabi', 'North Indian', 'Dhaba Style'],
    address: '987, Highway Road, Vadodara',
    timings: '11am – 11pm',
    contact: '+919333333333',
    rating: 4.0,
    ratingCount: 245,
    route: '/punjabi-dhaba',
    isVeg: false,
    deliveryTime: '35 mins',
    menu: [
      { name: 'Sarson ka Saag', price: 280, description: 'Traditional mustard greens curry.', category: 'Main Course', photo: process.env.PUBLIC_URL + '/menu-images/sarson-saag.jpg' },
      { name: 'Makki di Roti', price: 60, description: 'Corn flour flatbread.', category: 'Breads', photo: process.env.PUBLIC_URL + '/menu-images/makki-roti.jpg' },
      { name: 'Chicken Tikka', price: 400, description: 'Grilled marinated chicken pieces.', category: 'Appetizers', photo: process.env.PUBLIC_URL + '/menu-images/chicken-tikka.jpg' },
      { name: 'Rajma Chawal', price: 250, description: 'Kidney bean curry with rice.', category: 'Main Course', photo: process.env.PUBLIC_URL + '/menu-images/rajma-chawal.jpg' },
      { name: 'Punjabi Lassi', price: 120, description: 'Traditional thick yogurt drink.', category: 'Beverages', photo: process.env.PUBLIC_URL + '/menu-images/punjabi-lassi.jpg' },
    ],
  },
  {
    id: 'rajasthani-rasoi',
    name: 'Rajasthani Rasoi',
    photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252983/400b385226afc26f539aa732d38b14a6_k6si5f.jpg',
    cuisines: ['Rajasthani', 'Traditional', 'Vegetarian'],
    address: '456, Royal Palace Road, Vadodara',
    timings: '12pm – 10pm',
    contact: '+919222222222',
    rating: 4.6,
    ratingCount: 198,
    route: '/rajasthani-rasoi',
    isVeg: true,
    deliveryTime: '30 mins',
    menu: [
      { name: 'Dal Baati Churma', price: 350, description: 'Traditional Rajasthani thali with dal, baati and churma.', category: 'Main Course', photo: process.env.PUBLIC_URL + '/menu-images/dal-baati-churma.jpg' },
      { name: 'Gatte ki Sabzi', price: 220, description: 'Gram flour dumplings in spicy curry.', category: 'Main Course', photo: process.env.PUBLIC_URL + '/menu-images/gatte-sabzi.jpg' },
      { name: 'Ker Sangri', price: 180, description: 'Desert beans and berries curry.', category: 'Main Course', photo: process.env.PUBLIC_URL + '/menu-images/ker-sangri.jpg' },
      { name: 'Mawa Kachori', price: 80, description: 'Sweet stuffed pastry with dry fruits.', category: 'Desserts', photo: process.env.PUBLIC_URL + '/menu-images/mawa-kachori.jpg' },
      { name: 'Masala Chai', price: 40, description: 'Traditional spiced tea.', category: 'Beverages', photo: process.env.PUBLIC_URL + '/menu-images/masala-chai.jpg' },
    ],
  },
  {
    id: 'the-chaat-chaska',
    name: 'The Chaat Chaska',
    photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252986/930a559fbe007109bb73b2be1f53411a_ojpdss.jpg',
    cuisines: ['Chaat', 'Street Food', 'North Indian', 'Vegetarian'],
    address: '789, Chaat Corner, Vadodara',
    timings: '4pm – 11pm',
    contact: '+919111111111',
    rating: 4.2,
    ratingCount: 312,
    route: '/the-chaat-chaska',
    isVeg: true,
    deliveryTime: '15 mins',
    menu: [
      { name: 'Pani Puri', price: 60, description: 'Crispy shells with flavored water.', category: 'Chaat', photo: process.env.PUBLIC_URL + '/menu-images/pani-puri.jpg' },
      { name: 'Dahi Puri', price: 80, description: 'Puri shells with yogurt and chutney.', category: 'Chaat', photo: process.env.PUBLIC_URL + '/menu-images/dahi-puri.jpg' },
      { name: 'Aloo Tikki', price: 90, description: 'Spiced potato patties with toppings.', category: 'Chaat', photo: process.env.PUBLIC_URL + '/menu-images/aloo-tikki.jpg' },
      { name: 'Papdi Chaat', price: 100, description: 'Crispy wafers with yogurt and chutneys.', category: 'Chaat', photo: process.env.PUBLIC_URL + '/menu-images/papdi-chaat.jpg' },
      { name: 'Masala Soda', price: 50, description: 'Spiced lemon soda drink.', category: 'Beverages', photo: process.env.PUBLIC_URL + '/menu-images/masala-soda.jpg' },
    ],
  },
  {
    id: 'momos-hut',
    name: 'MomosHut',
    photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752398135/0b5eb439a0fe2c71aa7b427d3402e1ea_jd6bkm.jpg',
    cuisines: ['Momos', 'Tibetan', 'Chinese', 'Street Food'],
    address: '321, Food Street, Vadodara',
    timings: '2pm – 11pm',
    contact: '+919000000000',
    rating: 4.3,
    ratingCount: 456,
    route: '/momos-hut',
    isVeg: true,
    deliveryTime: '15 mins',
    menu: [
      { name: 'Veg Steamed Momos', price: 120, description: 'Steamed dumplings with vegetable filling.', category: 'Momos', photo: process.env.PUBLIC_URL + '/menu-images/veg-steamed-momos.jpg' },
      { name: 'Fried Momos', price: 140, description: 'Crispy fried dumplings.', category: 'Momos', photo: process.env.PUBLIC_URL + '/menu-images/fried-momos.jpg' },
      { name: 'Tandoori Momos', price: 160, description: 'Grilled momos with tandoori flavoring.', category: 'Momos', photo: process.env.PUBLIC_URL + '/menu-images/tandoori-momos.jpg' },
      { name: 'Chilli Momos', price: 180, description: 'Spicy momos tossed in chilli sauce.', category: 'Momos', photo: process.env.PUBLIC_URL + '/menu-images/chilli-momos.jpg' },
      { name: 'Hot Tea', price: 30, description: 'Warming tea to go with momos.', category: 'Beverages', photo: process.env.PUBLIC_URL + '/menu-images/hot-tea.jpg' },
    ],
  },
];

// Helper function to get restaurant by ID
export const getRestaurantById = (id) => {
  return restaurantsData.find(restaurant => restaurant.id === id);
};

// Helper function to search restaurants by name, cuisine, or menu items
export const searchRestaurants = (query, filters = {}) => {
  if (!query && !filters.cuisine && !filters.isVeg) {
    return restaurantsData;
  }

  return restaurantsData.filter(restaurant => {
    // Text search in name, cuisines, and menu items
    const searchText = query.toLowerCase();
    const matchesText = !query || 
      restaurant.name.toLowerCase().includes(searchText) ||
      restaurant.cuisines.some(cuisine => cuisine.toLowerCase().includes(searchText)) ||
      restaurant.menu.some(item => 
        item.name.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText) ||
        item.category.toLowerCase().includes(searchText)
      );

    // Cuisine filter
    const matchesCuisine = !filters.cuisine || 
      restaurant.cuisines.some(cuisine => 
        cuisine.toLowerCase().includes(filters.cuisine.toLowerCase())
      );

    // Vegetarian filter
    const matchesVeg = filters.isVeg === undefined || restaurant.isVeg === filters.isVeg;

    return matchesText && matchesCuisine && matchesVeg;
  });
};

// Helper function to search menu items across all restaurants
export const searchMenuItems = (query, filters = {}) => {
  const results = [];
  
  restaurantsData.forEach(restaurant => {
    const searchText = query.toLowerCase();
    const matchingItems = restaurant.menu.filter(item => {
      const matchesText = !query ||
        item.name.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText) ||
        item.category.toLowerCase().includes(searchText);

      const matchesVeg = filters.isVeg === undefined || 
        (filters.isVeg ? restaurant.isVeg : true);

      return matchesText && matchesVeg;
    });

    matchingItems.forEach(item => {
      results.push({
        ...item,
        restaurantName: restaurant.name,
        restaurantId: restaurant.id,
        restaurantRoute: restaurant.route,
        restaurantRating: restaurant.rating,
        deliveryTime: restaurant.deliveryTime
      });
    });
  });

  return results;
};