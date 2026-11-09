# Album Corner

以實體唱片收藏為靈感的繁體中文專輯介紹網站。從封面牆挑選專輯，閱讀音樂特色、推薦歌曲、創作背景、概念與音樂分析。

以 HTML、CSS、原生 JavaScript 與 JSON 製作，無須安裝套件或執行建置。完整規範見 [AGENTS.md](AGENTS.md)。

## 目前進度

- 首頁：唱片收藏視覺、封面牆、歌手／專輯搜尋、清除搜尋、隨機挑選。
- 介紹頁：共用內容版型、專輯配色、曲目、推薦歌曲、聆聽連結與來源。
- 載入中、資料為空、搜尋無結果、讀取失敗、未知專輯與封面備用圖片。
- 桌面／手機排版、鍵盤焦點、螢幕閱讀器狀態訊息與減少動畫偏好。

目前收藏八張專輯。

- **Kanye West《Graduation》（2007）**，以〈Big Brother〉作結的 13 首原版。介紹頁為 `album.html?id=kanye-west-graduation`。
- **Bring Me The Horizon《POST HUMAN: NeX GEn》（2024）**，16 首數位版。介紹頁為 `album.html?id=bring-me-the-horizon-post-human-nex-gen`。
- **Frank Ocean《Blonde》（2016）**，17 首數位版。介紹頁為 `album.html?id=frank-ocean-blonde`。
- **Magdalena Bay《Imaginal Disk》（2024）**，15 首數位版。介紹頁為 `album.html?id=magdalena-bay-imaginal-disk`。
- **Lana Del Rey《Norman Fucking Rockwell!》（2019）**，14 首數位版。介紹頁為 `album.html?id=lana-del-rey-norman-fucking-rockwell`。
- **Travis Scott《Rodeo》（2015）**，16 首數位加長版。介紹頁為 `album.html?id=travis-scott-rodeo`。
- **underscores《U》（2026）**，9 首數位版。介紹頁為 `album.html?id=underscores-u`。
- **Tyler, The Creator《IGOR》（2019）**，12 首數位版。介紹頁為 `album.html?id=tyler-the-creator-igor`。

成果網址：尚未發布，預定使用 GitHub Pages。

## 本地預覽

直接雙擊 `index.html` 即可瀏覽收藏、搜尋與開啟專輯介紹。此模式會載入從 `data/albums.json` 產生的 `data/albums.local.js`。

也可在專案根目錄啟動 HTTP 伺服器。

```bash
python -m http.server 8000
```

macOS／Linux 也可使用 `python3 -m http.server 8000`。開啟 <http://localhost:8000/>。在終端機按 `Ctrl+C` 可停止伺服器。HTTP 模式直接讀取 `data/albums.json`。

介紹頁網址為 `album.html?id=<album-id>`。未指定 `id` 或找不到對應資料時，會提供提示及回首頁的連結。

## 檔案結構

```text
.
├── index.html                     首頁與收藏入口
├── album.html                     共用專輯介紹頁
├── data/
│   ├── albums.json                 唯一正式專輯資料來源
│   └── albums.local.js             自動產生的本機預覽資料
├── tools/sync-local-albums.py       同步本機預覽資料
├── assets/
│   ├── css/styles.css              共用配色、元件、響應式樣式
│   ├── js/
│   │   ├── catalog.js              首頁呈現、搜尋與隨機挑選
│   │   ├── detail.js               介紹頁呈現與主題套用
│   │   └── shared.js               資料載入及共用工具
│   └── images/
│       ├── favicon.svg
│       └── covers/                 正式專輯封面與 fallback.svg 備用圖片
├── .nojekyll
├── README.md
└── AGENTS.md
```

首頁唱片插畫以 CSS 繪製，為網站裝飾，不代表正式專輯。正式封面維持正方形、完整顯示，不套用濾鏡。

## 新增專輯

1. 依使用者指定名單查證專輯版本、發行年份、完整曲序、背景與來源。
2. 將有使用依據的封面放入 `assets/images/covers/`，在 `sources` 記錄封面來源。
3. 在 `data/albums.json` 的頂層陣列加入資料物件。
4. 依封面色系選定 `theme`，檢查所有文字、按鈕和連結的對比。
5. 執行 `python tools/sync-local-albums.py`，更新雙擊 HTML 時載入的資料。
6. 重新整理首頁，檢查卡片、搜尋、隨機探索及介紹頁。

以下僅為欄位範本，**不是正式專輯資料**。年份、名稱、文字、曲目、封面與連結均須替換並查證，請勿將「待補」內容作為正式展示資料：

```json
{
  "id": "your-album-id",
  "title": "正式專輯名稱（待補）",
  "artist": "正式歌手名稱（待補）",
  "year": 2026,
  "cover": "assets/images/covers/your-album.webp",
  "theme": {
    "background": "#f3eee4",
    "surface": "#faf7f0",
    "text": "#302a24",
    "mutedText": "#71665c",
    "accent": "#a74329",
    "accentText": "#fff9f0"
  },
  "summary": "一句話介紹（待補）",
  "genres": ["曲風或聽感標籤（待補）"],
  "background": ["經查證的創作背景（待補）"],
  "concept": ["專輯概念，推論與事實分開表達（待補）"],
  "analysis": [
    { "heading": "分析標題（待補）", "text": "具體的節奏、編曲、音色或演唱分析（待補）" }
  ],
  "tracks": [
    { "number": 1, "title": "正式曲名（待補）" }
  ],
  "recommendedTracks": [
    { "trackNumber": 1, "reason": "推薦原因（待補）", "listenFor": "值得注意的聽點（待補）" }
  ],
  "listenLinks": [],
  "sources": []
}
```

- `id` 必須唯一，以小寫英文、數字及連字號組成，發布後盡量維持不變。
- `tracks` 須完整並依曲序排列，與年份對應同一發行版本。
- `recommendedTracks` 建議約 3 首，`trackNumber` 必須對應 `tracks`，曲名自動取得。
- `background`、`concept` 為段落字串陣列，`analysis` 為包含 `heading`、`text` 的物件陣列。
- `listenLinks` 每項為 `{ "label": "平台名稱", "url": "已確認的 HTTPS 網址" }`。
- `sources` 每項為 `{ "title": "來源標題", "url": "已確認的 HTTPS 網址" }`。須補入背景資料及封面來源。
- 正式發布前須補齊所有內容；程式的缺漏提示僅供開發時容錯。

## 主題與互動

`styles.css` 的 `:root` 集中管理預設配色、字體與間距。`shared.js` 的 `defaultTheme` 與 CSS 預設配色保持一致；`detail.js` 依 `id` 讀入專輯後，將 `theme` 的六個欄位套用至 CSS 變數。缺少或無效的色碼逐欄回復預設值，接受 `#RGB` 或 `#RRGGBB`。長文、卡片、標籤、按鈕、連結、頁首與頁尾均使用主題變數。

專輯頁載入後會用約半秒從首頁的米白底色淡入專輯配色。瀏覽器偏好減少動態效果時，會直接顯示專輯配色。

搜尋比對歌手及專輯名稱的部分文字，忽略英文大小寫與前後空白。隨機挑選始終從全部正式資料等機率抽選，不受搜尋影響，允許重複。資料為空時停用隨機按鈕，單張專輯仍可正常使用。

專輯內容以文字節點呈現，不插入資料中的 HTML。外部連結只接受 HTTPS 網址，在原分頁開啟；封面只接受站內相對路徑。資料格式錯誤或讀取失敗會提供重試操作。

## 驗證與發布

檢查 JSON：

```bash
python -m json.tool data/albums.json
```

JavaScript 語法檢查（本地有 Node.js 時）：

```bash
node --check assets/js/shared.js
node --check assets/js/catalog.js
node --check assets/js/detail.js
```

功能驗證項目依 [AGENTS.md](AGENTS.md) 的「本地預覽與驗證」執行。正式專輯上架時，尤其需檢查推薦曲目對應、不同明暗主題的對比，以及資料來源與聆聽連結。

所有站內資源均使用相對路徑，可從 GitHub Pages 的專案子路徑載入。發布時以本專案根目錄作為靜態檔案來源，保留 `.nojekyll`；無須打包或改寫網址。實際發布後，在本文件補上成果網址。
