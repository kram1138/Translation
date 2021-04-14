<script lang="ts" context="module">
    import StringView from "$lib/StringView.svelte";
    import type { Strings, Diff } from "$lib/translations";
    import type { Load } from "@sveltejs/kit";
    import Tm from "$lib/TM.svelte";

    export const load: Load = async ({ fetch }) => {
        const src = await fetch("source");
        const dest = await fetch(`/translations/fr`);

        if (src.ok) {
            return {
                props: {
                    source: await src.json(),
                    dest: await dest.json(),
                },
            };
        }

        return {
            status: src.status,
            error: new Error(`Could not load translations`),
        };
    };
</script>

<script lang="ts">
    export let source: Strings;
    export let dest: Strings = {};

    let diffs: Promise<Diff[]>;
    let selection = "";

    let entries = Object.entries(source ?? {});

    async function save(key: string, { detail }: CustomEvent<string>) {
        dest[key] = detail;
        await fetch("./translations/fr", {
            method: "PATCH",
            body: JSON.stringify({ key, value: detail }),
        });
        selected(selection);
    }

    function selected(key: string) {
        selection = key;
        diffs = fetch(`/memory?key=${key}`).then((response) => response.json());
    }

    function useTM({ detail }: CustomEvent<string>) {
        save(selection, { detail: dest[detail] } as CustomEvent<string>);
    }
</script>

<main>
    <h1>Translations</h1>
    <div class="container">
        <div class="strings">
            {#each entries as [key, src]}
                <StringView
                    {src}
                    {key}
                    selected={selection === key}
                    dest={dest[key] ?? ""}
                    on:save={(event) => save(key, event)}
                    on:select={() => selected(key)}
                />
            {/each}
        </div>
        <div class="tm">
            <h2>Translation memory</h2>
            {#await diffs}
                Loading TM
            {:then diffs}
                <Tm {dest} {diffs} on:select={useTM} />
            {/await}
        </div>
    </div>
</main>

<style lang="scss">
    .container {
        display: flex;
    }

    .strings {
        flex: 2;
        cursor: pointer;
    }

    .tm {
        flex: 1;
        border-left: 1px solid lightgray;
        padding-left: 16px;
    }
</style>
