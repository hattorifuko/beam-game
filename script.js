const beam = document.getElementById("beam");
const fin = document.getElementById("fin");
const game = document.getElementById("game");
const message = document.getElementById("message");

const menuButton = document.getElementById("menu-button");
const menuPanel = document.getElementById("menu-panel");

const howtoButton = document.getElementById("howto-button");
const rulesButton = document.getElementById("rules-button");
const closeMenuButton = document.getElementById("close-menu-button");

const infoOverlay = document.getElementById("info-overlay");
const infoClose = document.getElementById("info-close");

const howtoSection = document.getElementById("howto-section");
const rulesSection = document.getElementById("rules-section");


// ============================================================
// 基本状態
// ============================================================

let mode = "normal";

let x = 50;
let y = 50;

let dx = 0.08;
let dy = 0.05;

let normalTimer = null;
let holdTimer = null;
let messageTimer = null;

let lastInteractionTime = Date.now();


// ============================================================
// メニュー
// ============================================================

function openMenu() {
  menuPanel.classList.remove("hidden");
}

function closeMenu() {
  menuPanel.classList.add("hidden");
}

function openInfo(section) {

  closeMenu();

  howtoSection.classList.add("hidden");
  rulesSection.classList.add("hidden");

  if (section === "howto") {
    howtoSection.classList.remove("hidden");
  }

  if (section === "rules") {
    rulesSection.classList.remove("hidden");
  }

  infoOverlay.classList.remove("hidden");
}

function closeInfo() {
  infoOverlay.classList.add("hidden");
}


menuButton.addEventListener("click", function(event) {

  event.stopPropagation();

  if (menuPanel.classList.contains("hidden")) {
    openMenu();
  }
  else {
    closeMenu();
  }

});


howtoButton.addEventListener("click", function(event) {

  event.stopPropagation();

  openInfo("howto");

});


rulesButton.addEventListener("click", function(event) {

  event.stopPropagation();

  openInfo("rules");

});


closeMenuButton.addEventListener("click", function(event) {

  event.stopPropagation();

  closeMenu();

});


infoClose.addEventListener("click", function(event) {

  event.stopPropagation();

  closeInfo();

});


/*
  説明画面の外側をタップしても閉じる。
  中身を触った場合は閉じない。
*/

infoOverlay.addEventListener("click", function(event) {

  if (event.target === infoOverlay) {
    closeInfo();
  }

});


/*
  メニュー・説明画面の操作は
  ゲーム本体に伝えない。
*/

menuPanel.addEventListener("touchstart", function(event) {
  event.stopPropagation();
}, { passive: false });

menuPanel.addEventListener("touchmove", function(event) {
  event.stopPropagation();
}, { passive: false });

menuPanel.addEventListener("touchend", function(event) {
  event.stopPropagation();
}, { passive: false });

infoOverlay.addEventListener("touchstart", function(event) {
  event.stopPropagation();
}, { passive: false });

infoOverlay.addEventListener("touchmove", function(event) {
  event.stopPropagation();
}, { passive: false });

infoOverlay.addEventListener("touchend", function(event) {
  event.stopPropagation();
}, { passive: false });


// ============================================================
// 指表示
// ============================================================

const touchIndicators = {};

function createTouchIndicator(id, touch) {

  let indicator = touchIndicators[id];

  if (!indicator) {

    indicator = document.createElement("div");

    indicator.className = "touch-indicator";

    indicator.textContent = "○";

    indicator.style.position = "fixed";
    indicator.style.zIndex = "9999";
    indicator.style.pointerEvents = "none";
    indicator.style.fontSize = "34px";
    indicator.style.lineHeight = "1";
    indicator.style.color = "#555";
    indicator.style.fontWeight = "bold";
    indicator.style.transform = "translate(-50%, -50%)";

    document.body.appendChild(indicator);

    touchIndicators[id] = indicator;
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
// ✨ タップエフェクト
// ============================================================

function createSparkle(touch) {

  const sparkle =
    document.createElement("div");

  sparkle.textContent = "✨";

  sparkle.style.position = "fixed";
  sparkle.style.left =
    touch.clientX + "px";

  sparkle.style.top =
    touch.clientY + "px";

  sparkle.style.zIndex = "9998";
  sparkle.style.pointerEvents = "none";
  sparkle.style.fontSize = "28px";
  sparkle.style.transform =
    "translate(-50%, -50%)";

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


function showMessage(text, duration) {

  clearTimeout(messageTimer);

  message.textContent = text;

  if (duration) {

    messageTimer =
      setTimeout(function() {
        message.textContent = "";
      }, duration);

  }

}


function clearMessage() {

  clearTimeout(messageTimer);

  message.textContent = "";

}


function updateLastInteraction() {

  lastInteractionTime = Date.now();

}


// ============================================================
// 通常モード
// ============================================================

function updateBeamDirection() {

  if (mode !== "normal" &&
      mode !== "oneFingerHold" &&
      mode !== "tickled" &&
      mode !== "resting" &&
      mode !== "damage" &&
      mode !== "held" &&
      mode !== "dropping") {
    return;
  }

  if (dx > 0) {
    beam.style.transform =
      "translate(-50%, -50%) scaleX(1)";
  }
  else {
    beam.style.transform =
      "translate(-50%, -50%) scaleX(-1)";
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
// 通常タップジャンプ
// ============================================================

let jumpUntil = 0;


function doTap(touch) {

  if (mode !== "normal") return;

  beam.classList.remove("walking");
  beam.classList.remove("jump");

  void beam.offsetWidth;

  beam.classList.add("jump");

  jumpUntil =
    Date.now() + 650;

  registerNormalTap(touch);


  setTimeout(function() {

    if (mode !== "normal") return;

    if (Date.now() < jumpUntil) return;

    beam.classList.remove("jump");

    startWalking();

  }, 660);

}


// ============================================================
// 通常 1本指
// ============================================================

let oneFingerHeld = false;

let tickleLastX = 0;
let tickleLastY = 0;

let tickleDistance = 0;
let tickleChanges = 0;

let lastTickleDirection = null;

let touchMoved = false;

let tickleStartTime = 0;
let tickleLevel = 0;


// ============================================================
// 通常 2本指
// ============================================================

let twoFingerHolding = false;

let lastTouchX = 0;
let lastTouchY = 0;

let shakeStartTime = 0;

let shakeMaxReached = false;

let shakingStarted = false;


// ============================================================
// ▲ 移行
// ============================================================

const FIN_WAIT_TIME = 5000;


// ============================================================
// ▲ 壁
// ============================================================

const LEFT_WALL = 12;
const RIGHT_WALL = 88;

const TOP_WALL = 18;
const BOTTOM_WALL = 72;


// ============================================================
// ▲ 通常周回速度
// ============================================================

const FIN_BASE_SPEED = 0.45;


// ============================================================
// ▲ 高速周回
// ============================================================

const FIN_FAST_START_SPEED = 1.8;

const FIN_FAST_MAX_SPEED = 6.0;

const FIN_FAST_ACCEL_TIME = 3000;

const FIN_FAST_RELEASE_DELAY = 2000;

const FIN_FAST_MAX_TIME = 3000;


// ============================================================
// ▲ 自動解除
// ============================================================

const FIN_AUTO_EXIT_TIME = 10000;


// ============================================================
// ▲ 状態
// ============================================================

let finWall = "left";

let finMovingToWall = false;

let finJumping = false;

let finJumpStartX = 0;
let finJumpStartY = 0;

let finJumpDirectionX = 0;
let finJumpDirectionY = 0;

let finJumpProgress = 0;


// ============================================================
// ▲ 周回方向
// ============================================================

let finClockwise = true;


// ============================================================
// ▲ ホールド
// ============================================================

let finOneFingerHolding = false;

let finHoldRecognized = false;

let finHoldPauseUntil = 0;

let finTargetX = 0;
let finTargetY = 0;


// ============================================================
// ▲ 小刻み
// ============================================================

let finLastMoveX = 0;
let finLastMoveY = 0;

let finRapidMovement = 0;

let finRapidStartTime = 0;

let finFastMode = false;

let finMaxSpeedMode = false;

let finReleaseTimer = null;

let finFastStartedAt = 0;


// ============================================================
// ▲ 2タップ
// ============================================================

let finTapCount = 0;

let finTapTimer = null;


// ============================================================
// ▲ 自動解除
// ============================================================

let finAutoExitTimer = null;


// ============================================================
// ▲ 向き
// ============================================================

function setFinDirection() {

  /*
    finWallは「現在どの辺を泳いでいるか」。

    時計回り:
    left → top → right → bottom

    反時計回り:
    left → bottom → right → top

    画像の向きは、
    「進んでいる方向」に合わせて
    rotate + scaleX で調整する。
  */


  let rotation = 0;

  let flip = false;


  if (finWall === "left") {

    if (finClockwise) {
      rotation = 90;
    }
    else {
      rotation = -90;
    }

  }

  else if (finWall === "top") {

    if (finClockwise) {
      rotation = 0;
    }
    else {
      rotation = 180;
    }

  }

  else if (finWall === "right") {

    if (finClockwise) {
      rotation = -90;
    }
    else {
      rotation = 90;
    }

  }

  else {

    if (finClockwise) {
      rotation = 180;
    }
    else {
      rotation = 0;
    }

  }


  fin.style.transform =
    "translate(-50%, -50%) rotate(" +
    rotation +
    "deg) scaleX(" +
    (flip ? -1 : 1) +
    ")";

}


// ============================================================
// ▲ ホールド追従時の向き
// ============================================================

function setFinFollowDirection(previousX, previousY, nextX, nextY) {

  const moveX = nextX - previousX;
  const moveY = nextY - previousY;


  if (
    Math.abs(moveX) < 0.1 &&
    Math.abs(moveY) < 0.1
  ) {
    return;
  }


  /*
    beam_fin.png の基準方向を
    「上」として扱う。

    指へ向かう方向に合わせて回転。
  */

  const angle =
    Math.atan2(moveY, moveX) *
    180 /
    Math.PI;


  fin.style.transform =
    "translate(-50%, -50%) rotate(" +
    (angle + 90) +
    "deg)";
}


// ============================================================
// ▲ 位置
// ============================================================

function updateFinPosition() {

  fin.style.left =
    x + "%";

  fin.style.top =
    y + "%";

}


// ============================================================
// ▲ 壁移動
// ============================================================

function moveFinToWall() {

  if (mode !== "fin") return;


  let targetX = x;
  let targetY = y;


  if (finWall === "left") {
    targetX = LEFT_WALL;
  }

  else if (finWall === "right") {
    targetX = RIGHT_WALL;
  }

  else if (finWall === "top") {
    targetY = TOP_WALL;
  }

  else {
    targetY = BOTTOM_WALL;
  }


  const distanceX =
    targetX - x;

  const distanceY =
    targetY - y;


  x += distanceX * 0.08;
  y += distanceY * 0.08;


  if (
    Math.abs(distanceX) < 0.2 &&
    Math.abs(distanceY) < 0.2
  ) {

    x = targetX;
    y = targetY;

    finMovingToWall = false;

    setFinDirection();

  }


  updateFinPosition();

}


// ============================================================
// ▲ モード開始
// ============================================================

function enterFinMode() {

  if (mode !== "normal") return;

  mode = "fin";

  clearTimeout(normalTimer);
  clearTimeout(finAutoExitTimer);

  clearMessage();

  beam.classList.remove("walking");
  beam.classList.remove("jump");

  beam.style.display = "none";

  fin.style.display = "block";


  finJumping = false;
  finMovingToWall = true;

  finOneFingerHolding = false;
  finHoldRecognized = false;

  finFastMode = false;
  finMaxSpeedMode = false;

  finCurrentSpeed =
    FIN_BASE_SPEED;

  finRapidMovement = 0;
  finRapidStartTime = 0;


  /*
    前回の方向を固定せず、
    背びれモード開始時に
    時計回り／反時計回りをランダム決定。
  */

  finClockwise =
    Math.random() < 0.5;


  /*
    現在位置から最も近い壁へ。
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


  setFinDirection();

  updateFinPosition();

  updateLastInteraction();

  startFinAutoExitTimer();

}


// ============================================================
// ▲ 自動解除
// ============================================================

function startFinAutoExitTimer() {

  clearTimeout(finAutoExitTimer);

  finAutoExitTimer =
    setTimeout(function() {

      if (mode !== "fin") return;

      if (
        finOneFingerHolding ||
        finFastMode ||
        finMaxSpeedMode ||
        finJumping
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
// ▲ 飛び出し
// ============================================================

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


// ============================================================
// ▲ 飛び出し更新
// ============================================================

function updateFinJump() {

  if (!finJumping) return;

  finJumpProgress += 0.08;


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


  const jumpDistance = 8;


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
// ▲ → 通常
// ============================================================

function exitFinModeToNormal() {

  clearTimeout(finAutoExitTimer);
  clearTimeout(finReleaseTimer);
  clearTimeout(finTapTimer);

  fin.style.display = "none";

  beam.style.display = "block";

  finJumping = false;

  finMovingToWall = false;

  finOneFingerHolding = false;

  finHoldRecognized = false;

  finFastMode = false;

  finMaxSpeedMode = false;

  finRapidMovement = 0;

  mode = "normal";


  beam.style.left =
    x + "%";

  beam.style.top =
    y + "%";


  updateBeamDirection();

  clearMessage();

  startWalking();

  updateLastInteraction();

}


// ============================================================
// ▲ 通常周回
// ============================================================

function moveFin() {

  if (mode !== "fin") return;

  if (finJumping) return;


  if (finMovingToWall) {

    moveFinToWall();

    return;

  }


  if (finFastMode) {

    moveFinFast();

    return;

  }


  if (finOneFingerHolding) {

    moveFinTowardFinger();

    return;

  }


  /*
    時計回り
  */

  if (finClockwise) {

    if (finWall === "left") {

      y -= FIN_BASE_SPEED;

      if (y <= TOP_WALL) {

        y = TOP_WALL;
        finWall = "top";

        setFinDirection();

      }

    }

    else if (finWall === "top") {

      x += FIN_BASE_SPEED;

      if (x >= RIGHT_WALL) {

        x = RIGHT_WALL;
        finWall = "right";

        setFinDirection();

      }

    }

    else if (finWall === "right") {

      y += FIN_BASE_SPEED;

      if (y >= BOTTOM_WALL) {

        y = BOTTOM_WALL;
        finWall = "bottom";

        setFinDirection();

      }

    }

    else {

      x -= FIN_BASE_SPEED;

      if (x <= LEFT_WALL) {

        x = LEFT_WALL;
        finWall = "left";

        setFinDirection();

      }

    }

  }


  /*
    反時計回り
  */

  else {

    if (finWall === "left") {

      y += FIN_BASE_SPEED;

      if (y >= BOTTOM_WALL) {

        y = BOTTOM_WALL;
        finWall = "bottom";

        setFinDirection();

      }

    }

    else if (finWall === "bottom") {

      x += FIN_BASE_SPEED;

      if (x >= RIGHT_WALL) {

        x = RIGHT_WALL;
        finWall = "right";

        setFinDirection();

      }

    }

    else if (finWall === "right") {

      y -= FIN_BASE_SPEED;

      if (y <= TOP_WALL) {

        y = TOP_WALL;
        finWall = "top";

        setFinDirection();

      }

    }

    else {

      x -= FIN_BASE_SPEED;

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
// ▲ ホールド追従
// ============================================================

function moveFinTowardFinger() {

  if (!finOneFingerHolding) return;

  if (!finHoldRecognized) return;


  if (Date.now() < finHoldPauseUntil) {
    return;
  }


  const targetX =
    finTargetX /
    game.clientWidth *
    100;

  const targetY =
    finTargetY /
    game.clientHeight *
    100;


  const previousX = x;
  const previousY = y;


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


    y +=
      (target - y) * 0.035;

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


    x +=
      (target - x) * 0.035;

  }


  updateFinPosition();


  /*
    実際に移動した方向に合わせる。

    これで左右方向の追従時にも
    逆向きに泳いでいるように見えにくくする。
  */

  setFinFollowDirection(
    previousX,
    previousY,
    x,
    y
  );

}


// ============================================================
// ▲ 高速周回開始
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
// ▲ 最高速
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
// ▲ 高速周回移動
// ============================================================

let finCurrentSpeed =
  FIN_BASE_SPEED;


function moveFinFast() {

  if (!finFastMode) return;


  if (finMaxSpeedMode) {

    finCurrentSpeed =
      FIN_FAST_MAX_SPEED;

  }

  else {

    const elapsed =
      Date.now() -
      finFastStartedAt;


    const progress =
      Math.min(
        1,
        elapsed /
        FIN_FAST_ACCEL_TIME
      );


    finCurrentSpeed =
      FIN_FAST_START_SPEED +
      (
        FIN_FAST_MAX_SPEED -
        FIN_FAST_START_SPEED
      ) *
      progress;

  }


  const speed =
    finCurrentSpeed;


  /*
    高速時も同じ壁制限を使用する。
    画面外には出ない。
  */

  if (finClockwise) {

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
// ▲ 高速周回終了予約
// ============================================================

function releaseFinFastMode() {

  if (!finFastMode) return;

  clearTimeout(finReleaseTimer);


  finReleaseTimer =
    setTimeout(function() {

      if (mode !== "fin") return;

      finishFinFastReaction();

    }, FIN_FAST_RELEASE_DELAY);

}


// ============================================================
// ▲ 通常高速後
// ============================================================

function finishFinFastReaction() {

  if (mode !== "fin") return;


  if (finMaxSpeedMode) {

    finishFinMaxReaction();

    return;

  }


  finFastMode = false;
  finMaxSpeedMode = false;


  /*
    まず泳ぎを止める。
    少し間を置いてから反応。
  */

  clearMessage();


  setTimeout(function() {

    if (mode !== "fin") return;


    fin.style.display = "none";

    beam.style.display = "block";

    beam.style.left =
      x + "%";

    beam.style.top =
      y + "%";


    beam.classList.remove("walking");
    beam.classList.remove("jump");


    void beam.offsetWidth;

    beam.classList.add("jump");


    showMessage(
      "キャキャ！！"
    );


    /*
      飛び出した直後、
      着地前に背びれへ戻す。
    */

    setTimeout(function() {

      if (mode !== "fin") return;


      beam.classList.remove("jump");

      beam.style.display = "none";

      fin.style.display = "block";

      mode = "fin";

      finJumping = false;

      finMovingToWall = true;

      clearMessage();

      showMessage(
        "ザプンッ！",
        700
      );


      startFinAutoExitTimer();

    }, 450);

  }, 150);

}


// ============================================================
// ▲ 最高速後
// ============================================================

function finishFinMaxReaction() {

  finFastMode = false;
  finMaxSpeedMode = false;

  clearMessage();


  fin.style.display = "none";

  beam.style.display = "block";

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
    3回のジャンプ。
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

    if (mode !== "fin") return;

    beam.classList.remove("jump");

    mode = "normal";

    clearMessage();

    startWalking();

    updateLastInteraction();

  }, 1950);

}


// ============================================================
// ▲ 2タップ
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
// ▲ 2タップ解除
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
// ▲ 1秒ホールド認識
// ============================================================

function recognizeFinHold() {

  if (mode !== "fin") return;

  if (!finOneFingerHolding) return;

  if (finHoldRecognized) return;


  finHoldRecognized = true;


  /*
    認識した瞬間から1秒停止。
  */

  finHoldPauseUntil =
    Date.now() + 1000;


  showMessage(
    "……！"
  );


  resetFinAutoExitTimer();

}


// ============================================================
// ▲ 小刻み判定
// ============================================================

function checkFinRapidMovement(
  currentX,
  currentY
) {

  if (!finOneFingerHolding) return;

  /*
    1秒ホールド停止中は
    小刻み判定をしない。
  */

  if (!finHoldRecognized) return;

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
    7px以上動いた時だけカウント。

    さらに、
    小刻み操作が4回必要。
    これで「指をほとんど動かしていないのに
    高速周回になる」問題を抑える。
  */

  if (distance >= 7) {

    finRapidMovement++;


    if (finRapidStartTime === 0) {

      finRapidStartTime = now;

    }


    if (
      !finFastMode &&
      finRapidMovement >= 4
    ) {

      startFinFastMode();

    }

  }


  /*
    高速周回開始後、
    3秒間小刻み操作が続いたら最高速。
  */

  if (
    finFastMode &&
    !finMaxSpeedMode
  ) {

    const elapsed =
      now - finRapidStartTime;


    if (
      elapsed >= FIN_FAST_MAX_TIME &&
      finRapidMovement >= 8
    ) {

      startFinMaxSpeed();

    }

  }


  finLastMoveX =
    currentX;

  finLastMoveY =
    currentY;

}


// ============================================================
// 通常モード くすぐり
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

    beam.classList.add("tickle-max");

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

    /*
      上部UI・メニュー・説明画面は
      それぞれ独自にイベントを処理するので
      ここには届かない。
    */

    event.preventDefault();

    updateLastInteraction();


    Array.from(
      event.changedTouches
    ).forEach(
      function(touch) {

        createTouchIndicator(
          touch.identifier,
          touch
        );

      }
    );


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


        /*
          高速周回中でも、
          2タップ判定を残す。
        */

        clearTimeout(holdTimer);


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
    // 通常 2本指
    // ========================================================

    if (event.touches.length >= 2) {

      clearTimeout(holdTimer);
      clearTimeout(normalTimer);

      twoFingerHolding = true;

      mode = "twoFingerWaiting";

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
    // 通常 1本指
    // ========================================================

    if (event.touches.length === 1) {

      clearTimeout(holdTimer);
      clearTimeout(normalTimer);

      oneFingerHeld = true;

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

            mode = "oneFingerHold";

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
    ).forEach(
      function(touch) {

        createTouchIndicator(
          touch.identifier,
          touch
        );

      }
    );


    // ========================================================
    // ▲
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
    // 通常 2本指 待機
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
    // 通常 2本指 摘み上げ
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
          Math.min(90, x)
        );


      y =
        Math.max(
          15,
          Math.min(72, y)
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
    // 通常 1本指 くすぐり
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


      tickleDistance += distance;


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
// 指を離す
// ============================================================

game.addEventListener(
  "touchend",
  function(event) {

    updateLastInteraction();


    Array.from(
      event.changedTouches
    ).forEach(
      function(touch) {

        removeTouchIndicator(
          touch.identifier
        );

      }
    );


    // ========================================================
    // ▲
    // ========================================================

    if (
      mode === "fin" &&
      finOneFingerHolding
    ) {

      clearTimeout(holdTimer);

      finOneFingerHolding = false;


      /*
        最高速
      */

      if (finMaxSpeedMode) {

        releaseFinFastMode();

        return;

      }


      /*
        高速周回
      */

      if (finFastMode) {

        releaseFinFastMode();

        return;

      }


      /*
        ホールド追従終了
      */

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
    // 通常 2本指 待機
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
    // 通常 摘み上げ終了
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
    // 通常 くすぐり終了
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
          ここを今回変更。
          すぐ「はぁはぁ」にはせず、
          「キャハ〜〜！！」を残したまま
          高く長めにジャンプ。
        */

        beam.classList.remove(
          "panting"
        );

        beam.classList.remove(
          "high-jump"
        );

        void beam.offsetWidth;

        beam.classList.add(
          "high-jump"
        );

        showMessage(
          "キャハ〜〜！！"
        );


        setTimeout(function() {

          if (mode !== "resting") return;

          beam.classList.remove(
            "high-jump"
          );

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

        }, 1150);

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
    // 通常 1本指ホールド終了
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
    // 通常 1本指
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

  }
);


// ============================================================
// 通常移動
// ============================================================

function moveBeam() {

  if (mode === "normal") {

    x += dx;
    y += dy;


    /*
      上部UIとセリフ領域を避ける。
    */

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


    if (y >= 72) {

      y = 72;

      dy =
        -Math.abs(dy);

    }


    if (y <= 12) {

      y = 12;

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
// ▲ 移動ループ
// ============================================================

function moveFinLoop() {

  if (mode === "fin") {

    if (finJumping) {

      updateFinJump();

    }

    else {

      moveFin();

    }

  }


  requestAnimationFrame(
    moveFinLoop
  );

}


// ============================================================
// 通常ランダム方向変更
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
// 5秒無操作 → ▲
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
// 初期化
// ============================================================

beam.style.display = "block";

fin.style.display = "none";


beam.style.left =
  x + "%";

beam.style.top =
  y + "%";


updateBeamDirection();

startWalking();

moveBeam();

moveFinLoop();
