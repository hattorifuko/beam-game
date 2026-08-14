const beam = document.getElementById("beam");
const beamImage = document.getElementById("beam-image");

const fin = document.getElementById("fin");
const finImage = document.getElementById("fin-image");

const game = document.getElementById("game");
const message = document.getElementById("message");

const menuButton = document.getElementById("menu-button");
const menuPanel = document.getElementById("menu-panel");

const howtoButton = document.getElementById("howto-button");
const rulesButton = document.getElementById("rules-button");
const menuCloseButton =
  document.getElementById("menu-close-button");

const infoPanel = document.getElementById("info-panel");
const howtoPanel = document.getElementById("howto-panel");
const rulesPanel = document.getElementById("rules-panel");

const infoCloseButtons =
  document.querySelectorAll(".info-close");


// ============================================================
// 基本状態
// ============================================================

let mode = "normal";

let x = 50;
let y = 50;

let dx = 0.08;
let dy = 0.05;

let lastInteractionTime = Date.now();

let normalTimer = null;
let holdTimer = null;
let messageTimer = null;


// ============================================================
// メニュー
// ============================================================

menuButton.addEventListener("touchstart", function(event) {

  event.preventDefault();
  event.stopPropagation();

  toggleMenu();

}, { passive: false });


menuButton.addEventListener("click", function(event) {

  event.preventDefault();
  event.stopPropagation();

  toggleMenu();

});


function toggleMenu() {

  menuPanel.classList.toggle("open");

}


function closeMenu() {

  menuPanel.classList.remove("open");

}


howtoButton.addEventListener("click", function(event) {

  event.preventDefault();
  event.stopPropagation();

  closeMenu();

  rulesPanel.classList.remove("active");
  howtoPanel.classList.add("active");

  infoPanel.classList.add("open");

});


rulesButton.addEventListener("click", function(event) {

  event.preventDefault();
  event.stopPropagation();

  closeMenu();

  howtoPanel.classList.remove("active");
  rulesPanel.classList.add("active");

  infoPanel.classList.add("open");

});


menuCloseButton.addEventListener("click", function(event) {

  event.preventDefault();
  event.stopPropagation();

  closeMenu();

});


infoCloseButtons.forEach(function(button) {

  button.addEventListener("click", function(event) {

    event.preventDefault();
    event.stopPropagation();

    infoPanel.classList.remove("open");

    howtoPanel.classList.remove("active");
    rulesPanel.classList.remove("active");

  });

});


// メニュー領域ではゲーム操作を発生させない
menuPanel.addEventListener("touchstart", function(event) {
  event.stopPropagation();
});

menuPanel.addEventListener("touchmove", function(event) {
  event.stopPropagation();
});

menuPanel.addEventListener("touchend", function(event) {
  event.stopPropagation();
});

infoPanel.addEventListener("touchstart", function(event) {
  event.stopPropagation();
});

infoPanel.addEventListener("touchmove", function(event) {
  event.stopPropagation();
});

infoPanel.addEventListener("touchend", function(event) {
  event.stopPropagation();
});


// ============================================================
// メッセージ
// ============================================================

function showMessage(text, duration) {

  clearTimeout(messageTimer);

  message.textContent = text;

  if (duration) {

    messageTimer = setTimeout(function() {

      message.textContent = "";

    }, duration);

  }

}


function clearMessage() {

  clearTimeout(messageTimer);

  message.textContent = "";

}


// ============================================================
// 最終操作時間
// ============================================================

function updateLastInteraction() {

  lastInteractionTime = Date.now();

}


// ============================================================
// 指表示
// ============================================================

const touchIndicators = {};


function createTouchIndicator(id, touch) {

  let indicator = touchIndicators[id];

  if (!indicator) {

    indicator =
      document.createElement("div");

    indicator.className =
      "touch-indicator";

    document.body.appendChild(indicator);

    touchIndicators[id] =
      indicator;

  }

  indicator.style.left =
    touch.clientX + "px";

  indicator.style.top =
    touch.clientY + "px";

}


function removeTouchIndicator(id) {

  if (touchIndicators[id]) {

    touchIndicators[id].remove();

    delete touchIndicators[id];

  }

}


function clearTouchIndicators() {

  Object.keys(touchIndicators).forEach(
    function(id) {

      removeTouchIndicator(id);

    }
  );

}


// ============================================================
// ✨
/* ========================================================= */

function createSparkle(touch) {

  const sparkle =
    document.createElement("div");

  sparkle.className =
    "sparkle";

  sparkle.textContent =
    "✨";

  sparkle.style.left =
    touch.clientX + "px";

  sparkle.style.top =
    touch.clientY + "px";

  document.body.appendChild(sparkle);

  sparkle.animate(
    [
      {
        transform:
          "translate(-50%, -50%) scale(0.5)",
        opacity: 1
      },
      {
        transform:
          "translate(-50%, -90%) scale(1.4)",
        opacity: 0
      }
    ],
    {
      duration: 450,
      easing: "ease-out"
    }
  );

  setTimeout(function() {

    sparkle.remove();

  }, 500);

}


// ============================================================
// セリフ
// ============================================================

const twoTapLines = [

  "はい！",
  "ハイ！",
  "キタ！キタ！",
  "ダッシュ！！",
  "ギャワ！！",
  "チェンソー様ァ！！",
  "チェンソー様！ 最高！ 最強！",
  "チェンソー様！ 言う事！ 絶対！",
  "チェンソー様！！",
  "チェンソー様ア！！",
  "キャキャ！"

];


const fiveTapLines = [

  "すげえすごい！！",
  "さすがチェンソー様！！",
  "正解！！ 正解！！ 正解！！ 正解！！",
  "チェンソー様天才！ チェンソー様天才！",
  "ヒャ！！ ワアアアアアアアアアア！！"

];


const shakeMaxLines = [

  "チェンソーさまあああ😭",
  "ぎゃああああああ！！",
  "あわあわあわあわ",
  "ヤヴァヤヴァヤヴァヤヴァヤヴァ"

];


const damageLines = [

  "きゃ…き…",
  "う…うぇ…う〜ん……",
  "バクハツもうコリゴリ！",
  "チギャウ……チギャウ……",
  "う…あ…",
  "うう…",
  "ギギャア…………"

];


function randomChoice(list) {

  return list[
    Math.floor(
      Math.random() * list.length
    )
  ];

}


// ============================================================
// 通常モード
// ============================================================

function updateBeamDirection() {

  if (mode !== "normal") return;

  if (dx >= 0) {

    beamImage.style.transform =
      "scaleX(-1)";

  }

  else {

    beamImage.style.transform =
      "scaleX(1)";

  }

}


// ============================================================
// 通常タップ
// ============================================================

let tapCount = 0;
let tapWindowTimer = null;


function registerNormalTap(touch) {

  tapCount++;

  createSparkle(touch);

  clearTimeout(tapWindowTimer);


  if (tapCount >= 5) {

    tapCount = 0;

    showMessage(
      randomChoice(fiveTapLines),
      2000
    );

    return;

  }


  if (tapCount === 2) {

    showMessage(
      randomChoice(twoTapLines),
      1000
    );

  }


  tapWindowTimer =
    setTimeout(function() {

      tapCount = 0;

    }, 850);

}


// ============================================================
// 通常歩行
// ============================================================

function startWalking() {

  if (mode !== "normal") return;

  beam.classList.add("walking");

  clearTimeout(normalTimer);

  normalTimer =
    setTimeout(function() {

      if (mode !== "normal") return;

      stopWalking();

    }, 2000 + Math.random() * 2000);

}


function stopWalking() {

  if (mode !== "normal") return;

  beam.classList.remove("walking");

  clearTimeout(normalTimer);

  normalTimer =
    setTimeout(function() {

      if (mode !== "normal") return;

      startWalking();

    }, 1000 + Math.random() * 2000);

}


// ============================================================
// 通常ジャンプ
// ============================================================

function doTap(touch) {

  if (mode !== "normal") return;

  beam.classList.remove("walking");
  beam.classList.remove("jump");

  void beam.offsetWidth;

  beam.classList.add("jump");

  registerNormalTap(touch);

  setTimeout(function() {

    if (mode !== "normal") return;

    beam.classList.remove("jump");

    startWalking();

  }, 570);

}


// ============================================================
// 通常1本指
// ============================================================

let oneFingerHeld = false;

let touchMoved = false;

let oneFingerStartTime = 0;

let tickleLastX = 0;
let tickleLastY = 0;

let tickleDistance = 0;
let tickleChanges = 0;

let lastTickleDirection = null;

let tickleStartTime = 0;
let tickleLevel = 0;


// ============================================================
// 通常2本指
// ============================================================

let twoFingerHolding = false;

let lastTouchX = 0;
let lastTouchY = 0;

let shakeStartTime = 0;

let shakeMaxReached = false;

let shakingStarted = false;


// ============================================================
// ▲
/* ========================================================= */

const FIN_WAIT_TIME = 5000;

const FIN_AUTO_EXIT_TIME = 10000;

const LEFT_WALL = 10;
const RIGHT_WALL = 90;
const TOP_WALL = 15;
const BOTTOM_WALL = 73;


// 通常周回
const FIN_BASE_SPEED = 0.38;


// 高速周回
const FIN_FAST_START_SPEED = 0.8;
const FIN_FAST_MAX_SPEED = 4.8;

const FIN_FAST_RELEASE_DELAY = 2000;

const FIN_FAST_MAX_TIME = 3000;


// ============================================================
// ▲状態
// ============================================================

let finWall = "left";

let finJumping = false;

let finMovingToWall = false;

let finFastMode = false;

let finMaxSpeedMode = false;

let finCurrentSpeed =
  FIN_BASE_SPEED;

let finFastStartedAt = 0;

let finReleaseTimer = null;

let finAutoExitTimer = null;


// ============================================================
// ▲ホールド
// ============================================================

let finOneFingerHolding = false;

let finHoldRecognized = false;

let finHoldPauseUntil = 0;

let finTargetX = 0;
let finTargetY = 0;


// ============================================================
// ▲小刻み判定
// ============================================================

let finLastMoveX = 0;
let finLastMoveY = 0;

let finRapidMovement = 0;

let finRapidStartTime = 0;

let finRapidLastTime = 0;


// ============================================================
// ▲2タップ
// ============================================================

let finTapCount = 0;

let finTapTimer = null;


// ============================================================
// ▲向き
// ============================================================

function setFinDirection() {

  /*
    画像の基準方向を「下向き」とする。

    左壁：上へ
    上壁：右へ
    右壁：下へ
    下壁：左へ
  */

  let rotation = 0;
  let flip = false;


  if (finWall === "left") {

    rotation = 90;

    flip = false;

  }

  else if (finWall === "top") {

    rotation = 180;

    flip = false;

  }

  else if (finWall === "right") {

    rotation = -90;

    flip = false;

  }

  else {

    rotation = 0;

    flip = true;

  }


  /*
    反時計回りの場合は
    進行方向を反転させる。
  */

  if (finDirection === "counter") {

    flip = !flip;

  }


  finImage.style.transform =
    "rotate(" +
    rotation +
    "deg) " +
    "scaleX(" +
    (flip ? -1 : 1) +
    ")";

}


let finDirection = "clockwise";


// ============================================================
// ▲位置
// ============================================================

function updateFinPosition() {

  x = Math.max(
    LEFT_WALL,
    Math.min(
      RIGHT_WALL,
      x
    )
  );

  y = Math.max(
    TOP_WALL,
    Math.min(
      BOTTOM_WALL,
      y
    )
  );


  fin.style.left =
    x + "%";

  fin.style.top =
    y + "%";

}


// ============================================================
// ▲壁変更
// ============================================================

function chooseRandomFinDirection() {

  finDirection =
    Math.random() < 0.5
      ? "clockwise"
      : "counter";

}


// ============================================================
// ▲通常周回
// ============================================================

function moveFinNormal() {

  const speed =
    FIN_BASE_SPEED;


  if (finDirection === "clockwise") {

    if (finWall === "left") {

      y -= speed;

      if (y <= TOP_WALL) {

        y = TOP_WALL;

        finWall = "top";

        setFinDirection();

      }

    }

    else if (finWall === "top") {

      x += speed;

      if (x >= RIGHT_WALL) {

        x = RIGHT_WALL;

        finWall = "right";

        setFinDirection();

      }

    }

    else if (finWall === "right") {

      y += speed;

      if (y >= BOTTOM_WALL) {

        y = BOTTOM_WALL;

        finWall = "bottom";

        setFinDirection();

      }

    }

    else {

      x -= speed;

      if (x <= LEFT_WALL) {

        x = LEFT_WALL;

        finWall = "left";

        setFinDirection();

      }

    }

  }

  else {

    /*
      反時計回り
    */

    if (finWall === "left") {

      y += speed;

      if (y >= BOTTOM_WALL) {

        y = BOTTOM_WALL;

        finWall = "bottom";

        setFinDirection();

      }

    }

    else if (finWall === "bottom") {

      x += speed;

      if (x >= RIGHT_WALL) {

        x = RIGHT_WALL;

        finWall = "right";

        setFinDirection();

      }

    }

    else if (finWall === "right") {

      y -= speed;

      if (y <= TOP_WALL) {

        y = TOP_WALL;

        finWall = "top";

        setFinDirection();

      }

    }

    else {

      x -= speed;

      if (x <= LEFT_WALL) {

        x = LEFT_WALL;

        finWall = "left";

        setFinDirection();

      }

    }

  }


  updateFinPosition();

}


// ============================================================
// ▲ホールド追従
// ============================================================

function moveFinTowardFinger() {

  if (!finOneFingerHolding) return;

  if (!finHoldRecognized) return;

  if (Date.now() < finHoldPauseUntil) return;


  const rect =
    game.getBoundingClientRect();


  const targetX =
    (
      finTargetX -
      rect.left
    ) /
    rect.width *
    100;


  const targetY =
    (
      finTargetY -
      rect.top
    ) /
    rect.height *
    100;


  if (
    finWall === "left" ||
    finWall === "right"
  ) {

    const target =
      Math.max(
        TOP_WALL,
        Math.min(
          BOTTOM_WALL,
          targetY
        )
      );


    const movement =
      target - y;


    y += movement * 0.035;


    if (Math.abs(movement) > 0.2) {

      if (movement > 0) {

        finDirection =
          finWall === "left"
            ? "counter"
            : "clockwise";

      }

      else {

        finDirection =
          finWall === "left"
            ? "clockwise"
            : "counter";

      }

      setFinDirection();

    }

  }

  else {

    const target =
      Math.max(
        LEFT_WALL,
        Math.min(
          RIGHT_WALL,
          targetX
        )
      );


    const movement =
      target - x;


    x += movement * 0.035;


    if (Math.abs(movement) > 0.2) {

      if (movement > 0) {

        finDirection =
          finWall === "top"
            ? "clockwise"
            : "counter";

      }

      else {

        finDirection =
          finWall === "top"
            ? "counter"
            : "clockwise";

      }

      setFinDirection();

    }

  }


  updateFinPosition();

}


// ============================================================
// ▲モード開始
// ============================================================

function enterFinMode() {

  if (mode !== "normal") return;

  mode = "fin";

  clearTimeout(normalTimer);

  clearTimeout(finAutoExitTimer);

  clearMessage();

  beam.style.display =
    "none";

  fin.style.display =
    "block";


  finFastMode = false;

  finMaxSpeedMode = false;

  finOneFingerHolding = false;

  finHoldRecognized = false;

  finRapidMovement = 0;

  finRapidStartTime = 0;


  /*
    現在位置から最も近い壁を選ぶ
  */

  const distances = {

    left:
      Math.abs(x - LEFT_WALL),

    right:
      Math.abs(x - RIGHT_WALL),

    top:
      Math.abs(y - TOP_WALL),

    bottom:
      Math.abs(y - BOTTOM_WALL)

  };


  finWall =
    Object.keys(distances).reduce(
      function(closest, wall) {

        return distances[wall] <
          distances[closest]
          ? wall
          : closest;

      },
      "left"
    );


  /*
    放置開始時は
    時計回り・反時計回りをランダム
  */

  chooseRandomFinDirection();

  setFinDirection();

  updateFinPosition();

  startFinAutoExitTimer();

}


// ============================================================
// ▲自動解除
// ============================================================

function startFinAutoExitTimer() {

  clearTimeout(finAutoExitTimer);

  finAutoExitTimer =
    setTimeout(function() {

      if (mode !== "fin") return;

      if (
        finOneFingerHolding ||
        finFastMode ||
        finMaxSpeedMode
      ) {

        startFinAutoExitTimer();

        return;

      }

      finJump();

    }, FIN_AUTO_EXIT_TIME);

}


function resetFinAutoExitTimer() {

  if (mode !== "fin") return;

  startFinAutoExitTimer();

}


// ============================================================
// ▲飛び出し
// ============================================================

let finJumpProgress = 0;

let finJumpStartX = 0;
let finJumpStartY = 0;

let finJumpDirectionX = 0;
let finJumpDirectionY = 0;


function finJump() {

  if (mode !== "fin") return;

  if (finJumping) return;

  finJumping = true;

  finJumpProgress = 0;

  finJumpStartX = x;
  finJumpStartY = y;


  if (finWall === "left") {

    finJumpDirectionX = 1;
    finJumpDirectionY = 0;

  }

  else if (finWall === "right") {

    finJumpDirectionX = -1;
    finJumpDirectionY = 0;

  }

  else if (finWall === "top") {

    finJumpDirectionX = 0;
    finJumpDirectionY = 1;

  }

  else {

    finJumpDirectionX = 0;
    finJumpDirectionY = -1;

  }

}


function updateFinJump() {

  if (!finJumping) return;

  finJumpProgress += 0.06;


  let progress;

  if (finJumpProgress < 0.5) {

    progress =
      finJumpProgress * 2;

  }

  else {

    progress =
      1 -
      (finJumpProgress - 0.5) * 2;

  }


  const jumpDistance = 12;


  x =
    finJumpStartX +
    finJumpDirectionX *
    jumpDistance *
    progress;


  y =
    finJumpStartY +
    finJumpDirectionY *
    jumpDistance *
    progress;


  updateFinPosition();


  if (finJumpProgress >= 1) {

    finJumping = false;

    x = finJumpStartX;
    y = finJumpStartY;

    updateFinPosition();

    exitFinModeToNormal();

  }

}


// ============================================================
// ▲→通常
// ============================================================

function exitFinModeToNormal() {

  clearTimeout(finAutoExitTimer);
  clearTimeout(finReleaseTimer);
  clearTimeout(finTapTimer);

  clearTouchState();

  fin.style.display =
    "none";

  beam.style.display =
    "block";

  finJumping = false;

  finFastMode = false;

  finMaxSpeedMode = false;

  finOneFingerHolding = false;

  finHoldRecognized = false;

  mode = "normal";


  beam.style.left =
    x + "%";

  beam.style.top =
    y + "%";


  updateBeamDirection();

  clearMessage();

  updateLastInteraction();

  startWalking();

}


// ============================================================
// ▲高速周回開始
// ============================================================

function startFinFastMode() {

  if (mode !== "fin") return;

  if (finFastMode) return;

  finFastMode = true;

  finMaxSpeedMode = false;

  finFastStartedAt =
    Date.now();

  finCurrentSpeed =
    FIN_FAST_START_SPEED;

  showMessage(
    "ｽｲｽｲｽｲｽｲｽｲｽｲ"
  );

}


// ============================================================
// ▲最高速
// ============================================================

function startFinMaxSpeed() {

  if (mode !== "fin") return;

  if (!finFastMode) return;

  if (finMaxSpeedMode) return;

  finMaxSpeedMode = true;

  finCurrentSpeed =
    FIN_FAST_MAX_SPEED;

  showMessage(
    "キャーーー！！！"
  );

}


// ============================================================
// ▲高速周回
// ============================================================

function moveFinFast() {

  let speed;


  if (finMaxSpeedMode) {

    speed =
      FIN_FAST_MAX_SPEED;

  }

  else {

    const elapsed =
      Date.now() -
      finFastStartedAt;


    const progress =
      Math.min(
        1,
        elapsed / 3000
      );


    speed =
      FIN_FAST_START_SPEED +
      (
        FIN_FAST_MAX_SPEED -
        FIN_FAST_START_SPEED
      ) *
      progress;

  }


  /*
    周回は通常周回と同じ方向。
  */

  if (finDirection === "clockwise") {

    if (finWall === "left") {

      y -= speed;

      if (y <= TOP_WALL) {

        y = TOP_WALL;
        finWall = "top";
        setFinDirection();

      }

    }

    else if (finWall === "top") {

      x += speed;

      if (x >= RIGHT_WALL) {

        x = RIGHT_WALL;
        finWall = "right";
        setFinDirection();

      }

    }

    else if (finWall === "right") {

      y += speed;

      if (y >= BOTTOM_WALL) {

        y = BOTTOM_WALL;
        finWall = "bottom";
        setFinDirection();

      }

    }

    else {

      x -= speed;

      if (x <= LEFT_WALL) {

        x = LEFT_WALL;
        finWall = "left";
        setFinDirection();

      }

    }

  }

  else {

    if (finWall === "left") {

      y += speed;

      if (y >= BOTTOM_WALL) {

        y = BOTTOM_WALL;
        finWall = "bottom";
        setFinDirection();

      }

    }

    else if (finWall === "bottom") {

      x += speed;

      if (x >= RIGHT_WALL) {

        x = RIGHT_WALL;
        finWall = "right";
        setFinDirection();

      }

    }

    else if (finWall === "right") {

      y -= speed;

      if (y <= TOP_WALL) {

        y = TOP_WALL;
        finWall = "top";
        setFinDirection();

      }

    }

    else {

      x -= speed;

      if (x <= LEFT_WALL) {

        x = LEFT_WALL;
        finWall = "left";
        setFinDirection();

      }

    }

  }


  updateFinPosition();

}


// ============================================================
// ▲高速周回解除
// ============================================================

function releaseFinFastMode() {

  clearTimeout(finReleaseTimer);

  finReleaseTimer =
    setTimeout(function() {

      if (mode !== "fin") return;

      finishFinFastReaction();

    }, FIN_FAST_RELEASE_DELAY);

}


// ============================================================
// ▲通常高速終了
// ============================================================

function finishFinFastReaction() {

  if (finMaxSpeedMode) {

    finishFinMaxReaction();

    return;

  }


  finFastMode = false;

  finMaxSpeedMode = false;

  clearMessage();


  /*
    少しだけスイーッと減速してから
    キャキャ！！。
  */

  finCurrentSpeed =
    FIN_BASE_SPEED * 0.3;


  showMessage(
    "キャキャ！！"
  );


  fin.style.display =
    "none";

  beam.style.display =
    "block";

  beam.style.left =
    x + "%";

  beam.style.top =
    y + "%";

  beam.classList.remove("walking");
  beam.classList.remove("jump");

  void beam.offsetWidth;

  beam.classList.add("jump");


  /*
    着地前に▲へ戻す。
  */

  setTimeout(function() {

    beam.classList.remove("jump");

    beam.style.display =
      "none";

    fin.style.display =
      "block";

    mode = "fin";

    finMovingToWall = false;

    finJumping = false;

    showMessage(
      "ザプンッ！",
      700
    );

    setFinDirection();

    updateFinPosition();

  }, 420);


  setTimeout(function() {

    if (mode !== "fin") return;

    clearMessage();

    startFinAutoExitTimer();

  }, 1100);

}


// ============================================================
// ▲最高速終了
// ============================================================

function finishFinMaxReaction() {

  finFastMode = false;

  finMaxSpeedMode = false;

  clearMessage();


  fin.style.display =
    "none";

  beam.style.display =
    "block";

  beam.style.left =
    x + "%";

  beam.style.top =
    y + "%";

  beam.classList.remove("walking");
  beam.classList.remove("jump");

  void beam.offsetWidth;

  beam.classList.add("jump");


  showMessage(
    "キャッ！！キャキャキャ！！"
  );


  /*
    3回のジャンプは
    同じジャンプアニメーションを
    再スタートする。
  */

  setTimeout(function() {

    if (mode !== "fin") return;

    beam.classList.remove("jump");

    void beam.offsetWidth;

    beam.classList.add("jump");

  }, 650);


  setTimeout(function() {

    if (mode !== "fin") return;

    beam.classList.remove("jump");

    void beam.offsetWidth;

    beam.classList.add("jump");

  }, 1300);


  setTimeout(function() {

    beam.classList.remove("jump");

    mode = "normal";

    clearMessage();

    updateLastInteraction();

    startWalking();

  }, 1900);

}


// ============================================================
// ▲2タップ
// ============================================================

function registerFinTap() {

  finTapCount++;

  clearTimeout(finTapTimer);


  if (finTapCount >= 2) {

    finTapCount = 0;

    exitFinModeByTap();

    return;

  }


  finTapTimer =
    setTimeout(function() {

      finTapCount = 0;

    }, 500);

}


// ============================================================
// ▲2タップ解除
// ============================================================

function exitFinModeByTap() {

  clearTimeout(finTapTimer);
  clearTimeout(finAutoExitTimer);
  clearTimeout(finReleaseTimer);

  finTapCount = 0;

  finFastMode = false;

  finMaxSpeedMode = false;

  finOneFingerHolding = false;

  finHoldRecognized = false;

  clearMessage();

  finJump();

}


// ============================================================
// ▲1秒ホールド
// ============================================================

function recognizeFinHold() {

  if (mode !== "fin") return;

  if (!finOneFingerHolding) return;

  if (finHoldRecognized) return;


  finHoldRecognized = true;

  finHoldPauseUntil =
    Date.now() + 1000;


  finRapidMovement = 0;

  finRapidStartTime = 0;

  finRapidLastTime = 0;


  showMessage(
    "……！"
  );


  resetFinAutoExitTimer();

}


// ============================================================
// ▲小刻み判定
// ============================================================

function checkFinRapidMovement(
  currentX,
  currentY
) {

  if (!finOneFingerHolding) return;

  if (!finHoldRecognized) return;

  if (finFastMode) return;

  if (Date.now() < finHoldPauseUntil) return;


  const moveX =
    currentX - finLastMoveX;

  const moveY =
    currentY - finLastMoveY;


  const distance =
    Math.sqrt(
      moveX * moveX +
      moveY * moveY
    );


  const now =
    Date.now();


  /*
    ここをかなり厳しくする。

    7px程度の微妙な指揺れでは
    高速周回に入らない。

    1回の移動量 10px以上
    かつ短時間に複数回
  */

  if (distance >= 10) {

    if (
      finRapidLastTime === 0 ||
      now - finRapidLastTime < 450
    ) {

      finRapidMovement++;

    }

    else {

      finRapidMovement = 1;

    }


    finRapidLastTime =
      now;


    if (
      finRapidMovement >= 4
    ) {

      startFinFastMode();

    }

  }


  finLastMoveX =
    currentX;

  finLastMoveY =
    currentY;

}


// ============================================================
// 通常くすぐり
// ============================================================

function startTickle() {

  mode = "tickled";

  tickleStartTime =
    Date.now();

  tickleLevel = 1;

  beam.classList.add("tickled");

  beam.dataset.tickleLevel =
    "1";

  showMessage(
    "くすぐったい……ッ！"
  );

}


function updateTickle() {

  if (mode !== "tickled") return;


  const elapsed =
    (
      Date.now() -
      tickleStartTime
    ) / 1000;


  if (elapsed < 0.8) {

    tickleLevel = 1;

    beam.dataset.tickleLevel =
      "1";

    showMessage(
      "くすぐったい……ッ！"
    );

  }

  else if (elapsed < 1.6) {

    tickleLevel = 2;

    beam.dataset.tickleLevel =
      "2";

    showMessage(
      "キャハッ！ キャッキャッ！"
    );

  }

  else if (elapsed < 2.5) {

    tickleLevel = 3;

    beam.dataset.tickleLevel =
      "3";

    showMessage(
      "や、やめ…"
    );

  }

  else {

    tickleLevel = 4;

    beam.dataset.tickleLevel =
      "4";

    beam.classList.add(
      "tickle-max"
    );

    showMessage(
      "キャハ〜〜！！"
    );

  }

}


// ============================================================
// やられリアクション
// ============================================================

function showDamageReaction() {

  mode = "damage";

  beam.classList.remove("panting");
  beam.classList.remove("shake-max");

  beam.classList.add("damage");

  showMessage(
    randomChoice(damageLines),
    2200
  );


  setTimeout(function() {

    beam.classList.remove("damage");

    if (mode !== "damage") return;

    mode = "normal";

    clearMessage();

    updateLastInteraction();

    startWalking();

  }, 2200);

}


// ============================================================
// タッチ開始
// ============================================================

game.addEventListener(
  "touchstart",
  function(event) {

    event.preventDefault();

    updateLastInteraction();


    Array.from(
      event.changedTouches
    ).forEach(function(touch) {

      createTouchIndicator(
        touch.identifier,
        touch
      );

    });


    // ========================================================
    // ▲
    // ========================================================

    if (mode === "fin") {

      resetFinAutoExitTimer();


      if (event.touches.length >= 2) {

        return;

      }


      if (event.touches.length === 1) {

        const touch =
          event.touches[0];


        finOneFingerHolding = true;

        finHoldRecognized = false;

        finTargetX =
          touch.clientX;

        finTargetY =
          touch.clientY;

        finLastMoveX =
          touch.clientX;

        finLastMoveY =
          touch.clientY;


        finRapidMovement = 0;

        finRapidStartTime = 0;

        finRapidLastTime = 0;


        clearTimeout(holdTimer);


        /*
          1秒経つまで
          「ただのタップ」として待つ。
        */

        holdTimer =
          setTimeout(function() {

            if (
              mode === "fin" &&
              finOneFingerHolding
            ) {

              recognizeFinHold();

            }

          }, 1000);


        return;

      }

    }


    // ========================================================
    // 通常2本指
    // ========================================================

    if (event.touches.length >= 2) {

      clearTimeout(holdTimer);
      clearTimeout(normalTimer);

      twoFingerHolding = true;

      mode =
        "twoFingerWaiting";


      beam.classList.remove("walking");
      beam.classList.remove("jump");
      beam.classList.remove("shaking");
      beam.classList.remove("shake-max");


      lastTouchX =
        (
          event.touches[0].clientX +
          event.touches[1].clientX
        ) / 2;


      lastTouchY =
        (
          event.touches[0].clientY +
          event.touches[1].clientY
        ) / 2;


      shakeStartTime = 0;

      shakeMaxReached = false;

      shakingStarted = false;


      holdTimer =
        setTimeout(function() {

          if (
            mode === "twoFingerWaiting" &&
            twoFingerHolding
          ) {

            mode = "held";

            beam.classList.add("held");

            showMessage(
              "キャ？(浮いてる……)"
            );

          }

        }, 450);


      return;

    }


    // ========================================================
    // 通常1本指
    // ========================================================

    if (event.touches.length === 1) {

      clearTimeout(holdTimer);
      clearTimeout(normalTimer);

      oneFingerHeld = true;

      oneFingerStartTime =
        Date.now();

      touchMoved = false;

      tickleDistance = 0;

      tickleChanges = 0;

      lastTickleDirection = null;

      tickleStartTime = 0;

      tickleLevel = 0;


      tickleLastX =
        event.touches[0].clientX;

      tickleLastY =
        event.touches[0].clientY;


      holdTimer =
        setTimeout(function() {

          if (
            oneFingerHeld &&
            !touchMoved
          ) {

            mode =
              "oneFingerHold";

            beam.classList.remove(
              "walking"
            );

            showMessage(
              "……？"
            );

          }

        }, 550);

    }

  },
  { passive: false }
);


// ============================================================
// タッチ移動
// ============================================================

game.addEventListener(
  "touchmove",
  function(event) {

    event.preventDefault();

    updateLastInteraction();


    Array.from(
      event.changedTouches
    ).forEach(function(touch) {

      createTouchIndicator(
        touch.identifier,
        touch
      );

    });


    // ========================================================
    // ▲1本指
    // ========================================================

    if (
      mode === "fin" &&
      finOneFingerHolding &&
      event.touches.length === 1
    ) {

      const touch =
        event.touches[0];


      finTargetX =
        touch.clientX;

      finTargetY =
        touch.clientY;


      checkFinRapidMovement(
        touch.clientX,
        touch.clientY
      );


      resetFinAutoExitTimer();

      return;

    }


    // ========================================================
    // 通常2本指待機
    // ========================================================

    if (
      mode === "twoFingerWaiting" &&
      event.touches.length >= 2
    ) {

      lastTouchX =
        (
          event.touches[0].clientX +
          event.touches[1].clientX
        ) / 2;


      lastTouchY =
        (
          event.touches[0].clientY +
          event.touches[1].clientY
        ) / 2;


      return;

    }


    // ========================================================
    // 通常2本指ホールド
    // ========================================================

    if (
      mode === "held" &&
      event.touches.length >= 2
    ) {

      const currentTouchX =
        (
          event.touches[0].clientX +
          event.touches[1].clientX
        ) / 2;


      const currentTouchY =
        (
          event.touches[0].clientY +
          event.touches[1].clientY
        ) / 2;


      const moveX =
        currentTouchX -
        lastTouchX;

      const moveY =
        currentTouchY -
        lastTouchY;


      const movement =
        Math.sqrt(
          moveX * moveX +
          moveY * moveY
        );


      if (
        !shakingStarted &&
        movement >= 7
      ) {

        shakingStarted = true;

        shakeStartTime =
          Date.now();

        beam.classList.add(
          "shaking"
        );

        showMessage(
          "ギャワワワ！？(ブンブン)"
        );

      }


      if (
        shakingStarted &&
        !shakeMaxReached
      ) {

        const elapsed =
          Date.now() -
          shakeStartTime;


        if (elapsed >= 2000) {

          shakeMaxReached = true;

          beam.classList.remove(
            "shaking"
          );

          beam.classList.add(
            "shake-max"
          );

          showMessage(
            randomChoice(
              shakeMaxLines
            )
          );

        }

      }


      x +=
        moveX /
        game.clientWidth *
        100;


      y +=
        moveY /
        game.clientHeight *
        100;


      x =
        Math.max(
          10,
          Math.min(
            90,
            x
          )
        );


      y =
        Math.max(
          15,
          Math.min(
            BOTTOM_WALL,
            y
          )
        );


      beam.style.left =
        x + "%";

      beam.style.top =
        y + "%";


      lastTouchX =
        currentTouchX;

      lastTouchY =
        currentTouchY;


      return;

    }


    // ========================================================
    // 通常1本指くすぐり
    // ========================================================

    if (
      event.touches.length === 1 &&
      oneFingerHeld
    ) {

      const currentX =
        event.touches[0].clientX;

      const currentY =
        event.touches[0].clientY;


      const moveX =
        currentX -
        tickleLastX;

      const moveY =
        currentY -
        tickleLastY;


      const distance =
        Math.sqrt(
          moveX * moveX +
          moveY * moveY
        );


      if (distance > 8) {

        touchMoved = true;

      }


      tickleDistance +=
        distance;


      let direction = null;


      if (
        Math.abs(moveX) >
        Math.abs(moveY)
      ) {

        if (Math.abs(moveX) > 5) {

          direction =
            moveX > 0
              ? "right"
              : "left";

        }

      }

      else {

        if (Math.abs(moveY) > 5) {

          direction =
            moveY > 0
              ? "down"
              : "up";

        }

      }


      if (
        direction !== null &&
        lastTickleDirection !== null &&
        direction !== lastTickleDirection
      ) {

        tickleChanges++;

      }


      if (direction !== null) {

        lastTickleDirection =
          direction;

      }


      if (
        mode !== "tickled" &&
        tickleChanges >= 3 &&
        tickleDistance >= 55
      ) {

        startTickle();

      }


      if (mode === "tickled") {

        updateTickle();

      }


      tickleLastX =
        currentX;

      tickleLastY =
        currentY;

    }

  },
  { passive: false }
);


// ============================================================
// タッチ終了
// ============================================================

game.addEventListener(
  "touchend",
  function(event) {

    updateLastInteraction();


    Array.from(
      event.changedTouches
    ).forEach(function(touch) {

      removeTouchIndicator(
        touch.identifier
      );

    });


    // ========================================================
    // ▲
    // ========================================================

    if (
      mode === "fin" &&
      finOneFingerHolding
    ) {

      clearTimeout(holdTimer);

      finOneFingerHolding = false;


      if (finMaxSpeedMode) {

        releaseFinFastMode();

        return;

      }


      if (finFastMode) {

        releaseFinFastMode();

        return;

      }


      if (finHoldRecognized) {

        finHoldRecognized = false;

        clearMessage();

        resetFinAutoExitTimer();

        return;

      }


      /*
        1秒未満ならタップ。
      */

      registerFinTap();

      return;

    }


    // ========================================================
    // 通常2本指待機終了
    // ========================================================

    if (
      event.touches.length === 0 &&
      mode === "twoFingerWaiting"
    ) {

      clearTimeout(holdTimer);

      twoFingerHolding = false;

      mode = "normal";

      doTap(
        event.changedTouches[0]
      );

      return;

    }


    // ========================================================
    // 通常2本指ホールド終了
    // ========================================================

    if (
      event.touches.length === 0 &&
      mode === "held"
    ) {

      clearTimeout(holdTimer);

      twoFingerHolding = false;


      beam.classList.remove("held");
      beam.classList.remove("shaking");
      beam.classList.remove("shake-max");


      mode = "dropping";

      clearMessage();

      beam.classList.remove("drop");

      void beam.offsetWidth;

      beam.classList.add("drop");


      showMessage(
        "ぽとっ……"
      );


      const wasMax =
        shakeMaxReached;


      setTimeout(function() {

        beam.classList.remove("drop");


        if (wasMax) {

          showDamageReaction();

          return;

        }


        setTimeout(function() {

          if (mode !== "dropping") return;

          mode = "normal";

          clearMessage();

          updateLastInteraction();

          startWalking();

        }, 1000);

      }, 350);


      return;

    }


    // ========================================================
    // 最大くすぐり終了
    // ========================================================

    if (
      event.touches.length === 0 &&
      mode === "tickled"
    ) {

      const wasMax =
        tickleLevel >= 4;


      beam.classList.remove(
        "tickled"
      );

      beam.classList.remove(
        "tickle-max"
      );

      delete beam.dataset.tickleLevel;


      mode = "resting";


      if (wasMax) {

        /*
          「キャハ〜〜！！」を
          そのまま表示しながら
          大きく1回ジャンプ。
        */

        beam.classList.remove(
          "panting"
        );

        beam.classList.remove(
          "big-jump"
        );

        void beam.offsetWidth;

        beam.classList.add(
          "big-jump"
        );

        showMessage(
          "キャハ〜〜！！"
        );


        setTimeout(function() {

          beam.classList.remove(
            "big-jump"
          );

          if (mode !== "resting") return;

          beam.classList.add(
            "panting"
          );

          showMessage(
            "はぁ…はぁ…"
          );


          setTimeout(function() {

            beam.classList.remove(
              "panting"
            );

            showDamageReaction();

          }, 2200);

        }, 1000);

      }

      else {

        showMessage(
          "キャッ！"
        );


        setTimeout(function() {

          if (mode !== "resting") return;

          mode = "normal";

          clearMessage();

          updateLastInteraction();

          startWalking();

        }, 1500);

      }


      return;

    }


    // ========================================================
    // 通常1本指ホールド終了
    // ========================================================

    if (
      event.touches.length === 0 &&
      mode === "oneFingerHold"
    ) {

      clearTimeout(holdTimer);

      oneFingerHeld = false;

      mode = "normal";

      clearMessage();

      updateLastInteraction();

      startWalking();

      return;

    }


    // ========================================================
    // 通常1本指
    // ========================================================

    if (
      event.touches.length === 0 &&
      oneFingerHeld
    ) {

      clearTimeout(holdTimer);

      oneFingerHeld = false;


      if (
        !touchMoved &&
        mode !== "oneFingerHold"
      ) {

        mode = "normal";

        doTap(
          event.changedTouches[0]
        );

        return;

      }


      if (mode !== "tickled") {

        mode = "normal";

        clearMessage();

        updateLastInteraction();

        startWalking();

      }

    }


    /*
      iOS系で touchcancel が発生した場合にも
      指表示を残さないための保険。
    */

    clearTouchIndicators();

  },
  { passive: false }
);


// ============================================================
// touchcancel
// ============================================================

game.addEventListener(
  "touchcancel",
  function() {

    clearTouchIndicators();

    clearTimeout(holdTimer);

    oneFingerHeld = false;
    twoFingerHolding = false;

    if (mode === "fin") {

      finOneFingerHolding = false;

    }

  },
  { passive: false }
);


// ============================================================
// 通常移動
// ============================================================

function moveBeam() {

  if (mode === "normal") {

    x += dx;
    y += dy;


    if (x >= 90) {

      x = 90;

      dx =
        -Math.abs(dx);

      updateBeamDirection();

    }


    if (x <= 10) {

      x = 10;

      dx =
        Math.abs(dx);

      updateBeamDirection();

    }


    if (y >= BOTTOM_WALL) {

      y = BOTTOM_WALL;

      dy =
        -Math.abs(dy);

    }


    if (y <= TOP_WALL) {

      y = TOP_WALL;

      dy =
        Math.abs(dy);

    }


    beam.style.left =
      x + "%";

    beam.style.top =
      y + "%";

  }


  requestAnimationFrame(
    moveBeam
  );

}


// ============================================================
// ▲移動ループ
// ============================================================

function moveFinLoop() {

  if (mode === "fin") {

    if (finJumping) {

      updateFinJump();

    }

    else if (finFastMode) {

      moveFinFast();

    }

    else if (
      finOneFingerHolding &&
      finHoldRecognized
    ) {

      moveFinTowardFinger();

    }

    else {

      moveFinNormal();

    }

  }


  requestAnimationFrame(
    moveFinLoop
  );

}


// ============================================================
// 通常方向ランダム変更
// ============================================================

setInterval(function() {

  if (mode !== "normal") return;


  const angle =
    Math.random() *
    Math.PI *
    2;


  dx =
    Math.cos(angle) *
    0.08;

  dy =
    Math.sin(angle) *
    0.08;


  updateBeamDirection();

}, 2000);


// ============================================================
// くすぐり更新
// ============================================================

setInterval(function() {

  if (mode === "tickled") {

    updateTickle();

  }

}, 100);


// ============================================================
// 5秒無操作→▲
// ============================================================

setInterval(function() {

  if (
    mode === "normal" &&
    Date.now() -
      lastInteractionTime >=
      FIN_WAIT_TIME
  ) {

    enterFinMode();

  }

}, 100);


// ============================================================
// 状態リセット用
// ============================================================

function clearTouchState() {

  clearTimeout(holdTimer);

  oneFingerHeld = false;
  twoFingerHolding = false;

  finOneFingerHolding = false;

  clearTouchIndicators();

}


// ============================================================
// 初期化
// ============================================================

beam.style.display =
  "block";

fin.style.display =
  "none";


beam.style.left =
  x + "%";

beam.style.top =
  y + "%";


updateBeamDirection();

startWalking();

moveBeam();

moveFinLoop();
