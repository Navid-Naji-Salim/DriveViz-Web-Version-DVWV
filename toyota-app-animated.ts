type ModelKey = "crown" | "camry" | "supra" | "rav4";

type ModelSpecs = {
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

type ModelData = Record<ModelKey, { name: string; sub: string; specs: ModelSpecs }>;

const modelData: ModelData = {
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
      wb: "112 in"
    }
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
      wb: "111 in"
    }
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
      wb: "97 in"
    }
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
      wb: "105 in"
    }
  }
};

const envColors: Record<string, string> = {
  "Heavy Metal / Black": "radial-gradient(ellipse at 60% 40%, rgba(50,50,60,.25) 0%, transparent 70%)",
  "Wind Chill Pearl": "radial-gradient(ellipse at 60% 40%, rgba(220,215,200,.18) 0%, transparent 70%)",
  "Supersonic Red": "radial-gradient(ellipse at 60% 40%, rgba(140,0,0,.22) 0%, transparent 70%)",
  Blueprint: "radial-gradient(ellipse at 60% 40%, rgba(30,58,95,.25) 0%, transparent 70%)",
  "Oxide Bronze": "radial-gradient(ellipse at 60% 40%, rgba(163,140,109,.2) 0%, transparent 70%)",
  "Midnight Black": "radial-gradient(ellipse at 60% 40%, rgba(30,30,30,.3) 0%, transparent 70%)"
};

const getById = <T extends HTMLElement>(id: string): T => {
  const element = document.getElementById(id);
  if (!(element instanceof HTMLElement)) {
    throw new Error(`Missing element: ${id}`);
  }
  return element as T;
};

// Animate a spec value update with a flip
function setSpecVal(id: string, value: string): void {
  const el = getById(id);
  el.classList.remove("updating");
  void el.offsetWidth; // reflow
  el.classList.add("updating");
  // Set value mid-animation (at the invisible frame)
  setTimeout(() => {
    el.textContent = value;
  }, 140);
  el.addEventListener("animationend", () => el.classList.remove("updating"), { once: true });
}

// Animate watermark text change
function setWatermark(text: string): void {
  const el = getById("watermark");
  el.classList.remove("changing");
  void el.offsetWidth;
  el.classList.add("changing");
  setTimeout(() => {
    el.textContent = text;
  }, 160);
  el.addEventListener("animationend", () => el.classList.remove("changing"), { once: true });
}

// ─── Tab switching ───
document.querySelectorAll<HTMLButtonElement>(".p-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".p-tab").forEach((tab) => tab.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((panel) => panel.classList.remove("active"));
    button.classList.add("active");
    getById(`tab-${button.dataset.tab}`).classList.add("active");
  });
});

// ─── Model selection ───
document.querySelectorAll<HTMLElement>(".model-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".model-card").forEach((item) => item.classList.remove("active"));
    card.classList.add("active");

    const modelKey = card.dataset.model as ModelKey;
    const specs = modelData[modelKey].specs;
    const modelName = card.querySelector(".model-card-name")?.textContent ?? modelData[modelKey].name;

    setWatermark(modelName);

    // Stagger spec flips for a cascade effect
    const specIds: [string, string][] = [
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

// ─── Color swatches ───
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

// ─── Wheel pills ───
document.querySelectorAll<HTMLElement>(".wheel-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".wheel-pill").forEach((item) => item.classList.remove("active"));
    pill.classList.add("active");
    flashCanvas();
  });
});

// ─── Interior items ───
document.querySelectorAll<HTMLElement>(".int-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll<HTMLElement>(".int-item").forEach((entry) => {
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

// ─── View buttons ───
document.querySelectorAll<HTMLButtonElement>(".view-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".view-btn").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

// ─── Environment cards ───
document.querySelectorAll<HTMLButtonElement>(".env-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".env-card").forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
  });
});

// ─── Flash canvas ───
function flashCanvas(): void {
  const canvas = getById("carCanvas");
  canvas.classList.remove("flash");
  void canvas.offsetWidth;
  canvas.classList.add("flash");
}

// ─── Init ───
const initialSwatch = document.querySelector<HTMLButtonElement>(".swatch.active");
if (initialSwatch?.dataset.color) {
  const initialColor = initialSwatch.dataset.color;
  getById("colorName").textContent = initialColor;
  getById("envGlow").style.background = envColors[initialColor] || "";
}
