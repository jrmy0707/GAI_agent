const {
  albumUrl, applyTheme, createCover, createElement, filterAlbums, loadAlbums, pickRandomAlbum,
} = albumCorner;

const collection = document.querySelector("#collection");
const grid = document.querySelector("#album-grid");
const search = document.querySelector("#album-search");
const clearButton = document.querySelector("#search-clear");
const randomButton = document.querySelector("#random-album");
const count = document.querySelector("#album-count");
const status = document.querySelector("#result-status");
const state = document.querySelector("#collection-state");
const stateAction = document.querySelector("#state-action");
let albums = [];
let currentState = "loading";

function showState(kicker, title, description, action = null) {
  state.hidden = false;
  document.querySelector("#state-kicker").textContent = kicker;
  document.querySelector("#state-title").textContent = title;
  document.querySelector("#state-description").textContent = description;
  stateAction.hidden = !action;
  if (action) stateAction.textContent = action;
}

function createAlbumCard(album) {
  const item = createElement("article", "album-card");
  const link = createElement("a", "album-card-link");
  link.href = albumUrl(album.id);
  const sleeve = createElement("div", "album-cover");
  const image = createCover(album);
  image.loading = "lazy";
  sleeve.append(image, createElement("span", "cover-open", "閱讀專輯 ↗"));
  const meta = createElement("div", "card-meta");
  meta.append(createElement("span", "card-artist", album.artist), createElement("span", "card-year", album.year));
  link.append(sleeve, meta, createElement("h3", "card-title", album.title), createElement("p", "card-summary", album.summary || "從這張專輯的聲音開始探索。"));
  item.append(link);
  return item;
}

function renderCollection() {
  const visibleAlbums = filterAlbums(albums, search.value);
  const hasQuery = Boolean(search.value.trim());
  clearButton.hidden = !search.value;
  grid.replaceChildren(...visibleAlbums.map(createAlbumCard));
  count.textContent = String(albums.length).padStart(2, "0");
  if (!albums.length) {
    status.textContent = "目前收藏 0 張專輯";
    showState("ROOM FOR GOOD MUSIC", "好音樂，值得留一個位置。", "這裡將收藏不同歌手的專輯。上架後，就能從封面探索故事，或挑一張開始聽。");
  } else if (!visibleAlbums.length) {
    status.textContent = `找不到符合「${search.value.trim()}」的專輯`;
    showState("KEEP EXPLORING", "這次還沒找到想聽的。", "試試歌手名稱、專輯名稱，或回到全部收藏慢慢逛。", "清除搜尋");
  } else {
    state.hidden = true;
    status.textContent = hasQuery ? `找到 ${visibleAlbums.length} 張專輯，共收藏 ${albums.length} 張` : `共收藏 ${albums.length} 張專輯，隨心挑一張開始聽。`;
  }
}

function clearSearch() {
  search.value = "";
  renderCollection();
  search.focus();
}

async function initialize() {
  currentState = "loading";
  collection.setAttribute("aria-busy", "true");
  search.disabled = true;
  randomButton.disabled = true;
  stateAction.hidden = true;
  grid.replaceChildren();
  count.textContent = "—";
  status.textContent = "正在整理唱片架…";
  showState("ONE MOMENT", "正在整理唱片架", "稍等一下，讓音樂找到它的位置。");
  try {
    albums = await loadAlbums();
    currentState = "ready";
    search.disabled = false;
    randomButton.disabled = !albums.length;
    randomButton.title = albums.length ? "從全部收藏中隨機挑選一張專輯" : "加入專輯後，就能隨機挑選";
    renderCollection();
  } catch {
    currentState = "error";
    albums = [];
    status.textContent = "專輯收藏暫時無法載入";
    showState("PLEASE TRY AGAIN", "唱片架暫時打不開。", "請重新載入。若直接開啟檔案，請依 README 同步本機預覽資料。", "重新載入");
  } finally {
    collection.setAttribute("aria-busy", "false");
  }
}

document.querySelector("#search-form").addEventListener("submit", (event) => event.preventDefault());
search.addEventListener("input", renderCollection);
clearButton.addEventListener("click", clearSearch);
stateAction.addEventListener("click", () => currentState === "error" ? initialize() : clearSearch());
randomButton.addEventListener("click", () => {
  // 保留完整資料集，搜尋只影響封面牆，不影響抽選範圍。
  const album = pickRandomAlbum(albums);
  if (album) window.location.assign(albumUrl(album.id));
});
applyTheme();
initialize();
