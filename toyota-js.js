const modelData = {
  crown: {
    name: "Crown Platinum", sub: "2.4L Hybrid MAX AWD", price: 54450,
    specs: { power:"340 HP", torque:"400 lb-ft", accel:"5.7s", drive:"AWD", city:"29", hwy:"32", comb:"30", fuel:"Hybrid", len:"196 in", wb:"112 in" }
  },
  camry: {
    name: "Camry XSE", sub: "2.5L 4-Cylinder", price: 29950,
    specs: { power:"203 HP", torque:"184 lb-ft", accel:"7.2s", drive:"FWD", city:"28", hwy:"39", comb:"32", fuel:"Gasoline", len:"192 in", wb:"111 in" }
  },
  supra: {
    name: "GR Supra 3.0", sub: "3.0L Turbocharged Inline-6", price: 56545,
    specs: { power:"382 HP", torque:"368 lb-ft", accel:"3.9s", drive:"RWD", city:"22", hwy:"30", comb:"25", fuel:"Premium", len:"172 in", wb:"97 in" }
  },
  rav4: {
    name: "RAV4 XSE", sub: "2.5L Hybrid AWD", price: 31025,
    specs: { power:"219 HP", torque:"163 lb-ft", accel:"7.4s", drive:"AWD", city:"41", hwy:"38", comb:"40", fuel:"Hybrid", len:"180 in", wb:"105 in" }
  }
};

const envColors = {
  "#1a1c1c": "radial-gradient(ellipse at 60% 40%, rgba(50,50,60,.25) 0%, transparent 70%)",
  "#f0eeec": "radial-gradient(ellipse at 60% 40%, rgba(220,215,200,.18) 0%, transparent 70%)",
  "#8e0000": "radial-gradient(ellipse at 60% 40%, rgba(140,0,0,.22) 0%, transparent 70%)",
  "#1e3a5f": "radial-gradient(ellipse at 60% 40%, rgba(30,58,95,.25) 0%, transparent 70%)",
  "#a38c6d": "radial-gradient(ellipse at 60% 40%, rgba(163,140,109,.2) 0%, transparent 70%)",
  "#0d0d0d": "radial-gradient(ellipse at 60% 40%, rgba(30,30,30,.3) 0%, transparent 70%)"
};

let basePrice = 54450;

// Tabs
document.querySelectorAll('.p-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.p-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    const steps = { exterior: 'step2', interior: 'step3' };
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.querySelector('.step').classList.add('active');
    if (steps[btn.dataset.tab]) document.getElementById(steps[btn.dataset.tab]).classList.add('active');
  });
});

// Models
document.querySelectorAll('.model-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.model-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    const m = modelData[card.dataset.model];
    basePrice = m.price;
    document.getElementById('totalPrice').textContent = '$' + m.price.toLocaleString();
    document.getElementById('watermark').textContent = card.querySelector('.model-card-name').textContent;
    const s = m.specs;
    document.getElementById('sp-power').textContent  = s.power;
    document.getElementById('sp-torque').textContent = s.torque;
    document.getElementById('sp-accel').textContent  = s.accel;
    document.getElementById('sp-drive').textContent  = s.drive;
    document.getElementById('sp-city').textContent   = s.city;
    document.getElementById('sp-hwy').textContent    = s.hwy;
    document.getElementById('sp-comb').textContent   = s.comb;
    document.getElementById('sp-fuel').textContent   = s.fuel;
    document.getElementById('sp-len').textContent    = s.len;
    document.getElementById('sp-wb').textContent     = s.wb;
    flashCanvas();
  });
});

// Colors
document.querySelectorAll('.swatch').forEach(sw => {
  sw.addEventListener('click', () => {
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    sw.classList.add('active');
    const name = sw.dataset.color;
    document.getElementById('colorName').textContent = name;
    document.getElementById('colorTag').textContent  = name;
    document.getElementById('envGlow').style.background = envColors[sw.style.background] || '';
    flashCanvas();
  });
});

// Wheels
document.querySelectorAll('.wheel-pill').forEach(p => {
  p.addEventListener('click', () => {
    document.querySelectorAll('.wheel-pill').forEach(x => x.classList.remove('active'));
    p.classList.add('active');
    flashCanvas();
  });
});

// Interior
document.querySelectorAll('.int-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.int-item').forEach(i => {
      i.classList.remove('active');
      i.querySelector('.int-check')?.remove();
    });
    item.classList.add('active');
    const chk = document.createElement('span');
    chk.className = 'ms fill int-check';
    chk.textContent = 'check_circle';
    item.appendChild(chk);
    flashCanvas();
  });
});

// View buttons
document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

function flashCanvas() {
  const c = document.getElementById('carCanvas');
  c.classList.remove('flash');
  void c.offsetWidth;
  c.classList.add('flash');
}
