const showWindow = (a) => {
  let w = window.innerWidth * 0.5;
  let h = window.innerHeight * 0.8;
  window.open(
      a.href,
      'pdfwindow',
      `width=${w},height=${h}`,
  );
  return false;
}

const setLanguage = (lang, button, container, type) => {
  container.dataset.language = lang;
  localStorage.setItem(`${type}-language`, lang);

  button.textContent = lang === "ko" ? "EN" : "KO";
};

const setClock = (clockId, date) => {
  const clock = document.getElementById(clockId);
  if (!clock) return;

  const hourHand = clock.querySelector(".hour-hand");
  const minuteHand = clock.querySelector(".minute-hand");
  const secondHand = clock.querySelector(".second-hand");

  if (!hourHand || !minuteHand || !secondHand) return;

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const secondDeg = seconds * 6;

  hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
  minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
  secondHand.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
  clock.style.visibility = "visible";
};

const updateClocks = () => {
  const now = new Date();
  setClock("local-clock", now);

  const koreaNow = new Date(
    now.toLocaleString("en-US", {
      timeZone: "Asia/Seoul",
    }),
  );
  setClock("korea-clock", koreaNow);
};

const randomizeClockPosition = () => {
  const clock = document.getElementById("local-clock");
  if (!clock) return;

  const baseMargin = 50;
  const clockRadius = 38;
  const safetyMargin = baseMargin + clockRadius;

  const isSplitLayout = !!clock.closest("main .container.ex-kuma");
  const isMobile = window.innerWidth <= 580;

  let left, right;

  if (isMobile) {
    left = safetyMargin;
    right = window.innerWidth - safetyMargin;
  } else if (isSplitLayout) {
    left = window.innerWidth / 2 + safetyMargin;
    right = window.innerWidth - safetyMargin;
  } else {
    left = safetyMargin;
    right = window.innerWidth - safetyMargin;
  }

  if (left >= right) {
    left = safetyMargin;
    right = window.innerWidth - safetyMargin;
  }

  const x = Math.random() * (right - left) + left;
  const y = Math.random() * (window.innerHeight - safetyMargin * 2) + safetyMargin;

  clock.style.left = `${x}px`;
  clock.style.top = `${y}px`;
  clock.style.transform = "translate(-50%, -50%)";
  clock.style.visibility = "visible";
};

let resizeTimer;
let lastWidth = window.innerWidth;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    if (window.innerWidth !== lastWidth) {
      lastWidth = window.innerWidth;
      randomizeClockPosition();
    }
  }, 200);
});

document.addEventListener("DOMContentLoaded", () => {
  const sticker = document.querySelector(".sticker");
  const newsItems = document.querySelectorAll(".news-item");

  if (newsItems.length > 0) {
    for (let i = 0; i < newsItems.length; i++){
      const eachLink = newsItems[i].querySelector("a");

      eachLink.addEventListener("click", (e) => {
        e.preventDefault();
        showWindow(eachLink)
      });

    }
  }


  randomizeClockPosition();
  updateClocks();
  setInterval(updateClocks, 1000);

  if (sticker) {
    sticker.addEventListener("click", () => {
      sticker.style.display = "none";
    });
  }


});
