/*
 * @Description:
 * @Author: 安知鱼
 * @Date: 2025-11-28 15:59:59
 * @LastEditTime: 2025-12-01 18:10:10
 * @LastEditors: 安知鱼
 */
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { SearchEngine } from "@/types";
import { useSettingsStore } from "./settings";

const SEARCH_ENGINES: SearchEngine[] = [
  {
    id: "google",
    name: "Google",
    icon: "ri:google-fill",
    url: "https://www.google.com/search?q=",
    placeholder: "在 Google 中搜索",
  },
  {
    id: "bing",
    name: "Bing",
    icon: "ri:microsoft-fill",
    url: "https://www.bing.com/search?q=",
    placeholder: "在 Bing 中搜索",
  },
  {
    id: "baidu",
    name: "百度",
    icon: "ri:baidu-fill",
    url: "https://www.baidu.com/s?wd=",
    placeholder: "在百度中搜索",
  },
  {
    id: "github",
    name: "GitHub",
    icon: "ri:github-fill",
    url: "https://github.com/search?q=",
    placeholder: "在 GitHub 中搜索",
  },
];

const CUSTOM_ENGINES_KEY = "anheyu_custom_search_engines";

export const useSearchStore = defineStore("search", () => {
  const engines = ref<SearchEngine[]>([...SEARCH_ENGINES]);

  const settingsStore = useSettingsStore();

  // 加载自定义搜索引擎
  function loadCustomEngines() {
    try {
      const stored = localStorage.getItem(CUSTOM_ENGINES_KEY);
      if (stored) {
        const customEngines = JSON.parse(stored) as SearchEngine[];
        // 合并默认引擎和自定义引擎
        engines.value = [...SEARCH_ENGINES, ...customEngines];
      }
    } catch {
      // ignore storage errors
    }
  }

  // 保存自定义搜索引擎
  function saveCustomEngines() {
    try {
      const customEngines = engines.value.filter(e => e.isCustom);
      localStorage.setItem(CUSTOM_ENGINES_KEY, JSON.stringify(customEngines));
    } catch {
      // ignore storage errors
    }
  }

  const currentEngine = computed(() => {
    const engineId = settingsStore.settings.searchEngine;
    return engines.value.find(e => e.id === engineId) || engines.value[0];
  });

  function search(query: string) {
    if (!query.trim()) return;

    const url = currentEngine.value.url + encodeURIComponent(query);

    // 根据设置决定在新标签页还是当前页面打开
    if (settingsStore.settings.openInNewTab) {
      window.open(url, "_blank");
    } else {
      window.location.href = url;
    }
  }

  async function setEngine(engineId: string) {
    await settingsStore.updateSettings({ searchEngine: engineId });
  }

  // 添加自定义搜索引擎
  function addCustomEngine(engine: Omit<SearchEngine, "id" | "isCustom">) {
    const newEngine: SearchEngine = {
      ...engine,
      id: `custom_${Date.now()}`,
      isCustom: true,
    };
    engines.value.push(newEngine);
    saveCustomEngines();
    return newEngine;
  }

  // 更新自定义搜索引擎
  function updateCustomEngine(id: string, updates: Partial<SearchEngine>) {
    const index = engines.value.findIndex(e => e.id === id && e.isCustom);
    if (index !== -1) {
      engines.value[index] = { ...engines.value[index], ...updates };
      saveCustomEngines();
    }
  }

  // 删除自定义搜索引擎
  async function deleteCustomEngine(id: string) {
    const engine = engines.value.find(e => e.id === id);
    if (!engine?.isCustom) return;

    engines.value = engines.value.filter(e => e.id !== id);
    saveCustomEngines();

    // 如果删除的是当前引擎，切换到默认引擎
    if (currentEngine.value.id === id) {
      await setEngine(engines.value[0].id);
    }
  }

  // 初始化时加载自定义引擎
  loadCustomEngines();

  return {
    engines,
    currentEngine,
    search,
    setEngine,
    addCustomEngine,
    updateCustomEngine,
    deleteCustomEngine,
  };
});
