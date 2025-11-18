# FuzzySet.js

[![npm version](https://img.shields.io/npm/v/@assetval/fuzzyset.svg)](https://www.npmjs.com/package/@assetval/fuzzyset)
[![License](https://img.shields.io/badge/license-Prosperity%203.0-blue.svg)](LICENSE.md)

> A fast, lightweight fuzzy string matching library for JavaScript and TypeScript

FuzzySet is a data structure that performs fuzzy string matching using n-gram indexing and Levenshtein distance. It's perfect for handling typos, misspellings, and approximate string matching in search, autocomplete, spell checking, and more.

## ✨ Features

- 🚀 **Fast**: Uses n-gram indexing for efficient fuzzy matching
- 🎯 **Accurate**: Optional Levenshtein distance for precise scoring
- 📦 **Lightweight**: Zero dependencies, small bundle size
- 🔧 **Flexible**: Configurable matching thresholds and gram sizes
- 🌐 **Universal**: Works in Node.js and browsers
- 📘 **TypeScript**: Full TypeScript support with type definitions
- ⚡ **Modern**: ES Module and CommonJS builds

## 📚 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Use Cases](#use-cases)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Examples](#examples)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Installation

```bash
npm install @assetval/fuzzyset
```

For the original package name:
```bash
npm install fuzzyset
```

## ⚡ Quick Start

### Basic Usage

The usage is simple. Just add strings to the set, and search for them later:

```javascript
import FuzzySet from '@assetval/fuzzyset';

// Create a FuzzySet with initial data
const fs = FuzzySet(['Michael Axiak', 'John Smith', 'Sarah Johnson']);

// Fuzzy search with typos
const result = fs.get('Micael Asiak');
console.log(result);
// [[0.846, 'Michael Axiak']]
```

The result is an array of `[score, matched_value]` tuples, where:
- **Score**: 0.0 (no match) to 1.0 (perfect match)
- **Matched value**: The original string from the set

### TypeScript

```typescript
import FuzzySet, { FuzzySearch } from '@assetval/fuzzyset';

const fs: FuzzySearch = FuzzySet(['apple', 'banana', 'orange']);
const result = fs.get('aple');
```

### CommonJS

```javascript
const FuzzySet = require('@assetval/fuzzyset');

const fs = FuzzySet(['apple', 'banana']);
```

### Browser (ES Module)

```html
<script type="module">
  import FuzzySet from './node_modules/@assetval/fuzzyset/dist/fuzzyset.mjs';
  const fs = FuzzySet(['apple', 'banana']);
</script>
```

## 💡 Use Cases

FuzzySet is perfect for:

- **🔍 Search**: Typo-tolerant product/content search
- **✍️ Spell Checking**: Suggest corrections for misspelled words
- **👤 Name Matching**: Find users despite typos or variations
- **🔗 Data Deduplication**: Detect near-duplicate records
- **⌨️ Autocomplete**: Build flexible autocomplete systems
- **🔀 Record Linkage**: Match records across different databases
- **🤖 Command Recognition**: Parse commands with typo tolerance

See [examples/](examples/) for detailed implementations of each use case.

## 📖 API Reference

### Constructor

```typescript
FuzzySet(arr, useLevenshtein?, gramSizeLower?, gramSizeUpper?)
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `arr` | `string[]` | `[]` | Initial array of strings |
| `useLevenshtein` | `boolean` | `true` | Use Levenshtein distance for scoring |
| `gramSizeLower` | `number` | `2` | Lower bound of n-gram size |
| `gramSizeUpper` | `number` | `3` | Upper bound of n-gram size |

**Examples:**

```javascript
// Default configuration (recommended for most use cases)
const fs1 = FuzzySet(['apple', 'banana']);

// Without Levenshtein distance (faster, less accurate)
const fs2 = FuzzySet(['apple', 'banana'], false);

// Custom gram sizes (more accurate for longer strings)
const fs3 = FuzzySet(['apple', 'banana'], true, 2, 4);

// Start with empty set
const fs4 = FuzzySet([]);
fs4.add('apple');
```

### Methods

#### `get(value, defaultValue?, minScore?)`

Search for fuzzy matches.

```typescript
get(value: string, defaultValue?: any, minScore?: number): Array<[number, string]> | null | defaultValue
```

- **value**: String to search for
- **defaultValue**: Returned if no matches found (default: `undefined`)
- **minScore**: Minimum match score 0-1 (default: `0.33`)

**Returns:** Array of `[score, match]` tuples, or `null`/`defaultValue`

```javascript
const fs = FuzzySet(['apple', 'banana', 'orange']);

fs.get('aple');              // [[0.8, 'apple']]
fs.get('xyz');               // null
fs.get('xyz', 'Not found');  // 'Not found'
fs.get('banan', null, 0.9);  // [[0.96, 'banana']]
```

#### `add(value)`

Add a string to the set.

```typescript
add(value: string): void
```

```javascript
const fs = FuzzySet([]);
fs.add('apple');
fs.add('banana');
fs.add('apple');  // No effect (duplicate)
```

#### `length()`

Get the number of unique strings in the set.

```typescript
length(): number
```

```javascript
const fs = FuzzySet(['apple', 'banana']);
console.log(fs.length());  // 2
```

#### `isEmpty()`

Check if the set is empty.

```typescript
isEmpty(): boolean
```

```javascript
const fs = FuzzySet([]);
console.log(fs.isEmpty());  // true
```

#### `values()`

Get all strings in the set.

```typescript
values(): string[]
```

```javascript
const fs = FuzzySet(['apple', 'banana']);
console.log(fs.values());  // ['apple', 'banana']
```

## ⚙️ Configuration

### Match Score Thresholds

Choose your threshold based on the use case:

| Threshold | Use Case |
|-----------|----------|
| `0.9 - 1.0` | Duplicate detection (strict) |
| `0.7 - 0.9` | Spell checking (recommended) |
| `0.5 - 0.7` | Name/user search |
| `0.3 - 0.5` | Product search (flexible) |
| `0.1 - 0.3` | Autocomplete (very loose) |

### Gram Sizes

| Config | Speed | Accuracy | Memory | Best For |
|--------|-------|----------|--------|----------|
| `[2,2]` | Fast | Lower | Low | Real-time autocomplete |
| `[2,3]` | Medium | Good | Medium | **General purpose (default)** |
| `[2,4]` | Slower | Higher | High | Spell checking, long strings |

### Levenshtein Distance

| Setting | Speed | Accuracy | Use When |
|---------|-------|----------|----------|
| `true` (default) | Slower | Higher | Accuracy matters |
| `false` | Faster | Lower | Performance critical |

## 📘 Examples

### Spell Checker

```javascript
const dictionary = FuzzySet(['accommodate', 'definitely', 'receive']);

function checkSpelling(word) {
  const matches = dictionary.get(word, null, 0.7);
  return matches ? `Did you mean: ${matches[0][1]}?` : 'No suggestions';
}

checkSpelling('definately');  // "Did you mean: definitely?"
```

### Product Search

```javascript
const products = FuzzySet(['iPhone 15 Pro', 'Samsung Galaxy S23', 'Google Pixel 8']);

function searchProducts(query) {
  return products.get(query, null, 0.4)
    ?.map(([score, name]) => ({ name, relevance: (score * 100).toFixed(0) + '%' }));
}

searchProducts('iphone');     // [{ name: 'iPhone 15 Pro', relevance: '65%' }]
searchProducts('galxy s23');  // [{ name: 'Samsung Galaxy S23', relevance: '78%' }]
```

### Name Matching

```javascript
const users = FuzzySet(['Michael Johnson', 'Sarah Williams', 'John Smith']);

function findUser(name) {
  const matches = users.get(name, null, 0.5);
  return matches ? matches[0][1] : 'User not found';
}

findUser('Michal Jonson');  // "Michael Johnson"
findUser('Sara Williams');  // "Sarah Williams"
```

### Duplicate Detection

```javascript
const existing = FuzzySet(['John Smith', 'Jane Doe']);

function isDuplicate(name, threshold = 0.85) {
  const matches = existing.get(name, null, threshold);
  return matches !== null;
}

isDuplicate('John Smith');   // true (exact)
isDuplicate('Jon Smth');     // true (similar)
isDuplicate('Bob Wilson');   // false (different)
```

**📁 More Examples:**
- [Spell Checker](examples/spell-checker.js)
- [Name Matching](examples/name-matching.js)
- [Product Search](examples/product-search.js)
- [Performance Comparison](examples/performance-comparison.js)

See the [examples/](examples/) directory for complete, runnable examples.

## 📚 Documentation

- **[API.md](API.md)** - Complete API documentation with detailed examples
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guidelines for contributing
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and changes
- **[examples/](examples/)** - Practical examples and use cases
- **[Interactive Demo](http://glench.github.io/fuzzyset.js/ui/)** - Visual exploration tool

[![Interactive documentation screenshot](https://gallery.tinyletterapp.com/99afc5bd8aa788ae26037984e2d46fa0400db41f/images/5282d548-76ff-42dc-861e-e3a4337b5e8b.png)](http://glench.github.io/fuzzyset.js/ui/)

## 🔧 Development

### Building

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Output: dist/fuzzyset.{mjs,cjs,d.ts}
```

### Project Structure

```
fuzzyset.js/
├── src/
│   └── fuzzyset.ts      # Main source code
├── dist/                 # Build output
│   ├── fuzzyset.mjs     # ES Module
│   ├── fuzzyset.cjs     # CommonJS
│   └── fuzzyset.d.ts    # TypeScript definitions
├── examples/             # Usage examples
├── API.md               # API documentation
└── CONTRIBUTING.md      # Contribution guide
```

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Development setup
- Coding standards
- Testing guidelines
- Pull request process

**Areas where we'd love help:**
- Adding comprehensive tests (high priority!)
- Performance optimizations
- Additional examples
- Documentation improvements

## 🧪 Testing

Currently, the project lacks comprehensive tests. **Adding tests is a high-priority contribution opportunity!**

Recommended testing framework: Jest or Vitest

## 🐛 Issues & Questions

- **Bug reports**: [Open an issue](https://github.com/Glench/fuzzyset.js/issues)
- **Feature requests**: [Open an issue](https://github.com/Glench/fuzzyset.js/issues)
- **Questions**: [Open a discussion](https://github.com/Glench/fuzzyset.js/discussions)

## ⚡ Performance

FuzzySet is designed for speed:
- ✅ Efficient n-gram indexing
- ✅ Lazy Levenshtein computation (top 50 results only)
- ✅ Suitable for datasets up to 10,000+ items
- ✅ ~0.5ms average search time (1000 items, default config)

See [examples/performance-comparison.js](examples/performance-comparison.js) for benchmarks.

## 📝 License

This package is licensed under the [Prosperity Public License 3.0](LICENSE.md).

### What This Means

✅ **Free for non-commercial use:**
- Personal projects
- Open source projects
- Educational purposes
- Research
- Public benefit organizations
- Government institutions

💼 **Commercial use:**
- 30-day free trial period
- One-time license fee: $42
- **[Purchase commercial license](https://buy.stripe.com/4gw6rm6jw9xy05G144)**

### Why This License?

Since the original author [quit tech to become a therapist](http://glench.com/WhyIQuitTechAndBecameATherapist/), this licensing helps support the free work done on this project over 10+ years while enabling a sustainable practice helping therapy clients.

For small operations unable to afford the license, please reach out - accommodations can be made.

## 👨‍💻 Author & Credits

**Original Author**: Glen Chiacchieri ([glench.com](http://glench.com/))
**Repository**: [github.com/Glench/fuzzyset.js](https://github.com/Glench/fuzzyset.js)

## 🌟 Show Your Support

If you find this library useful:
- ⭐ Star the project on GitHub
- 💼 [Purchase a license](https://buy.stripe.com/4gw6rm6jw9xy05G144) if using commercially
- 🐛 Report bugs and suggest features
- 📝 Contribute documentation or code
- 📢 Share with others who might benefit

---

<div align="center">

**[Homepage](http://Glench.github.com/fuzzyset.js)** •
**[Documentation](API.md)** •
**[Examples](examples/)** •
**[Issues](https://github.com/Glench/fuzzyset.js/issues)** •
**[License](LICENSE.md)**

Made with ❤️ by [Glen Chiacchieri](http://glench.com/)

</div>
