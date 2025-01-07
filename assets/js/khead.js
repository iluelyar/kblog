document.addEventListener("DOMContentLoaded", function () {
  fetch("/assets/json/khead.json")
    .then((response) => response.json())
    .then((data) => {
      createHeader(data.home);
      drop(data.home);
    });

  let [a, b] = format();
  let [c, d] = format();

  function createHeader(homeData) {
    const kheader = $("#kheader");

    const headerNav = $$("div", "header-nav");
    const headerData = $$("div", "header-data");
    const headerDataTime = $$("div", "header-data-time");
    const headerDataModified = $$("div", "header-data-modified");

    const homeItem = $$("div", "header-nav-item");
    homeItem.innerText = homeData.title;
    homeItem.onclick = () => (window.location.href = "/");
    headerNav.appendChild(homeItem);

    const turn1 = createTurn("turnIcon1");
    const turn2 = createTurn("turnIcon2");
    headerNav.append(
      turn1,
      $$("div", "header-nav-item"),
      turn2,
      $$("div", "header-nav-item")
    );

    headerData.append(headerDataTime, headerDataModified);
    kheader.append(headerNav, headerData);
  }

  function createTurn(turnIconId) {
    const turnContainer = $$("div", "header-nav-turn");
    const turnIcon = $$("div", "turn-icon", turnIconId);
    const iconImage = $$("img");
    iconImage.src = "/assets/icon/turnIcon.svg";
    turnIcon.appendChild(iconImage);
    turnContainer.append(turnIcon, $$("div", "turn-result"));
    return turnContainer;
  }

  function drop(homeData) {
    const turnIcon1 = $("#turnIcon1");
    const turnIcon2 = $("#turnIcon2");
    const turnResults1 = document.querySelectorAll(".turn-result")[0];
    const turnResults2 = document.querySelectorAll(".turn-result")[1];
    const headerNavItem2 = document.querySelectorAll(".header-nav-item")[1];
    const headerNavItem3 = document.querySelectorAll(".header-nav-item")[2];
    const headerDataTime = $(".header-data-time");
    const headerDataModified = $(".header-data-modified");

    function navItem(a, b) {
      turnResults1.innerHTML = "";
      turnResults2.innerHTML = "";

      homeData.items.forEach((item, index) => {
        const turnItem = $$("div", "turn-item", "", item.title);
        turnItem.dataset.index = index;
        turnResults1.appendChild(turnItem);
      });

      homeData.items[a].items.forEach((item, subIndex) => {
        const turnItem1 = $$("div", "turn-item1", "", item.title);
        turnItem1.dataset.index = subIndex;
        turnResults2.appendChild(turnItem1);
      });

      headerNavItem2.innerText = homeData.items[a].title;
      headerNavItem3.innerText = homeData.items[a].items[b].title;
      headerDataTime.innerText =
        "时间: " + homeData.items[a].items[b].data.time;
      headerDataModified.innerText =
        "修改时间: " + homeData.items[a].items[b].data.modified;
    }

    navItem(a, b);

    turnResults1.addEventListener("click", function (event) {
      if (event.target.classList.contains("turn-item")) {
        a = event.target.getAttribute("data-index");
        navItem(a, 0);
        turnResults1.style.display = "none";
        turnResults2.style.display = "block";
        toggleIcon(turnIcon1, false);
        toggleIcon(turnIcon2, true);
      }
    });

    turnResults2.addEventListener("click", function (event) {
      if (event.target.classList.contains("turn-item1")) {
        b = event.target.getAttribute("data-index");
        navItem(a, b);
        headerNavItem3.innerText = homeData.items[a].items[b].title;
        window.location.href = homeData.items[a].items[b].url;
        turnResults2.style.display = "none";
        toggleIcon(turnIcon2, false);
      }
    });

    turnIcon1.addEventListener("click", () => {
      toggleDisplay(turnResults1);
      turnResults2.style.display = "none";
      toggleIcon(turnIcon1);
      turnIcon2.style.transform = "rotateZ(0deg)";
    });

    turnIcon2.addEventListener("click", () => {
      navItem(c, d);
      toggleDisplay(turnResults2);
      turnResults1.style.display = "none";
      toggleIcon(turnIcon2);
      turnIcon1.style.transform = "rotateZ(0deg)";
    });
  }

  function toggleDisplay(element) {
    element.style.display =
      element.style.display === "block" ? "none" : "block";
  }

  function toggleIcon(icon, rotate = false) {
    icon.style.transform = rotate
      ? "rotateZ(90deg)"
      : icon.style.transform === "rotateZ(90deg)"
      ? "rotateZ(0deg)"
      : "rotateZ(90deg)";
  }
});
