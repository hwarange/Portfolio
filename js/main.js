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
