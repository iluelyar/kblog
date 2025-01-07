const searchInput = $(".search-input");
const resultsList = $(".search-results");
let kleftdata = [];

// Fetch JSON data
fetch("/assets/json/kleft.json")
  .then((response) => response.json())
  .then((data) => (kleftdata = data));

function hk(text, keyword) {
  const k = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${k})`, "gi");
  return text.replace(regex, '<span class="highlight">$1</span>');
}

function toggle(show) {
  resultsList.style.display = show ? "grid" : "none";
}

function search() {
  const query = searchInput.value.replace(/\s+/g, " ").trim().toLowerCase();
  toggle(Boolean(query));
  resultsList.innerHTML = "";

  if (!query) return;

  const filteredPosts = kleftdata.filter(
    (post) =>
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query)
  );

  if (filteredPosts.length === 0) {
    const listItem = $$("li", "kcard");
    const message = $$("div", "", "", "没有找到内容!");
    listItem.append(message);
    resultsList.append(listItem);
  } else {
    filteredPosts.forEach((post) => {
      const listItem = $$("li", "card");
      const link = $$("a");
      const title = $$("div");
      const content = $$("div", "text");

      link.href = post.link;
      title.innerHTML = hk(post.title, query);
      content.innerHTML = hk(post.content, query);

      link.append(title, content);
      listItem.append(link);
      resultsList.append(listItem);
    });
  }
}

searchInput.addEventListener("input", search);