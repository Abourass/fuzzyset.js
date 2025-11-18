# FuzzySet Examples

This directory contains practical examples demonstrating various use cases for the FuzzySet library.

## Running the Examples

All examples are written as ES modules and can be run with Node.js (version 14+):

```bash
# First, build the project
npm run build

# Then run any example
node examples/basic-usage.js
node examples/spell-checker.js
node examples/name-matching.js
node examples/product-search.js
node examples/performance-comparison.js
```

## Available Examples

### 1. basic-usage.js
**What it demonstrates:**
- Creating FuzzySet instances
- Adding and searching for items
- Using different match thresholds
- Case insensitivity
- Default values
- Checking set properties (length, isEmpty, values)

**Best for:** Getting started with FuzzySet basics

---

### 2. spell-checker.js
**What it demonstrates:**
- Building a spell checker
- Providing spelling suggestions
- Checking entire text blocks
- Confidence scoring for suggestions
- Handling correctly spelled words

**Best for:** Text processing and spell checking applications

**Key techniques:**
- Using high match threshold (0.7+) for accurate suggestions
- Differentiating between correct and incorrect spellings
- Ranking suggestions by confidence

---

### 3. name-matching.js
**What it demonstrates:**
- Fuzzy name search with typos
- User search functionality
- Duplicate detection
- Contact deduplication
- Handling name variations (nicknames, initials)

**Best for:** User management systems, CRM applications, contact databases

**Key techniques:**
- Lower match threshold (0.4-0.5) for flexible name matching
- Confidence levels (High/Medium/Low) for better UX
- Automated duplicate detection workflows

---

### 4. product-search.js
**What it demonstrates:**
- E-commerce product search
- Auto-suggest functionality
- Product matching across different sources
- Search analytics
- Dynamic catalog updates

**Best for:** E-commerce platforms, inventory systems, product catalogs

**Key techniques:**
- Adjustable thresholds for different search types
- Auto-complete implementation
- Matching products from external data sources
- Real-time catalog management

---

### 5. performance-comparison.js
**What it demonstrates:**
- Performance benchmarking
- Configuration impact on speed
- Memory usage estimation
- Levenshtein vs. no-Levenshtein comparison
- Gram size optimization
- Scalability testing

**Best for:** Performance tuning, large-scale deployments, optimization

**Key techniques:**
- Benchmarking methodology
- Configuration trade-offs
- Memory profiling
- Performance recommendations

---

## Quick Reference

### Common Patterns

#### Pattern 1: Simple Lookup
```javascript
const fs = FuzzySet(['apple', 'banana', 'orange']);
const result = fs.get('aple');
// [[0.8, 'apple']]
```

#### Pattern 2: With Threshold
```javascript
const fs = FuzzySet(['apple', 'banana']);
const result = fs.get('xyz', null, 0.5);
// null (no matches above 0.5)
```

#### Pattern 3: With Default Value
```javascript
const fs = FuzzySet(['apple', 'banana']);
const result = fs.get('xyz', 'Not found');
// 'Not found'
```

#### Pattern 4: Dynamic Updates
```javascript
const fs = FuzzySet(['apple']);
fs.add('banana');
fs.add('orange');
console.log(fs.values());
// ['apple', 'banana', 'orange']
```

#### Pattern 5: Performance Optimized
```javascript
// Fast but less accurate
const fast = FuzzySet(items, false, 2, 2);

// Accurate but slower
const accurate = FuzzySet(items, true, 2, 4);
```

---

## Configuration Guidelines

### Match Score Thresholds

| Threshold | Use Case | Example |
|-----------|----------|---------|
| 0.9 - 1.0 | Exact or near-exact matches | Duplicate detection |
| 0.7 - 0.9 | High-quality matches | Spell checking |
| 0.5 - 0.7 | Flexible matching | Name search |
| 0.3 - 0.5 | Broad matching | Product search |
| 0.0 - 0.3 | Very loose matching | Autocomplete |

### Gram Size Selection

| Configuration | Speed | Accuracy | Memory | Use Case |
|--------------|-------|----------|--------|----------|
| [2, 2] | Fast | Lower | Low | Real-time autocomplete |
| [2, 3] | Medium | Good | Medium | General purpose (default) |
| [2, 4] | Slower | Higher | High | Spell checking |
| [3, 3] | Fast | Medium | Low | Short strings only |

### Levenshtein Distance

| Setting | Speed | Accuracy | Use Case |
|---------|-------|----------|----------|
| true (default) | Slower | Higher | Most applications |
| false | Faster | Lower | Real-time, large datasets |

---

## Performance Tips

1. **Reuse FuzzySet instances** - Create once, query many times
2. **Tune thresholds** - Higher thresholds = faster (fewer results)
3. **Start with defaults** - Only optimize if you have performance issues
4. **Profile your use case** - Use performance-comparison.js as a template
5. **Consider caching** - Cache frequent queries for better performance

---

## Common Use Cases

### Autocomplete
```javascript
const products = FuzzySet(['iPhone 15', 'iPad Air', 'MacBook Pro']);

function autocomplete(input) {
  return products.get(input, null, 0.2)?.map(([_, name]) => name) || [];
}
```

### Data Deduplication
```javascript
const existing = FuzzySet(existingRecords);

function isDuplicate(newRecord, threshold = 0.85) {
  const matches = existing.get(newRecord, null, threshold);
  return matches && matches.length > 0;
}
```

### Fuzzy Search API
```javascript
function searchAPI(query, minScore = 0.5) {
  const results = fuzzySet.get(query, null, minScore);
  return {
    success: results !== null,
    query,
    results: results?.map(([score, item]) => ({
      item,
      score: (score * 100).toFixed(1) + '%'
    })) || []
  };
}
```

---

## Need Help?

- Check the [main README](../README.MD) for basic usage
- See [API.md](../API.md) for detailed API documentation
- Review the examples above for practical patterns
- Open an issue on GitHub for questions

---

## Contributing Examples

Have a great use case? We'd love to see it! Please:
1. Create a new example file following the existing pattern
2. Add documentation in this README
3. Include clear comments in your code
4. Submit a pull request

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.
