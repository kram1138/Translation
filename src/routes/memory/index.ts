import { diff, Diff, Strings, stringsFromLang } from "$lib/translations";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async ({ query }) => {
    try {
        const strings = await stringsFromLang(`./static/source/source.yaml`) as Strings;
        const entries = Object.entries(strings);
        const sourceKey = query.get("key");
        const source = strings[sourceKey];
        const diffs = entries.filter(([key]) => key !== sourceKey).reduce<Diff[]>((prev, [key, value]) => {
            console.log(source, value);
            const d = diff(source, value);
            console.log(d);
            prev.push({key, diffs: d});
            return prev;
        }, []);
        return {body: diffs}
    } catch (error) {
        console.warn(error);
        return { status: 500 }
    }
};