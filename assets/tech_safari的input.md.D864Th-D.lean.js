import{_ as i,c as a,a0 as t,o as n}from"./chunks/framework.Dsvon-85.js";const p="/blog/assets/iosSafariInputBug.DlRgqeU8.png",g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"tech/safari的input.md","filePath":"tech/safari的input.md"}'),h={name:"tech/safari的input.md"};function l(e,s,k,r,E,d){return n(),a("div",null,s[0]||(s[0]=[t(`<h2 id="iphone-safari-的-input-光标左偏问题" tabindex="-1">iphone safari 的 input 光标左偏问题 <a class="header-anchor" href="#iphone-safari-的-input-光标左偏问题" aria-label="Permalink to &quot;iphone safari 的 input 光标左偏问题&quot;">​</a></h2><h3 id="最小复现-demo" tabindex="-1">最小复现 demo <a class="header-anchor" href="#最小复现-demo" aria-label="Permalink to &quot;最小复现 demo&quot;">​</a></h3><div class="language-tsx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { Input } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;@mui/material&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { useEffect } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;react&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> MyTest</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  useEffect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    document.documentElement.style.fontSize </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;4px&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }, []);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      raw : &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">input</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> type</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;text&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> className</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;w-[25rem]&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      mui : &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Input</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> className</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;w-[25rem]&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Input</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;/&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  );</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>用 iphone 的 safari 打开该页面，input 框的光标会偏移<br><img src="`+p+'" alt="bug" style="zoom:33%;"></p><h3 id="猜测问题原因及解决方案" tabindex="-1">猜测问题原因及解决方案 <a class="header-anchor" href="#猜测问题原因及解决方案" aria-label="Permalink to &quot;猜测问题原因及解决方案&quot;">​</a></h3><p>可能是因为根元素的字体小于 12px，越小 bug 越明显。所以解决方案就是别让 html 的字体太小。</p>',6)]))}const c=i(h,[["render",l]]);export{g as __pageData,c as default};
