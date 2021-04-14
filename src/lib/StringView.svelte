<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let key: string;
    export let src: string;
    export let dest: string;
    export let selected = false;

    const d = createEventDispatcher();

    function save(event: Event) {
        d("save", (event.target as HTMLInputElement).value);
    }

    function select() {
        d("select");
    }
</script>

<div class="string" class:selected on:click={select}>
    <div class="context">
        <div class="source">{src}</div>
        <div class="key">key: {key}</div>
    </div>
    <div class="translation">
        <textarea value={dest} on:change={save} />
    </div>
</div>

<style lang="scss">
    .string {
        display: flex;
        margin: 16px;
        padding: 8px;
        border: 1px solid lightgray;
    }

    .string:hover {
            background-color: rgb(250, 250, 250);
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

    .selected {
        background-color: rgb(238, 238, 238);
    }
</style>
