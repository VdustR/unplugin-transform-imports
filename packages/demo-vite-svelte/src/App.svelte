<script lang="ts">
  import { merge } from "lodash";
  import { Check as PhCheck } from "phosphor-svelte";
  const merged = merge({ foo: "foo" }, { bar: "bar" });
</script>

<main>
  <div>{JSON.stringify(merged)}</div>
  <PhCheck />
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }
</style>
