import { stringify } from "yaml";

function downloadFromURI(href: string, fileName: string) {
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", href);
    downloadLink.setAttribute("download", fileName);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

export function downloadFile(file: string, fileName: string) {
    const href = `data:text/plain;charset=utf-8,${encodeURIComponent(file)}`;
    downloadFromURI(href, fileName);
}

export function downloadObjectAsJson(obj: unknown, fileName: string) {
    downloadFile(JSON.stringify(obj, null, 2), fileName);
}

export function downloadObjectAsYaml(obj: unknown, fileName: string) {
    downloadFile(stringify(obj), fileName);
}