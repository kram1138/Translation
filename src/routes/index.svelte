<script lang="ts" context="module">
    import StringView from "$lib/StringView.svelte";
    import type { LanguageDef } from "$lib/translations";
    import type { Load } from "@sveltejs/kit";

    export const load: Load = async ({ page, fetch }) => {
        const url = `/translations/`;
        const src = await fetch(url + "en");
        const dest = await fetch(url + "fr");

        if (src.ok && dest.ok) {
            return {
                props: {
                    source: await src.json(),
                    dest: await dest.json(),
                },
            };
        }

        return {
            status: src.status,
            error: new Error(`Could not load ${url}`),
        };
    };
</script>

<script lang="ts">
    export let source: LanguageDef;
    export let dest: LanguageDef = {};

    let entries = Object.entries(source ?? {});

    function save(key, { detail }: CustomEvent<string>) {
        dest[key] = [{ v: detail, t: new Date().toISOString() }, ...dest[key]];
        fetch("./translations/fr", {
            method: "POST",
            body: JSON.stringify(dest),
        });
    }
</script>

<main>
    <h1>Translations</h1>

    {#each entries as [key, src]}
        <StringView
            {src}
            {key}
            dest={dest[key]}
            on:save={(event) => save(key, event)}
        />
    {/each}
</main>

<style lang="scss">
</style>
