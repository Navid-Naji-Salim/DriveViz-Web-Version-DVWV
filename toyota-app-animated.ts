type Specs = {
  power: string;
  torque: string;
  accel: string;
  drive: string;
  city: string;
  hwy: string;
  comb: string;
  fuel: string;
  len: string;
  wb: string;
};

type ModelKey = "crown" | "camry" | "supra" | "rav4";

const modelData: Record<ModelKey, { name: string; sub: string; specs: Specs }> = {
  crown: {
    name: "Crown Platinum",
    sub: "2.4L Hybrid MAX AWD",
    specs: {
      power: "340 HP",
      torque: "400 lb-ft",
      accel: "5.7s",
      drive: "AWD",
      city: "29",
      hwy: "32",
      comb: "30",
      fuel: "Hybrid",
      len: "196 in",
      wb: "112 in",
    },
  },
  camry: {
    name: "Camry XSE",
    sub: "2.5L 4-Cylinder",
    specs: {
      power: "203 HP",
      torque: "184 lb-ft",
      accel: "7.2s",
      drive: "FWD",
      city: "28",
      hwy: "39",
      comb: "32",
      fuel: "Gasoline",
      len: "192 in",
      wb: "111 in",
    },
  },
  supra: {
    name: "GR Supra 3.0",
    sub: "3.0L Turbocharged Inline-6",
    specs: {
      power: "382 HP",
      torque: "368 lb-ft",
      accel: "3.9s",
      drive: "RWD",
      city: "22",
      hwy: "30",
      comb: "25",
      fuel: "Premium",
      len: "172 in",
      wb: "97 in",
    },
  },
  rav4: {
    name: "RAV4 XSE",
    sub: "2.5L Hybrid AWD",
    specs: {
      power: "219 HP",
      torque: "163 lb-ft",
      accel: "7.4s",
      drive: "AWD",
      city: "41",
      hwy: "38",
      comb: "40",
      fuel: "Hybrid",
      len: "180 in",
      wb: "105 in",
    },
  },
};

const envColors: Record<string, string> = {
  "Heavy Metal / Black": "radial-gradient(ellipse at 60% 40%, rgba(50,50,60,.25) 0%, transparent 70%)",
  "Wind Chill Pearl": "radial-gradient(ellipse at 60% 40%, rgba(220,215,200,.18) 0%, transparent 70%)",
  "Supersonic Red": "radial-gradient(ellipse at 60% 40%, rgba(140,0,0,.22) 0%, transparent 70%)",
  Blueprint: "radial-gradient(ellipse at 60% 40%, rgba(30,58,95,.25) 0%, transparent 70%)",
  "Oxide Bronze": "radial-gradient(ellipse at 60% 40%, rgba(163,140,109,.2) 0%, transparent 70%)",
  "Midnight Black": "radial-gradient(ellipse at 60% 40%, rgba(30,30,30,.3) 0%, transparent 70%)",
};

const getById = (id: string): HTMLElement => {
  const element = document.getElementById(id);

  if (!(element instanceof HTMLElement)) {
    throw new Error(`Missing element: ${id}`);
  }

  return element;
};

const rootStyle = document.documentElement.style;
const mobileQuery = window.matchMedia("(max-width: 900px)");
const panel = document.querySelector(".panel");
const panelHandle = document.querySelector(".panel-handle");
const canvasModelName = getById("canvasModelName");
const canvasModelSub = getById("canvasModelSub");
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

let mobilePanelHeight = 0;
let mobilePanelOffset = 0;
let mobilePanelMaxOffset = 0;
let dragStartY = 0;
let dragStartOffset = 0;
let isDraggingPanel = false;

function setMobilePanelOffset(offset: number) {
  mobilePanelOffset = clamp(offset, 0, mobilePanelMaxOffset);
  rootStyle.setProperty("--mobile-panel-offset", `${mobilePanelOffset}px`);
}

function syncMobilePanelMetrics() {
  if (!(panel instanceof HTMLElement) || !mobileQuery.matches) {
    rootStyle.setProperty("--mobile-panel-height", "0px");
    rootStyle.setProperty("--mobile-panel-offset", "0px");
    return;
  }

  mobilePanelHeight = panel.getBoundingClientRect().height;
  mobilePanelMaxOffset = Math.max(0, mobilePanelHeight - 86);
  rootStyle.setProperty("--mobile-panel-height", `${mobilePanelHeight}px`);
  setMobilePanelOffset(Math.min(mobilePanelOffset, mobilePanelMaxOffset));
}

function snapMobilePanel() {
  if (!(panel instanceof HTMLElement)) {
    return;
  }

  const snapPoint = mobilePanelMaxOffset * 0.4;
  const nextOffset = mobilePanelOffset > snapPoint ? mobilePanelMaxOffset : 0;

  setMobilePanelOffset(nextOffset);
  panel.classList.remove("dragging");
}

function startDraggingPanel(clientY: number) {
  if (!(panel instanceof HTMLElement) || !mobileQuery.matches) {
    return;
  }

  syncMobilePanelMetrics();
  isDraggingPanel = true;
  dragStartY = clientY;
  dragStartOffset = mobilePanelOffset;
  panel.classList.add("dragging");
}

function updateDraggingPanel(clientY: number) {
  if (!isDraggingPanel) {
    return;
  }

  const delta = clientY - dragStartY;
  setMobilePanelOffset(dragStartOffset + delta);
}

function stopDraggingPanel() {
  if (!(panel instanceof HTMLElement) || !isDraggingPanel) {
    return;
  }

  isDraggingPanel = false;
  snapMobilePanel();
}

function bindPanelDrag(element: Element | null) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  element.addEventListener("pointerdown", (event) => {
    startDraggingPanel(event.clientY);
    element.setPointerCapture(event.pointerId);
  });

  element.addEventListener("pointermove", (event) => {
    updateDraggingPanel(event.clientY);
  });

  element.addEventListener("pointerup", () => {
    stopDraggingPanel();
  });

  element.addEventListener("pointercancel", () => {
    stopDraggingPanel();
  });
}

bindPanelDrag(panelHandle);

window.addEventListener("pointerup", stopDraggingPanel);
window.addEventListener("resize", syncMobilePanelMetrics);
mobileQuery.addEventListener("change", () => {
  if (panel instanceof HTMLElement) {
    panel.classList.remove("dragging");
  }

  mobilePanelOffset = 0;
  syncMobilePanelMetrics();
});

function setSpecVal(id: string, value: string) {
  const el = getById(id);
  el.classList.remove("updating");
  void el.offsetWidth;
  el.classList.add("updating");

  setTimeout(() => {
    el.textContent = value;
  }, 140);

  el.addEventListener("animationend", () => el.classList.remove("updating"), { once: true });
}

function setWatermark(text: string) {
  const el = getById("watermark");
  el.classList.remove("changing");
  void el.offsetWidth;
  el.classList.add("changing");

  setTimeout(() => {
    el.textContent = text;
  }, 160);

  el.addEventListener("animationend", () => el.classList.remove("changing"), { once: true });
}

document.querySelectorAll<HTMLButtonElement>(".p-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".p-tab").forEach((tab) => tab.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((tabPanel) => tabPanel.classList.remove("active"));

    button.classList.add("active");
    getById(`tab-${button.dataset.tab}`).classList.add("active");
  });
});

document.querySelectorAll<HTMLElement>(".model-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".model-card").forEach((item) => item.classList.remove("active"));
    card.classList.add("active");

    const modelKey = card.dataset.model as ModelKey;
    const model = modelData[modelKey];
    const specs = model.specs;
    const modelName =
      card.querySelector(".model-card-name")?.textContent ?? modelData[modelKey].name;

    setWatermark(modelName);
    canvasModelName.textContent = modelName;
    canvasModelSub.textContent = card.querySelector(".model-card-sub")?.textContent ?? model.sub;

    const specIds: Array<[string, string]> = [
      ["sp-power", specs.power],
      ["sp-torque", specs.torque],
      ["sp-accel", specs.accel],
      ["sp-drive", specs.drive],
      ["sp-city", specs.city],
      ["sp-hwy", specs.hwy],
      ["sp-comb", specs.comb],
      ["sp-fuel", specs.fuel],
      ["sp-len", specs.len],
      ["sp-wb", specs.wb],
    ];

    specIds.forEach(([id, val], i) => {
      setTimeout(() => setSpecVal(id, val), i * 35);
    });

    flashCanvas();
  });
});

document.querySelectorAll<HTMLButtonElement>(".swatch").forEach((swatch) => {
  swatch.addEventListener("click", () => {
    document.querySelectorAll(".swatch").forEach((item) => item.classList.remove("active"));
    swatch.classList.add("active");

    const colorName = swatch.dataset.color ?? "";
    getById("colorName").textContent = colorName;
    getById("envGlow").style.background = envColors[colorName] || "";
    flashCanvas();
  });
});

document.querySelectorAll<HTMLElement>(".wheel-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".wheel-pill").forEach((item) => item.classList.remove("active"));
    pill.classList.add("active");
    flashCanvas();
  });
});

document.querySelectorAll<HTMLElement>(".int-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".int-item").forEach((entry) => {
      entry.classList.remove("active");
      entry.querySelector(".int-check")?.remove();
    });

    item.classList.add("active");

    const check = document.createElement("span");
    check.className = "ms fill int-check";
    check.textContent = "check_circle";
    item.appendChild(check);
    flashCanvas();
  });
});

document.querySelectorAll<HTMLButtonElement>(".view-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".view-btn").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

document.querySelectorAll<HTMLButtonElement>(".env-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".env-card").forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
  });
});

function flashCanvas() {
  const canvas = getById("carCanvas");
  canvas.classList.remove("flash");
  void canvas.offsetWidth;
  canvas.classList.add("flash");
}

const initialSwatch = document.querySelector<HTMLButtonElement>(".swatch.active");
if (initialSwatch?.dataset.color) {
  const initialColor = initialSwatch.dataset.color;
  getById("colorName").textContent = initialColor;
  getById("envGlow").style.background = envColors[initialColor] || "";
}

const initialModelCard = document.querySelector<HTMLElement>(".model-card.active");
if (initialModelCard) {
  canvasModelName.textContent = initialModelCard.querySelector(".model-card-name")?.textContent ?? "Crown";
  canvasModelSub.textContent = initialModelCard.querySelector(".model-card-sub")?.textContent ?? "Platinum - Hybrid MAX AWD";
}

syncMobilePanelMetrics();
