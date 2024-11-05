const svgNS = "http://www.w3.org/2000/svg";
let coordinates = [];
function toPI(degrees) {
  return degrees * (Math.PI / 180);
}
function coordinate(firstAngle, changeAngle, offsetAngle, R, r, dis) {
  const x1 = Math.cos(toPI(firstAngle)) * (R - r);
  const y1 = Math.sin(toPI(firstAngle)) * (R - r);
  const x2 = Math.cos(toPI(firstAngle + offsetAngle)) * R;
  const y2 = Math.sin(toPI(firstAngle + offsetAngle)) * R;
  const x3 = Math.cos(toPI(firstAngle + changeAngle - offsetAngle)) * R;
  const y3 = Math.sin(toPI(firstAngle + changeAngle - offsetAngle)) * R;
  const x4 = Math.cos(toPI(firstAngle + changeAngle)) * (R - r);
  const y4 = Math.sin(toPI(firstAngle + changeAngle)) * (R - r);
  const x5 = Math.cos(toPI(firstAngle + changeAngle / 2)) * (R + dis);
  const y5 = Math.sin(toPI(firstAngle + changeAngle / 2)) * (R + dis);
  return { x1, y1, x2, y2, x3, y3, x4, y4, x5, y5 };
}
function generatePolarChart(config) {
  const { target, R, r, dis, rotate, strokeC, strokeWidth, values, colors } =
    config;
  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("stroke", strokeC);
  path.setAttribute("stroke-width", strokeWidth);
  const totalValue = values.reduce((sum, val) => sum + val, 0);
  const changeAngles = values.map((val) => (val / totalValue) * 360);
  let firstAngle = rotate;
  const offsetAngle = Math.atan(r / (R - r)) * (180 / Math.PI);
  coordinates = [];
  changeAngles.forEach((changeAngle, index) => {
    const { x1, y1, x2, y2, x3, y3, x4, y4, x5, y5 } = coordinate(
      firstAngle,
      changeAngle,
      offsetAngle,
      R,
      r,
      dis
    );
    coordinates.push({ x5, y5 });
    const flag = changeAngle > 180 ? 1 : 0;
    let d = `M0 0 L${x1} ${y1} `;
    d += `A${r} ${r} 0 0 1 ${x2} ${y2} `;
    d += `A${R} ${R} 0 ${flag} 1 ${x3} ${y3} `;
    d += `A${r} ${r} 0 0 1 ${x4} ${y4} Z`;
    const segment = document.createElementNS(svgNS, "path");
    segment.setAttribute("d", d);
    segment.setAttribute("fill", colors[index]);
    segment.setAttribute("stroke", strokeC);
    segment.setAttribute("stroke-width", strokeWidth);
    document.querySelector(target).appendChild(segment);
    firstAngle += changeAngle;
  });
}
function generatePolarLines(config) {
  const { target, strokeWidth, colors } = config;
  coordinates.forEach(({ x5, y5 }, index) => {
    const dx = x5 > 0 ? 20 : -20;
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", colors[index]);
    path.setAttribute("stroke-width", strokeWidth);
    path.setAttribute("d", `M${x5 / 1.2} ${y5 / 1.2} L${x5} ${y5} h${dx}`);
    document.querySelector(target).appendChild(path);
  });
}
function generatePolarText(config) {
  const { target, fontSize, colors, content } = config;
  content.forEach((text, index) => {
    const { x5, y5 } = coordinates[index];
    const dx = x5 > 0 ? 20 : -20;
    const textElem = document.createElementNS(svgNS, "text");
    textElem.setAttribute("x", x5 + dx);
    textElem.setAttribute("y", y5);
    textElem.setAttribute("font-size", fontSize);
    textElem.setAttribute("text-anchor", x5 >= 0 ? "end" : "start");
    textElem.setAttribute("alignment-baseline", "after-edge");
    textElem.setAttribute("fill", colors[index]);
    textElem.textContent = text;
    document.querySelector(target).appendChild(textElem);
  });
}
function generatePolar(config) {
  generatePolarChart(config);
  generatePolarLines(config);
  generatePolarText(config);
}