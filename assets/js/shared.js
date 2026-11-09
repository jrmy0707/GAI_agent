const albumCorner = (() => {
  const defaultTheme = Object.freeze({
    background: "#f3eee4",
    surface: "#faf7f0",
    text: "#302a24",
    mutedText: "#71665c",
    accent: "#a74329",
    accentText: "#fff9f0",
  });

  const themeVariables = {
    background: "--color-background",
    surface: "--color-surface",
    text: "--color-text",
    mutedText: "--color-muted",
    accent: "--color-accent",
    accentText: "--color-accent-text",
  };

  function loadLocalAlbums() {
    // file:// 頁面可載入一般指令碼，專輯資料由 JSON 同步產生。
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "data/albums.local.js";
      script.onload = () => {
        script.remove();
        resolve(window.albumCornerLocalAlbums);
      };
      script.onerror = () => {
        script.remove();
        reject(new Error("無法讀取本機預覽資料"));
      };
      document.head.append(script);
    });
  }

  async function loadAlbums() {
    let albums;
    if (window.location.protocol === "file:") {
      albums = await loadLocalAlbums();
    } else {
      const response = await fetch("data/albums.json");
      if (!response.ok) throw new Error(`無法讀取專輯資料（${response.status}）`);
      albums = await response.json();
    }
    if (!Array.isArray(albums)) throw new Error("專輯資料必須是陣列");
    const ids = new Set();
    for (const album of albums) {
      if (
        !album || typeof album !== "object" ||
        typeof album.id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(album.id) ||
        ids.has(album.id) ||
        typeof album.title !== "string" || !album.title.trim() ||
        typeof album.artist !== "string" || !album.artist.trim() ||
        !Number.isInteger(album.year)
      ) throw new Error("專輯資料格式不正確，或 id 重複");
      ids.add(album.id);
    }
    return albums;
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function albumUrl(id) {
    return `album.html?id=${encodeURIComponent(id)}`;
  }

  function filterAlbums(albums, query) {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return albums.filter((album) =>
      album.title.toLocaleLowerCase().includes(normalizedQuery) ||
      album.artist.toLocaleLowerCase().includes(normalizedQuery)
    );
  }

  function pickRandomAlbum(albums) {
    return albums.length ? albums[Math.floor(Math.random() * albums.length)] : null;
  }

  function resolveTheme(theme) {
    return Object.fromEntries(Object.entries(defaultTheme).map(([key, fallback]) => [
      key, typeof theme?.[key] === "string" && /^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(theme[key])
        ? theme[key] : fallback,
    ]));
  }

  function applyTheme(theme = {}) {
    const colors = resolveTheme(theme);
    for (const [key, variable] of Object.entries(themeVariables)) {
      document.documentElement.style.setProperty(variable, colors[key]);
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", colors.background);
  }

  function createCover(album, className = "") {
    const image = createElement("img", className);
    image.alt = `${album.title} — ${album.artist} 專輯封面`;
    image.width = 600;
    image.height = 600;
    image.decoding = "async";
    const fallback = "assets/images/covers/fallback.svg";
    // 封面只讀取站內相對路徑，避免部署子路徑或不受信任協定造成問題。
    const cover = typeof album.cover === "string" &&
      !/^(?:[a-z][a-z\d+.-]*:|[\\/])/i.test(album.cover) &&
      !album.cover.split(/[\\/]/).includes("..");
    image.addEventListener("error", () => { image.src = fallback; }, { once: true });
    image.src = cover && album.cover ? album.cover : fallback;
    return image;
  }

  function getHttpsUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
    } catch {
      return null;
    }
  }

  function createExternalLink(label, url, className = "") {
    const href = getHttpsUrl(url);
    if (!href) return null;
    const link = createElement("a", className, label);
    link.href = href;
    return link;
  }

  return { albumUrl, applyTheme, asArray, createCover, createElement, createExternalLink, filterAlbums, loadAlbums, pickRandomAlbum };
})();
