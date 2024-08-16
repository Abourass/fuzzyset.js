type GramCounterResult = Record<string, number>;
type MatchDictEntry = [number, number];
type ItemsEntry = [number, string];

export class FuzzySearch {
  gramSizeLower: number;
  gramSizeUpper: number;
  useLevenshtein: boolean;
  exactSet: Record<string, string> = {};
  matchDict: Record<string, MatchDictEntry[]> = {};
  items: Record<number, ItemsEntry[]> = {};

  constructor(arr: string[], useLevenshtein?: boolean, gramSizeLower: number = 2, gramSizeUpper: number = 3) {
    this.gramSizeLower = gramSizeLower;
    this.gramSizeUpper = gramSizeUpper;
    this.useLevenshtein = typeof useLevenshtein !== 'boolean' ? true : useLevenshtein;

    for (let i = this.gramSizeLower; i <= this.gramSizeUpper; ++i) {
      this.items[i] = [];
    }

    arr.forEach(item => this.add(item));
  }

  private levenshtein(str1: string, str2: string): number {
    let current: number[] = new Array(str1.length + 1);
    let prev: number, value: number;

    for (let i = 0; i <= str1.length; i++) {
      current[i] = i;
    }

    for (let i = 1; i <= str2.length; i++) {
      prev = current[0];
      current[0] = i;
      for (let j = 1; j <= str1.length; j++) {
        if (str1.charAt(j - 1) === str2.charAt(i - 1)) {
          value = prev;
        } else {
          value = Math.min(current[j], current[j - 1], prev) + 1;
        }
        prev = current[j];
        current[j] = value;
      }
    }

    return current[str1.length];
  }

  public get(value: string, defaultValue?: any, minMatchScore: number = 0.33): any {
    const result = this._get(value, minMatchScore);
    if (!result && typeof defaultValue !== 'undefined') {
      return defaultValue;
    }
    return result;
  }

  private _get(value: string, minMatchScore: number): any {
    let results = [];
    for (let gramSize = this.gramSizeUpper; gramSize >= this.gramSizeLower; --gramSize) {
      results = this.__get(value, gramSize, minMatchScore);
      if (results && results.length > 0) {
        return results;
      }
    }
    return null;
  }

  private __get(value: string, gramSize: number, minMatchScore: number): any {
    const normalizedValue = this._normalizeStr(value);
    const matches: Record<number, number> = {};
    const gramCounts = this._gramCounter(normalizedValue, gramSize);
    const items = this.items[gramSize];
    let sumOfSquareGramCounts = 0;

    for (const gram in gramCounts) {
      const gramCount = gramCounts[gram];
      sumOfSquareGramCounts += Math.pow(gramCount, 2);
      if (gram in this.matchDict) {
        for (let i = 0; i < this.matchDict[gram].length; ++i) {
          const [index, otherGramCount] = this.matchDict[gram][i];
          if (index in matches) {
            matches[index] += gramCount * otherGramCount;
          } else {
            matches[index] = gramCount * otherGramCount;
          }
        }
      }
    }

    if (Object.keys(matches).length === 0) {
      return null;
    }

    const vectorNormal = Math.sqrt(sumOfSquareGramCounts);
    let results: Array<[number, string]> = [];
    for (const matchIndex in matches) {
      const matchScore = matches[matchIndex];
      results.push([matchScore / (vectorNormal * items[matchIndex][0]), items[matchIndex][1]]);
    }

    results.sort((a, b) => b[0] - a[0]);

    if (this.useLevenshtein) {
      const newResults: Array<[number, string]> = [];
      const endIndex = Math.min(50, results.length);
      for (let i = 0; i < endIndex; ++i) {
        newResults.push([this._distance(results[i][1], normalizedValue), results[i][1]]);
      }
      results = newResults;
      results.sort((a, b) => b[0] - a[0]);
    }

    const finalResults: Array<[number, string]> = [];
    results.forEach(([score, word]) => {
      if (score >= minMatchScore) {
        finalResults.push([score, this.exactSet[word]]);
      }
    });

    return finalResults;
  }

  private _distance(str1: string | null, str2: string | null): number {
    if (str1 === null && str2 === null) throw new Error('Trying to compare two null values');
    if (str1 === null || str2 === null) return 0;
    str1 = String(str1); str2 = String(str2);

    const distance = this.levenshtein(str1, str2);
    return str1.length > str2.length ? 1 - distance / str1.length : 1 - distance / str2.length;
  }

  private _nonWordRe = /^[^a-zA-Z0-9\u00C0-\u00FF\u0621-\u064A\u0660-\u0669, ]+$/g;

  private _iterateGrams(value: string, gramSize?: number): string[] {
    gramSize = gramSize || 2;
    let simplified = '-' + value.toLowerCase().replace(this._nonWordRe, '') + '-';
    let lenDiff = gramSize - simplified.length;
    const results: string[] = [];
    if (lenDiff > 0) {
      for (let i = 0; i < lenDiff; ++i) {
        simplified += '-';
      }
    }
    for (let i = 0; i < simplified.length - gramSize + 1; ++i) {
      results.push(simplified.slice(i, i + gramSize));
    }
    return results;
  }

  private _gramCounter(value: string, gramSize?: number): GramCounterResult {
    gramSize = gramSize || 2;
    const result: GramCounterResult = {};
    const grams = this._iterateGrams(value, gramSize);
    let i = 0;
    for (; i < grams.length; ++i) {
      if (grams[i] in result) {
        result[grams[i]] += 1;
      } else {
        result[grams[i]] = 1;
      }
    }
    return result;
  }

  public add(value: string): void {
    const normalizedValue = this._normalizeStr(value);
    if (normalizedValue in this.exactSet) return;

    let i = this.gramSizeLower;
    for (; i <= this.gramSizeUpper; ++i) {
      this._add(value, i);
    }
  }

  private _add(value: string, gramSize: number): void {
    const normalizedValue = this._normalizeStr(value);
    let items = this.items[gramSize] || [];
    const index = items.length;

    items.push([0, normalizedValue]);
    const gramCounts = this._gramCounter(normalizedValue, gramSize);
    let sumOfSquareGramCounts = 0;
    for (let gram in gramCounts) {
      const gramCount = gramCounts[gram];
      sumOfSquareGramCounts += Math.pow(gramCount, 2);
      if (gram in this.matchDict) {
        this.matchDict[gram].push([index, gramCount]);
      } else {
        this.matchDict[gram] = [[index, gramCount]];
      }
    }
    const vectorNormal = Math.sqrt(sumOfSquareGramCounts);
    items[index] = [vectorNormal, normalizedValue];
    this.items[gramSize] = items;
    this.exactSet[normalizedValue] = value;
  }

  private _normalizeStr(str: string): string {
    return str.toLowerCase();
  }

  public length(): number {
    let count = 0;
    for (const prop in this.exactSet) {
      if (this.exactSet.hasOwnProperty(prop)) {
        count += 1;
      }
    }
    return count;
  }

  public isEmpty(): boolean {
    for (const prop in this.exactSet) {
      if (this.exactSet.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }

  public values(): string[] {
    const values: string[] = [];
    for (const prop in this.exactSet) {
      if (this.exactSet.hasOwnProperty(prop)) {
        values.push(this.exactSet[prop]);
      }
    }
    return values;
  }
}

export const FuzzySet = (arr: string[], useLevenshtein?: boolean, gramSizeLower?: number, gramSizeUpper?: number): FuzzySearch => {
  return new FuzzySearch(arr, useLevenshtein, gramSizeLower, gramSizeUpper);
};
