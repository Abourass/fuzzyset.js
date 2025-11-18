/**
 * Name Matching Example
 *
 * Demonstrates using FuzzySet for matching names with typos,
 * variations, and partial matches. Useful for user search,
 * contact matching, and data deduplication.
 */

import FuzzySet from '../dist/fuzzyset.mjs';

// Sample user database
const users = [
  'Michael Johnson',
  'Sarah Williams',
  'James Rodriguez',
  'Emily Chen',
  'Christopher Martinez',
  'Jessica Thompson',
  'Matthew Anderson',
  'Ashley Garcia',
  'Daniel Brown',
  'Jennifer Davis'
];

const userSet = FuzzySet(users);

console.log('=== Name Matching Example ===\n');
console.log(`Database contains ${users.length} users\n`);

/**
 * Search for users by name with fuzzy matching
 */
function searchUsers(query, minScore = 0.5) {
  const matches = userSet.get(query, null, minScore);

  if (!matches || matches.length === 0) {
    return {
      found: false,
      query,
      matches: []
    };
  }

  return {
    found: true,
    query,
    matches: matches.map(([score, name]) => ({
      name,
      score: (score * 100).toFixed(1) + '%',
      confidence: score > 0.8 ? 'High' : score > 0.6 ? 'Medium' : 'Low'
    }))
  };
}

// Test various search scenarios
const searchQueries = [
  { query: 'Michael Johnson', description: 'Exact match' },
  { query: 'Michal Jonson', description: 'Multiple typos' },
  { query: 'Sara Williams', description: 'Missing letter' },
  { query: 'Chris Martinez', description: 'Partial first name' },
  { query: 'J Rodriguez', description: 'First initial only' },
  { query: 'Emily Chin', description: 'Similar last name' },
  { query: 'Matt Anderson', description: 'Nickname variation' },
  { query: 'jenifer davis', description: 'Common misspelling + lowercase' },
  { query: 'Brown', description: 'Last name only' },
  { query: 'xyz abc', description: 'No match' }
];

searchQueries.forEach(({ query, description }, index) => {
  console.log(`${index + 1}. ${description}`);
  console.log(`   Query: "${query}"`);

  const result = searchUsers(query, 0.4);

  if (result.found) {
    console.log(`   ✓ Found ${result.matches.length} match(es):`);
    result.matches.slice(0, 3).forEach((match, i) => {
      console.log(`     ${i + 1}. ${match.name} (${match.score} - ${match.confidence} confidence)`);
    });
  } else {
    console.log('   ✗ No matches found');
  }
  console.log();
});

// Demonstrate user deduplication
console.log('=== Duplicate Detection Example ===\n');

const newUsers = [
  'Michael Jonson',      // Possible duplicate
  'Robert Smith',        // New user
  'Sarah Willams',       // Possible duplicate
  'Daniel Brown'         // Exact duplicate
];

console.log('Checking for potential duplicates in new user list:\n');

newUsers.forEach((name, index) => {
  console.log(`${index + 1}. Checking: "${name}"`);

  const matches = userSet.get(name, null, 0.7);

  if (matches && matches.length > 0) {
    const topMatch = matches[0];
    const score = (topMatch[0] * 100).toFixed(1);

    if (topMatch[0] === 1.0) {
      console.log(`   ⚠️  Exact duplicate found: "${topMatch[1]}"`);
    } else {
      console.log(`   ⚠️  Similar user exists: "${topMatch[1]}" (${score}% match)`);
      console.log(`   💡 Possible duplicate - manual review recommended`);
    }
  } else {
    console.log('   ✓ No duplicates found - safe to add');
  }
  console.log();
});

// Contact merging example
console.log('=== Contact Merging Assistance ===\n');

function suggestContactMerges(contacts, threshold = 0.85) {
  const contactSet = FuzzySet([]);
  const suggestions = [];

  contacts.forEach((contact, index) => {
    const matches = contactSet.get(contact, null, threshold);

    if (matches && matches.length > 0) {
      suggestions.push({
        contact,
        possibleDuplicate: matches[0][1],
        confidence: (matches[0][0] * 100).toFixed(1) + '%'
      });
    }

    contactSet.add(contact);
  });

  return suggestions;
}

const contactList = [
  'John Smith',
  'Jane Doe',
  'John Smith',        // Exact duplicate
  'Jon Smth',          // Typo duplicate
  'Jane Doe-Johnson',  // Possible variation
  'Robert Jones'
];

console.log('Analyzing contact list for potential duplicates:\n');
const merges = suggestContactMerges(contactList, 0.75);

if (merges.length > 0) {
  console.log(`Found ${merges.length} potential duplicate(s):\n`);
  merges.forEach((merge, i) => {
    console.log(`${i + 1}. "${merge.contact}" may be duplicate of "${merge.possibleDuplicate}"`);
    console.log(`   Confidence: ${merge.confidence}`);
    console.log();
  });
} else {
  console.log('No potential duplicates found.');
}
