function loadContentFromJSON(jsonFilePath) {
  fetch(jsonFilePath)
    .then((response) => response.json())
    .then((jsonData) => {
      var kmain = document.getElementById("kmain");
      var kright = document.getElementById("kright");

      // 处理顶级title
      if (jsonData.title) {
        var mainTitle = document.createElement("h1");
        mainTitle.innerText = jsonData.title;
        kmain.appendChild(mainTitle);
      }

      // 生成导航
      generateNav(jsonData.sections);

      // 处理每个section
      jsonData.sections.forEach(function (item) {
        createSection(item, kmain);
      });
    });
}

function generateNav(sections) {
  const nav = document.createElement("nav");
  const ul = document.createElement("ul");

  sections.forEach((section) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const id = section.name.replace(/[()]/g, "_");
    a.href = `#${id}`;
    a.textContent = section.name;
    a.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.getElementById(id);
      window.scrollTo({
        top: target.offsetTop - 10,
        behavior: "smooth",
      });
    });
    li.appendChild(a);
    ul.appendChild(li);
  });

  nav.appendChild(ul);
  kright.insertBefore(nav, kright.firstChild);
}

function createSection(data, parent) {
  var section = document.createElement("div");
  section.className = "section";

  if (data.name) {
    var name = document.createElement("h2");
    const id = data.name.replace(/[()]/g, "_"); // 替换括号为下划线
    name.id = id;
    name.innerText = data.name;
    section.appendChild(name);
  }

  if (data.description) {
    var description = document.createElement("p");
    description.innerText = data.description;
    section.appendChild(description);
  }

  if (data.html || data.css || data.js) {
    var openBtns = document.createElement("div");
    openBtns.className = "openBtns";
    openBtns.innerHTML = `
      <div>HTML</div>
      <div>CSS</div>
      <div>JS</div>`;

    var codeBoxs = document.createElement("div");
    codeBoxs.className = "codeBoxs";

    var htmlBox = document.createElement("div");
    var cssBox = document.createElement("div");
    var jsBox = document.createElement("div");
    htmlBox.className = "htmlBox";
    cssBox.className = "cssBox";
    jsBox.className = "jsBox";

    openBtns.children[0].addEventListener("click", function () {
      htmlBox.style.display =
        htmlBox.style.display === "none" ? "block" : "none";
    });
    openBtns.children[1].addEventListener("click", function () {
      cssBox.style.display =
        cssBox.style.display === "none" ? "block" : "none";
    });
    openBtns.children[2].addEventListener("click", function () {
      jsBox.style.display =
        jsBox.style.display === "none" ? "block" : "none";
    });

    var iframeBox = document.createElement("iframe");
    iframeBox.className = "iframeBox";

    codeBoxs.append(htmlBox, cssBox, jsBox, iframeBox);
    section.appendChild(openBtns);
    section.appendChild(codeBoxs);
    section.className = "kcode";

    htmlBox.innerText =
      data.html.map((line) => " ".repeat(Number(line.indent)) + line.value).join("\n");
    cssBox.innerText =
      data.css.map((line) => " ".repeat(Number(line.indent)) + line.value).join("\n");
    jsBox.innerText =
      data.js.map((line) => " ".repeat(Number(line.indent)) + line.value).join("\n");

    htmlBox.style.display = data.showHTML ? "block" : "none";
    cssBox.style.display = data.showCSS ? "block" : "none";
    jsBox.style.display = data.showJS ? "block" : "none";

    updateIframe(
      htmlBox.innerText,
      cssBox.innerText,
      jsBox.innerText,
      iframeBox
    );
  }

  parent.appendChild(section);
}

function updateIframe(htmlContent, cssContent, jsContent, iframeBox) {
  var iframeContent = `<!DOCTYPE html>
    <html lang="zh">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }
          ::-webkit-scrollbar-track {
            background: #eee; /* 滚动条轨道颜色 */
          }
          ::-webkit-scrollbar-thumb {
            background: #aaa; /* 滚动条滑块颜色 */
            border-radius: 5px; /* 滚动条滑块圆角 */
          }
          /* 应用传入的自定义样式 */
          ${cssContent}
        </style>
      </head>
      <body>
        ${htmlContent}
        <script>
          ${jsContent}
        <\/script>
      </body>
    </html>`;
  iframeBox.srcdoc = iframeContent;
}