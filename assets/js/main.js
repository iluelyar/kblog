const $ = (selector) => document.querySelector(selector);
const $$ = (tagname, classname, idname) => {
  const element = document.createElement(tagname);
  if (classname) { element.className = classname; }
  if (idname) { element.id = idname; }
  return element;
};

let kmainData = {};

async function loadContentFromJSON(jsonFilePath) {
  const response = await fetch(jsonFilePath);
  const data = await response.json();
  kmainData = data;
  return kmainData;
}

function generateTitle() {
  const title = $$('h1')
  title.innerText = kmainData.title;
  $('#kmain').appendChild(title);
}

function generateNav(sections) {
  const ul = $$("ul");

  // 创建返回顶部的链接
  const li = $$("li");
  const a = $$("a");
  a.href = `#top`;
  a.textContent = "返回顶部";

  a.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0, // 设置为0以平滑滚动到顶部
      behavior: "smooth", // 平滑滚动
    });
  });

  li.appendChild(a);
  ul.appendChild(li);

  // 先获取需要的部分数据
  const selectedSections = sections.map(index => kmainData.sections[index]).filter(section => section);

  selectedSections.forEach((section) => {
    const li = $$("li");
    const a = $$("a");
    const id = section.name.replace(/[()]/g, "");
    a.href = `#${id}`;
    a.textContent = section.name;

    // 添加平滑滚动的事件
    a.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.getElementById(id);
      window.scrollTo({
        top: target.offsetTop - 8, // 目标元素的偏移量
        behavior: "smooth", // 平滑滚动
      });
    });

    li.appendChild(a);
    ul.appendChild(li);
  });

  // 将生成的导航列表添加到右侧面板
  $('#kright').append(ul);
}

function createName(data, section) {
  if (data.name) {
    var name = document.createElement("h2");
    const id = data.name.replace(/[()]/g, "");
    name.id = id;
    name.innerText = data.name;
    section.appendChild(name);
  }
}

function createDescription(data, section) {
  if (data.description) {
    var description = document.createElement("p");
    description.innerText = data.description;
    section.appendChild(description);
  }
}

function createCodeDivs({
  data,
  showHTML,
  showCSS,
  showJS,
  showPreview,
  iframeHTML,
  iframeCSS,
  iframeJS,
}) {
  // 检查传入的 data 是否有效
  if (!data) {
    console.error("Missing 'data' object");
    return;
  }

  // 创建 openBtns 容器
  var openBtns = document.createElement("div");
  openBtns.className = "openBtns";

  // 定义按钮变量
  let htmlDiv, cssDiv, jsDiv, previewDiv;

  // 根据条件创建 HTML 按钮
  if (showHTML) {
    htmlDiv = document.createElement("div");
    htmlDiv.textContent = "HTML";
    openBtns.appendChild(htmlDiv);
  }

  // 根据条件创建 CSS 按钮
  if (showCSS) {
    cssDiv = document.createElement("div");
    cssDiv.textContent = "CSS";
    openBtns.appendChild(cssDiv);
  }

  // 根据条件创建 JS 按钮
  if (showJS) {
    jsDiv = document.createElement("div");
    jsDiv.textContent = "JS";
    openBtns.appendChild(jsDiv);
  }

  // 根据条件创建 Preview 按钮
  if (showPreview) {
    previewDiv = document.createElement("div");
    previewDiv.textContent = "Preview";
    openBtns.appendChild(previewDiv);
  }

  // 创建 codeBoxs 容器
  var codeBoxs = document.createElement("div");
  codeBoxs.className = "codeBoxs";

  // 创建 HTML Box 并添加内容
  var htmlBox, cssBox, jsBox;

  if (iframeHTML) {
    htmlBox = document.createElement("div");
    htmlBox.className = "htmlBox";
    htmlBox.setAttribute("contenteditable", "true");
    htmlBox.innerHTML = `<pre><code class="language-html">${data.html
      .map((line) => " ".repeat(Number(line.indent)) + line.value)
      .join("\n")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")}</code></pre>`;
    codeBoxs.appendChild(htmlBox);
  }

  // HTML 按钮点击事件
  if (htmlDiv) {
    htmlDiv.addEventListener("click", function () {
      htmlBox.style.display = htmlBox.style.display === "none" ? "block" : "none";
      Prism.highlightAll(); // 高亮显示
    });
  }

  // 创建 CSS Box 并添加内容
  if (iframeCSS) {
    cssBox = document.createElement("div");
    cssBox.className = "cssBox";
    cssBox.setAttribute("contenteditable", "true");
    cssBox.innerHTML = `<pre><code class="language-css">${data.css
      .map((line) => " ".repeat(Number(line.indent)) + line.value)
      .join("\n")}</code></pre>`;
    codeBoxs.appendChild(cssBox);
  }

  // CSS 按钮点击事件
  if (cssDiv) {
    cssDiv.addEventListener("click", function () {
      cssBox.style.display = cssBox.style.display === "none" ? "block" : "none";
      Prism.highlightAll(); // 高亮显示
    });
  }

  // 创建 JS Box 并添加内容
  if (iframeJS) {
    jsBox = document.createElement("div");
    jsBox.className = "jsBox";
    jsBox.setAttribute("contenteditable", "true");
    jsBox.innerHTML = `<pre><code class="language-javascript">${data.js
      .map((line) => " ".repeat(Number(line.indent)) + line.value)
      .join("\n")}</code></pre>`;
    codeBoxs.appendChild(jsBox);
  }

  // JS 按钮点击事件
  if (jsDiv) {
    jsDiv.addEventListener("click", function () {
      jsBox.style.display = jsBox.style.display === "none" ? "block" : "none";
      Prism.highlightAll(); // 高亮显示
    });
  }

  // 创建 Preview Box
  var previewBox = document.createElement("iframe");
  previewBox.className = "previewBox";
  codeBoxs.appendChild(previewBox);

  // Preview 按钮点击事件：更新 iframe 中的内容
  
  previewDiv.addEventListener("click", () => {
    updateContent(htmlBox.innerText, cssBox.innerText, jsBox ? jsBox.innerText : "", previewBox);
    Prism.highlightAll(); // 高亮显示
  });

  // 当 iframe 加载时，更新内容并高亮代码
  
  previewBox.onload = () => {
    updateContent(htmlBox.innerText, cssBox.innerText, jsBox ? jsBox.innerText : "", previewBox);
    Prism.highlightAll();
  };

  // 返回 openBtns 和 codeBoxs，供外部使用
  return { openBtns, codeBoxs };
}

function createSection(data) {
  var section = document.createElement("div");
  section.className = "kcode";

  // 调用 createName 函数来创建名称
  createName(data, section);

  // 调用 createDescription 函数来创建描述
  createDescription(data, section);

  // 调用 createCodeDivs 函数创建按钮和代码框
  const { openBtns, codeBoxs } = createCodeDivs({
    data: data,
    showHTML: 1,
    showCSS: 1,
    showJS: 0,
    showPreview: 1,
    iframeHTML: 1,
    iframeCSS: 1,
    iframeJS: 0,
  });

  // 将按钮和代码框添加到 section 中
  section.appendChild(openBtns);
  section.appendChild(codeBoxs);

  // 将 section 添加到页面中
  document.getElementById("kmain").appendChild(section);
}

// 用于更新 iframe 内容的函数
function updateContent(htmlContent, cssContent, jsContent, iframe) {
  const document = iframe.contentDocument;
  document.open();
  document.write(`
    <html>
      <head>
        <style>${cssContent}</style>
      </head>
      <body>
        ${htmlContent}
        <script>${jsContent}</script>
      </body>
    </html>
  `);
  document.close();
}

// 根据索引创建部分
function createSectionsByIndices(indices) {
  indices.forEach(index => {
    if (index >= 0 && index < kmainData.sections.length) {
      createSection(kmainData.sections[index]);
    } else {
      console.error(`Section at index ${index} does not exist.`);
    }
  });
}