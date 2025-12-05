/*
 * @Description:
 * @Author: 安知鱼
 * @Date: 2025-11-28 15:59:08
 * @LastEditTime: 2025-12-05 19:15:03
 * @LastEditors: 安知鱼
 */
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { i18n } from "../locales";
import "../styles/main.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(i18n);
app.mount("#app");
