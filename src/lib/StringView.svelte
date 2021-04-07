<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { StringDef } from "./translations";

    export let key: string;
    export let src: StringDef[];
    export let dest: StringDef[];

    const formatter = Intl.DateTimeFormat("en-CA", {
        dateStyle: "medium",
        timeStyle: "medium",
    });

    const d = createEventDispatcher();

    let fullView = false;

    function save(event: Event) {
        d("save", (event.target as HTMLInputElement).value);
    }
</script>

<div class="string">
    {#if !fullView}
        <div class="context">
            <div class="source">{src?.[0]?.v}</div>
            <div class="key">key: {key}</div>
        </div>
        <div class="translation">
            <textarea value={dest?.[0]?.v} on:change={save} />
            <div class="timestamp">
                Last modified: {formatter.format(new Date(dest?.[0]?.t))}
                <button on:click={() => (fullView = true)}>
                    Show history
                </button>
            </div>
        </div>
    {:else}
        <div class="context">
            {#each src as s}
                <div class="source">
                    {s.v}:
                    <span class="timestamp"
                        >{formatter.format(new Date(s.t))}</span
                    >
                </div>
            {/each}
            <div class="key">key: {key}</div>
        </div>
        <div class="translation">
            {#each dest as d}
                <div>
                    {d.v}:
                    <span class="timestamp"
                        >{formatter.format(new Date(d.t))}</span
                    >
                </div>
            {/each}
        </div>
        <button on:click={() => (fullView = false)}> Hide history </button>
    {/if}
</div>

<style lang="scss">
    .string {
        display: flex;
        margin: 16px;
        padding: 8px;
        border: 1px solid lightgray;
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
        flex-direction: column;
        flex: 1;
        textarea {
            flex: 1;
        }
    }

    .timestamp {
        font-size: 12px;
        color: gray;
    }
</style>
