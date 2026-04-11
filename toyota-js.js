const modelData = {
  crown: {
    name: "Crown Platinum",
    sub: "2.4L Hybrid MAX AWD",
    price: 54450,
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
    price: 29950,
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
    price: 56545,
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
    price: 31025,
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
  "Blueprint": "radial-gradient(ellipse at 60% 40%, rgba(30,58,95,.25) 0%, transparent 70%)",
  "Oxide Bronze": "radial-gradient(ellipse at 60% 40%, rgba(163,140,109,.2) 0%, transparent 70%)",
  "Midnight Black": "radial-gradient(ellipse at 60% 40%, rgba(30,30,30,.3) 0%, transparent 70%)"
};

// Tabs
document.querySelectorAll(".p-tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".p-tab").forEach((tab) => tab.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((panel) => panel.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");

    const steps = { exterior: "step2", interior: "step3" };
    document.querySelectorAll(".step").forEach((step) => step.classList.remove("active"));
    document.querySelector(".step").classList.add("active");

    if (steps[btn.dataset.tab]) {
      document.getElementById(steps[btn.dataset.tab]).classList.add("active");
    }
  });
});

// Models
document.querySelectorAll(".model-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".model-card").forEach((item) => item.classList.remove("active"));
    card.classList.add("active");

    const model = modelData[card.dataset.model];
    const specs = model.specs;

    document.getElementById("totalPrice").textContent = `$${model.price.toLocaleString()}`;
    document.getElementById("watermark").textContent = card.querySelector(".model-card-name").textContent;
    document.getElementById("sp-power").textContent = specs.power;
    document.getElementById("sp-torque").textContent = specs.torque;
    document.getElementById("sp-accel").textContent = specs.accel;
    document.getElementById("sp-drive").textContent = specs.drive;
    document.getElementById("sp-city").textContent = specs.city;
    document.getElementById("sp-hwy").textContent = specs.hwy;
    document.getElementById("sp-comb").textContent = specs.comb;
    document.getElementById("sp-fuel").textContent = specs.fuel;
    document.getElementById("sp-len").textContent = specs.len;
    document.getElementById("sp-wb").textContent = specs.wb;

    flashCanvas();
  });
});

// Colors
document.querySelectorAll(".swatch").forEach((swatch) => {
  swatch.addEventListener("click", () => {
    document.querySelectorAll(".swatch").forEach((item) => item.classList.remove("active"));
    swatch.classList.add("active");

    const colorName = swatch.dataset.color;
    document.getElementById("colorName").textContent = colorName;
    document.getElementById("colorTag").textContent = colorName;
    document.getElementById("envGlow").style.background = envColors[colorName] || "";

    flashCanvas();
  });
});

// Wheels
document.querySelectorAll(".wheel-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".wheel-pill").forEach((item) => item.classList.remove("active"));
    pill.classList.add("active");
    flashCanvas();
  });
});

// Interior
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

// View buttons
document.querySelectorAll(".view-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".view-btn").forEach((item) => item.classList.remove("active"));
    btn.classList.add("active");
  });
});

function flashCanvas() {
  const canvas = document.getElementById("carCanvas");
  canvas.classList.remove("flash");
  void canvas.offsetWidth;
  canvas.classList.add("flash");
}

const initialSwatch = document.querySelector(".swatch.active");
if (initialSwatch) {
  const initialColor = initialSwatch.dataset.color;
  document.getElementById("colorName").textContent = initialColor;
  document.getElementById("colorTag").textContent = initialColor;
  document.getElementById("envGlow").style.background = envColors[initialColor] || "";
}
