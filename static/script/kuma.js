document.addEventListener("DOMContentLoaded", () => {
  const kumaLangButton = document.querySelector(".lang-button.kuma");
  const leftContainer = document.querySelector(".container.kuma");
  const collections = document.querySelectorAll(".collections-item");
  const exhibitions = document.querySelectorAll(".exhibition-item");
  const sliders = document.querySelectorAll(".gallery-slider");

  kumaLangButton.addEventListener("click", () => {
    const now = leftContainer.dataset.language || "ko";
    const next = now === "ko" ? "en" : "ko";

    setLanguage(next, kumaLangButton, leftContainer, "kuma");
  });

  setLanguage(
    localStorage.getItem("kuma-language") || "ko",
    kumaLangButton,
    leftContainer,
    "kuma",
  );

  const bindCollectionsClick = () => {
    const isMobile = window.matchMedia("(hover: none)").matches;

    collections.forEach((collection) => {
      collection.onclick = null;

      if (isMobile) {
        collection.onclick = (e) => {
          collections.forEach((item) => {
            if (item !== e.currentTarget) {
              item.classList.remove("active");
            }
          });

          e.currentTarget.classList.toggle("active");
        };
      } else {
        collection.classList.remove("active");
      }
    });
  };

  bindCollectionsClick();

  window.addEventListener("resize", bindCollectionsClick);

  for (let i = 0; i < exhibitions.length; i++) {
    const details = exhibitions[i];

    details.addEventListener("toggle", () => {
      if (!details.open) return;

      exhibitions.forEach((other) => {
        if (other !== details) {
          other.open = false;
        }
      });
    });
  }

  for (let i = 0; i < sliders.length; i++) {
    const slider = sliders[i];

    const track = slider.querySelector(".gallery-track");
    const slides = [...track.querySelectorAll(".image-container")];

    const prev = slider.querySelector(".prev-button");
    const next = slider.querySelector(".next-button");

    if (slides.length <= 1) {
      prev.classList.add("hidden");
      next.classList.add("hidden");
      continue;
    }

    let j = 0;

    const update = () => {
      track.style.transform = `translateX(-${j * 100}%)`;

      prev.classList.toggle("hidden", j === 0);
      next.classList.toggle("hidden", j === slides.length - 1);
    };

    prev.addEventListener("click", () => {
      if (j > 0) {
        j--;
        update();
      }
    });

    next.addEventListener("click", () => {
      if (j < slides.length - 1) {
        j++;
        update();
      }
    });

    update();
  }
});
