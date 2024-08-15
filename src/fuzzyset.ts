interface FuzzySetInterface {
    gramSizeLower: number;
    gramSizeUpper: number;
    useLevenshtein: boolean;
    exactSet: Record<string, string>;
    matchDict: Record<string, Array<[number, number]>>;
    items: Record<number, Array<[number, string]>>;
    add(value: string): void;
    length(): number;
    isEmpty(): boolean;
    values(): string[];
}

type GramCounterResult = Record<string, number>;

export class FuzzySearch implements FuzzySetInterface {
    gramSizeLower: number;
    gramSizeUpper: number;
    useLevenshtein: boolean;
    exactSet: Record<string, string>;
    matchDict: Record<string, Array<[number, number]>>;
    items: Record<number, Array<[number, string]>>;

    constructor(arr: string[], useLevenshtein?: boolean, gramSizeLower?: number, gramSizeUpper?: number) {
        this.gramSizeLower = gramSizeLower || 2;
        this.gramSizeUpper = gramSizeUpper || 3;
        this.useLevenshtein = typeof useLevenshtein !== 'boolean' ? true : useLevenshtein;
        this.exactSet = {};
        this.matchDict = {};
        this.items = {};

        for (let i = this.gramSizeLower; i <= this.gramSizeUpper; ++i) {
            this.items[i] = [];
        }

        arr.forEach(item => this.add(item));
    }

    private levenshtein(str1: string, str2: string): number {
        let current: number[], prev, value;

        for (let i = 0; i <= str2.length; i++) {
            for (let j = 0; j <= str1.length; j++) {
                if (i && j) {
                    if (str1.charAt(j - 1) === str2.charAt(i - 1)) {
                        value = prev;
                    } else {
                        value = Math.min(current[j], current[j - 1], prev) + 1;
                    }
                } else {
                    value = i + j;
                }

                prev = current[j];
                current[j] = value;
            }
        }

        return current.pop()!;
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

    add(value: string): void {
        const normalizedValue = this._normalizeStr(value);
        if (normalizedValue in this.exactSet) {
            return;
        }

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

    length(): number {
        let count = 0;
        for (const prop in this.exactSet) {
            if (this.exactSet.hasOwnProperty(prop)) {
                count += 1;
            }
        }
        return count;
    }

    isEmpty(): boolean {
        for (const prop in this.exactSet) {
            if (this.exactSet.hasOwnProperty(prop)) {
                return false;
            }
        }
        return true;
    }

    values(): string[] {
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
