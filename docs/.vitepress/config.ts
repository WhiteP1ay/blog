import { defineConfig } from "vitepress";
import { set_sidebar } from "./sidebar";

export default defineConfig({
  title: "WhiteP1ay的博客",
  description: "技术博客",
  lang: "zh-CN",

  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "技术文章", link: "/tech/" },
      { text: "读书笔记", link: "/read/" },
      { text: "音乐学习", link: "/music/" },
    ],
    sidebar: {
      "/tech/": set_sidebar("/tech/"),
      "/read/": set_sidebar("/read/"),
      "/music/": set_sidebar("/music/"),
    },
    socialLinks: [{ icon: "github", link: "https://github.com/your-username" }],
  },
});
