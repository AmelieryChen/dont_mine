(function () {
  var sale = new Date("2026-11-19T18:00:00-11:00");

  function tick() {
    var diff = sale - new Date();
    if (diff < 0) diff = 0;
    var s = Math.floor(diff / 1000);
    document.getElementById("d").textContent = Math.floor(s / 86400);
    document.getElementById("h").textContent = Math.floor((s % 86400) / 3600);
    document.getElementById("m").textContent = Math.floor((s % 3600) / 60);
    document.getElementById("s").textContent = s % 60;
  }
  tick();
  setInterval(tick, 1000);

  var captions = [
    "A collector strips nodules from the seafloor — and the life that depends on them.",
    "A riser pipe lifts a slurry of rock, sediment, and seawater across thousands of meters.",
    "Waste discharge can seed a midwater plume far from the mine site.",
    "Noise, light, and metals do not stop at a lease boundary whales and tuna still cross."
  ];
  var steps = document.querySelectorAll(".step");
  var plume = document.getElementById("plume");
  steps.forEach(function (btn) {
    btn.addEventListener("click", function () {
      steps.forEach(function (s) {
        s.classList.remove("active");
        s.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      var i = Number(btn.getAttribute("data-step"));
      document.getElementById("viz-caption").textContent = captions[i];
      if (plume) {
        plume.setAttribute("opacity", i >= 2 ? "0.55" : "0.2");
        plume.setAttribute("rx", i >= 2 ? "48" : "18");
      }
    });
  });

  var depth = document.getElementById("depth");
  var depthLabel = document.getElementById("depth-label");
  function describeDepth(m) {
    m = Number(m);
    if (m < 40) return m + " m — typical recreational scuba limit is far shallower than this industry.";
    if (m < 200) return m.toLocaleString() + " m — still in sunlit or twilight waters, not the lease blocks.";
    if (m < 1400) return m.toLocaleString() + " m — approaching the shallow edge of the proposed American Samoa blocks.";
    if (m <= 6000) return m.toLocaleString() + " m — inside the 1,400–6,000 m depth range named for the sale area.";
    return m.toLocaleString() + " m";
  }
  depth.addEventListener("input", function () {
    depthLabel.textContent = describeDepth(depth.value);
  });
  depthLabel.textContent = describeDepth(depth.value);

  var canvas = document.getElementById("marine-snow");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (canvas && canvas.getContext && !reduce) {
    var ctx = canvas.getContext("2d");
    var flakes = [];
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    function spawn() {
      flakes = [];
      var n = Math.min(90, Math.floor(window.innerWidth / 16));
      for (var i = 0; i < n; i++) {
        flakes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.8 + 0.4,
          v: Math.random() * 0.45 + 0.12,
          a: Math.random() * 0.35 + 0.08
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#d8fff6";
      flakes.forEach(function (f) {
        ctx.globalAlpha = f.a;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
        f.y += f.v;
        f.x += Math.sin(f.y / 40) * 0.15;
        if (f.y > canvas.height) {
          f.y = -4;
          f.x = Math.random() * canvas.width;
        }
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    window.addEventListener("resize", function () {
      resize();
      spawn();
    });
    resize();
    spawn();
    draw();
  }

  var questions = [
    {
      q: "How far offshore does American Samoa’s own mining moratorium reach?",
      choices: [
        "The entire exclusive economic zone, out to 200 nautical miles",
        "About 3 nautical miles — territorial waters only",
        "Only inside Pago Pago Harbor",
        "It has no legal force; it is a resolution"
      ],
      answer: 1,
      why: "EO 006-2024 applies to territorial waters. Federal leasing is aimed at the Outer Continental Shelf farther out, which is why a local ban has not stopped PACM-1."
    },
    {
      q: "About how large is the proposed November 19, 2026 lease sale?",
      choices: [
        "31,000 acres, similar to a large ranch",
        "Two blocks totaling more than 31 million acres",
        "The same size as Fagatele Bay’s original sanctuary unit",
        "A single experimental plot of one square kilometer"
      ],
      answer: 1,
      why: "Reporting on the proposed leasing notice describes blocks of about 16.3 and 15.1 million acres, more than 31 million acres in all."
    },
    {
      q: "Why do community leaders say mining threatens the tuna economy?",
      choices: [
        "Because nodules are made of canned tuna",
        "Because StarKist has already announced it will close if any survey ship visits",
        "Because sediment plumes, metals, and food-web disruption can move through the water column tuna and their prey use",
        "Because mining royalties are illegal in U.S. territories"
      ],
      answer: 2,
      why: "The cannery and related jobs depend on healthy pelagic fisheries. Midwater discharge science and ESA litigation both focus on harm that is not confined to the seafloor."
    },
    {
      q: "What did scientists measure inside industrial collector tracks two months after a 2022 Pacific trial?",
      choices: [
        "No change in animals living in the sediment",
        "A 37% drop in density and a 32% drop in species richness",
        "A doubling of coral cover",
        "Full recovery of nodule fauna"
      ],
      answer: 1,
      why: "The Nature Ecology & Evolution trial paper reported those declines in macrofauna inside the tracks, plus shifts in dominance in plume-affected communities."
    },
    {
      q: "What is Faʻasao Amerika Samoa asking a federal court to do?",
      choices: [
        "Award mining royalties to villages",
        "Void NMFS’s conclusion that leasing is not likely to adversely affect listed species, and require a lawful ESA review",
        "Annex the Cook Islands EEZ",
        "Ban all NOAA research ships from Pago Pago"
      ],
      answer: 1,
      why: "The August 2026 suit targets the fisheries service’s ESA consultation — not a random protest of science in general."
    }
  ];

  var qi = 0;
  var locked = false;
  var root = document.getElementById("quiz-root");
  var feedback = document.getElementById("q-feedback");
  var next = document.getElementById("q-next");
  var progress = document.getElementById("q-progress");

  function render() {
    locked = false;
    feedback.textContent = "";
    var item = questions[qi];
    progress.textContent = "Question " + (qi + 1) + " of " + questions.length;
    root.innerHTML = "<h3>" + item.q + "</h3><div class='choices'></div>";
    var box = root.querySelector(".choices");
    item.choices.forEach(function (label, idx) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.addEventListener("click", function () {
        if (locked) return;
        locked = true;
        var buttons = box.querySelectorAll("button");
        buttons.forEach(function (el, j) {
          if (j === item.answer) el.classList.add("good");
        });
        if (idx === item.answer) {
          b.classList.add("good");
          feedback.textContent = "Correct. " + item.why;
        } else {
          b.classList.add("bad");
          feedback.textContent = "Not quite. " + item.why;
        }
      });
      box.appendChild(b);
    });
    next.textContent = qi === questions.length - 1 ? "Start over" : "Next question";
  }

  next.addEventListener("click", function () {
    qi = qi === questions.length - 1 ? 0 : qi + 1;
    render();
  });
  render();
})();
