/**
 * Product Search Example
 *
 * Demonstrates using FuzzySet for e-commerce product search
 * with typo tolerance and flexible matching.
 */

import FuzzySet from '../dist/fuzzyset.mjs';

// Sample product catalog
const products = [
  'iPhone 15 Pro Max',
  'Samsung Galaxy S23 Ultra',
  'Google Pixel 8 Pro',
  'OnePlus 11',
  'MacBook Pro 16-inch',
  'Dell XPS 15',
  'Sony WH-1000XM5 Headphones',
  'AirPods Pro',
  'Apple Watch Series 9',
  'Samsung Galaxy Watch 6',
  'iPad Air',
  'Microsoft Surface Pro 9',
  'Nintendo Switch OLED',
  'PlayStation 5',
  'Xbox Series X',
  'LG C3 OLED TV',
  'Sony A7 IV Camera',
  'Canon EOS R6',
  'Bose QuietComfort 45',
  'Logitech MX Master 3S Mouse'
];

const productSearch = FuzzySet(products);

console.log('=== Product Search Example ===\n');
console.log(`Catalog contains ${products.length} products\n`);

/**
 * Search for products with detailed results
 */
function searchProducts(query, minScore = 0.3) {
  const matches = productSearch.get(query, null, minScore);

  if (!matches || matches.length === 0) {
    return {
      success: false,
      query,
      results: []
    };
  }

  return {
    success: true,
    query,
    results: matches.map(([score, product]) => ({
      product,
      relevance: (score * 100).toFixed(0) + '%',
      score: score
    }))
  };
}

// Test various search scenarios
const searchQueries = [
  { query: 'iphone 15', description: 'Partial product name' },
  { query: 'samsng galxy', description: 'Multiple typos' },
  { query: 'pixel 8', description: 'Short query' },
  { query: 'macbok', description: 'Single typo' },
  { query: 'airpods', description: 'Missing space' },
  { query: 'playstation', description: 'Partial brand match' },
  { query: 'noise canceling headphones', description: 'Description-based search' },
  { query: 'smart watch', description: 'Generic term' },
  { query: 'camera', description: 'Category search' },
  { query: 'xyz random', description: 'No match' }
];

console.log('=== Search Test Cases ===\n');

searchQueries.forEach(({ query, description }, index) => {
  console.log(`${index + 1}. ${description}`);
  console.log(`   Search: "${query}"`);

  const result = searchProducts(query);

  if (result.success) {
    console.log(`   ✓ Found ${result.results.length} result(s):`);
    result.results.slice(0, 3).forEach((item, i) => {
      console.log(`     ${i + 1}. ${item.product} (${item.relevance} relevant)`);
    });
  } else {
    console.log('   ✗ No results found');
  }
  console.log();
});

// Auto-suggest feature
console.log('=== Auto-Suggest Feature ===\n');

function autoSuggest(partialQuery, maxResults = 5) {
  const matches = productSearch.get(partialQuery, null, 0.2);

  if (!matches) return [];

  return matches
    .slice(0, maxResults)
    .map(([score, product]) => product);
}

const partialQueries = ['iph', 'samsu', 'head', 'watch'];

partialQueries.forEach(query => {
  const suggestions = autoSuggest(query);
  console.log(`User types: "${query}"`);
  console.log('Suggestions:');
  suggestions.forEach((suggestion, i) => {
    console.log(`  ${i + 1}. ${suggestion}`);
  });
  console.log();
});

// Price comparison / product matching scenario
console.log('=== Product Matching Across Sources ===\n');

// Simulating products from different sources with variations
const externalProducts = [
  'iPhone 15 Pro Max 256GB',
  'Samsung Galaxy S23 Ultra 5G',
  'Google Pixel 8 Pro Phone',
  'MacBook Pro 16" M3'
];

console.log('Matching products from external source to catalog:\n');

externalProducts.forEach((extProduct, index) => {
  console.log(`${index + 1}. External: "${extProduct}"`);

  const matches = productSearch.get(extProduct, null, 0.6);

  if (matches && matches.length > 0) {
    const bestMatch = matches[0];
    console.log(`   ✓ Matched to: "${bestMatch[1]}"`);
    console.log(`   Confidence: ${(bestMatch[0] * 100).toFixed(1)}%`);
  } else {
    console.log('   ✗ No match found in catalog');
  }
  console.log();
});

// Search analytics
console.log('=== Search Analytics Demo ===\n');

const userSearches = [
  'iphone',
  'iphone pro',
  'iphone 15',
  'samung phone',
  'headphones',
  'wireless headphones',
  'gaming console',
  'playstation',
  'xyz123'
];

const searchStats = {
  successful: 0,
  failed: 0,
  avgResults: 0,
  totalResults: 0
};

userSearches.forEach(query => {
  const result = searchProducts(query, 0.4);
  if (result.success) {
    searchStats.successful++;
    searchStats.totalResults += result.results.length;
  } else {
    searchStats.failed++;
  }
});

searchStats.avgResults = searchStats.successful > 0
  ? (searchStats.totalResults / searchStats.successful).toFixed(1)
  : 0;

console.log('Search Statistics:');
console.log(`Total searches: ${userSearches.length}`);
console.log(`Successful: ${searchStats.successful} (${((searchStats.successful / userSearches.length) * 100).toFixed(1)}%)`);
console.log(`Failed: ${searchStats.failed} (${((searchStats.failed / userSearches.length) * 100).toFixed(1)}%)`);
console.log(`Avg results per successful search: ${searchStats.avgResults}`);
console.log();

// Dynamic product catalog updates
console.log('=== Dynamic Catalog Updates ===\n');

const dynamicSearch = FuzzySet(['iPhone 15', 'Samsung Galaxy S23']);
console.log('Initial catalog size:', dynamicSearch.length());

console.log('Adding new products...');
dynamicSearch.add('Google Pixel 8');
dynamicSearch.add('OnePlus 11');
dynamicSearch.add('Nothing Phone 2');

console.log('Updated catalog size:', dynamicSearch.length());
console.log('All products:', dynamicSearch.values().join(', '));
