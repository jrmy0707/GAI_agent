const {
  applyTheme, asArray, createCover, createElement, createExternalLink, loadAlbums,
} = albumCorner;

const main = document.querySelector("#main");
const content = document.querySelector("#album-content");
const state = document.querySelector("#detail-state");
const retry = document.querySelector("#detail-retry");

function showState(kicker, title, description, canRetry = false) {
  state.hidden = false;
  content.hidden = true;
  document.querySelector("#detail-state-kicker").textContent = kicker;
  document.querySelector("#detail-state-title").textContent = title;
  document.querySelector("#detail-state-description").textContent = description;
  retry.hidden = !canRetry;
}

function addParagraphs(selector, paragraphs, fallback) {
  const values = asArray(paragraphs).filter((text) => typeof text === "string" && text.trim());
  document.querySelector(selector).replaceChildren(...(values.length ? values : [fallback]).map((text) => createElement("p", "", text)));
}

function renderLinks(selector, links, labelKey, fallback) {
  const list = document.querySelector(selector);
  const items = asArray(links).flatMap((entry) => {
    if (!entry || typeof entry[labelKey] !== "string") return [];
    const link = createExternalLink(entry[labelKey], entry.url);
    if (!link) return [];
    link.append(createElement("span", "external-arrow", "↗"));
    const item = createElement("li");
    item.append(link);
    return [item];
  });
  list.replaceChildren(...(items.length ? items : [createElement("li", "content-note", fallback)]));
}

function renderAlbum(album) {
  applyTheme(album.theme);
  document.title = `${album.title} — ${album.artist}｜Album Corner`;
  document.querySelector('meta[name="description"]').content = album.summary || `${album.artist}《${album.title}》的推薦歌曲、創作背景與音樂分析。`;
  document.querySelector("#album-title").textContent = album.title;
  document.querySelector("#album-artist").textContent = album.artist;
  document.querySelector("#album-year").textContent = ` / ${album.year}`;
  document.querySelector("#album-summary").textContent = album.summary || "";
  const cover = createCover(album);
  cover.fetchPriority = "high";
  document.querySelector("#detail-cover").replaceChildren(cover);

  const genres = asArray(album.genres).filter((genre) => typeof genre === "string");
  document.querySelector("#album-genres").replaceChildren(...(genres.length
    ? genres.map((genre) => createElement("span", "genre-tag", genre))
    : [createElement("p", "content-note", "音樂特色尚未整理。判讀曲風時，也別忘了親自聽聽看。")]
  ));

  const tracks = asArray(album.tracks).filter((track) => track && Number.isInteger(track.number) && typeof track.title === "string");
  const recommendations = asArray(album.recommendedTracks).flatMap((recommendation) => {
    const track = tracks.find((entry) => entry.number === recommendation?.trackNumber);
    if (!track) return [];
    const card = createElement("article", "recommendation");
    const body = createElement("div", "recommendation-body");
    body.append(createElement("h3", "", track.title), createElement("p", "", recommendation.reason || "推薦從這首歌開始認識專輯。"));
    if (recommendation.listenFor) {
      const listeningNote = createElement("p", "listening-note");
      listeningNote.append(createElement("span", "", "留意聽"), document.createTextNode(recommendation.listenFor));
      body.append(listeningNote);
    }
    card.append(createElement("span", "track-number", String(track.number).padStart(2, "0")), body);
    return [card];
  });
  document.querySelector("#recommended-tracks").replaceChildren(...(recommendations.length ? recommendations : [createElement("p", "content-note", "推薦歌曲尚未整理，可以先依完整曲序開始聆聽。") ]));
  addParagraphs("#album-background", album.background, "創作背景尚未整理。");
  addParagraphs("#album-concept", album.concept, "專輯概念尚未整理。");
  const analysis = asArray(album.analysis).filter((item) => item && typeof item.heading === "string" && typeof item.text === "string");
  document.querySelector("#album-analysis").replaceChildren(...(analysis.length ? analysis.map((item) => {
    const section = createElement("div", "analysis-item");
    section.append(createElement("h3", "", item.heading), createElement("p", "", item.text));
    return section;
  }) : [createElement("p", "content-note", "音樂分析尚未整理。") ]));
  document.querySelector("#album-tracks").replaceChildren(...(tracks.length ? tracks.map((track) => {
    const item = createElement("li");
    item.value = track.number;
    item.append(createElement("span", "track-number", String(track.number).padStart(2, "0")), createElement("span", "", track.title));
    return item;
  }) : [createElement("li", "content-note", "完整曲目尚未整理。") ]));
  renderLinks("#album-links", album.listenLinks, "label", "尚未提供聆聽連結。");
  renderLinks("#album-sources", album.sources, "title", "資料來源尚未整理。");
  content.hidden = false;
  state.hidden = true;
  document.body.classList.add("album-theme-enter");
}

async function initialize() {
  applyTheme();
  main.setAttribute("aria-busy", "true");
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) {
    showState("RECORD NOT FOUND", "還沒選到一張專輯。", "回到唱片架，從一張喜歡的封面開始吧。");
    main.setAttribute("aria-busy", "false");
    return;
  }
  showState("ONE MOMENT", "正在取出這張專輯", "稍等一下，故事即將開始。");
  try {
    const albums = await loadAlbums();
    const album = albums.find((entry) => entry.id === id);
    if (album) renderAlbum(album);
    else showState("RECORD NOT FOUND", "找不到這張專輯。", "這張專輯可能尚未上架，或連結有誤。回到收藏看看其他唱片吧。");
  } catch {
    showState("PLEASE TRY AGAIN", "暫時無法讀取這張專輯。", "請重新載入。若直接開啟檔案，請依 README 同步本機預覽資料。", true);
  } finally {
    main.setAttribute("aria-busy", "false");
  }
}

retry.addEventListener("click", initialize);
initialize();
