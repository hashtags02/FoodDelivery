# Admin Dashboard - Food Delivery Project

## Overview
This project now includes a comprehensive Admin Dashboard for super administrators to manage restaurants, orders, and users in the food delivery system.

## Features

### 🏪 Restaurant Management
- View all restaurants with details (ID, Name, Location, Owner, Cuisine, Total Orders, Status)
- Approve pending restaurant applications
- Block/Unblock restaurants
- View restaurant-specific orders

### 📊 Order Management
- View all orders across the platform
- Track order status (Pending, In Progress, Delivered)
- Monitor order details including customer info, items, and totals

### 📈 Dashboard Statistics
- Total restaurants count
- Pending approval count
- Total orders count
- Active users count

### 🔐 Role-Based Access Control
- Only users with `role: 'admin'` can access the admin dashboard
- Automatic redirection based on user role after login
- Protected routes for admin-only content

## File Structure

```
src/
├── pages/
│   ├── AdminDashboard.js          # Main admin dashboard component
│   └── AdminDashboard.css         # Admin dashboard styles
├── components/
│   └── TestAdminAccess.js         # Testing component for role switching
└── App.js                         # Updated with role-based routing
```

## Routes

- `/admin` - Admin Dashboard (admin role required)
- `/dashboard` - Smart redirect based on user role
- `/user-dashboard` - Regular user dashboard
- `/test-admin` - Testing component for role switching

## How to Test

### 1. Login as a Regular User
1. Navigate to `/login`
2. Complete the authentication process
3. You'll be redirected to `/dashboard` which will then redirect to `/user-dashboard`

### 2. Test Admin Access
1. After logging in, go to `/test-admin`
2. Click "Make Admin" to temporarily change your role to admin
3. Click "Go to Admin Dashboard" to access the admin panel
4. Test the admin functionality

### 3. Test Role-Based Routing
1. With admin role: `/dashboard` redirects to `/admin`
2. With user role: `/dashboard` redirects to `/user-dashboard`
3. Accessing `/admin` without admin role shows "Access Denied"

## Admin Actions

### Restaurant Management
- **Approve**: Change restaurant status from "pending" to "approved"
- **Block/Unblock**: Toggle restaurant status between "approved" and "blocked"
- **View Orders**: Open a modal showing restaurant-specific orders

### Data Display
- **Restaurants Tab**: Shows restaurant management table
- **Orders Tab**: Shows order management table
- **Statistics Cards**: Display key metrics at the top

## Styling

The admin dashboard uses:
- Clean, modern design with card-based layout
- Responsive grid system for statistics
- Tabbed interface for different sections
- Color-coded status badges
- Hover effects and smooth transitions
- Mobile-responsive design

## Security Notes

⚠️ **Important**: The current implementation is frontend-only for demonstration purposes. In production:

1. **Backend Validation**: All role checks should be validated on the server
2. **JWT Tokens**: User roles should be verified from JWT tokens
3. **API Protection**: Admin endpoints should be protected with middleware
4. **Audit Logs**: All admin actions should be logged for security

## Future Enhancements

- [ ] Real-time notifications for new restaurant applications
- [ ] Advanced filtering and search for restaurants/orders
- [ ] Bulk actions (approve multiple restaurants at once)
- [ ] Export functionality for reports
- [ ] User management interface
- [ ] Analytics and reporting dashboard
- [ ] Email notifications for restaurant owners

## Testing the Implementation

1. **Start the development server**:
   ```bash
   npm start
   ```

2. **Login with any user account**

3. **Test role switching**:
   - Go to `/test-admin`
   - Switch between user and admin roles
   - Test the different dashboard redirects

4. **Test admin functionality**:
   - Approve/block restaurants
   - View orders
   - Navigate between tabs

## Troubleshooting

### Common Issues

1. **"Access Denied" message**: Ensure user has `role: 'admin'` in localStorage
2. **Dashboard not redirecting**: Check if user object exists and has a role property
3. **Styling issues**: Ensure AdminDashboard.css is properly imported

### Debug Steps

1. Check browser console for errors
2. Verify user object in localStorage
3. Check if all components are properly imported
4. Ensure routes are correctly configured in App.js

## Contributing

When adding new admin features:
1. Follow the existing component structure
2. Add proper role-based access control
3. Include responsive design considerations
4. Add appropriate error handling
5. Update this README with new features
