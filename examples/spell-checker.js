/**
 * Spell Checker Example
 *
 * Demonstrates how to use FuzzySet for spell checking functionality.
 * This example shows how to build a simple spell checker with suggestions.
 */

import FuzzySet from '../dist/fuzzyset.mjs';

// Common English words (small sample for demo purposes)
const dictionary = FuzzySet([
  'accommodate', 'acknowledge', 'acquaintance', 'believe', 'calendar',
  'definitely', 'embarrass', 'environment', 'fierce', 'guarantee',
  'harass', 'independent', 'knowledge', 'library', 'maintenance',
  'necessary', 'occasion', 'parallel', 'privilege', 'questionnaire',
  'receive', 'recommend', 'separate', 'tomorrow', 'wednesday'
]);

console.log('=== Spell Checker Example ===\n');

/**
 * Check if a word is spelled correctly and provide suggestions
 */
function checkSpelling(word, minScore = 0.7) {
  const matches = dictionary.get(word, null, minScore);

  if (!matches || matches.length === 0) {
    return {
      correct: false,
      suggestions: [],
      message: `No suggestions found for "${word}"`
    };
  }

  // Check if first match is perfect
  if (matches[0][0] === 1.0) {
    return {
      correct: true,
      suggestions: [],
      message: `"${word}" is spelled correctly`
    };
  }

  return {
    correct: false,
    suggestions: matches.map(([score, word]) => ({
      word,
      confidence: (score * 100).toFixed(1) + '%'
    })),
    message: `Did you mean: ${matches[0][1]}?`
  };
}

// Test cases
const testWords = [
  'definately',    // should suggest "definitely"
  'accommodate',   // correctly spelled
  'occassion',     // should suggest "occasion"
  'recieve',       // should suggest "receive"
  'maintainence',  // should suggest "maintenance"
  'embarass',      // should suggest "embarrass"
  'priviledge',    // should suggest "privilege"
  'seperate',      // should suggest "separate"
  'xyz123',        // no match
  'knowledge'      // correctly spelled
];

testWords.forEach(word => {
  const result = checkSpelling(word);
  console.log(`Word: "${word}"`);
  console.log(`Status: ${result.correct ? '✓ Correct' : '✗ Incorrect'}`);
  console.log(`Message: ${result.message}`);

  if (result.suggestions.length > 0) {
    console.log('Suggestions:');
    result.suggestions.forEach((s, i) => {
      console.log(`  ${i + 1}. ${s.word} (${s.confidence} match)`);
    });
  }
  console.log();
});

// Interactive spell checking function
function spellCheckText(text) {
  const words = text.toLowerCase().split(/\s+/);
  const misspellings = [];

  words.forEach((word, index) => {
    const result = checkSpelling(word, 0.75);
    if (!result.correct && result.suggestions.length > 0) {
      misspellings.push({
        word,
        position: index,
        suggestion: result.suggestions[0].word,
        confidence: result.suggestions[0].confidence
      });
    }
  });

  return misspellings;
}

// Example text checking
console.log('=== Text Spell Checking ===\n');
const sampleText = 'I definately need to recieve that calender for the occassion';
console.log('Original text:');
console.log(`"${sampleText}"\n`);

const errors = spellCheckText(sampleText);
console.log(`Found ${errors.length} potential misspelling(s):\n`);

errors.forEach((error, i) => {
  console.log(`${i + 1}. "${error.word}" → "${error.suggestion}" (${error.confidence} confidence)`);
});
