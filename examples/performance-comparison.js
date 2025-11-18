/**
 * Performance Comparison Example
 *
 * Demonstrates the performance characteristics of different
 * FuzzySet configurations and provides benchmarking utilities.
 */

import FuzzySet from '../dist/fuzzyset.mjs';

console.log('=== FuzzySet Performance Comparison ===\n');

// Generate test data
function generateWords(count) {
  const words = [];
  const prefixes = ['super', 'ultra', 'mega', 'hyper', 'meta'];
  const middles = ['awesome', 'fantastic', 'incredible', 'amazing', 'wonderful'];
  const suffixes = ['product', 'service', 'solution', 'platform', 'system'];

  for (let i = 0; i < count; i++) {
    const word = [
      prefixes[i % prefixes.length],
      middles[Math.floor(i / prefixes.length) % middles.length],
      suffixes[Math.floor(i / (prefixes.length * middles.length)) % suffixes.length],
      i
    ].join(' ');
    words.push(word);
  }

  return words;
}

// Benchmark function
function benchmark(name, fn, iterations = 1000) {
  const start = process.hrtime.bigint();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const end = process.hrtime.bigint();
  const durationMs = Number(end - start) / 1_000_000;
  const avgMs = durationMs / iterations;

  return {
    name,
    totalMs: durationMs.toFixed(2),
    avgMs: avgMs.toFixed(4),
    iterations
  };
}

// Test 1: Creation performance
console.log('1. CREATION PERFORMANCE\n');

const smallDataset = generateWords(100);
const mediumDataset = generateWords(1000);
const largeDataset = generateWords(5000);

console.log('Small dataset (100 items):');
let result = benchmark('Create FuzzySet', () => {
  FuzzySet(smallDataset);
}, 100);
console.log(`  Total: ${result.totalMs}ms | Avg: ${result.avgMs}ms per creation\n`);

console.log('Medium dataset (1,000 items):');
result = benchmark('Create FuzzySet', () => {
  FuzzySet(mediumDataset);
}, 10);
console.log(`  Total: ${result.totalMs}ms | Avg: ${result.avgMs}ms per creation\n`);

console.log('Large dataset (5,000 items):');
result = benchmark('Create FuzzySet', () => {
  FuzzySet(largeDataset);
}, 5);
console.log(`  Total: ${result.totalMs}ms | Avg: ${result.avgMs}ms per creation\n`);

// Test 2: Search performance
console.log('2. SEARCH PERFORMANCE\n');

const testSet = FuzzySet(mediumDataset);
const testQuery = 'super awsome product 42'; // Intentional typo

console.log(`Searching for: "${testQuery}" in 1,000 items\n`);

result = benchmark('Search (default settings)', () => {
  testSet.get(testQuery);
}, 1000);
console.log(`Default: ${result.totalMs}ms total | ${result.avgMs}ms per search\n`);

// Test 3: Levenshtein vs No Levenshtein
console.log('3. LEVENSHTEIN IMPACT\n');

const withLevenshtein = FuzzySet(mediumDataset, true);
const withoutLevenshtein = FuzzySet(mediumDataset, false);

console.log('With Levenshtein distance:');
result = benchmark('Search', () => {
  withLevenshtein.get(testQuery);
}, 1000);
console.log(`  ${result.avgMs}ms per search\n`);

console.log('Without Levenshtein distance:');
result = benchmark('Search', () => {
  withoutLevenshtein.get(testQuery);
}, 1000);
console.log(`  ${result.avgMs}ms per search\n`);

const speedup = (
  (parseFloat(result.avgMs) / parseFloat(result.avgMs)) * 100
).toFixed(1);
console.log(`Speedup: Without Levenshtein is ~${speedup}% faster\n`);

// Test 4: Gram size impact
console.log('4. GRAM SIZE IMPACT\n');

const gram2_2 = FuzzySet(mediumDataset, true, 2, 2);  // Only 2-grams
const gram2_3 = FuzzySet(mediumDataset, true, 2, 3);  // 2 and 3-grams (default)
const gram2_4 = FuzzySet(mediumDataset, true, 2, 4);  // 2, 3, and 4-grams

console.log('Gram size [2,2] (only 2-grams):');
result = benchmark('Search', () => {
  gram2_2.get(testQuery);
}, 1000);
console.log(`  ${result.avgMs}ms per search\n`);

console.log('Gram size [2,3] (default):');
result = benchmark('Search', () => {
  gram2_3.get(testQuery);
}, 1000);
console.log(`  ${result.avgMs}ms per search\n`);

console.log('Gram size [2,4]:');
result = benchmark('Search', () => {
  gram2_4.get(testQuery);
}, 1000);
console.log(`  ${result.avgMs}ms per search\n`);

// Test 5: Memory usage (approximate)
console.log('5. MEMORY USAGE (APPROXIMATE)\n');

function estimateMemoryUsage(fuzzySet) {
  const values = fuzzySet.values();
  let estimatedBytes = 0;

  // Estimate for exactSet
  values.forEach(v => {
    estimatedBytes += v.length * 2; // Approximate Unicode size
  });

  // Rough estimation for internal structures
  // This is a very rough approximation
  estimatedBytes *= 5; // Multiply for matchDict and items overhead

  return estimatedBytes;
}

const sets = [
  { name: 'Small (100 items)', set: FuzzySet(smallDataset) },
  { name: 'Medium (1,000 items)', set: FuzzySet(mediumDataset) },
  { name: 'Large (5,000 items)', set: FuzzySet(largeDataset) }
];

sets.forEach(({ name, set }) => {
  const bytes = estimateMemoryUsage(set);
  const kb = (bytes / 1024).toFixed(2);
  const mb = (bytes / (1024 * 1024)).toFixed(2);
  console.log(`${name}:`);
  console.log(`  ~${kb} KB (~${mb} MB)\n`);
});

// Test 6: Add operation performance
console.log('6. ADD OPERATION PERFORMANCE\n');

const addSet = FuzzySet([]);

console.log('Adding 1,000 items one by one:');
const addStart = process.hrtime.bigint();
mediumDataset.forEach(item => addSet.add(item));
const addEnd = process.hrtime.bigint();
const addDuration = Number(addEnd - addStart) / 1_000_000;
console.log(`  Total: ${addDuration.toFixed(2)}ms`);
console.log(`  Avg: ${(addDuration / mediumDataset.length).toFixed(4)}ms per add\n`);

// Test 7: Different query lengths
console.log('7. QUERY LENGTH IMPACT\n');

const queries = [
  { name: 'Short (3 chars)', query: 'sup' },
  { name: 'Medium (15 chars)', query: 'super awesome' },
  { name: 'Long (40 chars)', query: 'super awesome fantastic incredible product' }
];

queries.forEach(({ name, query }) => {
  result = benchmark(`Search - ${name}`, () => {
    testSet.get(query);
  }, 1000);
  console.log(`${name}: ${result.avgMs}ms per search`);
});
console.log();

// Test 8: Configuration recommendations
console.log('8. CONFIGURATION RECOMMENDATIONS\n');

console.log('For SPEED (lower accuracy):');
console.log('  - useLevenshtein: false');
console.log('  - gramSizeLower: 2');
console.log('  - gramSizeUpper: 2');
console.log('  - Good for: Real-time autocomplete, large datasets\n');

console.log('For ACCURACY (slower):');
console.log('  - useLevenshtein: true');
console.log('  - gramSizeLower: 2');
console.log('  - gramSizeUpper: 4');
console.log('  - Good for: Spell checking, critical matches\n');

console.log('For BALANCED (default):');
console.log('  - useLevenshtein: true');
console.log('  - gramSizeLower: 2');
console.log('  - gramSizeUpper: 3');
console.log('  - Good for: Most use cases\n');

// Practical performance tips
console.log('9. PERFORMANCE TIPS\n');
console.log('• Create FuzzySet once and reuse it');
console.log('• For dynamic data, add items individually rather than recreating');
console.log('• Adjust minMatchScore to filter results early');
console.log('• Use smaller gram ranges for larger datasets');
console.log('• Disable Levenshtein for real-time applications');
console.log('• Consider caching frequent queries');
console.log('• Monitor memory usage with very large datasets (>10,000 items)');
