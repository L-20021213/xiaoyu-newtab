import { ref } from "vue";
import type { BookmarkNode } from "@/types";

// 检测是否在浏览器扩展环境中
declare const chrome:
  | {
      bookmarks?: unknown;
    }
  | undefined;

const isExtension = typeof chrome !== "undefined" && chrome?.bookmarks;

// 动态导入 webextension-polyfill
type BrowserBookmarksAPI = {
  bookmarks: {
    getTree: () => Promise<BrowserBookmarkTreeNode[]>;
  };
};

interface BrowserBookmarkTreeNode {
  id: string;
  title: string;
  url?: string;
  children?: BrowserBookmarkTreeNode[];
}

let browser: BrowserBookmarksAPI | null = null;

async function getBrowser(): Promise<BrowserBookmarksAPI | null> {
  if (!isExtension) return null;
  if (!browser) {
    try {
      const browserModule = await import("webextension-polyfill");
      browser = (browserModule.default || browserModule) as BrowserBookmarksAPI;
    } catch {
      return null;
    }
  }
  return browser;
}

// localStorage 中存储的书签 key
const BOOKMARKS_STORAGE_KEY = "h5_bookmarks";

// 获取本地存储的书签
function getLocalBookmarks(): BookmarkNode[] {
  try {
    const stored = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // 忽略错误
  }
  return [];
}

// 保存书签到本地存储
function saveLocalBookmarks(bookmarks: BookmarkNode[]): void {
  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
  } catch {
    // 忽略错误
  }
}

export function useBookmarks() {
  const bookmarks = ref<BookmarkNode[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  // 是否在扩展环境中
  const isInExtension = ref(isExtension);

  async function fetchBookmarks() {
    loading.value = true;
    error.value = null;

    try {
      const b = await getBrowser();
      if (b) {
        const tree = await b.bookmarks.getTree();
        bookmarks.value = transformBookmarks(tree);
      } else {
        // 非扩展环境，从 localStorage 加载
        bookmarks.value = getLocalBookmarks();
        if (bookmarks.value.length === 0) {
          // 提供一些默认书签供 H5 模式使用
          bookmarks.value = getDefaultBookmarks();
        }
      }
    } catch (e) {
      console.error("Failed to fetch bookmarks:", e);
      error.value = "无法加载书签";
      // 尝试从本地存储加载
      bookmarks.value = getLocalBookmarks();
    } finally {
      loading.value = false;
    }
  }

  function transformBookmarks(nodes: BrowserBookmarkTreeNode[]): BookmarkNode[] {
    return nodes.map(node => ({
      id: node.id,
      title: node.title,
      url: node.url,
      children: node.children ? transformBookmarks(node.children) : undefined,
    }));
  }

  function flattenBookmarks(nodes: BookmarkNode[]): BookmarkNode[] {
    const result: BookmarkNode[] = [];

    function traverse(items: BookmarkNode[]) {
      for (const item of items) {
        if (item.url) {
          result.push(item);
        }
        if (item.children) {
          traverse(item.children);
        }
      }
    }

    traverse(nodes);
    return result;
  }

  function searchBookmarks(query: string): BookmarkNode[] {
    if (!query.trim()) return [];

    const flat = flattenBookmarks(bookmarks.value);
    const lowerQuery = query.toLowerCase();

    return flat.filter(
      bookmark => bookmark.title.toLowerCase().includes(lowerQuery) || bookmark.url?.toLowerCase().includes(lowerQuery)
    );
  }

  // H5 模式下添加书签
  function addBookmark(bookmark: Omit<BookmarkNode, "id">) {
    if (isExtension) {
      console.warn("在扩展环境中请使用浏览器的书签功能");
      return;
    }
    const newBookmark: BookmarkNode = {
      ...bookmark,
      id: Date.now().toString(),
    };
    bookmarks.value.push(newBookmark);
    saveLocalBookmarks(bookmarks.value);
  }

  // H5 模式下删除书签
  function removeBookmark(id: string) {
    if (isExtension) {
      console.warn("在扩展环境中请使用浏览器的书签功能");
      return;
    }
    const index = bookmarks.value.findIndex(b => b.id === id);
    if (index !== -1) {
      bookmarks.value.splice(index, 1);
      saveLocalBookmarks(bookmarks.value);
    }
  }

  // 获取默认书签（H5 模式）
  function getDefaultBookmarks(): BookmarkNode[] {
    return [
      { id: "1", title: "Google", url: "https://www.google.com" },
      { id: "2", title: "GitHub", url: "https://github.com" },
      { id: "3", title: "Bilibili", url: "https://www.bilibili.com" },
      { id: "4", title: "知乎", url: "https://www.zhihu.com" },
      { id: "5", title: "掘金", url: "https://juejin.cn" },
    ];
  }

  return {
    bookmarks,
    loading,
    error,
    isInExtension,
    fetchBookmarks,
    flattenBookmarks,
    searchBookmarks,
    addBookmark,
    removeBookmark,
  };
}
