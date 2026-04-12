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

const getById = (id) => {
  const element = document.getElementById(id);

  if (!(element instanceof HTMLElement)) {
    throw new Error(`Missing element: ${id}`);
  }

  return element;
};

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
if (initialSwatch?.dataset.color) {
  const initialColor = initialSwatch.dataset.color;
  getById("colorName").textContent = initialColor;
  getById("envGlow").style.background = envColors[initialColor] || "";
}
