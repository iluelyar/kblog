const $ = (selector) => document.querySelector(selector);
const $$ = (tagname, classname, idname, content) => {
  const element = document.createElement(tagname);
  if (classname) element.className = classname;
  if (idname) element.id = idname;
  if (content) element.innerText = content;
  return element;
};

$(".kcontrols-left").addEventListener("click", () => {
  if (
    $(".kleft-container").style.left === "-300px" ||
    $(".kleft-container").style.left === ""
  ) {
    $(".kleft-container").style.left = "8px";
    $(".kright-container").style.right = "-300px";
  } else {
    $(".kleft-container").style.left = "-300px";
  }
});

$(".kcontrols-right").addEventListener("click", () => {
  if (
    $(".kright-container").style.right === "-300px" ||
    $(".kright-container").style.right === ""
  ) {
    $(".kright-container").style.right = "8px";
    $(".kleft-container").style.left = "-300px";
  } else {
    $(".kright-container").style.right = "-300px";
  }
});

$(".author-avatar").addEventListener("click", () => {
  window.location.href = "/";
});