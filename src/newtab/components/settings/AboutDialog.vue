<!--
 * @Description: 
 * @Author: 安知鱼
 * @Date: 2025-11-28 16:02:35
 * @LastEditTime: 2025-12-05 09:52:23
 * @LastEditors: 安知鱼
-->
<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import { useI18n } from "vue-i18n";
import SettingsDialog from "./SettingsDialog.vue";

const { t } = useI18n();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const version = "1.0.0";
const links = computed(() => [
  { label: t("about.github"), icon: "ri:github-fill", url: "https://github.com" },
  { label: t("about.website"), icon: "ri:global-line", url: "https://anheyu.com" },
  { label: t("about.feedback"), icon: "ri:feedback-line", url: "https://github.com" },
]);
</script>

<template>
  <SettingsDialog :title="t('about.title')" :show-large-title="false" :show-search="false" @close="emit('close')">
    <div class="text-center">
      <!-- Logo -->
      <div class="flex items-center justify-center w-20 h-20 mx-auto mb-4 shadow-lg rounded-2xl logo-bg">
        <svg viewBox="0 0 49.06 44.67" class="w-12 h-12">
          <path
            fill="#017aff"
            d="M46.87,39.7h0c-1.1-1.26-2.66-3.38-2.51-5.09,5.45-7.01,6.25-18.04,1.93-25.92-.3-.55-.95-.81-1.55-.64-5.94,1.71-10.93,6.18-13.71,11.66-.56,1.13-1.11,2.31-2.44,2.55-1.58,.29-4.36,2.51-5.43,4.12h0c-.47,.46-.11,1.34,.56,1.32,.13-.01,4.37-.4,4.51-.41,1.39,11.9-16.2,13.32-16.71,1.33-.09-4.74,3.54-5.54,2.26-7.41-1.21-1.7-3.29,.54-4.5,1.11-3.05,2.29-4.75,0-4.79-3.43-.26-2.1,.16-3.82-.92-5.46-.66-.92-2.1-.79-2.55,.25-6.66,22.16,21.16,40.58,38.99,25.5,1.73,.87,4.22,1.81,6.17,1.8,.69,.14,1.18-.77,.7-1.27h0Zm-3.51-17.42c-2.57,.5-3.33-3.34-.79-3.88,2.57-.49,3.32,3.34,.79,3.88Z"
          />
          <path
            fill="#003cfc"
            d="M5.33,10.23c3.01,3.08-.36,10.31,2.61,10.22,.41-.04,.75-.28,.93-.64,1.68-2.04,3.38-2.99,6.17-3.37,1.19-.14,2.18,1.47,4.28,.86,2.6-.75,2.01-3.86,.72-4.56-1.75-1.34-5.62-1.25-7.23,0,3.83-3.52,10.97-4.21,12.48,1.92,.89,3.22,4.16,3.42,5.26,.23,1.34-7.03-7.33-12.62-13.66-10.36,1.55-.79,3.32-1.01,4.85-1.78,1-.64,1.21-2.07,0-2.67-5.12-.75-10.54,4.47-12.28,8.98-.74-1.86-3.18-4.04-5.34-3.82-1.13,.24-1.56,1.63-.78,2.48,.75,.9,1.32,1.57,1.97,2.52Z"
          />
          <path
            fill="#003cfc"
            d="M25.64,2.7s.02,0,.03,0c0,0,0,0,0,0,3.78-.43,4.27,2.23,6.58,1.86,2.16-.42,1.99-3.29-.06-3.77-2.08-.65-5,.1-6.68,1.66-.08,.1,0,.26,.12,.26Z"
          />
        </svg>
      </div>

      <!-- App name -->
      <h2 class="mb-1 text-xl font-semibold text-primary">{{ t("about.appName") }}</h2>
      <p class="mb-4 text-sm text-muted">{{ t("about.version") }} {{ version }}</p>

      <!-- Description -->
      <p class="mb-6 text-sm text-secondary">{{ t("about.description") }}</p>

      <!-- Links -->
      <div class="flex justify-center gap-6 mb-6">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.url"
          target="_blank"
          class="flex flex-col items-center gap-1 transition-colors text-muted hover:text-accent"
        >
          <Icon :icon="link.icon" class="w-6 h-6" />
          <span class="text-xs">{{ link.label }}</span>
        </a>
      </div>

      <!-- Tech stack -->
      <div class="mb-4 text-xs text-muted">{{ t("about.builtWith") }}</div>

      <!-- Copyright -->
      <p class="text-xs text-muted">© {{ new Date().getFullYear() }} Anheyu. All rights reserved.</p>
    </div>
  </SettingsDialog>
</template>

<style scoped>
@import "./settings-form.css";

.logo-bg {
  background: var(--color-accent);
}

.hover\:text-accent:hover {
  color: rgb(var(--color-accent));
}
</style>
