import type { LanguageDef } from "$lib/translations";
import type { RequestHandler } from "@sveltejs/kit";
import { writeFile, readFile } from "fs";
import { dump, load } from "js-yaml";
import { promisify } from "util";

export const get: RequestHandler = async ({ params }) => {
    try {
        const contents = load((await promisify(readFile)(`./static/translations/${params.lang}.yaml`)).toString()) as LanguageDef;
        console.log(contents);
        return {
            body: contents,
        }
    } catch (error) {
        console.warn(error);
        return { status: 500 }
    }
};

export const post: RequestHandler = async ({ params, body }) => {
    try {
        const content: LanguageDef = JSON.parse(body.toString());
        await promisify(writeFile)(`./static/translations/${params.lang}.yaml`, dump(content));
    } catch (error) {
        console.warn(error);
        return { status: 500 }
    }
    return {
        status: 200,
        body: ""
    };
}