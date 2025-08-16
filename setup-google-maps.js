#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🗺️  Setting up Google Maps for Vadodara Food Delivery Tracking\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function checkEnvFile() {
  const envPath = path.join(__dirname, '.env');
  
  if (!fs.existsSync(envPath)) {
    log('❌ .env file not found!', 'red');
    log('Creating .env file from .env.example...', 'yellow');
    
    const envExamplePath = path.join(__dirname, '.env.example');
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      log('✅ .env file created successfully!', 'green');
    } else {
      log('❌ .env.example file not found!', 'red');
      return false;
    }
  }
  
  // Check if API key is set
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('your_google_maps_api_key_here') || 
      envContent.includes('AIzaSyDeveloperKey_REPLACE_WITH_YOUR_ACTUAL_KEY')) {
    return false;
  }
  
  return true;
}

function displaySetupInstructions() {
  log('\n📋 Google Maps API Setup Instructions:', 'bold');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  
  log('\n1. 🔗 Open Google Cloud Console:', 'yellow');
  log('   https://console.cloud.google.com/');
  
  log('\n2. 📁 Create or Select Project:', 'yellow');
  log('   • Click "Select a project" → "New Project"');
  log('   • Name: "Vadodara Food Delivery" (or your choice)');
  log('   • Click "Create"');
  
  log('\n3. 🔧 Enable Required APIs:', 'yellow');
  log('   Navigate to "APIs & Services" → "Library" and enable:');
  log('   ✓ Maps JavaScript API');
  log('   ✓ Places API');
  log('   ✓ Geocoding API');
  log('   ✓ Directions API');
  
  log('\n4. 🔑 Create API Key:', 'yellow');
  log('   • Go to "APIs & Services" → "Credentials"');
  log('   • Click "Create Credentials" → "API Key"');
  log('   • Copy the generated API key');
  
  log('\n5. 🛡️  Secure Your API Key:', 'yellow');
  log('   • Click "Restrict Key" on your new API key');
  log('   • Application restrictions: HTTP referrers');
  log('   • Add: localhost:3000/* (for development)');
  log('   • API restrictions: Select the 4 APIs enabled above');
  
  log('\n6. 📝 Update Environment File:', 'yellow');
  log('   • Open .env file in your project root');
  log('   • Replace REACT_APP_GOOGLE_MAPS_API_KEY value with your API key');
  
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
}

function checkDependencies() {
  log('\n🔍 Checking project dependencies...', 'blue');
  
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log('❌ package.json not found!', 'red');
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const requiredDeps = [
    '@googlemaps/js-api-loader',
    '@googlemaps/react-wrapper'
  ];
  
  const missingDeps = requiredDeps.filter(dep => 
    !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
  );
  
  if (missingDeps.length > 0) {
    log(`❌ Missing dependencies: ${missingDeps.join(', ')}`, 'red');
    log('Installing missing dependencies...', 'yellow');
    
    try {
      execSync(`npm install ${missingDeps.join(' ')}`, { stdio: 'inherit' });
      log('✅ Dependencies installed successfully!', 'green');
    } catch (error) {
      log('❌ Failed to install dependencies', 'red');
      return false;
    }
  } else {
    log('✅ All required dependencies are installed', 'green');
  }
  
  return true;
}

function validateVadodaraConfig() {
  log('\n🏙️  Validating Vadodara configuration...', 'blue');
  
  const configPath = path.join(__dirname, 'src', 'config', 'googleMaps.js');
  if (!fs.existsSync(configPath)) {
    log('❌ Google Maps configuration file not found!', 'red');
    return false;
  }
  
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // Check for Vadodara coordinates
  if (configContent.includes('22.3072') && configContent.includes('73.1812')) {
    log('✅ Vadodara coordinates configured correctly', 'green');
  } else {
    log('❌ Vadodara coordinates not found in configuration', 'red');
    return false;
  }
  
  // Check delivery zones
  const expectedZones = ['Central Vadodara', 'Sayajigunj', 'Alkapuri'];
  const hasAllZones = expectedZones.every(zone => configContent.includes(zone));
  
  if (hasAllZones) {
    log('✅ Vadodara delivery zones configured correctly', 'green');
  } else {
    log('❌ Some Vadodara delivery zones are missing', 'red');
    return false;
  }
  
  return true;
}

function createTestOrder() {
  log('\n📦 Creating sample test data...', 'blue');
  
  const testOrderPath = path.join(__dirname, 'test-order-data.json');
  const sampleOrder = {
    orderId: 'ORD1234567890',
    status: 'out_for_delivery',
    restaurant: {
      name: 'Vadodara Delights',
      location: {
        latitude: 22.3072,
        longitude: 73.1812
      },
      address: 'Sayajigunj, Vadodara',
      phone: '+91 265 123 4567'
    },
    deliveryAddress: {
      street: 'Alkapuri Society, Block A',
      city: 'Vadodara',
      coordinates: {
        latitude: 22.2950,
        longitude: 73.2020
      }
    },
    driver: {
      name: 'Rahul Patel',
      phone: '+91 98765 43210',
      vehicleNumber: 'GJ-06-AB-1234',
      rating: 4.8
    },
    tracking: {
      currentLocation: {
        latitude: 22.3010,
        longitude: 73.1900,
        timestamp: new Date().toISOString()
      },
      estimatedTimeRemaining: 15,
      distanceRemaining: '2.3'
    }
  };
  
  fs.writeFileSync(testOrderPath, JSON.stringify(sampleOrder, null, 2));
  log('✅ Sample test order created: test-order-data.json', 'green');
  
  return true;
}

function displayQuickStart() {
  log('\n🚀 Quick Start Guide:', 'bold');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  
  log('\n1. 📝 Get your Google Maps API key (see instructions above)', 'yellow');
  log('2. 🔧 Update .env file with your API key', 'yellow');
  log('3. 🚀 Start the development servers:', 'yellow');
  log('   Frontend: npm start');
  log('   Backend:  cd backend && npm run dev');
  log('\n4. 🧪 Test the tracking system:', 'yellow');
  log('   • Open http://localhost:3000/track');
  log('   • Enter order ID: ORD1234567890');
  log('   • View live tracking on Google Maps');
  
  log('\n📱 Features to test:', 'green');
  log('   ✓ Real-time map with Vadodara center');
  log('   ✓ Restaurant, driver, and delivery markers');
  log('   ✓ Delivery route visualization');
  log('   ✓ Driver contact information');
  log('   ✓ ETA calculations for Vadodara traffic');
  
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
}

// Main execution
async function main() {
  try {
    log('🚀 Starting setup process...\n', 'bold');
    
    // Check environment file
    const hasValidApiKey = checkEnvFile();
    
    // Check dependencies
    const depsValid = checkDependencies();
    
    // Validate Vadodara configuration
    const configValid = validateVadodaraConfig();
    
    // Create test data
    const testDataCreated = createTestOrder();
    
    if (!hasValidApiKey) {
      log('\n⚠️  API Key Setup Required!', 'yellow');
      displaySetupInstructions();
    }
    
    if (depsValid && configValid && testDataCreated) {
      log('\n✅ Setup validation completed!', 'green');
      
      if (hasValidApiKey) {
        log('\n🎉 Everything is ready for testing!', 'green');
        log('Run: npm start (frontend) and cd backend && npm run dev (backend)', 'blue');
      } else {
        log('\n📝 Next: Get your Google Maps API key and update .env file', 'yellow');
      }
      
      displayQuickStart();
    } else {
      log('\n❌ Setup validation failed. Please check the errors above.', 'red');
    }
    
  } catch (error) {
    log(`\n❌ Setup failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };