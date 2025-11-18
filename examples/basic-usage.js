/**
 * Basic Usage Example
 *
 * This example demonstrates the fundamental operations of FuzzySet:
 * - Creating a set
 * - Adding items
 * - Searching for matches
 */

import FuzzySet from '../dist/fuzzyset.mjs';

// Create a FuzzySet with initial values
const fs = FuzzySet(['apple', 'banana', 'orange', 'grape', 'strawberry']);

console.log('=== Basic Usage ===\n');

// 1. Exact match
console.log('1. Exact match:');
const exactMatch = fs.get('apple');
console.log('   Search: "apple"');
console.log('   Result:', exactMatch);
console.log();

// 2. Fuzzy match with typo
console.log('2. Fuzzy match with typo:');
const typoMatch = fs.get('aple');
console.log('   Search: "aple"');
console.log('   Result:', typoMatch);
console.log('   Score:', typoMatch ? (typoMatch[0][0] * 100).toFixed(1) + '%' : 'N/A');
console.log();

// 3. Fuzzy match with multiple typos
console.log('3. Multiple typos:');
const multiTypoMatch = fs.get('straberry');
console.log('   Search: "straberry"');
console.log('   Result:', multiTypoMatch);
console.log('   Score:', multiTypoMatch ? (multiTypoMatch[0][0] * 100).toFixed(1) + '%' : 'N/A');
console.log();

// 4. No match (below threshold)
console.log('4. No match (below threshold):');
const noMatch = fs.get('xyz');
console.log('   Search: "xyz"');
console.log('   Result:', noMatch);
console.log();

// 5. Using default value
console.log('5. Using default value:');
const defaultMatch = fs.get('xyz', 'No match found');
console.log('   Search: "xyz" with default value');
console.log('   Result:', defaultMatch);
console.log();

// 6. Custom threshold
console.log('6. Custom threshold (0.8):');
const highThreshold = fs.get('aple', null, 0.8);
console.log('   Search: "aple" with minScore=0.8');
console.log('   Result:', highThreshold);
console.log();

// 7. Adding new items
console.log('7. Adding items dynamically:');
console.log('   Before:', fs.length(), 'items');
fs.add('mango');
fs.add('pineapple');
console.log('   After adding "mango" and "pineapple":', fs.length(), 'items');
console.log('   All values:', fs.values());
console.log();

// 8. Case insensitivity
console.log('8. Case insensitivity:');
const caseMatch = fs.get('APPLE');
console.log('   Search: "APPLE" (uppercase)');
console.log('   Result:', caseMatch);
console.log();

// 9. Partial matches
console.log('9. Partial matches:');
const partialMatch = fs.get('ban', null, 0.3);
console.log('   Search: "ban" with minScore=0.3');
console.log('   Result:', partialMatch);
console.log();

// 10. Empty check
console.log('10. Checking if empty:');
const emptySet = FuzzySet([]);
console.log('    Empty set:', emptySet.isEmpty());
console.log('    Our set:', fs.isEmpty());
