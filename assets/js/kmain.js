const $ = (selector) => document.querySelector(selector);
const $$ = (tagname, classname, idname) => {
    const element = document.createElement(tagname);
    if (classname) {
        element.className = classname;
    }
    if (idname) {
        element.id = idname;
    }
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

function generateNav() {
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

    kmainData.sections.forEach((section) => {
        const li = $$("li");
        const a = $$("a");
        const id = section.name;
        a.href = `#${id}`;
        a.textContent = section.name;

        // 添加平滑滚动的事件
        a.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.getElementById(id);
            window.scrollTo({
                top: target.offsetTop - 8,
                behavior: "smooth",
            });
        });

        li.appendChild(a);
        ul.appendChild(li);
    });

    $('#kright').append(ul);
}

function createName(data, section) {
    if (data.name) {
        var name = $$("h2");
        const id = data.name;
        name.id = id;
        name.innerText = data.name;
        section.appendChild(name);
    }
}

function createDescription(data, section) {
    if (data.description) {
        var description = $$("p");
        description.innerText = data.description;
        section.appendChild(description);
    }
}

function createCodeDivs(data) {
    var openBtns = $$("div", "openBtns");
    var codeBoxs = $$("div", "codeBoxs");
    var previewBox = $$("iframe", "previewBox");

    const languageMap = {
        html: 'HTML',
        css: 'CSS',
        js: 'JavaScript',
        vue: 'Vue',
        nodejs: 'Node.js',
        svg: 'SVG'
    };

    Object.keys(data).forEach((lang) => {
        if (data[lang].show) {
            let codeText = data[lang].code.map((line) =>
                " ".repeat(Number(line.indent)) + line.value
            ).join("\n");

            // 创建按钮
            let langDiv = $$("div");
            langDiv.textContent = languageMap[lang] || lang.toUpperCase();
            openBtns.appendChild(langDiv);

            // 创建代码展示框
            let langBox = $$("div", `${lang}Box`);
            langBox.setAttribute('data-lang', languageMap[lang] || lang.toUpperCase());

            if (lang === 'vue') {
                lang = 'js'; // 将 lang 设置为 js
            }

            langBox.innerHTML = `<pre><code class="language-${lang}">${codeText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
            codeBoxs.appendChild(langBox);

            langDiv.addEventListener("click", function () {
                langBox.style.display = langBox.style.display === "none" ? "block" : "none";
            });

            Prism.highlightElement(langBox.querySelector("code"));
        }
    });

    previewBox.onload = () => {
        let codes = {};

        // 处理各类型代码
        Object.keys(data).forEach(key => {
            // 检查当前类型是否存在且需要使用
            if (data[key] && data[key].use) {
                // 初始化该类型的代码内容
                codes[key] = data[key].code.map(line =>
                    " ".repeat(Number(line.indent)) + line.value
                ).join("\n");
            }
        });

        const { html, css, js, vue } = codes;

        // 如果有 Vue 代码，优先运行 updateVue
        if (vue) {
            updateVue(html || '', vue, css || '', previewBox);
        } else if (html) {
            // 根据不同的情况调用 updateContent
            if (css && js) {
                updateContent(html, css, js, previewBox); // 有 HTML, CSS, JS
            } else if (css) {
                updateContent(html, css, '', previewBox); // 有 HTML, CSS
            } else if (js) {
                updateContent(html, '', js, previewBox); // 有 HTML, JS
            } else {
                updateContent(html, '', '', previewBox); // 只有 HTML
            }
        }
    };

    codeBoxs.appendChild(previewBox);
    return { openBtns, codeBoxs };
}

function updateVue(vueTemplate, vueScript, vueStyle, iframe) {
    let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
            <style>
                body {
                    color: #fff;
                }
                ::-webkit-scrollbar {
                    display: none;
                }
                body::-webkit-scrollbar {
                    width: 4px;
                    height: 4px;
                    display: block;
                }
                body::-webkit-scrollbar-track {
                    background: #fff2;
                    border-radius: 10px;
                }
                body::-webkit-scrollbar-thumb {
                    background: #fff5;
                    border-radius: 10px;
                }
                body::-webkit-scrollbar-corner {
                    background-color: #0000;
                }
                ${vueStyle}
            </style>
        </head>
        <body>
            ${vueTemplate}
            <script>${vueScript}<\/script>
        </body>
        </html>
    `);
    iframeDoc.close();
}

function updateContent(html, css, js, iframe) {
    let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <style>
                body {
                    color: #fff;
                }
                ::-webkit-scrollbar {
                    display: none;
                }
                body::-webkit-scrollbar {
                    width: 4px;
                    height: 4px;
                    display: block;
                }
                body::-webkit-scrollbar-track {
                    background: #fff2;
                    border-radius: 10px;
                }
                body::-webkit-scrollbar-thumb {
                    background: #fff5;
                    border-radius: 10px;
                }
                body::-webkit-scrollbar-corner {
                    background-color: #0000;
                }
                ${css}
            </style>
        </head>
        <body>
            ${html}
            <script>${js}<\/script>
        </body>
        </html>
    `);
    iframeDoc.close();
}

function createSection(data) {
    var section = $$("div", "kcode");

    createName(data, section);
    createDescription(data, section);
    const { openBtns, codeBoxs } = createCodeDivs(data);

    section.appendChild(openBtns);
    section.appendChild(codeBoxs);

    $("#kmain").appendChild(section);

    const codeElements = document.querySelectorAll(".codeBoxs code");

    $("#wrapSwitch").addEventListener("change", function () {
        const codeElements = document.querySelectorAll(".kcode code");
        codeElements.forEach(codeElement => {
            codeElement.classList.toggle("wrap", this.checked);
        });
    });
}
