import type { RequestHandler } from "@sveltejs/kit";
import fs from "fs";
import { load } from "js-yaml";

export const get: RequestHandler = ({ params }) => {
    const contents = (fs.readFileSync("./static/en.yaml")).toString();
    return {
        body: load(contents),
    }
};