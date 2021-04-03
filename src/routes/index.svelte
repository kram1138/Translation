<script lang="ts" context="module">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = async ({ page, fetch }) => {
        const url = `/source`;
        const res = await fetch(url);

        if (res.ok) {
            return {
                props: {
                    source: await res.json(),
                },
            };
        }

        return {
            status: res.status,
            error: new Error(`Could not load ${url}`),
        };
    };
</script>

<script lang="ts">
    import { downloadObjectAsYaml } from "../utils/files";
    import { dump } from "js-yaml";

    export let source: Record<string, string>;
    let entries = Object.entries(source ?? {});

    let dest: Record<string, string> = {};
    function download() {
        downloadObjectAsYaml(dest, "fr.yaml");
    }
</script>

<main>
    <h1>Translations</h1>
    <button on:click={download}>Download translation</button>

    {#each entries as [key, en]}
        <div class="string">
            <div class="context">
                <div class="source">{en}</div>
                <div class="key">{key}</div>
            </div>
            <div class="translation">
                <textarea bind:value={dest[key]} />
            </div>
        </div>
    {/each}

    <pre>{dump(dest)}</pre>
</main>

<style lang="scss">
    .string {
        display: flex;
        padding: 16px;
    }

    .context {
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .key {
        color: gray;
        padding-left: 8px;
    }

    .translation {
        display: flex;
        flex: 1;
        textarea {
            flex: 1;
        }
    }
</style>
