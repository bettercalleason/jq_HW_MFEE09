const MatchGame= {};

// 使用立即函示執行卡片渲染

$(function() {
  const $game = $('#game');
  const values = generateCardValues();
  renderCards(values, $game);
  console.log("values", values)
});  

// 命名一個空陣列cardValues，並且push從cardArray隨機選取一個randomIndex（0-15)進去
// 並且在新的迴圈逐漸splice cardArray中的數值，直到cardArray.length = 0
// 最後得到的cardValues為一個16個數值的陣列

generateCardValues = () => {
  const cardArray = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8];
  const cardValues = [];
  // const 若為一個物件或陣列，是可變的
  while (cardArray.length > 0) {
      const randomIndex = Math.floor(Math.random()*cardArray.length);
      // console.log("randomIndex", randomIndex) 
      cardValues.push(cardArray[randomIndex]);
      // console.log("cardValues", cardValues)
      cardArray.splice(randomIndex,1);
      console.log("cardArray", cardArray)
  }

  return cardValues;
};  

// 將cardValues中16個數值轉換成jQ物件並賦予data值

renderCards = (cardValues, $game) => {
  // 為每一個cardValues產生顏色 
  const cardColors = ["burlywood", "cadetblue", "coral", "darkseagreen", "darkorange", "purple", "pink", "brown"];
  //清除HTML
  $game.empty();
  // 用法 .data( key, value )
  // $.data（）函數用於在指定的元素上訪問數據，返回設置值。(臨時數據)
  // 在$game變數上先存儲再獲取數據

  // 追蹤 flippedCards 數量
  $game.data('flippedCards',[]); 
  // 使用forEach建構函式建構card的data物件,共16個，並用字串模板將物件取出再印上去
  cardValues.forEach((value) => {
    // value為cardValues逐一取出的值
    const $card = $('<div class="card"></div>');
    $card.data('value', value);
    $card.data('isFlipped', false);
    // value對應數字1-8，使用index-1的方式可以將相同號碼對應到同個cardColors
    $card.data('color', cardColors[value - 1]);
    console.log( 'value', value, 'color', cardColors[value - 1] );
    $game.append($card);
  });

// 監聽user翻牌
  $('.card').on('click', function() {
    flipCard($(this), $('#game'));
  });
};

//檢查翻開的兩張陷阱卡是否相符，並且給予相對應的顏色

flipCard = ($card, $game) => {
  // 如果牌被翻過就return
  if ($card.data('isFlipped')) {
    return;
  };

  $card.css('background-color', $card.data('color'));
  $card.text($card.data('value'));
  $card.data('isFlipped', true);
  // 第44行$game.data('flippedCards',[])，將翻過的兩張牌牌push進flippedCards的陣列
  let flippedCards = $game.data('flippedCards')
  flippedCards.push($card);
  console.log(flippedCards, $card)

  // 如果有兩張卡被翻起來的話就開始檢查
  if (flippedCards.length === 2) {
    //如果兩個顏色相符就將bg和color轉為灰色
    if (flippedCards[0].data('value') === flippedCards[1].data('value')) {
      const matched = {
        backgroundColor: 'rgb(153,153,153)',
        color: 'rgb(204,204,204)'
      };

      flippedCards[0].css(matched);
      flippedCards[1].css(matched);

      } else {
      // 如果不match就過0.5秒reset到原始樣式
        window.setTimeout(() => {
          flippedCards[0].css('background-color', 'rgb(32, 64, 86)')
            .text('')
            .data('isFlipped',false);
          flippedCards[1].css('background-color', 'rgb(32, 64, 86)')
            .text('')
            .data('isFlipped',false);
        }, 500);
      };
    // reset翻過的牌的陣列
    $game.data('flippedCards',[]); 
  };
};
