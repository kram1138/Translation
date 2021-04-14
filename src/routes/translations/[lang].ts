import { Language, save, Strings, stringsFromLang, updateFile } from "$lib/translations";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async ({ params, query }) => {
    try {
        const body = await stringsFromLang(`./static/translations/${params.lang}.yaml`, !!query.get("full"));
        return { body };
    } catch (error) {
        console.warn(error);
        return { status: 500 }
    }
};

export const patch: RequestHandler<unknown, Strings> = async ({ body, params }) => {
    try {
        const str = JSON.parse(body.toString());
        await updateFile(`./static/translations/${params.lang}.yaml`, str);
    } catch (error) {
        console.warn(error);
        return { status: 500 }
    }
    return {
        status: 200,
        body: ""
    };
}

export const post: RequestHandler<unknown, Strings> = async ({ body, params }) => {
    try {
        const t = new Date().toISOString();
        const content = Object.entries(JSON.parse(body.toString()) as Strings).reduce<Language>((acc, [key, value]) => {
            acc[key] = { vs: [{ v: value, t }] };
            return acc;
        }, {});
        await save(`./static/translations/${params.lang}.yaml`, content);
    } catch (error) {
        console.warn(error);
        return { status: 500 }
    }
    return {
        status: 200,
        body: ""
    };
}