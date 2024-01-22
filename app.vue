<template>
  <div>
    <!-- Markup shared across all pages, ex: NavBar -->
    <NuxtPage />
  </div>
</template>
<script setup lang="ts">
import { initApi } from "./services/api";
initApi('http://localhost:3000/');
</script>
