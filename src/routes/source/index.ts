import { Language, save, Strings, stringsFromLang, Translatable } from "$lib/translations";
import type { RequestHandler } from "@sveltejs/kit";
import { readFile } from "fs";
import { load } from "js-yaml";
import { promisify } from "util";

export const get: RequestHandler = async ({ query }) => {
    try {
        const body = await stringsFromLang(`./static/source/source.yaml`, !!query.get("full"));
        return { body, }
    } catch (error) {
        console.warn(error);
        return { status: 500 }
    }
};

export const put: RequestHandler<unknown, Strings> = async ({ body }) => {
    try {
        const prev: Language = load((await promisify(readFile)(`./static/source/source.yaml`)).toString()) as Language;
        const next: Strings = JSON.parse(body.toString());
        const t = new Date().toISOString();
        const content = Object.entries(next).reduce<Language>((acc, [key, v]) => {
            const oldString = prev[key];
            const newString: Translatable = {
                inactive: false,
                vs: oldString.vs[0]?.v === v ? oldString.vs : [{ t, v }, ...oldString.vs]
            };
            acc[key] = newString;
            return acc;
        }, {});
        await save(`./static/source/source.yaml`, content);
    } catch (error) {
        console.warn(error);
        return { status: 500 }
    }
    return {
        status: 200,
        body: ""
    };
}

export const post: RequestHandler<unknown, Strings> = async ({ body }) => {
    try {
        const t = new Date().toISOString();
        const content = Object.entries(JSON.parse(body.toString()) as Strings).reduce<Language>((acc, [key, value]) => {
            acc[key] = { vs: [{ v: value, t }] };
            return acc;
        }, {});
        await save(`./static/source/source.yaml`, content);
    } catch (error) {
        console.warn(error);
        return { status: 500 }
    }
    return {
        status: 200,
        body: ""
    };
}