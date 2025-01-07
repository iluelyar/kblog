const hourHand = document.getElementById("hourHand");
const minuteHand = document.getElementById("minuteHand");
const secondHand = document.getElementById("secondHand");
function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  // 计算角度
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;
  // 旋转指针
  hourHand.setAttribute("transform", `rotate(${hourAngle})`);
  minuteHand.setAttribute("transform", `rotate(${minuteAngle})`);
  secondHand.setAttribute("transform", `rotate(${secondAngle})`);
}
setInterval(updateClock, 1000);
updateClock();
const ticks = document.getElementById("ticks");
for (let index = 0; index < 360; index += 6) {
  const angle = index * (Math.PI / 180);
  const x1 = Math.sin(angle) * 85;
  const y1 = Math.cos(angle) * 85;
  const x2 = Math.sin(angle) * (index % 30 === 0 ? 78 : 80);
  const y2 = Math.cos(angle) * (index % 30 === 0 ? 78 : 80);
  const line = document.createElementNS(svgNS, "line");
  line.setAttribute("x1", x1.toFixed(4));
  line.setAttribute("y1", y1.toFixed(4));
  line.setAttribute("x2", x2.toFixed(4));
  line.setAttribute("y2", y2.toFixed(4));
  line.setAttribute("stroke", index % 30 === 0 ? "#fff" : "#aaa");
  line.setAttribute("stroke-linecap", "round");
  line.setAttribute("stroke-width", index % 30 === 0 ? 2 : 1);
  ticks.appendChild(line);
}