document.addEventListener("DOMContentLoaded", () => {
  initFAQ();
  initMobileMenu();
  fetchArticles();

  const reloadBtn = document.getElementById("reload-btn");
  if (reloadBtn) {
    reloadBtn.addEventListener("click", fetchArticles);
  }
});

function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.contains("active");

    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", !isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });
}

function initFAQ() {
  const headers = document.querySelectorAll(".accordion-header");

  headers.forEach((header) => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      const isOpen = header.classList.contains("active");

      document.querySelectorAll(".accordion-header").forEach((h) => {
        h.classList.remove("active");
        h.setAttribute("aria-expanded", "false");
        h.nextElementSibling.style.height = "0px";
      });

      if (!isOpen) {
        header.classList.add("active");
        header.setAttribute("aria-expanded", "true");
        content.style.height = content.scrollHeight + "px";
      }
    });
  });
}

async function fetchArticles() {
  const container = document.getElementById("articles-container");
  const loadingState = document.getElementById("loading-state");
  const errorState = document.getElementById("error-state");

  container.innerHTML = "";
  loadingState.classList.remove("hidden");
  errorState.classList.add("hidden");

  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_limit=4"
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    loadingState.classList.add("hidden");

    data.forEach((post) => {
      const article = document.createElement("article");
      article.className = "article-card";

      const excerpt = post.body.substring(0, 100) + "...";

      article.innerHTML = `
                <h3>${post.title}</h3>
                <p>${excerpt}</p>
            `;

      container.appendChild(article);
    });
  } catch (error) {
    console.error("Fetch error:", error);
    loadingState.classList.add("hidden");
    errorState.classList.remove("hidden");
  }
}
