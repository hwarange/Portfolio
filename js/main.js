// 다크/라이트 테마 전환
const toggle = document.querySelector(".theme-toggle");
const root = document.documentElement;

// 저장된 테마 또는 시스템 설정을 초기값으로 사용
const saved = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(saved || (prefersDark ? "dark" : "light"));

toggle.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("theme", next);
});

function applyTheme(theme) {
  root.dataset.theme = theme;
  toggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

// ===== 히어로 텍스트 스트리밍(타이핑) 효과 =====
// 글자를 span으로 감싸 미리 자리를 잡아두고 하나씩 보이게 해서 레이아웃 밀림이 없다.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroTargets = [".hero-greeting", ".hero-title", ".hero-desc"]
  .map((sel) => document.querySelector(sel));
const heroActions = document.querySelector(".hero-actions");

if (!reduceMotion && heroTargets.every(Boolean)) {
  heroTargets.forEach(wrapChars);
  heroActions.style.opacity = "0";

  (async () => {
    await typeElement(heroTargets[0], 45); // 안녕하세요 👋
    await typeElement(heroTargets[1], 60); // 제목
    await typeElement(heroTargets[2], 22); // 설명
    heroActions.style.transition = "opacity 0.6s";
    heroActions.style.opacity = "1";
  })();
}

// 요소 안의 모든 텍스트를 글자 단위 span(.ch)으로 감싼다 (태그 구조는 유지)
function wrapChars(node) {
  [...node.childNodes].forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      for (const ch of child.textContent) {
        const s = document.createElement("span");
        s.className = "ch";
        s.textContent = ch;
        frag.appendChild(s);
      }
      child.replaceWith(frag);
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      wrapChars(child);
    }
  });
}

// 커서를 붙인 채 글자를 순서대로 드러낸다
async function typeElement(el, speed) {
  const chars = el.querySelectorAll(".ch");
  const cursor = document.createElement("span");
  cursor.className = "type-cursor";
  el.appendChild(cursor);
  for (const ch of chars) {
    ch.classList.add("on");
    ch.after(cursor);
    if (ch.textContent.trim()) {
      await sleep(speed);
    }
  }
  cursor.remove();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ===== 스킬 툴팁: 숙련도 게이지(5칸) + 근거 =====
const LEVEL_LABEL = { 1: "하", 2: "하", 3: "중", 4: "상", 5: "상" };
const skillTip = document.createElement("div");
skillTip.className = "skill-tip";
skillTip.hidden = true;
document.body.appendChild(skillTip);

document.querySelectorAll(".skills-grid .tag-list li[data-level]").forEach((tag) => {
  tag.addEventListener("mouseenter", () => showSkillTip(tag));
  tag.addEventListener("mouseleave", hideSkillTip);
});

function showSkillTip(tag) {
  const level = Math.min(5, Math.max(1, Number(tag.dataset.level)));
  const notes = (tag.dataset.notes || "").split("|").filter(Boolean);
  const cells = [1, 2, 3, 4, 5]
    .map((i) => `<i${i <= level ? ' class="on"' : ""}></i>`)
    .join("");
  skillTip.innerHTML =
    `<div class="skill-tip-head"><strong>${tag.textContent}</strong>` +
    `<span class="gauge">${cells}</span>` +
    `<span class="gauge-label">${LEVEL_LABEL[level]}</span></div>` +
    `<ul>${notes.map((n) => `<li>${n}</li>`).join("")}</ul>`;
  skillTip.hidden = false;

  // 태그 위 중앙 정렬, 화면 밖으로 나가면 아래로/안쪽으로 보정
  const r = tag.getBoundingClientRect();
  const t = skillTip.getBoundingClientRect();
  let left = r.left + r.width / 2 - t.width / 2;
  left = Math.max(8, Math.min(left, window.innerWidth - t.width - 8));
  let top = r.top - t.height - 10;
  if (top < 8) top = r.bottom + 10;
  skillTip.style.left = `${left}px`;
  skillTip.style.top = `${top}px`;
}

function hideSkillTip() {
  skillTip.hidden = true;
}
