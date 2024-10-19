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

  const li = $$("li");
  const a = $$("a");
  a.href = `#top`;
  a.textContent = "返回顶部";

  a.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
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
  iframeHTML,
  iframeCSS,
  iframeJS,
}) {
  var openBtns = document.createElement("div");
  openBtns.className = "openBtns";
  var codeBoxs = document.createElement("div");
  codeBoxs.className = "codeBoxs";
  let htmlText, cssText, jsText;

  // 创建 HTML 按钮
  if (showHTML) {
    var htmlDiv = document.createElement("div");
    htmlDiv.textContent = "HTML";
    openBtns.appendChild(htmlDiv);
  }

  // 创建 CSS 按钮
  if (showCSS) {
    var cssDiv = document.createElement("div");
    cssDiv.textContent = "CSS";
    openBtns.appendChild(cssDiv);
  }

  // 创建 JS 按钮
  if (showJS) {
    var jsDiv = document.createElement("div");
    jsDiv.textContent = "JS";
    openBtns.appendChild(jsDiv);
  }

  // 创建 HTML 代码框
  if (iframeHTML) {
    var htmlBox = document.createElement("div");
    htmlBox.className = "htmlBox";
    htmlText = data.html
      .map((line) => " ".repeat(Number(line.indent)) + line.value)
      .join("\n");

    htmlBox.innerHTML = `<pre><code class="language-html">${htmlText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
    codeBoxs.appendChild(htmlBox);

    if (htmlDiv) {
      htmlDiv.addEventListener("click", function () {
        htmlBox.style.display = htmlBox.style.display === "none" ? "block" : "none";
      });
    }

    Prism.highlightElement(htmlBox.querySelector("code"));
  }

  // 创建 CSS 代码框
  if (iframeCSS) {
    var cssBox = document.createElement("div");
    cssBox.className = "cssBox";
    cssText = data.css
      .map((line) => " ".repeat(Number(line.indent)) + line.value)
      .join("\n");

    cssBox.innerHTML = `<pre><code class="language-css">${cssText}</code></pre>`;
    codeBoxs.appendChild(cssBox);

    if (cssDiv) {
      cssDiv.addEventListener("click", function () {
        cssBox.style.display = cssBox.style.display === "none" ? "block" : "none";
      });
    }

    Prism.highlightElement(cssBox.querySelector("code"));
  }

  // 创建 JS 代码框
  if (iframeJS) {
    var jsBox = document.createElement("div");
    jsBox.className = "jsBox";
    jsText = data.js
      .map((line) => " ".repeat(Number(line.indent)) + line.value)
      .join("\n");

    jsBox.innerHTML = `<pre><code class="language-javascript">${jsText}</code></pre>`;
    codeBoxs.appendChild(jsBox);

    if (jsDiv) {
      jsDiv.addEventListener("click", function () {
        jsBox.style.display = jsBox.style.display === "none" ? "block" : "none";
      });
    }

    Prism.highlightElement(jsBox.querySelector("code"));
  }


  var previewBox = document.createElement("iframe");
  previewBox.className = "previewBox";
  codeBoxs.appendChild(previewBox);

  previewBox.onload = () => {
    updateContent(
      htmlText || '',
      cssText || '',
      jsText || '',
      previewBox
    );
  };

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
    iframeHTML: 1,
    iframeCSS: 1,
    iframeJS: 0,
  });

  section.appendChild(openBtns);
  section.appendChild(codeBoxs);
  $("#kmain").appendChild(section);
}

function updateContent(htmlContent, cssContent, jsContent, iframe) {
  const document = iframe.contentDocument || iframe.contentWindow.document;
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