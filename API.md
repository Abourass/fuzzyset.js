# FuzzySet API Documentation

## Table of Contents
- [Overview](#overview)
- [Constructor](#constructor)
- [Methods](#methods)
- [Types](#types)
- [Examples](#examples)

## Overview

FuzzySet is a data structure for fuzzy string matching using n-gram indexing and optional Levenshtein distance calculation. It efficiently finds approximate matches for misspelled or similar strings.

## Constructor

### `FuzzySet(arr, useLevenshtein, gramSizeLower, gramSizeUpper)`

Creates a new FuzzySet instance.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `arr` | `string[]` | `[]` | Initial array of strings to populate the set |
| `useLevenshtein` | `boolean` | `true` | Whether to use Levenshtein distance for scoring |
| `gramSizeLower` | `number` | `2` | Lower bound of n-gram size (inclusive) |
| `gramSizeUpper` | `number` | `3` | Upper bound of n-gram size (inclusive) |

**Returns:** `FuzzySearch` instance

**Example:**
```typescript
import FuzzySet from '@assetval/fuzzyset';

// Create with default settings
const fs = FuzzySet(['apple', 'banana', 'orange']);

// Create with custom settings
const fs2 = FuzzySet(['apple', 'banana'], false, 2, 4);

// Create empty set
const fs3 = FuzzySet([]);
```

---

## Methods

### `get(value, defaultValue, minMatchScore)`

Attempts to find fuzzy matches for a given string.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `string` | *required* | The string to search for |
| `defaultValue` | `any` | `undefined` | Value to return if no matches found |
| `minMatchScore` | `number` | `0.33` | Minimum match score (0-1) for results |

**Returns:** `Array<[number, string]> | null | defaultValue`

Returns an array of `[score, match]` tuples sorted by score (descending), or `null`/`defaultValue` if no matches meet the threshold.

**Score Range:** 0.0 (no match) to 1.0 (perfect match)

**Example:**
```typescript
const fs = FuzzySet(['Michael Axiak', 'John Smith', 'Jane Doe']);

// Basic usage
const result = fs.get('Micael Asiak');
// Returns: [[0.846, 'Michael Axiak']]

// With higher threshold
const result2 = fs.get('Micael Asiak', null, 0.9);
// Returns: null (no matches above 0.9)

// With default value
const result3 = fs.get('xyz', 'No match found');
// Returns: 'No match found'

// Multiple matches
const result4 = fs.get('Jon', null, 0.3);
// Returns: [[0.6, 'John Smith'], [0.4, 'Jane Doe']]
```

**Notes:**
- Matching is case-insensitive
- Non-alphanumeric characters are handled specially
- Results are sorted by score in descending order

---

### `add(value)`

Adds a string to the FuzzySet.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | `string` | The string to add to the set |

**Returns:** `void`

**Behavior:**
- Does nothing if the string already exists (case-insensitive comparison)
- Normalizes the string internally while preserving original case
- Updates internal n-gram indices for all configured gram sizes

**Example:**
```typescript
const fs = FuzzySet([]);

fs.add('apple');
fs.add('banana');
fs.add('Apple'); // No effect - 'apple' already exists

console.log(fs.length()); // 2
console.log(fs.get('aple')); // [[0.8, 'apple']]
```

---

### `length()`

Returns the number of unique strings in the set.

**Parameters:** None

**Returns:** `number` - The count of unique strings

**Example:**
```typescript
const fs = FuzzySet(['apple', 'banana', 'orange']);
console.log(fs.length()); // 3

fs.add('grape');
console.log(fs.length()); // 4

fs.add('apple'); // Duplicate
console.log(fs.length()); // Still 4
```

---

### `isEmpty()`

Checks if the set contains any strings.

**Parameters:** None

**Returns:** `boolean` - `true` if empty, `false` otherwise

**Example:**
```typescript
const fs = FuzzySet([]);
console.log(fs.isEmpty()); // true

fs.add('apple');
console.log(fs.isEmpty()); // false
```

---

### `values()`

Returns all strings in the set with their original casing.

**Parameters:** None

**Returns:** `string[]` - Array of all strings in the set

**Example:**
```typescript
const fs = FuzzySet(['Apple', 'Banana', 'Orange']);
const values = fs.values();
console.log(values); // ['Apple', 'Banana', 'Orange']
```

**Notes:**
- Returns strings in their original case as added
- Order is not guaranteed
- Returns a new array (safe to modify without affecting the set)

---

## Types

### `GramCounterResult`
```typescript
type GramCounterResult = Record<string, number>;
```
Internal type representing n-gram counts.

### `MatchDictEntry`
```typescript
type MatchDictEntry = [number, number];
```
Internal type representing `[index, gramCount]` for matching.

### `ItemsEntry`
```typescript
type ItemsEntry = [number, string];
```
Internal type representing `[vectorNormal, normalizedValue]` for items.

---

## Examples

### Spell Checking
```typescript
const dictionary = FuzzySet([
  'accommodate', 'believe', 'calendar', 'definitely', 'embarrass'
]);

const misspelled = 'definately';
const matches = dictionary.get(misspelled, null, 0.7);

if (matches) {
  console.log(`Did you mean: ${matches[0][1]}?`);
  // Output: "Did you mean: definitely?"
}
```

### Name Matching
```typescript
const users = FuzzySet([
  'John Smith',
  'Jane Doe',
  'Michael Johnson',
  'Sarah Williams'
]);

// Handle typos in user search
const searchTerm = 'Jon Smth';
const results = users.get(searchTerm, null, 0.5);

console.log('Possible matches:');
results.forEach(([score, name]) => {
  console.log(`${name} (${(score * 100).toFixed(0)}% match)`);
});
```

### Product Search
```typescript
const products = FuzzySet([
  'iPhone 15 Pro',
  'Samsung Galaxy S23',
  'Google Pixel 8',
  'OnePlus 11'
]);

// Flexible search with lower threshold
const query = 'galxy s23';
const matches = products.get(query, [], 0.4);

if (matches.length > 0) {
  console.log('Found:', matches[0][1]);
  // Output: "Found: Samsung Galaxy S23"
}
```

### Command Auto-completion
```typescript
const commands = FuzzySet([
  'git commit',
  'git push',
  'git pull',
  'git checkout',
  'git branch'
]);

function autocomplete(input: string): string[] {
  const matches = commands.get(input, null, 0.6);
  return matches ? matches.map(([_, cmd]) => cmd) : [];
}

console.log(autocomplete('git comit'));
// Output: ['git commit']

console.log(autocomplete('git ch'));
// Output: ['git checkout']
```

### Dynamic Set Management
```typescript
const tags = FuzzySet(['javascript', 'typescript', 'python']);

// Add new tags dynamically
tags.add('java');
tags.add('rust');

console.log(`Total tags: ${tags.length()}`);

// Find similar tags
const similar = tags.get('typescrip', null, 0.7);
console.log('Did you mean:', similar?.[0]?.[1]);
```

### Performance Tuning

#### Using Different Gram Sizes
```typescript
// Smaller gram range (faster, less memory, less accurate)
const fast = FuzzySet(['apple', 'banana'], true, 2, 2);

// Larger gram range (slower, more memory, more accurate)
const accurate = FuzzySet(['apple', 'banana'], true, 2, 5);

// Test with heavily misspelled input
const input = 'aple';
console.log('Fast:', fast.get(input));
console.log('Accurate:', accurate.get(input));
```

#### Disabling Levenshtein
```typescript
// Without Levenshtein (faster but less accurate)
const fast = FuzzySet(['apple', 'banana'], false);

// With Levenshtein (slower but more accurate)
const accurate = FuzzySet(['apple', 'banana'], true);

const test = 'aple';
console.log('Without Levenshtein:', fast.get(test));
console.log('With Levenshtein:', accurate.get(test));
```

---

## Algorithm Details

### N-Gram Indexing

FuzzySet uses n-gram (substring) indexing to quickly find potential matches:

1. Each string is broken into overlapping n-grams (default: 2-grams and 3-grams)
2. Example: `"hello"` → 2-grams: `["-h", "he", "el", "ll", "lo", "o-"]`
3. These n-grams are indexed with their frequencies
4. Query strings are similarly broken into n-grams
5. Matches are scored based on n-gram overlap using cosine similarity

### Levenshtein Distance

When enabled (default), the top 50 n-gram matches are re-scored using Levenshtein distance:
- Measures the minimum number of single-character edits needed
- Provides more accurate scoring for similar strings
- More computationally expensive than n-gram matching alone

### Normalization

All strings are normalized for matching:
- Converted to lowercase
- Original case preserved for return values
- Non-word characters handled specially in n-gram generation
