import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

const outputDir = join(process.cwd(), "public/assets/equipment/items");
mkdirSync(outputDir, { recursive: true });

const colors = {
  gold: ["#ffe38a", "#d68b28"],
  red: ["#ff7b65", "#9a203e"],
  green: ["#8ff0b0", "#177c62"],
  blue: ["#87dfff", "#2869bb"],
  violet: ["#d4a7ff", "#7141b5"],
  rose: ["#ffacd7", "#b64777"],
  teal: ["#76f0df", "#21869d"],
};

function sparkle(x, y, size = 24, color = "#ffe49a") {
  return `<path d="M ${x} ${y - size} L ${x + size * .2} ${y - size * .2} L ${x + size} ${y} L ${x + size * .2} ${y + size * .2} L ${x} ${y + size} L ${x - size * .2} ${y + size * .2} L ${x - size} ${y} L ${x - size * .2} ${y - size * .2} Z" fill="${color}" opacity=".88" filter="url(#glow)"/>`;
}

function wrap(inner, accent = "#e8b65b", secondary = "#6dc7e8") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1120" height="1400" viewBox="0 0 1120 1400">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#071220"/><stop offset=".55" stop-color="#10263a"/><stop offset="1" stop-color="#050b13"/></linearGradient>
    <radialGradient id="aura"><stop stop-color="${accent}" stop-opacity=".32"/><stop offset=".55" stop-color="${secondary}" stop-opacity=".09"/><stop offset="1" stop-color="#07111d" stop-opacity="0"/></radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff0a8"/><stop offset=".42" stop-color="#d89734"/><stop offset=".72" stop-color="#8e4f17"/><stop offset="1" stop-color="#ffd66f"/></linearGradient>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f1fbff"/><stop offset=".3" stop-color="#8ba5b4"/><stop offset=".62" stop-color="#334b5c"/><stop offset="1" stop-color="#c8e0e8"/></linearGradient>
    <linearGradient id="wood" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d18b45"/><stop offset=".55" stop-color="#713c22"/><stop offset="1" stop-color="#2c1715"/></linearGradient>
    <linearGradient id="leather" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ad6c3c"/><stop offset=".55" stop-color="#57301f"/><stop offset="1" stop-color="#241417"/></linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="22"/><feOffset dy="26"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .65 0"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="1120" height="1400" fill="url(#bg)"/>
  <ellipse cx="560" cy="690" rx="500" ry="570" fill="url(#aura)"/>
  <path d="M0 1130 Q280 1080 560 1125 T1120 1120 V1400 H0Z" fill="#100e13" opacity=".84"/>
  <path d="M0 1180 Q310 1120 620 1175 T1120 1160" fill="none" stroke="#6d492d" stroke-opacity=".28" stroke-width="8"/>
  ${sparkle(150, 250, 16, accent)}${sparkle(955, 335, 11, secondary)}${sparkle(930, 910, 14, accent)}
  <g filter="url(#shadow)">${inner}</g>
  <ellipse cx="560" cy="1125" rx="330" ry="46" fill="#000" opacity=".36"/>
  </svg>`;
}

function wineskin() {
  return `<g transform="rotate(-7 560 720)"><path d="M455 430 Q560 375 665 430 L640 545 Q740 665 705 950 Q680 1090 560 1120 Q440 1090 415 950 Q380 665 480 545Z" fill="url(#leather)" stroke="#d28b4e" stroke-width="14"/><rect x="510" y="350" width="100" height="115" rx="20" fill="url(#wood)" stroke="#e4ad63" stroke-width="12"/><path d="M500 420 Q560 455 620 420" fill="none" stroke="#e0b374" stroke-width="18"/><path d="M470 565 Q560 610 650 565" fill="none" stroke="#442119" stroke-width="19"/><path d="M470 800 C510 745 610 745 650 800 C610 775 510 775 470 800Z" fill="#6f2530" opacity=".55"/><circle cx="520" cy="790" r="18" fill="#b54b52"/><circle cx="558" cy="775" r="19" fill="#a73d47"/><circle cx="596" cy="792" r="18" fill="#c04a54"/><path d="M560 760 Q580 720 612 728" fill="none" stroke="#7ba45b" stroke-width="13"/></g>`;
}

function lute(compact = false) {
  const scale = compact ? .88 : 1;
  return `<g transform="translate(${compact ? 65 : 0} ${compact ? 100 : 0}) rotate(-12 560 700) scale(${scale})"><path d="M560 1130 C390 1100 330 965 385 840 C420 760 495 725 520 660 L600 660 C625 725 700 760 735 840 C790 965 730 1100 560 1130Z" fill="url(#wood)" stroke="#e0a05a" stroke-width="16"/><ellipse cx="560" cy="875" rx="78" ry="95" fill="#171722" stroke="#d29a54" stroke-width="15"/><rect x="522" y="300" width="76" height="410" rx="28" fill="url(#wood)" stroke="#d9944b" stroke-width="12"/><path d="M490 320 Q560 245 630 320 L610 390 H510Z" fill="#6f3a25" stroke="#e0a05a" stroke-width="12"/><rect x="465" y="720" width="190" height="36" rx="18" fill="#3c211b"/><g stroke="#ffe8b0" stroke-width="4" opacity=".85"><path d="M530 330 L515 1040"/><path d="M548 320 L545 1050"/><path d="M570 320 L575 1050"/><path d="M590 330 L605 1040"/></g></g>`;
}

function harp() {
  const strings = Array.from({length:9}, (_,i) => `<path d="M${470+i*31} ${500+i*20} L${470+i*31} 1030"/>`).join("");
  return `<g><path d="M360 1080 Q355 560 500 300 Q600 430 750 485 Q805 510 790 575 Q725 835 820 1080" fill="none" stroke="url(#wood)" stroke-width="70" stroke-linecap="round"/><path d="M375 1080 H825" stroke="url(#gold)" stroke-width="65" stroke-linecap="round"/><path d="M500 330 Q610 470 765 520" fill="none" stroke="url(#gold)" stroke-width="35"/><g stroke="#bcecff" stroke-width="7" opacity=".82">${strings}</g>${sparkle(765,510,22,"#9ee8ff")}</g>`;
}

function bagpipes() {
  return `<g><path d="M360 710 Q430 560 625 610 Q770 650 770 830 Q760 1010 580 1045 Q385 1060 330 900 Q295 805 360 710Z" fill="#315d4d" stroke="#9ac28a" stroke-width="18"/><path d="M400 680 Q530 790 750 735" fill="none" stroke="#d5b26f" stroke-width="17"/><g stroke="url(#wood)" stroke-width="34" stroke-linecap="round"><path d="M610 660 L700 260"/><path d="M675 685 L820 350"/><path d="M720 735 L915 470"/><path d="M420 890 L300 1130"/></g><g fill="url(#gold)"><ellipse cx="700" cy="255" rx="36" ry="22"/><ellipse cx="820" cy="345" rx="36" ry="22"/><ellipse cx="915" cy="465" rx="36" ry="22"/><ellipse cx="295" cy="1130" rx="29" ry="18"/></g><path d="M350 720 Q230 610 290 535 Q335 480 390 550" fill="none" stroke="url(#wood)" stroke-width="30"/></g>`;
}

function drum() {
  return `<g><path d="M340 610 Q560 550 780 610 V1000 Q560 1065 340 1000Z" fill="url(#wood)" stroke="#d9964b" stroke-width="18"/><ellipse cx="560" cy="610" rx="225" ry="78" fill="#ead3a1" stroke="url(#gold)" stroke-width="20"/><ellipse cx="560" cy="1000" rx="220" ry="70" fill="#5b2e22" stroke="url(#gold)" stroke-width="18"/><g stroke="#f0ca86" stroke-width="13" opacity=".9"><path d="M360 650 L480 1035 L600 650 L720 1035"/><path d="M760 650 L640 1035 L520 650 L400 1035"/></g><g stroke="url(#wood)" stroke-width="28" stroke-linecap="round"><path d="M310 370 L690 830"/><path d="M790 360 L505 820"/></g><circle cx="303" cy="365" r="32" fill="#dfb66e"/><circle cx="797" cy="355" r="32" fill="#dfb66e"/></g>`;
}

function whistle() {
  return `<g transform="rotate(-24 560 700)"><rect x="500" y="300" width="125" height="800" rx="60" fill="url(#wood)" stroke="#dda65e" stroke-width="16"/><path d="M500 365 Q560 300 625 365 L610 470 H515Z" fill="#d8a35e"/><g fill="#142334" stroke="#e8b46d" stroke-width="6">${[540,660,780,900].map(y=>`<circle cx="562" cy="${y}" r="22"/>`).join("")}</g><path d="M562 1100 Q450 1195 390 1090 Q500 1095 562 1025 Q625 1095 735 1090 Q675 1195 562 1100Z" fill="#6fb58a" stroke="#b9e5a3" stroke-width="12"/></g>`;
}

const bottlePaths = {
  small: "M490 500 L630 500 L642 610 Q730 700 700 925 Q680 1060 560 1080 Q440 1060 420 925 Q390 700 478 610Z",
  medium: "M480 460 L640 460 L650 585 Q760 720 710 970 Q685 1090 560 1110 Q435 1090 410 970 Q360 720 470 585Z",
  large: "M460 430 L660 430 L670 560 Q790 680 755 1000 Q735 1140 560 1160 Q385 1140 365 1000 Q330 680 450 560Z",
  slim: "M500 430 L620 430 L625 600 Q690 710 665 1010 Q650 1110 560 1125 Q470 1110 455 1010 Q430 710 495 600Z",
  square: "M485 450 L635 450 L645 600 L760 700 L730 1080 H390 L360 700 L475 600Z",
  diamond: "M485 430 L635 430 L650 590 L760 820 L560 1130 L360 820 L470 590Z",
  round: "M490 470 L630 470 L640 600 Q785 700 760 920 Q740 1110 560 1135 Q380 1110 360 920 Q335 700 480 600Z",
};

function potion(shape, c1, c2, symbol) {
  const d = bottlePaths[shape];
  const symbols = {
    heart: `<path d="M560 900 C500 840 445 805 445 745 C445 660 545 650 560 720 C575 650 675 660 675 745 C675 805 620 840 560 900Z" fill="#ffd8d8" opacity=".9"/>`,
    leaf: `<path d="M560 925 Q445 815 535 700 Q665 710 660 830 Q635 920 560 925Z" fill="#d8ffe2" opacity=".9"/><path d="M535 900 Q565 815 630 745" stroke="#35885b" stroke-width="14"/>`,
    mountain: `<path d="M430 910 L550 690 L655 850 L705 785 L760 925Z" fill="#ffe4a0" opacity=".9"/>`,
    wing: `<path d="M560 895 Q410 850 405 700 Q500 735 560 820 Q620 735 715 700 Q710 850 560 895Z" fill="#ddfbff" opacity=".88"/>`,
    eye: `<path d="M405 805 Q560 650 715 805 Q560 960 405 805Z" fill="#e5dbff" opacity=".9"/><circle cx="560" cy="805" r="56" fill="#744bcc"/><circle cx="560" cy="805" r="22" fill="#fff"/>`,
    rose: `<g fill="#ffe0ed" opacity=".9"><circle cx="560" cy="785" r="70"/><circle cx="505" cy="820" r="60"/><circle cx="615" cy="820" r="60"/><circle cx="560" cy="860" r="60"/></g>`,
    luck: `<g fill="#dcffe1" opacity=".92"><circle cx="515" cy="760" r="60"/><circle cx="605" cy="760" r="60"/><circle cx="515" cy="850" r="60"/><circle cx="605" cy="850" r="60"/></g><path d="M560 860 Q590 930 650 970" fill="none" stroke="#d8ffe1" stroke-width="20"/>`,
  };
  return `<g><defs><clipPath id="bottleClip"><path d="${d}"/></clipPath><linearGradient id="liquid" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><path d="${d}" fill="#bfddec" fill-opacity=".24" stroke="#e4f6ff" stroke-width="18"/><g clip-path="url(#bottleClip)"><rect x="320" y="680" width="500" height="520" fill="url(#liquid)" opacity=".88"/><path d="M350 720 Q510 650 770 725" fill="none" stroke="#fff" stroke-opacity=".48" stroke-width="20"/>${symbols[symbol]}</g><rect x="465" y="395" width="190" height="90" rx="24" fill="url(#wood)" stroke="#e8bd78" stroke-width="14"/><path d="M430 610 Q560 660 690 610" fill="none" stroke="url(#gold)" stroke-width="20"/>${sparkle(735,720,26,c1)}${sparkle(395,920,18,c2)}</g>`;
}

function circlet() {
  return `<g><path d="M270 770 Q560 430 850 770 Q770 980 560 1050 Q350 980 270 770Z" fill="none" stroke="url(#gold)" stroke-width="45"/><path d="M315 770 Q560 565 805 770" fill="none" stroke="#f3efff" stroke-width="18"/><path d="M560 430 L650 610 L560 700 L470 610Z" fill="#9a70ff" stroke="#e7d8ff" stroke-width="18" filter="url(#glow)"/>${sparkle(560,350,38,"#d9c1ff")}</g>`;
}

function helmet() {
  return `<g><path d="M350 940 V680 Q350 390 560 335 Q770 390 770 680 V940 L665 1040 V760 H610 V1080 L560 1130 L510 1080 V760 H455 V1040Z" fill="url(#steel)" stroke="url(#gold)" stroke-width="20"/><path d="M390 620 Q560 470 730 620" fill="none" stroke="#dff4ff" stroke-width="28"/><path d="M560 330 V610" stroke="url(#gold)" stroke-width="28"/><path d="M320 800 Q560 1120 800 800" fill="none" stroke="#8edaff" stroke-width="25" opacity=".55" filter="url(#glow)"/></g>`;
}

function amulet(spirit = false) {
  const gem = spirit ? `<path d="M560 640 C430 760 470 960 560 1050 C650 960 690 760 560 640Z" fill="#65e7e2" stroke="#dcffff" stroke-width="22" filter="url(#glow)"/><path d="M560 730 Q500 840 560 935 Q620 840 560 730Z" fill="#fff" opacity=".75"/>` : `<path d="M560 650 L710 790 L650 1030 H470 L410 790Z" fill="#ffe47b" stroke="#fff3be" stroke-width="24" filter="url(#glow)"/><circle cx="560" cy="850" r="85" fill="#fff7c7" opacity=".72"/>`;
  return `<g><path d="M310 430 Q560 160 810 430 Q860 570 720 725" fill="none" stroke="url(#gold)" stroke-width="24"/><path d="M310 430 Q260 570 400 725" fill="none" stroke="url(#gold)" stroke-width="24"/>${gem}${sparkle(785,500,24,spirit?"#7ff8f2":"#ffe88d")}</g>`;
}

function cloak(shadow = false) {
  const main = shadow ? "#17152b" : "#28566e";
  const edge = shadow ? "#9164cb" : "#76d9eb";
  return `<g><path d="M450 370 Q560 300 670 370 L735 525 Q845 710 820 1120 Q670 1040 560 1135 Q450 1040 300 1120 Q275 710 385 525Z" fill="${main}" stroke="${edge}" stroke-width="22"/><path d="M450 370 Q560 470 670 370" fill="none" stroke="url(#gold)" stroke-width="26"/><circle cx="560" cy="430" r="32" fill="url(#gold)"/><path d="M380 600 Q560 700 740 600 M350 780 Q560 890 770 780" fill="none" stroke="${edge}" stroke-opacity=".42" stroke-width="18"/>${shadow ? `<path d="M300 1120 Q430 1020 560 1135 Q690 1020 820 1120" fill="none" stroke="#b17be6" stroke-width="30" opacity=".5" filter="url(#glow)"/>` : `<g fill="#a8edff" opacity=".8"><circle cx="790" cy="530" r="17"/><circle cx="825" cy="590" r="13"/><circle cx="305" cy="650" r="16"/></g>`}</g>`;
}

function robeFire() {
  return `<g><path d="M450 330 Q560 265 670 330 L720 500 L810 710 L735 780 L680 650 L760 1130 H360 L440 650 L385 780 L310 710 L400 500Z" fill="#842d35" stroke="#f08a47" stroke-width="22"/><path d="M560 1060 C455 980 485 865 540 790 C530 900 590 890 615 800 C700 900 670 1020 560 1060Z" fill="#ffb14e" opacity=".85" filter="url(#glow)"/><path d="M475 350 Q560 470 645 350" fill="none" stroke="url(#gold)" stroke-width="30"/>${sparkle(760,590,26,"#ff9845")}</g>`;
}

function leatherArmor() {
  return `<g><path d="M420 360 L500 310 H620 L700 360 L810 520 L720 650 L670 570 L715 1080 H405 L450 570 L400 650 L310 520Z" fill="url(#leather)" stroke="#d89b52" stroke-width="22"/><path d="M500 320 Q560 430 620 320 M455 600 H665 M430 760 H690 M420 920 H700" fill="none" stroke="#f0c26e" stroke-width="22" opacity=".75"/><path d="M465 560 L655 960 M655 560 L465 960" stroke="#7be0b0" stroke-width="14" opacity=".55" filter="url(#glow)"/></g>`;
}

function gloves() {
  return `<g fill="url(#leather)" stroke="#d79b5a" stroke-width="20"><path d="M250 650 Q280 590 335 630 L360 430 Q370 375 415 400 L430 590 L455 350 Q465 300 510 330 L505 590 L545 390 Q560 345 600 380 L565 650 Q650 760 605 990 Q575 1110 430 1080 Q300 1045 290 910Z"/><path d="M870 650 Q840 590 785 630 L760 430 Q750 375 705 400 L690 590 L665 350 Q655 300 610 330 L615 590 L575 390 Q560 345 520 380 L555 650 Q470 760 515 990 Q545 1110 690 1080 Q820 1045 830 910Z"/></g><g fill="none" stroke="#79e6cf" stroke-width="24" opacity=".75"><path d="M340 830 Q430 750 525 830"/><path d="M595 830 Q690 750 780 830"/></g>`;
}

function bracers() {
  return `<g><path d="M300 430 Q390 380 480 430 L520 1040 Q390 1110 260 1040Z" fill="url(#leather)" stroke="#db9d55" stroke-width="22"/><path d="M640 430 Q730 380 820 430 L860 1040 Q730 1110 600 1040Z" fill="url(#leather)" stroke="#db9d55" stroke-width="22"/><g fill="none" stroke="#90e7ff" stroke-width="22" filter="url(#glow)"><path d="M330 875 Q390 650 460 540 M460 540 L400 600 M460 540 L470 625"/><path d="M670 875 Q730 650 800 540 M800 540 L740 600 M800 540 L810 625"/></g></g>`;
}

function ring(luck = false) {
  return `<g><ellipse cx="560" cy="820" rx="245" ry="280" fill="none" stroke="url(#gold)" stroke-width="105"/><ellipse cx="560" cy="815" rx="165" ry="195" fill="#102033"/><path d="M455 520 Q560 405 665 520 L630 650 H490Z" fill="url(#gold)" stroke="#ffe59a" stroke-width="16"/>${luck ? `<g fill="#7aefa4" stroke="#d8ffe0" stroke-width="10" filter="url(#glow)"><circle cx="520" cy="520" r="53"/><circle cx="600" cy="520" r="53"/><circle cx="520" cy="590" r="53"/><circle cx="600" cy="590" r="53"/></g>` : `<path d="M560 435 C470 530 495 650 560 705 C625 650 650 530 560 435Z" fill="#ff8a55" stroke="#ffe0a0" stroke-width="18" filter="url(#glow)"/>`}${sparkle(800,620,24,luck?"#7aff9d":"#ff9b55")}</g>`;
}

function swordPrecision() {
  return `<g transform="rotate(9 560 700)"><path d="M560 170 L655 340 L605 905 L515 905 L465 340Z" fill="url(#steel)" stroke="#dff8ff" stroke-width="16"/><path d="M560 220 V870" stroke="#7edbff" stroke-width="20" filter="url(#glow)"/><path d="M340 880 Q560 820 780 880 L745 960 Q560 915 375 960Z" fill="url(#gold)"/><rect x="510" y="900" width="100" height="290" rx="40" fill="url(#leather)" stroke="#d8a65c" stroke-width="16"/><circle cx="560" cy="1210" r="55" fill="url(#gold)"/>${sparkle(560,150,34,"#a3e9ff")}</g>`;
}

function staff(nature = false) {
  return `<g transform="rotate(9 560 700)"><path d="M535 1170 Q505 900 565 710 Q620 530 555 250" fill="none" stroke="url(#wood)" stroke-width="68" stroke-linecap="round"/>${nature ? `<path d="M560 310 Q420 205 370 360 Q470 390 550 350 M555 420 Q700 300 770 450 Q650 490 560 460 M545 600 Q410 520 390 660 Q485 675 550 635" fill="#65bd78" stroke="#b8eca3" stroke-width="12"/><path d="M555 250 Q665 180 715 285 Q635 350 555 300" fill="#8ce49b" stroke="#d3ffc5" stroke-width="13"/>${sparkle(720,285,28,"#9cffad")}` : `<path d="M555 250 L690 360 L610 515 L460 490 L420 335Z" fill="#9471ff" stroke="#e1d4ff" stroke-width="22" filter="url(#glow)"/><path d="M500 330 L625 430 M620 325 L490 450" stroke="#fff" stroke-width="12" opacity=".65"/>${sparkle(710,300,28,"#c3a9ff")}`}</g>`;
}

function protectionShield() {
  return `<g><path d="M560 260 Q740 330 850 440 V730 Q820 990 560 1140 Q300 990 270 730 V440 Q380 330 560 260Z" fill="#345373" stroke="url(#gold)" stroke-width="30"/><path d="M560 350 Q690 390 760 470 V710 Q735 890 560 1010 Q385 890 360 710 V470 Q430 390 560 350Z" fill="none" stroke="#ffe28a" stroke-width="32" opacity=".78" filter="url(#glow)"/><circle cx="560" cy="680" r="115" fill="#ffdc76" opacity=".35"/>${sparkle(560,675,52,"#ffe598")}</g>`;
}

function belt(healer = false) {
  return `<g><path d="M190 600 Q560 510 930 600 L900 850 Q560 770 220 850Z" fill="url(#leather)" stroke="#d5934d" stroke-width="22"/><path d="M400 585 V835 M720 575 V825" stroke="#e7b064" stroke-width="18"/><rect x="440" y="560" width="240" height="300" rx="45" fill="url(#gold)"/><rect x="500" y="620" width="120" height="180" rx="26" fill="#172435"/>${healer ? `<path d="M560 640 V780 M490 710 H630" stroke="#a8f2b5" stroke-width="35" filter="url(#glow)"/><path d="M245 610 Q330 550 390 630 V880 Q310 930 235 860Z M730 620 Q820 555 895 635 V870 Q815 925 735 860Z" fill="#e8d5a3" stroke="#77cfa0" stroke-width="18"/>` : `<path d="M500 750 L560 640 L620 750Z" fill="#ff985b" filter="url(#glow)"/><path d="M280 640 Q560 470 840 640" fill="none" stroke="#ff9b5e" stroke-width="20" opacity=".7" filter="url(#glow)"/>`}</g>`;
}

function boots(agility = false) {
  const accent = agility ? "#66ddff" : "#a8e7c6";
  return `<g><path d="M290 350 Q410 290 500 370 L475 780 Q500 900 620 995 Q670 1060 600 1120 H250 Q185 1080 245 990 L300 880Z" fill="url(#leather)" stroke="#d99b54" stroke-width="22"/><path d="M630 350 Q750 290 840 370 L815 780 Q840 900 960 995 Q1010 1060 940 1120 H590 Q525 1080 585 990 L640 880Z" fill="url(#leather)" stroke="#d99b54" stroke-width="22"/><g stroke="${accent}" stroke-width="22" opacity=".78" filter="url(#glow)"><path d="M300 520 H480 M285 630 H475"/><path d="M640 520 H820 M625 630 H815"/>${agility ? `<path d="M150 920 Q310 820 500 900 M500 990 Q700 860 920 930"/>` : `<path d="M230 1165 Q425 1120 620 1165 M580 1195 Q760 1150 950 1195"/>`}</g>${!agility ? `<g fill="#8bcf9a"><path d="M210 1165 Q150 1100 100 1160 Q155 1210 210 1165Z"/><path d="M930 1190 Q995 1125 1030 1195 Q980 1235 930 1190Z"/></g>` : ""}</g>`;
}

function windBow() {
  return `<g transform="rotate(-5 560 700)"><path d="M430 170 Q230 430 320 700 Q230 970 430 1230" fill="none" stroke="url(#wood)" stroke-width="46" stroke-linecap="round"/><path d="M430 170 Q700 700 430 1230" fill="none" stroke="#e8faff" stroke-width="8"/><path d="M430 700 H845" stroke="#e8faff" stroke-width="15"/><path d="M845 700 L755 645 V755Z" fill="url(#steel)"/><path d="M300 420 Q690 230 850 470 M285 800 Q690 600 900 850 M420 1030 Q700 900 860 1060" fill="none" stroke="#7ddfff" stroke-width="24" opacity=".72" filter="url(#glow)"/>${sparkle(850,470,26,"#9ce9ff")}</g>`;
}

const illustrations = {
  "mech-s-vinem": wrap(wineskin(), "#b44758", "#e8a55b"),
  loutna: wrap(lute(false), "#df9b48", "#7ecad8"),
  mandolina: wrap(lute(true), "#d66d55", "#e8bd67"),
  harfa: wrap(harp(), "#f1c768", "#79d5f0"),
  dudy: wrap(bagpipes(), "#70aa79", "#d7af5f"),
  "maly-buben": wrap(drum(), "#d7784c", "#eec879"),
  pistalka: wrap(whistle(), "#75bd91", "#dca35f"),
  "maly-lecivy-lektvar": wrap(potion("small", ...colors.red, "heart"), colors.red[0], colors.red[1]),
  "lecivy-lektvar": wrap(potion("medium", "#ff655e", "#b51f4c", "heart"), "#ff655e", "#d33a64"),
  "velky-lecivy-lektvar": wrap(potion("large", "#ffb45d", "#a81243", "heart"), "#ffb45d", "#d52d55"),
  protijed: wrap(potion("slim", ...colors.green, "leaf"), colors.green[0], colors.green[1]),
  "lektvar-sily": wrap(potion("square", "#ff9c55", "#a52b32", "mountain"), "#ff9c55", "#b5363d"),
  "lektvar-obratnosti": wrap(potion("diamond", ...colors.blue, "wing"), colors.blue[0], colors.blue[1]),
  "lektvar-chytrosti": wrap(potion("slim", ...colors.violet, "eye"), colors.violet[0], colors.violet[1]),
  "lektvar-charismatu": wrap(potion("round", ...colors.rose, "rose"), colors.rose[0], colors.rose[1]),
  "lektvar-stesti": wrap(potion("medium", "#a4f27e", "#2f9b61", "luck"), "#a4f27e", "#e2c959"),
  "celenka-jasne-mysli": wrap(circlet(), "#c7a0ff", "#74d7ff"),
  "helma-strazce": wrap(helmet(), "#9bdfff", "#e4b85e"),
  "amulet-svetla": wrap(amulet(false), "#ffe489", "#f7b84f"),
  "talisman-ducha": wrap(amulet(true), "#7cf4eb", "#9da8ff"),
  "plast-sucha": wrap(cloak(false), "#70d9ee", "#e6bd68"),
  "plast-stinu": wrap(cloak(true), "#a273d5", "#334a83"),
  "roba-ohne": wrap(robeFire(), "#ff8a48", "#d43d3f"),
  "kozena-zbroj-poutnika": wrap(leatherArmor(), "#d69a53", "#72d6a1"),
  "rukavice-prilnavosti": wrap(gloves(), "#67e3c7", "#c88c4f"),
  "natepniky-lucistnika": wrap(bracers(), "#77ddff", "#d3944d"),
  "prsten-tepla": wrap(ring(false), "#ff9a54", "#e8bf5d"),
  "prsten-stesteny": wrap(ring(true), "#79ed9f", "#e9c85c"),
  "mec-presnosti": wrap(swordPrecision(), "#83ddff", "#e8c66a"),
  "hul-prirody": wrap(staff(true), "#7ee596", "#d7bd5e"),
  "kouzelnicka-hul": wrap(staff(false), "#ad8aff", "#74d0f0"),
  "stit-ochrany": wrap(protectionShield(), "#ffe48b", "#6fb9ef"),
  "opasek-sily": wrap(belt(false), "#ff9d5c", "#d6a556"),
  "opasek-lecitele": wrap(belt(true), "#8be4ac", "#e8d687"),
  "boty-lehkeho-kroku": wrap(boots(false), "#9de0ba", "#5caab7"),
  "boty-obratnosti": wrap(boots(true), "#70ddff", "#6a83e5"),
  "luk-vetru": wrap(windBow(), "#7de4ff", "#d9efff"),
};

const tempDir = mkdtempSync(join(tmpdir(), "afa-equipment-art-"));
try {
  for (const [slug, svg] of Object.entries(illustrations)) {
    const source = join(tempDir, `${slug}.svg`);
    const raster = join(tempDir, `${slug}.png`);
    const target = join(outputDir, `${slug}.webp`);
    if (existsSync(target)) continue;
    writeFileSync(source, svg);
    const render = spawnSync("inkscape", [source, "--export-type=png", `--export-filename=${raster}`, "--export-width=1120", "--export-height=1400"], {
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    });
    if (render.status !== 0) {
      throw new Error(`Failed to rasterize ${slug}: ${render.stderr}`);
    }
    const result = spawnSync("convert", [raster, "-strip", "-quality", "84", target], {
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    });
    if (result.status !== 0) {
      throw new Error(`Failed to render ${slug}: ${result.stderr}`);
    }
  }
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}

console.log(`Rendered ${Object.keys(illustrations).length} unique equipment illustrations.`);
