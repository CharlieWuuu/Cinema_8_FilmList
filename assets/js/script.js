// 目的：渲染片單到目標位置
// 變數：要渲染的片單HTML
const filmHTML = `
<section class="film">
	<p>{{name}} | {{country}} | {{long}} | {{rating}}</p>
  <span id="{{fid}}" onclick="chooseFavorite(this.id)">♡ 加入片單</span>
</section>`;

// 迴圈：依序取代資料，放到對應的容器中
for (i = 0; i < filmList.list.length; i++) {
  const currentFilmHTML = filmHTML
    .replace('{{name}}', filmList.list[i].name)
    .replace('{{country}}', filmList.list[i].countryZH1)
    .replace('{{long}}', filmList.list[i].long)
    .replace('{{rating}}', filmList.list[i].rating)
    .replace('{{fid}}', filmList.list[i].fid);
  $('#' + filmList.list[i].tid).append(currentFilmHTML);
}

// 開合
let lastThis = '';

$(function () {
  // 隱藏除了 id=introduction 以外的區塊
  $('.film__type').attr('style', 'display:block');

  // 函式：點擊.type__title後
  $('.type__title').click(function () {
    const showFilm = $(this).attr('href');
    console.log(showFilm);
    if (lastThis == showFilm) {
      $(document.querySelector('#' + showFilm)).attr('style', 'display:none');
      lastThis = '';
    } else {
      $('.film__type').attr('style', 'display:none');

      console.log(document.querySelector('#' + showFilm));
      $(document.querySelector('#' + showFilm)).attr('style', 'display:block');
      lastThis = showFilm;
      console.log(lastThis);
    }
  });
});

// 變數：瀏覽器暫存片單(obj)，有的話讀取，沒有的話顯示空的陣列
const filmFavoriteData = JSON.parse(localStorage.getItem('片單'))
  ? JSON.parse(localStorage.getItem('片單'))
  : [];

console.log(filmFavoriteData);

// 函式：載入時，顯示已選片單數量
function showFilmAmount() {
  document.getElementById('film_amount').innerText = filmFavoriteData.length;
}
showFilmAmount();

// 函式：載入時，已選片單變灰色
function showClicked() {
  // 變數：載入時，預選的id；預設為空值
  let chosenId = '';

  // 檢查：瀏覽器暫存片單(obj)所有資料
  for (i = 0; i < filmFavoriteData.length; i++) {
    // 判斷：是否有預選id，有的話欲渲染片單的HTML變灰色
    if ((chosenId = filmFavoriteData[i].fid)) {
      const clickedHTML = document.querySelector('#' + chosenId);
      clickedHTML.style.color = 'gray';
    }
  }
}
showClicked();

// 函式：當點擊愛心時，影片加入我的片單
function chooseFavorite(clickedId) {
  // 變數：設定(1)檢查片單存在與否的i、(2)片單存在狀態、(3)欲渲染片單的HTML
  let current_i = -1;
  let check = '還沒有這部片';
  const clickedHTML = document.querySelector('#' + clickedId);

  // 檢查：瀏覽器暫存片單(obj)所有資料
  for (i = 0; i < filmFavoriteData.length; i++) {
    // 判斷：是否有已點擊的id這部
    if (clickedId == filmFavoriteData[i].fid) {
      current_i = i;
      check = '已經有這部片';
      break;
    }
  }

  // 判斷：瀏覽器暫存片單(obj)中是否有這部，決定push或刪除一筆瀏覽器暫存片單(obj)的資料
  if (check == '已經有這部片') {
    filmFavoriteData.splice(current_i, 1);
    localStorage.setItem('片單', JSON.stringify(filmFavoriteData));
    // 渲染：已選片單變黑色
    const clickedHTML = document.querySelector('#' + clickedId);
    clickedHTML.style.color = 'black';
  } else if (check == '還沒有這部片') {
    filmFavoriteData.push({ fid: clickedId });
    localStorage.setItem('片單', JSON.stringify(filmFavoriteData));
    // 渲染：未選片單變灰色
    showClicked();
  }

  // 渲染：顯示已選片單數量
  showFilmAmount();
}
