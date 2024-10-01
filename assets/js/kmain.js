function $(selector) {
  return document.querySelector(selector);
}

function loadContentFromJSON(jsonFilePath) {
  fetch(jsonFilePath)
    .then((response) => response.json())
    .then((jsonData) => {
      if (jsonData.title) {
        var mainTitle = document.createElement('h1');
        mainTitle.innerText = jsonData.title;
        $('#kmain').appendChild(mainTitle);
      }
      generateNav(jsonData.sections);
      jsonData.sections.forEach(function (item) {
        createSection(item, kmain);
      });
    });
}

function generateNav(sections) {
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

  $('#kright').append(ul);
}

function createSection(data, parent) {
  var section = document.createElement("div");
  section.className = "section";

  if (data.name) {
    var name = document.createElement("h2");
    const id = data.name.replace(/[()]/g, "_");
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

    const htmlDiv = document.createElement('div');
    htmlDiv.textContent = 'HTML';
    const cssDiv = document.createElement('div');
    cssDiv.textContent = 'CSS';
    const jsDiv = document.createElement('div');
    jsDiv.textContent = 'JS';
    const previewDiv = document.createElement('div');
    previewDiv.textContent = 'Preview';

    openBtns.append(htmlDiv, cssDiv, jsDiv, previewDiv);

    var codeBoxs = document.createElement("div");
    codeBoxs.className = "codeBoxs";

    var htmlBox = document.createElement("div");
    var cssBox = document.createElement("div");
    var jsBox = document.createElement("div");
    htmlBox.className = "htmlBox";
    htmlBox.setAttribute('contenteditable', 'true');
    cssBox.className = "cssBox";
    cssBox.setAttribute('contenteditable', 'true');
    jsBox.className = "jsBox";
    jsBox.setAttribute('contenteditable', 'true');

    htmlDiv.addEventListener("click", function () {
      htmlBox.style.display = htmlBox.style.display === "none" ? "block" : "none";
    });
    cssDiv.addEventListener("click", function () {
      cssBox.style.display = cssBox.style.display === "none" ? "block" : "none";
    });
    jsDiv.addEventListener("click", function () {
      jsBox.style.display = jsBox.style.display === "none" ? "block" : "none";
    });

    var previewBox = document.createElement("iframe");
    previewBox.className = "previewBox";

    codeBoxs.append(htmlBox, cssBox, jsBox, previewBox);
    section.appendChild(openBtns);
    section.appendChild(codeBoxs);
    section.className = "kcode";

    htmlBox.innerHTML = `<pre><code class="language-html">${data.html.map(line => " ".repeat(Number(line.indent)) + line.value).join("\n").replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    cssBox.innerHTML = `<pre><code class="language-css">${data.css.map(line => " ".repeat(Number(line.indent)) + line.value).join("\n")}</code></pre>`;
    jsBox.innerHTML = `<pre><code class="language-javascript">${data.js.map(line => " ".repeat(Number(line.indent)) + line.value).join("\n")}</code></pre>`;

    htmlBox.style.display = data.showHTML ? "block" : "none";
    cssBox.style.display = data.showCSS ? "block" : "none";
    jsBox.style.display = data.showJS ? "block" : "none";

    previewDiv.addEventListener("click", () => {
      updateContent(htmlBox.innerText, cssBox.innerText, jsBox.innerText, previewBox);
      Prism.highlightAll();
    });

    previewBox.onload = () => {
      updateContent(htmlBox.innerText, cssBox.innerText, jsBox.innerText, previewBox);
      Prism.highlightAll();
    };
  }
  parent.appendChild(section);
}

function updateContent(htmlContent, cssContent, jsContent, iframe) {
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(`
      <html>
        <head>
          <style>
            ${cssContent}
            ::-webkit-scrollbar {
              width: 5px;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
          <script>${jsContent}<\/script>
        </body>
      </html>
    `);
  iframeDoc.close();
}

// htmlBoxHTML = `<pre><code class="language-html">${data.html.map((line) => " ".repeat(Number(line.indent)) + line.value).join("\n")}</code></pre>`;
// cssBoxHTML = `<pre><code class="language-css">${data.css.map((line) => " ".repeat(Number(line.indent)) + line.value).join("\n")}</code></pre>`;
// jsBoxHTML = `<pre><code class="language-javascript">${data.js.map((line) => " ".repeat(Number(line.indent)) + line.value).join("\n")}</code></pre>`;
// console.log(htmlBoxHTML);