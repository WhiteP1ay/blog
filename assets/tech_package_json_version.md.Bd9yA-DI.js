import{_ as i,c as a,a0 as t,o as n}from"./chunks/framework.Dsvon-85.js";const e="/blog/assets/version2.Dh8Up51z.png",l="/blog/assets/version1.BGw5SLeh.png",E=JSON.parse('{"title":"version","description":"","frontmatter":{},"headers":[],"relativePath":"tech/package_json/version.md","filePath":"tech/package_json/version.md"}'),p={name:"tech/package_json/version.md"};function h(o,s,r,k,d,g){return n(),a("div",null,s[0]||(s[0]=[t('<h1 id="version" tabindex="-1">version <a class="header-anchor" href="#version" aria-label="Permalink to &quot;version&quot;">​</a></h1><h3 id="semver规范" tabindex="-1"><strong>Semver规范</strong> <a class="header-anchor" href="#semver规范" aria-label="Permalink to &quot;**Semver规范**&quot;">​</a></h3><p>版本号应遵循semantic version规范</p><p><a href="https://semver.org/lang/zh-CN/" target="_blank" rel="noreferrer">semver</a> <a href="https://docs.npmjs.com/about-semantic-versioning" target="_blank" rel="noreferrer">npm Docs</a></p><h3 id="semver简述" tabindex="-1"><strong>Semver简述</strong> <a class="header-anchor" href="#semver简述" aria-label="Permalink to &quot;**Semver简述**&quot;">​</a></h3><p>标准的版本号必须采用 X.Y.Z 的格式，其中 X、Y 和 Z 为非负的整数，且禁止在数字前方补零。X 是主版本号、Y 是次版本号、而 Z 为修订号，英文对应表示为 major、minor、patch。<strong>总结：破坏性的不兼容的变更修改主版本号（Major)，以向后兼容的方式添加功能使用修改次版本号(Minor)，修复缺陷修改修订号(Patch)</strong>。另外还有测试版本号，在修订号后。例如1.0.0-alpha.1，表示非稳定的版本。</p><h3 id="测试版本号" tabindex="-1"><strong>测试版本号</strong> <a class="header-anchor" href="#测试版本号" aria-label="Permalink to &quot;**测试版本号**&quot;">​</a></h3><p>一般来说，alpha表示内部测试版，beta表示公开测试版，rc（Release Candidate）表示候选版本,experimental表示实验版本（可能有更多的bug)。</p><p><img src="'+e+'" alt="Untitled"></p><blockquote><p>Canary发布是一种降低在生产中引入新软件版本的风险的技术，方法是在将更改推广到整个基础设施并让每个人都能使用之前，将更改缓慢地推广到一小部分用户。</p></blockquote><p><img src="'+l+`" alt="Untitled"></p><h3 id="指定版本号" tabindex="-1">指定版本号 <a class="header-anchor" href="#指定版本号" aria-label="Permalink to &quot;指定版本号&quot;">​</a></h3><p>^ 表示只会执行不更改最左边非零数字的更新</p><blockquote><p>这意味着，如果你指定了 <strong><code>^1.2.3</code></strong>，那么可以安装任何 <strong><code>1.x.x</code></strong> 版本，但不包括 <strong><code>2.0.0</code></strong> 版本及以上具体而言，<strong><code>^0.1.2</code></strong> 允许安装以下范围的版本：大于等于 <strong><code>0.1.2</code></strong> 且小于 <strong><code>0.2.0</code></strong> 的版本，包括 <strong><code>0.1.2</code></strong>。例如，<strong><code>0.1.3</code></strong>、<strong><code>0.1.4</code></strong>、<strong><code>0.1.5</code></strong>，一直到 <strong><code>0.1.9999</code></strong> 都是允许的。但不包括 <strong><code>0.2.0</code></strong> 及以上的版本。</p></blockquote><p>~ 表示修订版本号的更新</p><blockquote><p>如果版本号是 <strong><code>~1.2.3</code></strong>，那么可以安装任何 <strong><code>1.2.x</code></strong> 版本，但不包括 <strong><code>1.3.0</code></strong> 及以上的版本</p></blockquote><p>还有一些其他的符号来指定版本范围 <a href="https://docs.npmjs.com/cli/v8/configuring-npm/package-json#dependencies" target="_blank" rel="noreferrer">npm Docs</a></p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;dependencies&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	//表示范围</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	&quot;foo&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;1.0.0 - 2.9999.9999&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	&quot;bar&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&gt;=1.0.2 &lt;2.1.2&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	&quot;baz&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&gt;1.0.2 &lt;=2.3.4&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	//精准要求</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	&quot;boo&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;2.0.1&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	//逻辑或</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	&quot;qux&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&lt;1.0.0 || &gt;=2.3.1 &lt;2.4.5 || &gt;=2.5.2 &lt;3.0.0&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	//指定从给定 URL 下载压缩包安装</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	&quot;asd&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;http://asdf.com/asdf.tar.gz&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">	[</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//允许1.2.x](notion://xn--1-l07a090p.2.x/)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	&quot;til&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;~1.2&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	&quot;elf&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;~1.2.3&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	//x代表任意</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	&quot;two&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;2.x&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	&quot;thr&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;3.3.x&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	//总是安装最新</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	&quot;lat&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;latest&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	//从本地路径安装</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	&quot;dyl&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;file:../dyl&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div>`,18)]))}const u=i(p,[["render",h]]);export{E as __pageData,u as default};
