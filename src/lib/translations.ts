import { writeFile, readFile } from "fs";
import { dump, load } from "js-yaml";
import { promisify } from "util";
declare global {
    interface Array<T> {
        get(i: number): T;
        set(i: number, value: T): void;
    }
}
Array.prototype.get = function <T>(i: number): T {
    const a: T[] = this as T[];
    return a[(i + a.length) % a.length];
}
Array.prototype.set = function <T>(i: number, value: T) {
    const a: T[] = this as T[];
    return a[(i + a.length) % a.length] = value;
}

export type SingleString = { key: string, value: string };
export type StringDef = { v: string, t: string };
export type Translatable = {
    vs: StringDef[];
    inactive?: boolean;
}

export type Language = Record<string, Translatable>;
export type Strings = Record<string, string>;

export type DiffStep = [number, string];
export type Diff = { key: string, diffs: DiffStep[] };

export async function save(path: string, contents: unknown): Promise<void> {
    await promisify(writeFile)(path, dump(contents, { quotingType: "\"" }));
}

export async function updateFile(path: string, { key, value }: SingleString): Promise<void> {
    const src: Language = load((await promisify(readFile)(path)).toString()) as Language;
    const t = new Date().toISOString();
    if (src[key]) {
        src[key] = { vs: [{ v: value, t }, ...(src[key].vs ?? []),], inactive: false };
    }
    await save(path, src);
}

export async function stringsFromLang(path: string, full = false): Promise<Strings | Language> {
    const contents = load((await promisify(readFile)(path)).toString()) as Language;
    if (full) {
        return contents;
    }

    return Object.entries(contents).reduce<Strings>((acc, [key, value]) => {
        if (!value.inactive) {
            acc[key] = value.vs?.[0]?.v;
        }
        return acc;
    }, {});
}

function shortestEdit(a: string[], b: string[]): number[][] {
    const [n, m] = [a.length, b.length];
    const max = n + m;
    const v: number[] = Array(2 * max + 1).fill(null);
    const trace: number[][] = [];
    v[1] = 0;
    for (let d = 0; d <= max; d++) {
        trace.push(v.map(q => q));
        for (let k = -d; k <= d; k += 2) {
            let x = (k === -d || (k !== d && v.get(k - 1) < v.get(k + 1)))
                ? v.get(k + 1)
                : v.get(k - 1) + 1
            let y = x - k;
            while (x < n && y < m && a[x] === b[y]) {
                x++;
                y++;
            }
            v.set(k, x);
            if (x >= n && y >= m) {
                return trace;
            }
        }
    }
}

function* backtrack(a: string[], b: string[]) {
    const trace = shortestEdit(a, b);
    // let toPrint = "";
    // trace.forEach(x => {
    //     x.forEach(y => {
    //         toPrint += (` ${y ?? " "} `);
    //     });
    //     toPrint += "\n";
    // });
    // console.log(toPrint);
    let [x, y] = [a.length, b.length];
    const reversed = trace.map((v, d) => [v, d]).reverse() as [number[], number][];
    for (const [v, d] of reversed) {
        const k = x - y;

        const prevK = k === -d || (k !== d && v.get(k - 1) < v.get(k + 1))
            ? k + 1
            : k - 1;
        const prevX = v.get(prevK);
        const prevY = prevX - prevK;

        while (x > prevX && y > prevY) {
            yield [x - 1, y - 1, x, y];
            x--;
            y--;
        }

        if (d > 0) {
            yield [prevX, prevY, x, y];
        }

        x = prevX; y = prevY;
    }
}

export function diff(a: string, b: string): DiffStep[] {
    const [aParts, bParts] = [a.split(" "), b.split(" ")];
    const steps = backtrack(aParts, bParts)
    const diff = [];
    let next = steps.next();
    while (!next.done) {
        const [prevX, prevY, x, y] = next.value as [number, number, number, number];
        const toAdd = x === prevX
            ? [1, bParts[prevY]]
            : y === prevY
                ? [-1, aParts[prevX]]
                : [0, aParts[prevX]];
        if (diff[0]?.[0] === toAdd[0]) {
            diff[0][1] = `${toAdd[1]} ${diff[0][1]}`;
        } else {
            if (diff[0]?.[0] !== 1 || toAdd[0] !== -1) {
                toAdd[1] = toAdd[1] + " ";
            }
            diff.unshift(toAdd);
        }
        next = steps.next();
    }
    return diff;
}
