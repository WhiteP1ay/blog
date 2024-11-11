import{_ as a,c as t,a0 as n,o as e}from"./chunks/framework.Dsvon-85.js";const d=JSON.parse('{"title":"scripts","description":"","frontmatter":{},"headers":[],"relativePath":"tech/package_json/scripts.md","filePath":"tech/package_json/scripts.md"}'),p={name:"tech/package_json/scripts.md"};function i(o,s,r,l,c,h){return e(),t("div",null,s[0]||(s[0]=[n(`<h1 id="scripts" tabindex="-1">scripts <a class="header-anchor" href="#scripts" aria-label="Permalink to &quot;scripts&quot;">​</a></h1><p>&quot;scripts&quot; 属性是一个包含在您的包的生命周期中在各个时刻运行的脚本命令的字典。键是生命周期事件，值是在该时刻运行的命令。</p><p>一般我们会把项目常用的脚本也写到该字段</p><h3 id="_6-1-前置、后置脚本" tabindex="-1">6.1 前置、后置脚本 <a class="header-anchor" href="#_6-1-前置、后置脚本" aria-label="Permalink to &quot;6.1 前置、后置脚本&quot;">​</a></h3><p>如果需要创建前置或后置脚本，只需创建另一个脚本，名称与之匹配，并在它们的开头添加 &quot;pre&quot; 或 &quot;post&quot;。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;scripts&quot;: {</span></span>
<span class="line"><span>    &quot;precompress&quot;: &quot;{{ executes BEFORE the \`compress\` script }}&quot;,</span></span>
<span class="line"><span>    &quot;compress&quot;: &quot;{{ run command to compress files }}&quot;,</span></span>
<span class="line"><span>    &quot;postcompress&quot;: &quot;{{ executes AFTER \`compress\` script }}&quot;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在该例子中 npm run compress 将执行三个脚本。</p><h3 id="_6-2-生命周期脚本" tabindex="-1">6.2 生命周期脚本 <a class="header-anchor" href="#_6-2-生命周期脚本" aria-label="Permalink to &quot;6.2 生命周期脚本&quot;">​</a></h3><ul><li>常用的是 prepare，例如用于husky，在本地npm install时会运行（不带任何参数) ，用于注入git hooks。</li><li>还有<strong>prepublish</strong>、<strong>prepublishOnly、prepack</strong>等等，我用的不多，具体参考<a href="https://docs.npmjs.com/cli/v10/using-npm/scripts" target="_blank" rel="noreferrer">npm Docs</a></li></ul><h3 id="_6-3-bin" tabindex="-1">6.3 bin <a class="header-anchor" href="#_6-3-bin" aria-label="Permalink to &quot;6.3 bin&quot;">​</a></h3><p>用于指定一些可执行文件的路径，使得这些文件可以在全局环境下直接运行。</p><div class="language-tsx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//create-react-app的bin</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;bin&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;create-react-app&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./index.js&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span></code></pre></div>`,12)]))}const k=a(p,[["render",i]]);export{d as __pageData,k as default};
