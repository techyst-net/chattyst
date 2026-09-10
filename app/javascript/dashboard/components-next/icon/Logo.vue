<script setup>
import { useAttrs } from 'vue';
import { useMapGetter } from 'dashboard/composables/store';

const attrs = useAttrs();
const globalConfig = useMapGetter('globalConfig/get');
</script>

<template>
  <img
    v-if="globalConfig.logoThumbnail"
    v-bind="attrs"
    :src="globalConfig.logoThumbnail"
  />
  <!-- Fallback used before global config loads, or if LOGO_THUMBNAIL is unset. -->
  <svg
    v-else
    v-once
    v-bind="attrs"
    width="16"
    height="16"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Zeshan Desk"
  >
    <defs>
      <linearGradient id="zeshan-logo-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#818CF8" />
        <stop offset="1" stop-color="#4F46E5" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="14" fill="url(#zeshan-logo-gradient)" />
    <path
      d="M18 18 H46 V26 L31 38 H46 V46 H18 V38 L33 26 H18 Z"
      fill="#F8FAFC"
    />
  </svg>
</template>
