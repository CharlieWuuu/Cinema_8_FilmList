// 渲染加入最愛的資料
// 變數：取得本機儲存空間
const localData = JSON.parse(localStorage.getItem('片單'))
  ? JSON.parse(localStorage.getItem('片單'))
  : [];

// 函式：載入時，顯示已選片單數量
function showFilmAmount() {
  if (localData.length == 0) {
    document.getElementById('film_amount').style.display = 'none';
  } else {
    document.getElementById('film_amount').innerText = localData.length;
  }
}
showFilmAmount();

// 目的：渲染片單到目標位置
// 變數：要渲染的片單HTML
const filmHTML = `
<section class="film">
	<p><a href="https://charliewuuu.github.io/Cinema_6_aboutFilm/">{{name}}</a> | {{country}} | {{long}} | {{rating}}</p>
  <div id="timelineList">{{timelineList}}</div>
</section>`;

const timelineHTML = `
<div class="timelineList__container">
  <span>{{date}}</span>
  <span>{{startTime}}</span>
  <span class="timelineCinema">{{cinema}}</span>
  <span class="timelineFav" id="{{full_id}}" onclick="chooseFavorite(this.id);">❤</span>
</div>`;

// 迴圈：依序取代資料，放到對應的容器中
for (i = 0; i < filmList.list.length; i++) {
  //產生此部film的場次列表，可以點選
  var fid = filmList.list[i].fid;
  var flist = getFilmTimelineListByFId(fid);

  // 取代各時段的影片資訊
  var currentTimelineList = '';
  for (f = 0; f < flist.length; f++) {
    currentTimelineList += timelineHTML
      .replace('{{date}}', flist[f].date)
      .replace('{{startTime}}', flist[f].startTime)
      .replace('{{cinema}}', flist[f].cinema)
      .replace('{{full_id}}', flist[f].full_id);
  }

  // 取代片單的列表
  var currentFilmHTML = filmHTML
    .replace('{{name}}', filmList.list[i].name)
    .replace('{{country}}', filmList.list[i].countryZH1)
    .replace('{{long}}', filmList.list[i].long)
    .replace('{{rating}}', filmList.list[i].rating)
    .replace('{{fid}}', filmList.list[i].fid)
    .replace('{{timelineList}}', currentTimelineList);

  $('#' + filmList.list[i].tid).append(currentFilmHTML);
}

// 載入時，隱藏除了 id=introduction 以外的區塊
$(function () {
  $('.film__type').attr('style', 'display: none');
});

// 開合
let lastThis = '';
// 函式：點擊.type__title後
$('.type__title').click(function () {
  // 記錄案到的.type__title的href (影片類型id)
  const showFilmHref = $(this).attr('href');
  // 判斷：如果這個已經active，就收起來
  if ($(this).hasClass('active')) {
    $(this).removeClass('active');
    $('#' + showFilmHref).slideUp();
  } else if ($(this).hasClass('active') == false) {
    // 判斷：如果這個有active，且只有它有active，直接收起
    if ($('.type__title').hasClass('active') == false) {
      $(this).addClass('active');
      $('#' + showFilmHref).slideDown();
      // 判斷：如果這個有active，且別人有active，等0.8秒再收起 (讓動畫流暢一點)
    } else {
      const shownFilmHref = $('.type__title.active').attr('href');
      $('.type__title.active').removeClass('active');
      $('#' + shownFilmHref).slideUp();
      $(this).addClass('active');
      $('#' + showFilmHref)
        .delay(800)
        .slideDown();
    }
  }
});

// // 變數：瀏覽器暫存片單(obj)，有的話讀取，沒有的話顯示空的陣列
// const filmFavoriteData = JSON.parse(localStorage.getItem('片單'))
//   ? JSON.parse(localStorage.getItem('片單'))
//   : [];

// console.log(filmFavoriteData);

// // 函式：載入時，顯示已選片單數量
// function showFilmAmount() {
//   document.getElementById('film_amount').innerText = filmFavoriteData.length;
// }
// showFilmAmount();

// 函式：載入時，已選片單變紅色
function showClicked() {
  // 變數：載入時，預選的id；預設為空值
  let chosenId = localStorage.getItem('片單').full_id;
  console.log(chosenId);

  // 檢查：瀏覽器暫存片單(obj)所有資料
  for (i = 0; i < localData.length; i++) {
    chosenId = localData[i].full_id;
    // 判斷：是否有預選id，有的話欲渲染片單的HTML變灰色
    const clickedHTML = document.querySelector('#' + chosenId);
    if (clickedHTML != null) clickedHTML.style.color = '#EA5136';
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
  for (i = 0; i < localData.length; i++) {
    // 判斷：是否有已點擊的id這部
    if (clickedId == localData[i].full_id) {
      current_i = i;
      check = '已經有這部片';
      break;
    }
  }

  // 判斷：瀏覽器暫存片單(obj)中是否有這部，決定push或刪除一筆瀏覽器暫存片單(obj)的資料
  if (check == '已經有這部片') {
    localData.splice(current_i, 1);
    localStorage.setItem('片單', JSON.stringify(localData));
    // 渲染：已選片單變回灰色
    const clickedHTML = document.querySelector('#' + clickedId);
    clickedHTML.style.color = 'rgba(0, 0, 0, 0.2)';
  } else if (check == '還沒有這部片') {
    localData.push({ full_id: clickedId });
    localStorage.setItem('片單', JSON.stringify(localData));
    // 渲染：已選片單變紅色
    showClicked();
  }

  // 渲染：顯示已選片單數量
  showFilmAmount();
}
