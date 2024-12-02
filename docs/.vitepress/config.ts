import { defineConfig } from "vitepress";
import { set_sidebar } from "./sidebar";

export default defineConfig({
  title: "WhiteP1ay的博客",
  description: "博客",
  lang: "zh-CN",
  base: "/blog/",

  themeConfig: {
    docFooter: {
      prev: false,
      next: false,
    },
    nav: [
      { text: "首页", link: "/" },
      { text: "技术文章", link: "/tech/" },
      { text: "读书笔记", link: "/read/" },
      { text: "乱七八糟", link: "/misc/" },
    ],
    sidebar: {
      "/tech/": set_sidebar("/tech/"),
      "/read/": set_sidebar("/read/"),
      "/misc/": set_sidebar("/misc/"),
    },
    socialLinks: [{ icon: "github", link: "https://github.com/WhiteP1ay" }],
  },
});
