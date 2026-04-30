(function () {
  const data = window.siteData;
  const page = document.body.dataset.page || "home";
  const root = document.getElementById("site-root");

  if (!data || !root) {
    return;
  }

  document.title = page === "home"
    ? data.profile.name
    : `${titleCase(page)} | ${data.profile.name}`;

  const nav = data.navigation
    .map((item) => {
      const isActive = item.url.includes(`${page}.html`);
      return `
        <a class="nav-link${isActive ? " is-active" : ""}" href="${escapeHtml(item.url)}">
          ${escapeHtml(item.label)}
        </a>
      `;
    })
    .join("");

  const profileLinks = data.profileLinks
    .filter((item) => item.url)
    .map((item) => `
      <a class="profile-link" href="${escapeHtml(item.url)}" aria-label="${escapeHtml(item.label)}" title="${escapeHtml(item.label)}">
        ${escapeHtml(item.shortLabel || item.label)}
      </a>
    `)
    .join("");

  root.innerHTML = `
    <header class="site-header">
      <div class="header-inner">
        <a class="site-name" href="index.html">${escapeHtml(data.profile.name)}</a>
        <nav class="main-nav" aria-label="Main navigation">${nav}</nav>
        <div class="profile-links" aria-label="Profile links">${profileLinks}</div>
      </div>
    </header>
    <main class="site-main">
      ${renderPage(page)}
    </main>
    <footer class="site-footer">
      ${escapeHtml(data.profile.footer)}
    </footer>
  `;

  function renderPage(pageName) {
    switch (pageName) {
      case "research":
        return renderResearch();
      case "teaching":
        return renderTeaching();
      case "writing":
        return renderWriting();
      case "cv":
        return renderCv();
      default:
        return renderHome();
    }
  }

  function renderHome() {
    const paragraphs = data.home.paragraphs
      .map((paragraph) => {
        return `<p>${escapeHtml(paragraph)}</p>`;
      })
      .join("");

    return `
      <section class="profile-layout" aria-labelledby="profile-title">
        <figure class="portrait-wrap">
          <img class="portrait" src="${escapeHtml(data.profile.photo)}" alt="${escapeHtml(data.profile.photoAlt)}">
          <figcaption>
            <strong>${escapeHtml(data.profile.title)}</strong>
            <span>${escapeHtml(data.profile.location)}</span>
          </figcaption>
        </figure>
        <article class="profile-copy">
          <h1 id="profile-title">${escapeHtml(data.profile.name)}</h1>
          ${paragraphs}
        </article>
      </section>
    `;
  }

  function renderResearch() {
    const sections = data.research.sections
      .map((section) => `
        <section class="content-section">
          <h2>${escapeHtml(section.heading)}</h2>
          <ul class="publication-list">
            ${section.items.map(renderPublication).join("")}
          </ul>
        </section>
      `)
      .join("");

    const lead = data.research.lead
      ? `<p>${escapeHtml(data.research.lead)}</p>`
      : "";

    return `
      <article class="page-copy">
        <h1>Research</h1>
        ${lead}
        ${sections}
      </article>
    `;
  }

  function renderTeaching() {
    const sections = data.teaching.sections
      .map(renderSectionList)
      .join("");

    return `
      <article class="page-copy">
        <h1>Teaching</h1>
        ${sections}
      </article>
    `;
  }

  function renderWriting() {
    if (!data.writing && data.Other) {
      const sections = data.Other.sections
        .map(renderSectionList)
        .join("");

      return `
        <article class="page-copy">
          <h1>Experience</h1>
          ${sections}
        </article>
      `;
    }

    return `
      <article class="page-copy">
        <h1>Writing</h1>
        <p>${escapeHtml(data.writing.lead)}</p>
        <div class="entry-list">
          ${data.writing.posts.map(renderEntry).join("")}
        </div>
      </article>
    `;
  }

  function renderCv() {
    const sections = data.cv.sections
      .map((section) => `
        <section class="content-section">
          <h2>${escapeHtml(section.heading)}</h2>
          <ul>
            ${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </section>
      `)
      .join("");

    const pdfLink = data.profile.cvPdfUrl
      ? `<p><a class="download-link" href="${escapeHtml(data.profile.cvPdfUrl)}">Download CV PDF</a></p>`
      : "";

    return `
      <article class="page-copy">
        <h1>CV &amp; Education</h1>
        <p>${escapeHtml(data.cv.lead)}</p>
        ${pdfLink}
        ${sections}
      </article>
    `;
  }

  function renderSectionList(section) {
    const description = section.description && section.description !== "."
      ? `<p class="section-description">${escapeHtml(section.description)}</p>`
      : "";

    return `
      <section class="content-section">
        <h2>${escapeHtml(section.heading)}</h2>
        ${description}
        <ul>
          ${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </section>
    `;
  }

  function renderPublication(item) {
    if (item.citation || item.trial) {
      return `<li>${formatCitation(item.citation || item.trial)}</li>`;
    }

    const title = item.url && item.url !== "#"
      ? `<a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a>`
      : escapeHtml(item.title);

    return `
      <li>
        <span class="publication-title">${title}</span>
        <span>${escapeHtml(item.authors)} (${escapeHtml(item.year)}). ${escapeHtml(item.venue)}.</span>
      </li>
    `;
  }

  function renderEntry(item) {
    const title = item.url && item.url !== "#"
      ? `<a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a>`
      : escapeHtml(item.title);

    return `
      <article class="entry">
        <h2>${title}</h2>
        <p class="entry-meta">${escapeHtml(item.date || item.venue)}</p>
        <p>${escapeHtml(item.summary || item.venue)}</p>
      </article>
    `;
  }

  function titleCase(value) {
    return value === "cv"
      ? "CV & Education"
      : value.charAt(0).toUpperCase() + value.slice(1);
  }

  function formatCitation(value) {
    return escapeHtml(value).replace(/Liao, Y\.|Liao Y/g, "<strong>$&</strong>");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
