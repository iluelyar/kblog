document.addEventListener("DOMContentLoaded", function () {
  fetch("/assets/json/link.json")
    .then((response) => response.json())
    .then((data) => {
      createKHeader(data.Home);
      addDropdownEventListeners(data.Home);
    });

  var result = headerIndex(index1, index2);
  var index1 = result[0];
  var index2 = result[1];
  function createKHeader(homeData) {
    const kheader = document.getElementById("kheader");
    kheader.innerHTML = `
        <div class="header-nav">
            <div class="header-nav-item" onclick="window.location.href= '/'">
                ${homeData.title}
            </div>
            <div class="header-nav-turn">
                <div class="turn-icon" id="turnIcon1">
                    <img src="/assets/icon/turnIcon.svg" alt="" />
                </div>
                <div class="turn-result"></div>
            </div>
            <div class="header-nav-item"></div>
            <div class="header-nav-turn">
                <div class="turn-icon" id="turnIcon2">
                    <img src="/assets/icon/turnIcon.svg" alt="" />
                </div>
                <div class="turn-result"></div>
            </div>
            <div class="header-nav-item"></div>
        </div>
        <div class="header-data">
            <div class="header-data-time"></div>
            <div class="header-data-modified"></div>
        </div>`;
  }

  function addDropdownEventListeners(homeData) {
    const turnIcon1 = document.getElementById("turnIcon1");
    const turnIcon2 = document.getElementById("turnIcon2");
    const turnResults1 = document.querySelectorAll(".turn-result")[0];
    const turnResults2 = document.querySelectorAll(".turn-result")[1];
    const headerNavItem2 = document.querySelectorAll(".header-nav-item")[1];
    const headerNavItem3 = document.querySelectorAll(".header-nav-item")[2];
    const headerDataTime = document.querySelector(".header-data-time");
    const headerDataModified = document.querySelector(".header-data-modified");
    function navItem(index1, index2) {
      turnResults1.innerHTML = "";
      turnResults2.innerHTML = "";

      homeData.items.forEach((item, index) => {
        turnResults1.innerHTML += `<div class="turn-item" data-index="${index}">${item.title}</div>`;
      });

      homeData.items[index1].items.forEach((item, subIndex) => {
        turnResults2.innerHTML += `<div class="turn-item1" data-index="${subIndex}">${item.title}</div>`;
      });

      headerNavItem2.innerHTML = homeData.items[index1].title;
      headerNavItem3.innerHTML = homeData.items[index1].items[index2].title;
      headerDataTime.innerHTML =
        "时间: " + homeData.items[index1].items[index2].data.time;
      headerDataModified.innerHTML =
        "修改时间: " + homeData.items[index1].items[index2].data.modified;
    }

    navItem(index1, index2);

    turnResults1.addEventListener("click", function (event) {
      if (event.target.classList.contains("turn-item")) {
        index1 = event.target.getAttribute("data-index");
        navItem(index1, 0);
        turnResults1.style.display = "none";
        turnResults2.style.display = "block";
        turnIcon1.style.transform =
          turnIcon1.style.transform === "rotateZ(90deg)"
            ? "rotateZ(0deg)"
            : "rotateZ(90deg)";
        turnIcon2.style.transform = "rotateZ(90deg)";
      }
    });

    turnResults2.addEventListener("click", function (event) {
      if (event.target.classList.contains("turn-item1")) {
        index2 = event.target.getAttribute("data-index");
        navItem(index1, index2);
        headerNavItem3.innerHTML = homeData.items[index1].items[index2].title;
        window.location.href = homeData.items[index1].items[index2].url;
      }
    });

    turnIcon1.addEventListener("click", () => {
      turnResults1.style.display =
        turnResults1.style.display === "block" ? "none" : "block";
      turnResults2.style.display = "none";
      turnIcon1.style.transform =
        turnIcon1.style.transform === "rotateZ(90deg)"
          ? "rotateZ(0deg)"
          : "rotateZ(90deg)";
      turnIcon2.style.transform = "rotateZ(0deg)";
    });

    turnIcon2.addEventListener("click", () => {
      turnResults2.style.display =
        turnResults2.style.display === "block" ? "none" : "block";
      turnResults1.style.display = "none";
      turnIcon2.style.transform =
        turnIcon2.style.transform === "rotateZ(90deg)"
          ? "rotateZ(0deg)"
          : "rotateZ(90deg)";
      turnIcon1.style.transform = "rotateZ(0deg)";
    });
  }
});
