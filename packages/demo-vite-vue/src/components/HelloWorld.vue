<script setup lang="ts">
import { merge } from "lodash";
import { PhCheck } from "phosphor-vue";
import { ref } from "vue";

defineProps<{ msg: string }>();

const merged = ref(JSON.stringify(merge({ foo: "foo" }, { bar: "bar" })));
</script>

<template>
  <div>{{ merged }}</div>
  <PhCheck />
</template>
