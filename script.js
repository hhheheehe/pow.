const groups = [
  {
    title: "OWNERS", color: "#ff5ad9",
    members: [
      ["Nova", "Lead builder of the fictional network.", "N"],
      ["Cipher", "Systems designer and UI architect.", "C"]
    ]
  },
  {
    title: "CO OWNERS", color: "#ffd34e",
    members: [
      ["Mako", "Creative director and motion designer.", "M"],
      ["Astra", "Frontend engineer and visual designer.", "A"]
    ]
  },
  {
    title: "ADMINS", color: "#53a6ff",
    members: [
      ["Pixel", "Keeps the database organized.", "P"],
      ["Echo", "Animation and interaction specialist.", "E"],
      ["Vex", "Testing and accessibility.", "V"],
      ["Rin", "UI component maintainer.", "R"]
    ]
  },
  {
    title: "CREATORS", color: "#cf53ff",
    members: [
      ["Lumi", "Illustration and avatar art.", "L"],
      ["Kairo", "Motion graphics and effects.", "K"],
      ["Sora", "Typography and layout.", "S"]
    ]
  },
  {
    title: "SKID", color: "#5dffad",
    members: [
      ["Katana", "Fictional profile for demonstration.", "K"],
      ["Quill", "Fictional profile for demonstration.", "Q"],
      ["Roxy", "Fictional profile for demonstration.", "R"],
      ["Vexel", "Fictional profile for demonstration.", "V"]
    ]
  },
  {
    title: "LARP", color: "#ff2020",
    members: [
      ["Redshift", "Fictional profile for demonstration.", "R"],
      ["Neon", "Fictional profile for demonstration.", "N"],
      ["Static", "Fictional profile for demonstration.", "S"],
      ["Glitch", "Fictional profile for demonstration.", "G"],
      ["Byte", "Fictional profile for demonstration.", "B"]
    ]
  }
];

const groupsEl = document.getElementById("groups");

function renderRoster() {
  groupsEl.innerHTML = "";
  groups.forEach((group, gi) => {
    const section = document.createElement("section");
    section.className = "group";
    section.style.animationDelay = `${gi * 70}ms`;

    const heading = document.createElement("h2");
    heading.className = "group-title";
    heading.style.color = group.color;
    heading.style.textShadow = `0 0 10px ${group.color}55`;
    heading.textContent = `| ${group.title}`;
    section.appendChild(heading);

    const list = document.createElement("div");
    list.className = "member-list";

    group.members.forEach((member, mi) => {
      const [name, desc, initials] = member;
      const card = document.createElement("article");
      card.className = "member";
      card.style.setProperty("--accent", group.color);
      card.style.animation = `rise .4s both`;
      card.style.animationDelay = `${mi * 45}ms`;

      const avatar = document.createElement("div");
      avatar.className = "avatar";
      const initialsEl = document.createElement("span");
      initialsEl.textContent = initials;
      avatar.appendChild(initialsEl);

      const info = document.createElement("div");
      info.className = "info";
      const nameEl = document.createElement("div");
      nameEl.className = "name";
      nameEl.textContent = name;
      const descEl = document.createElement("div");
      descEl.className = "desc";
      descEl.textContent = desc;
      info.append(nameEl, descEl);

      card.append(avatar, info);
      list.appendChild(card);
    });

    section.appendChild(list);
    groupsEl.appendChild(section);
  });
}

const intro = document.getElementById("intro");
const roster = document.getElementById("roster");

const music = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");

function setMusicButton(isPlaying) {
  musicBtn.textContent = isPlaying ? "♫ MUSIC: ON" : "♫ MUSIC: OFF";
}

async function startMusic() {
  try {
    music.volume = 0.65;
    await music.play();
    setMusicButton(true);
  } catch (error) {
    setMusicButton(false);
    console.log("Music could not start:", error);
  }
}

music.addEventListener("play", () => setMusicButton(true));
music.addEventListener("pause", () => setMusicButton(false));

musicBtn.addEventListener("click", async () => {
  if (music.paused) {
    await startMusic();
  } else {
    music.pause();
  }
});

document.getElementById("enterBtn").addEventListener("click", async () => {
  await startMusic();
  intro.classList.add("fade-out");
  setTimeout(() => {
    intro.hidden = true;
    roster.hidden = false;
    window.scrollTo({top:0, behavior:"instant"});
    renderRoster();
  }, 350);
});

document.getElementById("backBtn").addEventListener("click", () => {
  roster.hidden = true;
  intro.hidden = false;
  window.scrollTo({top:0, behavior:"instant"});
});

const style = document.createElement("style");
style.textContent = `
.fade-out{animation:fadeOut .35s forwards}
@keyframes fadeOut{to{opacity:0;transform:scale(.98)}}
`;
document.head.appendChild(style);

// Animated network background
const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");
let points = [];
let w, h, dpr;

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.setTransform(dpr,0,0,dpr,0,0);

  const count = Math.min(70, Math.max(28, Math.floor((w*h)/18000)));
  points = Array.from({length: count}, () => ({
    x: Math.random()*w, y: Math.random()*h,
    vx: (Math.random()-.5)*.24, vy: (Math.random()-.5)*.24
  }));
}
window.addEventListener("resize", resize);
resize();

function drawNetwork() {
  ctx.clearRect(0,0,w,h);
  for (const p of points) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < -20 || p.x > w+20) p.vx *= -1;
    if (p.y < -20 || p.y > h+20) p.vy *= -1;
  }

  for (let i=0;i<points.length;i++) {
    const a=points[i];
    for (let j=i+1;j<points.length;j++) {
      const b=points[j];
      const dx=a.x-b.x, dy=a.y-b.y;
      const dist=Math.hypot(dx,dy);
      if(dist<150){
        const alpha=(1-dist/150)*.24;
        ctx.strokeStyle=`rgba(255,75,15,${alpha})`;
        ctx.lineWidth=.7;
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
      }
    }
  }
  for(const p of points){
    ctx.fillStyle="rgba(255,75,15,.55)";
    ctx.beginPath();ctx.arc(p.x,p.y,1.2,0,Math.PI*2);ctx.fill();
  }
  requestAnimationFrame(drawNetwork);
}
drawNetwork();
