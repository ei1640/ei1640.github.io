const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ====================
// 画面サイズ
// ====================

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

// ====================
// ゲーム状態
// ====================

let scene = "title";
// "title"
// "countdown"
// "game"
// "gameover"

let gameStarted = false;
let gameOver = false;
let canRestart = false;

let survivalTime = 0;
let lastTime = performance.now();

let countdown = 3;
let countdownTimer = 3;

let endlessRanking =
  JSON.parse(localStorage.getItem("endlessRanking")) || [];

let checkpointRanking =
  JSON.parse(localStorage.getItem("checkpointRanking")) || [];

let nickname = "";
let scoreSaved = false;
let scoreSubmitted = false;

let interval = 1;
let danmakuTimer = 0;

let gameMode = "endless";
// "endless" or "checkpoint"

let clearedCheckpoints = 0;

let resultRank = null;

// ====================
// ボタン
// ====================

let startButton = {
  x: 0,
  y: 0,
  width: 420,
  height: 80
};

let modeButton = {
  x: 0,
  y: 0,
  width: 420,
  height: 80
};

let titleButton = {
  x: 0,
  y: 0,
  width: 420,
  height: 80
};

// ====================
// チェックポイント
// ====================

const checkpoint = {
  x: 0,
  y: 0,
  size: 25
};

let checkpointTimer = 10;

// ====================
// プレイヤー
// ====================

const player = {
  x: canvas.width / 2,
  y: canvas.height - 150,
  size: 10,
  hitbox: 4
};

// ====================
// 弾
// ====================

const bullets = [];
const delayedBullets = [];

// ====================
// マウス操作
// ====================

canvas.addEventListener("mousemove", (e) => {

  player.x = e.clientX;
  player.y = e.clientY;
});

canvas.addEventListener("click", (e) => {

  const mouseX = e.clientX;
  const mouseY = e.clientY;

  // ====================
  // タイトル画面
  // ====================

  if (scene === "title") {

    modeButton.x = canvas.width / 2 - 160;
    modeButton.y = canvas.height / 2 - 80;

    startButton.x = canvas.width / 2 - 160;
    startButton.y = canvas.height / 2 + 40;

    // モード切替
    if (
      mouseX >= modeButton.x &&
      mouseX <= modeButton.x + modeButton.width &&
      mouseY >= modeButton.y &&
      mouseY <= modeButton.y + modeButton.height
    ) {

      gameMode =
        gameMode === "endless"
          ? "checkpoint"
          : "endless";

      return;
    }

    // START
    if (
      mouseX >= startButton.x &&
      mouseX <= startButton.x + startButton.width &&
      mouseY >= startButton.y &&
      mouseY <= startButton.y + startButton.height
    ) {

      restartGame();
      return;
    }
  }

  // ====================
  // タイトルへ戻る
  // ====================

  if (scene === "gameover" && canRestart) {

    titleButton.x = canvas.width / 2 - 160;
    titleButton.y = canvas.height - 120;

    if (
      mouseX >= titleButton.x &&
      mouseX <= titleButton.x + titleButton.width &&
      mouseY >= titleButton.y &&
      mouseY <= titleButton.y + titleButton.height
    ) {

      returnToTitle();
    }
  }
});

// ====================
// キーボード
// ====================

document.addEventListener("keydown", (e) => {

  if (scene === "gameover" && canRestart) {

    if (!scoreSubmitted) {

      // Enter保存
      if (e.key === "Enter") {

        saveScore();
        return;
      }

      // Backspace
      if (e.key === "Backspace") {

        nickname = nickname.slice(0, -1);
        return;
      }

      // 文字入力
      if (
        e.key.length === 1 &&
        nickname.length < 12
      ) {

        nickname += e.key;
      }
    }
  }
});

// ====================
// チェックポイント移動
// ====================

function moveCheckpoint() {

  checkpoint.x =
    100 + Math.random() * (canvas.width - 200);

  checkpoint.y =
    100 + Math.random() * (canvas.height - 200);
}

// ====================
// 弾生成
// ====================

function createBullet(
  x,
  y,
  angle,
  speed,
  size = 6
) {

  bullets.push({

    x,
    y,

    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,

    size
  });
}

// ====================
// 弾幕①
// ====================

let spiralAngle1 = 0;

function pattern1() {

  const centerX =
    Math.random() * canvas.width;

  const centerY =
    Math.random() * canvas.height;

  for (let i = 0; i < 18; i++) {

    const angle =
      spiralAngle1 +
      (Math.PI * 2 / 18) * i;

    createBullet(
      centerX,
      centerY,
      angle,
      1
    );
  }

  spiralAngle1 += Math.PI / 3;
}

// ====================
// 弾幕②
// ====================

function pattern2() {

  const centerX =
    Math.random() * canvas.width;

  const centerY =
    Math.random() * canvas.height;

  for (let layer = 1; layer <= 4; layer++) {

    const speed =
      1 + layer * 0.15;

    for (let i = 0; i < 12; i++) {

      let angle =
        (Math.PI * 2 / 12) * i;

      if (layer % 2 === 0) {

        angle += Math.PI * 2 / 24;
      }

      createBullet(
        centerX,
        centerY,
        angle,
        speed
      );
    }
  }
}

// ====================
// 弾幕③
// ====================

let spiralAngle3 = 0;

function pattern3() {

  const centerX =
    Math.random() * canvas.width;

  const centerY =
    Math.random() * canvas.height;

  const total = 18;

  for (let i = 0; i < total; i++) {

    let angle = spiralAngle3 + (Math.PI * 2 / total) * i;
    delayedBullets.push({

      x: centerX,
      y: centerY,

      angle,

      speed: 1.5,
      size: 5,

      delay: i * 0.2
    });

    angle = spiralAngle3 + (Math.PI * 2 / total) * i + Math.PI;
    delayedBullets.push({

      x: centerX,
      y: centerY,

      angle,

      speed: 1.5,
      size: 5,

      delay: i * 0.2
    });

    angle = spiralAngle3 + (Math.PI * 2 / total) * i + (Math.PI / 2);
    delayedBullets.push({

      x: centerX,
      y: centerY,

      angle,

      speed: 1.5,
      size: 5,

      delay: i * 0.2
    });

    angle = spiralAngle3 + (Math.PI * 2 / total) * i + (Math.PI / -2);
    delayedBullets.push({

      x: centerX,
      y: centerY,

      angle,

      speed: 1.5,
      size: 5,

      delay: i * 0.2
    });
  }

  spiralAngle3 += 0.25;
}

// ====================
// ランダム弾幕
// ====================

function spawnDanmaku() {

  const random =
    Math.floor(Math.random() * 3);

  switch (random) {

    case 0:
      pattern1();
      break;

    case 1:
      pattern2();
      break;

    case 2:
      pattern3();
      break;
  }
}

// ====================
// ゲームオーバー
// ====================

function triggerGameOver() {

  if (gameOver) return;

  gameOver = true;
  scene = "gameover";

  setTimeout(() => {

    canRestart = true;

  }, 500);
}

// ====================
// リスタート
// ====================

function restartGame() {

  scene = "countdown";

  gameStarted = false;
  gameOver = false;
  canRestart = false;

  survivalTime = 0;

  countdown = 3;
  countdownTimer = 3;

  bullets.length = 0;
  delayedBullets.length = 0;

  danmakuTimer = 0;

  interval = 1;

  checkpointTimer = 10;
  clearedCheckpoints = 0;

  spiralAngle1 = 0;
  spiralAngle3 = 0;

  nickname = "";
  scoreSaved = false;
  scoreSubmitted = false;

  player.x = canvas.width / 2;
  player.y = canvas.height - 150;

  resultRank = null;

  moveCheckpoint();
}

// ====================
// タイトルへ戻る
// ====================

function returnToTitle() {

  scene = "title";

  gameStarted = false;
  gameOver = false;
  canRestart = false;

  survivalTime = 0;

  countdown = 3;
  countdownTimer = 3;

  bullets.length = 0;
  delayedBullets.length = 0;

  danmakuTimer = 0;

  interval = 1;

  checkpointTimer = 10;
  clearedCheckpoints = 0;

  spiralAngle1 = 0;
  spiralAngle3 = 0;

  nickname = "";
  scoreSaved = false;
  scoreSubmitted = false;

  player.x = canvas.width / 2;
  player.y = canvas.height - 150;

  resultRank = null;

  moveCheckpoint();
}

// ====================
// 更新
// ====================

function update(deltaTime) {

  // ====================
  // タイトル
  // ====================

  if (scene === "title") {
    return;
  }

  // ====================
  // カウントダウン
  // ====================

  if (scene === "countdown") {

    countdownTimer -= deltaTime;

    countdown =
      Math.ceil(countdownTimer);

    if (countdownTimer <= 0) {

      countdown = 0;

      gameStarted = true;
      scene = "game";
    }

    return;
  }

  // ====================
  // ゲーム中
  // ====================

  if (scene === "game") {

    survivalTime += deltaTime;

    // ====================
    // モード別処理
    // ====================

    if (gameMode === "endless") {

      // 10秒ごとに速くなる
      interval =
        1.0 -
        Math.floor(survivalTime / 10) * 0.05;

      interval =
        Math.max(0.05, interval);
    }

    if (gameMode === "checkpoint") {

      // 固定速度
      interval = 0.8;

      checkpointTimer -= deltaTime;

      // 時間切れ
      if (checkpointTimer <= 0) {

        triggerGameOver();
      }

      // 到達判定
      const dx =
        player.x - checkpoint.x;

      const dy =
        player.y - checkpoint.y;

      const distance =
        Math.sqrt(dx * dx + dy * dy);

      if (
        distance <
        checkpoint.size + player.size
      ) {

        clearedCheckpoints++;

        checkpointTimer = 10;

        moveCheckpoint();
      }
    }

    // ====================
    // 弾幕生成
    // ====================

    danmakuTimer += deltaTime;

    if (danmakuTimer >= interval) {

      spawnDanmaku();

      danmakuTimer = 0;
    }
  }

  // ====================
  // 遅延弾
  // ====================

  for (
    let i = delayedBullets.length - 1;
    i >= 0;
    i--
  ) {

    const d = delayedBullets[i];

    d.delay -= deltaTime;

    if (d.delay <= 0) {

      createBullet(
        d.x,
        d.y,
        d.angle,
        d.speed,
        d.size
      );

      delayedBullets.splice(i, 1);
    }
  }

  // ====================
  // 弾移動
  // ====================

  for (const bullet of bullets) {

    bullet.x +=
      bullet.vx * deltaTime * 60;

    bullet.y +=
      bullet.vy * deltaTime * 60;
  }

  // ====================
  // 画面外削除
  // ====================

  for (
    let i = bullets.length - 1;
    i >= 0;
    i--
  ) {

    const b = bullets[i];

    if (
      b.x < -100 ||
      b.x > canvas.width + 100 ||
      b.y < -100 ||
      b.y > canvas.height + 100
    ) {

      bullets.splice(i, 1);
    }
  }

  // ====================
  // 当たり判定
  // ====================

  for (const bullet of bullets) {

    const dx =
      player.x - bullet.x;

    const dy =
      player.y - bullet.y;

    const distance =
      Math.sqrt(dx * dx + dy * dy);

    if (
      distance <
      player.hitbox + bullet.size
    ) {

      triggerGameOver();
    }
  }
}

// ====================
// 描画
// ====================

function draw() {

  // 背景
  ctx.fillStyle = "black";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  // ====================
  // タイトル
  // ====================

  if (scene === "title") {

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.font = "90px sans-serif";

    ctx.fillText(
      "BARAMAKI",
      canvas.width / 2,
      canvas.height / 2 - 180
    );

    // モードボタン
    modeButton.x =
      canvas.width / 2 - 210;

    modeButton.y =
      canvas.height / 2 - 80;

    ctx.fillStyle =
      "rgba(255,255,255,0.15)";

    ctx.fillRect(
      modeButton.x,
      modeButton.y,
      modeButton.width,
      modeButton.height
    );

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;

    ctx.strokeRect(
      modeButton.x,
      modeButton.y,
      modeButton.width,
      modeButton.height
    );

    ctx.fillStyle = "white";
    ctx.font = "32px sans-serif";

    ctx.fillText(
      "MODE : " +
      (
        gameMode === "endless"
          ? "ENDLESS"
          : "CHECKPOINT"
      ),
      canvas.width / 2,
      modeButton.y + 50
    );

    // STARTボタン
    startButton.x =
      canvas.width / 2 - 210;

    startButton.y =
      canvas.height / 2 + 40;

    ctx.fillStyle =
      "rgba(255,255,255,0.15)";

    ctx.fillRect(
      startButton.x,
      startButton.y,
      startButton.width,
      startButton.height
    );

    ctx.strokeStyle = "white";

    ctx.strokeRect(
      startButton.x,
      startButton.y,
      startButton.width,
      startButton.height
    );

    ctx.fillStyle = "white";

    ctx.fillText(
      "START",
      canvas.width / 2,
      startButton.y + 50
    );

    return;
  }

  // ====================
  // 弾描画
  // ====================

  for (const bullet of bullets) {

    ctx.fillStyle = "cyan";

    ctx.beginPath();

    ctx.arc(
      bullet.x,
      bullet.y,
      bullet.size,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.arc(
      bullet.x,
      bullet.y,
      bullet.size / 2,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  // ====================
  // プレイヤー
  // ====================

  ctx.fillStyle = "white";

  ctx.beginPath();

  ctx.arc(
    player.x,
    player.y,
    player.size,
    0,
    Math.PI * 2
  );

  ctx.fill();

  // ヒットボックス
  ctx.fillStyle = "red";

  ctx.beginPath();

  ctx.arc(
    player.x,
    player.y,
    player.hitbox,
    0,
    Math.PI * 2
  );

  ctx.fill();

  // ====================
  // UI
  // ====================

  ctx.fillStyle = "white";
  ctx.textAlign = "left";

  // TIME
  ctx.font = "32px sans-serif";

  ctx.fillText(
    "TIME : " +
    survivalTime.toFixed(1),
    20,
    50
  );

  // ENDLESS
  if (
    gameMode === "endless" &&
    scene === "game"
  ) {

    ctx.font = "24px sans-serif";

    ctx.fillText(
      "SPAWN : " +
      interval.toFixed(2) +
      "s",
      20,
      90
    );
  }

  // CHECKPOINT
  if (
    gameMode === "checkpoint" &&
    scene === "game"
  ) {

    // チェックポイント描画
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 5;

    ctx.beginPath();

    ctx.arc(
      checkpoint.x,
      checkpoint.y,
      checkpoint.size,
      0,
      Math.PI * 2
    );

    ctx.stroke();

    ctx.fillStyle = "lime";
    ctx.font = "24px sans-serif";

    ctx.fillText(
      "CHECK : " +
      checkpointTimer.toFixed(1),
      20,
      90
    );

    ctx.fillText(
      "CLEARED : " +
      clearedCheckpoints,
      20,
      125
    );
  }

  // ====================
  // カウントダウン
  // ====================

  if (scene === "countdown") {

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.font = "100px sans-serif";

    ctx.fillText(
      countdown,
      canvas.width / 2,
      canvas.height / 2
    );
  }

  // ====================
  // GAME OVER
  // ====================

  if (scene === "gameover") {

    ctx.fillStyle =
      "rgba(50,50,50,0.8)";

    ctx.fillRect(
      canvas.width / 2 - 320,
      canvas.height / 2 - 280,
      640,
      520
    );

    ctx.fillStyle = "red";
    ctx.textAlign = "center";

    ctx.font = "80px sans-serif";

    ctx.fillText(
      "GAME OVER",
      canvas.width / 2,
      canvas.height / 2 - 220
    );

    // スコア
    ctx.fillStyle = "white";

    ctx.font = "40px sans-serif";

    ctx.fillText(
      "TIME : " +
      survivalTime.toFixed(2),
      canvas.width / 2,
      canvas.height / 2 - 150
    );

    // 名前入力
    ctx.font = "32px sans-serif";

    ctx.fillText(
      "NAME : " + nickname,
      canvas.width / 2,
      canvas.height / 2 - 80
    );

    ctx.font = "24px sans-serif";

    ctx.fillText(
      "Press Enter to Save",
      canvas.width / 2,
      canvas.height / 2 - 40
    );

    // ====================
    // 順位表示
    // ====================

    ctx.font = "28px sans-serif";

    if (resultRank === null) {

      ctx.fillText(
        "NOT SUBMITTED",
        canvas.width / 2,
        canvas.height / 2
      );

    } else if (resultRank === "ERROR") {

      ctx.fillText(
        "SERVER ERROR",
        canvas.width / 2,
        canvas.height / 2
      );

    } else {

      ctx.fillText(
        resultRank <= 1000
          ? resultRank + " RANK"
          : "OUT OF RANKING",
        canvas.width / 2,
        canvas.height / 2
      );
    }

    // ランキング
    ctx.font = "30px sans-serif";

    ctx.fillText(
      "RANKING",
      canvas.width / 2,
      canvas.height / 2 + 30
    );

    ctx.font = "24px sans-serif";

    const currentRanking =
      gameMode === "endless"
        ? endlessRanking
        : checkpointRanking;

    for (
      let i = 0;
      i < currentRanking.length;
      i++
    ) {

      const r = currentRanking[i];

      ctx.fillText(
        gameMode === "endless"
          ? `${i + 1}. ${r.name} - ${r.score.toFixed(2)}s`
          : `${i + 1}. ${r.name} - ${r.score}pt`,
        canvas.width / 2,
        canvas.height / 2 + 80 + i * 30
      );
    }
  }

  // タイトルへ戻る
  if (canRestart) {

    titleButton.x =
      canvas.width / 2 - 210;

    titleButton.y =
      canvas.height - 120;

    ctx.fillStyle =
      "rgba(255,255,255,0.15)";

    ctx.fillRect(
      titleButton.x,
      titleButton.y,
      titleButton.width,
      titleButton.height
    );

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;

    ctx.strokeRect(
      titleButton.x,
      titleButton.y,
      titleButton.width,
      titleButton.height
    );

    ctx.fillStyle = "white";

    ctx.font = "28px sans-serif";

    ctx.fillText(
      "RETURN TO TITLE",
      canvas.width / 2,
      titleButton.y + 48
    );
  }
}


// ====================
// メインループ
// ====================

function gameLoop(currentTime) {

  const deltaTime = Math.min(
    (currentTime - lastTime) / 1000,
    0.1
  );

  lastTime = currentTime;

  update(deltaTime);
  draw();

  requestAnimationFrame(gameLoop);
}

async function submitScore() {

  try {

    const score =
      gameMode === "checkpoint"
        ? clearedCheckpoints
        : survivalTime;

    const response = await fetch(
      "http://35.78.89.76:3000/score",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          mode: gameMode,

          name:
            nickname.trim() === ""
              ? "Guest"
              : nickname,

          score: score
        })
      }
    );

    const data =
      await response.json();

    resultRank = data.rank;

  } catch (error) {

    console.error(error);

    resultRank = "ERROR";
  }
}

// ====================
// スコア保存
// ====================

async function saveScore() {

  if (scoreSaved) return;

  scoreSaved = true;
  scoreSubmitted = true;

  const finalName =
    nickname.trim() === ""
      ? "Guest"
      : nickname;

  // ====================
  // モード別
  // ====================

  let targetRanking;
  let scoreValue;

  if (gameMode === "endless") {

    targetRanking = endlessRanking;
    scoreValue = survivalTime;

  } else {

    targetRanking = checkpointRanking;
    scoreValue = clearedCheckpoints;
  }

  targetRanking.push({

    name: finalName,
    score: scoreValue
  });

  // 降順
  targetRanking.sort(
    (a, b) => b.score - a.score
  );

  // 1000位まで
  targetRanking = targetRanking.slice(0, 1000);

  // 保存
  if (gameMode === "endless") {

    endlessRanking = targetRanking;

    localStorage.setItem(
      "endlessRanking",
      JSON.stringify(endlessRanking)
    );

  } else {

    checkpointRanking = targetRanking;

    localStorage.setItem(
      "checkpointRanking",
      JSON.stringify(checkpointRanking)
    );
  }

  // サーバー送信
  await submitScore();
}

// ====================
// 開始
// ====================

moveCheckpoint();

requestAnimationFrame(gameLoop);