import { CapabilityEngine } from "../core/capability-engine.js";
import { SensorManager } from "../sensors/sensor-manager.js";
import { StorageManager } from "../storage/storage-manager.js";

const storage = new StorageManager();
const capabilities = CapabilityEngine.detect();
const sensors = new SensorManager();

/* =========================
   CORE STATUS
========================= */

const status = document.querySelector("#status");

if (status) {
  status.textContent =
    "DRAGON CORE ONLINE — " + JSON.stringify(capabilities);
}

/* =========================
   SENSORS
========================= */

const sensorsElement = document.querySelector("#sensors");

if (sensorsElement) {
  sensorsElement.textContent =
    JSON.stringify(sensors.status(), null, 2);
}

/* =========================
   HISTORY
========================= */

const historyElement = document.querySelector("#history");

if (historyElement) {
  historyElement.textContent =
    JSON.stringify(storage.history(), null, 2);
}

/* =========================
   ALERTS
========================= */

const alertsElement = document.querySelector("#alerts");

if (alertsElement) {
  alertsElement.textContent =
    JSON.stringify(storage.alerts(), null, 2);
}


/* =====================================================
   DRAGON RADAR ENGINE
===================================================== */

const canvas = document.querySelector("#radar");

if (canvas) {

  const ctx = canvas.getContext("2d");

  let angle = 0;

  const targets = [
    {
      angle: 0.7,
      distance: 0.48,
      strength: 1
    },
    {
      angle: 2.1,
      distance: 0.72,
      strength: 0.8
    },
    {
      angle: 3.7,
      distance: 0.35,
      strength: 0.9
    },
    {
      angle: 5.1,
      distance: 0.62,
      strength: 0.7
    }
  ];


  function resizeCanvas() {

    const size = Math.min(
      canvas.clientWidth || 700,
      canvas.clientHeight || 700
    );

    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }


  function drawGrid(cx, cy, radius) {

    ctx.strokeStyle = "rgba(97,234,255,0.18)";
    ctx.lineWidth = 1;

    /* Radar circles */

    for (let i = 1; i <= 4; i++) {

      ctx.beginPath();

      ctx.arc(
        cx,
        cy,
        radius * (i / 4),
        0,
        Math.PI * 2
      );

      ctx.stroke();
    }


    /* Cross lines */

    ctx.beginPath();

    ctx.moveTo(cx - radius, cy);
    ctx.lineTo(cx + radius, cy);

    ctx.moveTo(cx, cy - radius);
    ctx.lineTo(cx, cy + radius);

    ctx.stroke();


    /* Diagonal lines */

    ctx.beginPath();

    ctx.moveTo(
      cx - radius * 0.707,
      cy - radius * 0.707
    );

    ctx.lineTo(
      cx + radius * 0.707,
      cy + radius * 0.707
    );

    ctx.moveTo(
      cx + radius * 0.707,
      cy - radius * 0.707
    );

    ctx.lineTo(
      cx - radius * 0.707,
      cy + radius * 0.707
    );

    ctx.stroke();
  }


  function drawTargets(cx, cy, radius) {

    targets.forEach(target => {

      const distance =
        radius * target.distance;

      const x =
        cx + Math.cos(target.angle) * distance;

      const y =
        cy + Math.sin(target.angle) * distance;


      /* Target glow */

      const glow =
        ctx.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          20
        );

      glow.addColorStop(
        0,
        "rgba(83,255,154,0.8)"
      );

      glow.addColorStop(
        0.3,
        "rgba(83,255,154,0.25)"
      );

      glow.addColorStop(
        1,
        "rgba(83,255,154,0)"
      );

      ctx.fillStyle = glow;

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        20,
        0,
        Math.PI * 2
      );

      ctx.fill();


      /* Target */

      ctx.fillStyle = "#53ff9a";

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        4 + target.strength * 2,
        0,
        Math.PI * 2
      );

      ctx.fill();


      /* Target ring */

      ctx.strokeStyle =
        "rgba(83,255,154,0.55)";

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        10,
        0,
        Math.PI * 2
      );

      ctx.stroke();
    });
  }


  function drawScanner(cx, cy, radius) {

    const scannerX =
      cx + Math.cos(angle) * radius;

    const scannerY =
      cy + Math.sin(angle) * radius;


    /* Scanner line */

    ctx.strokeStyle = "#61eaff";

    ctx.lineWidth = 2;

    ctx.shadowBlur = 12;

    ctx.shadowColor = "#61eaff";

    ctx.beginPath();

    ctx.moveTo(cx, cy);

    ctx.lineTo(
      scannerX,
      scannerY
    );

    ctx.stroke();


    ctx.shadowBlur = 0;


    /* Scanner point */

    ctx.fillStyle = "#61eaff";

    ctx.beginPath();

    ctx.arc(
      scannerX,
      scannerY,
      3,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }


  function drawCore(cx, cy) {

    ctx.fillStyle = "#61eaff";

    ctx.shadowBlur = 15;

    ctx.shadowColor = "#61eaff";

    ctx.beginPath();

    ctx.arc(
      cx,
      cy,
      5,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;


    ctx.fillStyle =
      "rgba(97,234,255,0.65)";

    ctx.font =
      "11px monospace";

    ctx.textAlign = "center";

    ctx.fillText(
      "DRAGON CORE",
      cx,
      cy + 28
    );
  }


  function drawHUD(cx, cy, radius) {

    ctx.font = "11px monospace";

    ctx.fillStyle =
      "rgba(97,234,255,0.75)";

    ctx.textAlign = "left";

    ctx.fillText(
      "DRAGON // RADAR",
      15,
      22
    );

    ctx.fillText(
      "SCANNING",
      15,
      40
    );


    ctx.textAlign = "right";

    ctx.fillText(
      "CORE ONLINE",
      canvas.clientWidth - 15,
      22
    );

    ctx.fillText(
      "TARGETS: " + targets.length,
      canvas.clientWidth - 15,
      40
    );


    ctx.textAlign = "center";

    ctx.fillStyle =
      "rgba(97,234,255,0.35)";

    ctx.fillText(
      "N",
      cx,
      cy - radius - 10
    );

    ctx.fillText(
      "S",
      cx,
      cy + radius + 18
    );

    ctx.fillText(
      "W",
      cx - radius - 15,
      cy + 4
    );

    ctx.fillText(
      "E",
      cx + radius + 15,
      cy + 4
    );
  }


  function draw() {

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    const size =
      Math.min(width, height);

    const cx = width / 2;
    const cy = height / 2;

    const radius =
      size / 2 - 35;


    /* Background */

    const background =
      ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        radius
      );

    background.addColorStop(
      0,
      "rgba(0,80,100,0.15)"
    );

    background.addColorStop(
      1,
      "rgba(0,10,15,0.05)"
    );

    ctx.fillStyle = background;

    ctx.fillRect(
      0,
      0,
      width,
      height
    );


    drawGrid(
      cx,
      cy,
      radius
    );

    drawTargets(
      cx,
      cy,
      radius
    );

    drawScanner(
      cx,
      cy,
      radius
    );

    drawCore(
      cx,
      cy
    );

    drawHUD(
      cx,
      cy,
      radius
    );


    angle += 0.018;

    if (angle > Math.PI * 2) {
      angle = 0;
    }


    requestAnimationFrame(draw);
  }


  resizeCanvas();

  window.addEventListener(
    "resize",
    resizeCanvas
  );

  draw();
      }
