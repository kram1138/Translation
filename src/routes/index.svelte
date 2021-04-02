<script lang="ts">
    import { downloadObjectAsYaml } from "../utils/files";
    import { parse, stringify } from "yaml";

    let files: FileList;
    let source: Record<string, string>;
    $: {
        if (files && files[0]) {
            let binfile = files[0];
            let reader = new FileReader();
            reader.onload = function (evt) {
                source = parse(
                    new TextDecoder("utf-8").decode(
                        evt.target.result as ArrayBuffer
                    )
                );
            };
            reader.readAsArrayBuffer(binfile);
        }
    }
    $: entries = Object.entries(source ?? {});

    let dest: Record<string, string> = {};

    function download() {
        downloadObjectAsYaml(dest, "fr.yaml");
    }
</script>

<main>
    <h1>Translations</h1>
    <input type="file" bind:files />
    <button on:click={download}>Download translation</button>

    {#each entries as [key, en]}
        <div class="string">
            <div class="context">
                <div class="source">{en}</div>
                <div class="key">{key}</div>
            </div>
            <div class="translation"><textarea bind:value={dest[key]} /></div>
        </div>
    {/each}
    <pre>{stringify(dest)}</pre>
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
