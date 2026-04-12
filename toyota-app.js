const modelData = {
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

const envColors = {
  "Heavy Metal / Black": "radial-gradient(ellipse at 60% 40%, rgba(50,50,60,.25) 0%, transparent 70%)",
  "Wind Chill Pearl": "radial-gradient(ellipse at 60% 40%, rgba(220,215,200,.18) 0%, transparent 70%)",
  "Supersonic Red": "radial-gradient(ellipse at 60% 40%, rgba(140,0,0,.22) 0%, transparent 70%)",
  Blueprint: "radial-gradient(ellipse at 60% 40%, rgba(30,58,95,.25) 0%, transparent 70%)",
  "Oxide Bronze": "radial-gradient(ellipse at 60% 40%, rgba(163,140,109,.2) 0%, transparent 70%)",
  "Midnight Black": "radial-gradient(ellipse at 60% 40%, rgba(30,30,30,.3) 0%, transparent 70%)"
};

const environmentPresets = {
  studio: {
    backdrop:
      "radial-gradient(circle at 50% 18%, rgba(255,255,255,.08), transparent 38%), linear-gradient(180deg, #1a1b1d 0%, #101112 56%, #0b0b0c 100%)",
    glow: "radial-gradient(ellipse at 50% 44%, rgba(255,255,255,.08) 0%, transparent 58%)",
    ground: "linear-gradient(to top, rgba(0,0,0,.6), transparent)",
    horizon: "linear-gradient(to right, transparent, rgba(255,255,255,.06), transparent)",
    features: {
      backdrop: "Neutral gradient dome",
      ground: "Soft studio floor fade",
      mood: "Clean showroom focus",
      highlights: "Balanced reflections"
    }
  },
  sunset: {
    backdrop:
      "radial-gradient(circle at 52% 22%, rgba(255,190,120,.24), transparent 30%), linear-gradient(180deg, #5d3a33 0%, #2a1e24 48%, #121316 100%)",
    glow: "radial-gradient(ellipse at 55% 42%, rgba(255,146,71,.26) 0%, transparent 62%)",
    ground: "linear-gradient(to top, rgba(33,16,10,.72), transparent)",
    horizon: "linear-gradient(to right, transparent, rgba(255,169,103,.14), transparent)",
    features: {
      backdrop: "Warm amber sunset sky",
      ground: "Smoked asphalt fade",
      mood: "Golden-hour energy",
      highlights: "Warm side reflections"
    }
  },
  night: {
    backdrop:
      "radial-gradient(circle at 50% 14%, rgba(68,94,160,.13), transparent 26%), linear-gradient(180deg, #0e1320 0%, #090b11 52%, #040506 100%)",
    glow: "radial-gradient(ellipse at 58% 40%, rgba(73,102,190,.24) 0%, transparent 62%)",
    ground: "linear-gradient(to top, rgba(3,5,9,.88), transparent)",
    horizon: "linear-gradient(to right, transparent, rgba(116,145,255,.12), transparent)",
    features: {
      backdrop: "City-night blue blackout",
      ground: "Glossy dark pavement",
      mood: "Focused, dramatic contrast",
      highlights: "Sharper cool reflections"
    }
  },
  alpine: {
    backdrop:
      "radial-gradient(circle at 48% 18%, rgba(219,241,255,.16), transparent 32%), linear-gradient(180deg, #d9e5ee 0%, #8ea4b5 44%, #39444d 100%)",
    glow: "radial-gradient(ellipse at 54% 42%, rgba(197,232,255,.22) 0%, transparent 60%)",
    ground: "linear-gradient(to top, rgba(54,67,79,.7), transparent)",
    horizon: "linear-gradient(to right, transparent, rgba(215,236,255,.22), transparent)",
    features: {
      backdrop: "Open alpine daylight",
      ground: "Cool slate surface",
      mood: "Fresh high-altitude clarity",
      highlights: "Bright crisp reflections"
    }
  }
};

const getById = (id) => {
  const element = document.getElementById(id);

  if (!(element instanceof HTMLElement)) {
    throw new Error(`Missing element: ${id}`);
  }

  return element;
};

function applyEnvironment(presetKey) {
  const preset = environmentPresets[presetKey];
  getById("envBackdropLayer").style.background = `${preset.glow}, ${preset.backdrop}`;
  document.documentElement.style.setProperty("--env-ground", preset.ground);
  document.documentElement.style.setProperty("--env-horizon", preset.horizon);
  getById("envBackdrop").textContent = preset.features.backdrop;
  getById("envGround").textContent = preset.features.ground;
  getById("envMood").textContent = preset.features.mood;
  getById("envHighlights").textContent = preset.features.highlights;
  flashCanvas();
}

document.querySelectorAll(".p-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".p-tab").forEach((tab) => tab.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((panel) => panel.classList.remove("active"));
    button.classList.add("active");
    getById(`tab-${button.dataset.tab}`).classList.add("active");
  });
});

document.querySelectorAll(".model-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".model-card").forEach((item) => item.classList.remove("active"));
    card.classList.add("active");

    const modelKey = card.dataset.model;
    const specs = modelData[modelKey].specs;
    const modelName = card.querySelector(".model-card-name")?.textContent ?? modelData[modelKey].name;

    getById("watermark").textContent = modelName;
    getById("sp-power").textContent = specs.power;
    getById("sp-torque").textContent = specs.torque;
    getById("sp-accel").textContent = specs.accel;
    getById("sp-drive").textContent = specs.drive;
    getById("sp-city").textContent = specs.city;
    getById("sp-hwy").textContent = specs.hwy;
    getById("sp-comb").textContent = specs.comb;
    getById("sp-fuel").textContent = specs.fuel;
    getById("sp-len").textContent = specs.len;
    getById("sp-wb").textContent = specs.wb;

    flashCanvas();
  });
});

document.querySelectorAll(".swatch").forEach((swatch) => {
  swatch.addEventListener("click", () => {
    document.querySelectorAll(".swatch").forEach((item) => item.classList.remove("active"));
    swatch.classList.add("active");

    const colorName = swatch.dataset.color ?? "";
    getById("colorName").textContent = colorName;
    getById("envGlow").style.background = envColors[colorName] || "";

    flashCanvas();
  });
});

document.querySelectorAll(".env-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".env-card").forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
    applyEnvironment(card.dataset.env);
  });
});

document.querySelectorAll(".wheel-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".wheel-pill").forEach((item) => item.classList.remove("active"));
    pill.classList.add("active");
    flashCanvas();
  });
});

document.querySelectorAll(".int-item").forEach((item) => {
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

document.querySelectorAll(".view-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".view-btn").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

function flashCanvas() {
  const canvas = getById("carCanvas");
  canvas.classList.remove("flash");
  void canvas.offsetWidth;
  canvas.classList.add("flash");
}

const initialSwatch = document.querySelector(".swatch.active");
const initialEnvironment = document.querySelector(".env-card.active");

if (initialEnvironment?.dataset.env) {
  applyEnvironment(initialEnvironment.dataset.env);
}

if (initialSwatch?.dataset.color) {
  const initialColor = initialSwatch.dataset.color;
  getById("colorName").textContent = initialColor;
  getById("envGlow").style.background = envColors[initialColor] || "";
}
