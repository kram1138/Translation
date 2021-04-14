<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { Diff, Strings } from "./translations";

    export let diffs: Diff[];
    export let dest: Strings;

    const d = createEventDispatcher();

    function select(key: string) {
        d("select", key);
    }
</script>

<div>
    {#each diffs ?? [] as { key, diffs }}
        <div class="context" on:click={() => select(key)}>
            <div>{dest[key]}</div>
            <div class="diff">
                {#each diffs ?? [] as [status, part]}<span class:remove={status === -1} class:add={status === 1}>{part}</span>{/each}
            </div>
            <div class="key">key: {key}</div>
        </div>
    {/each}
</div>

<style lang="scss">
    .remove {
        background-color: rgba(255, 0, 0, 0.61);
        text-decoration: line-through;
    }

    .add {
        background-color: rgba(0, 255, 64, 0.733);
    }

    .context {
        display: flex;
        flex-direction: column;
        flex: 1;
        margin-bottom: 16px;
        cursor: pointer;

        &:hover {
            background-color: rgb(238, 251, 255);
        }
    }
    
    .diff {
        padding-left: 8px;
    }

    .key {
        color: gray;
        padding-left: 8px;
    }
</style>
