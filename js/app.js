const loader = document.getElementById("loader");
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const closeMenu = document.getElementById("closeMenu");
const sideMenu = document.getElementById("sideMenu");

const statsPanel = document.getElementById("statsPanel");
const featuredMemory = document.getElementById("featuredMemory");
const memoryList = document.getElementById("memoryList");
const mediaList = document.getElementById("mediaList");
const timelineList = document.getElementById("timelineList");

const lightbox = document.getElementById("lightbox");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDesc = document.getElementById("lightboxDesc");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxDate = document.getElementById("lightboxDate");
const lightboxLocation = document.getElementById("lightboxLocation");

const audio = document.getElementById("audio");
const miniPlay = document.getElementById("miniPlay");
const mainPlay = document.getElementById("mainPlay");
const prevTrack = document.getElementById("prevTrack");
const nextTrack = document.getElementById("nextTrack");
const progressBar = document.getElementById("progressBar");

const trackQueue = document.getElementById("trackQueue");
const currentTrackNumber = document.getElementById("currentTrackNumber");
const currentTrackDuration = document.getElementById("currentTrackDuration");
const queueCount = document.getElementById("queueCount");

const mainVideo = document.getElementById("mainVideo");

let currentTrackIndex = 0;

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("hide");
  }, 750);
});

function renderHero() {
  document.getElementById("heroKicker").textContent = SITE_DATA.hero.kicker;
  document.getElementById("heroTitle").innerHTML = SITE_DATA.hero.title;
  document.getElementById("heroSubtitle").textContent = SITE_DATA.hero.subtitle;
  document.getElementById("spotlightImg").src = SITE_DATA.hero.spotlightImage;
  document.getElementById("spotlightTitle").textContent = SITE_DATA.hero.spotlightTitle;
  document.getElementById("ticketTitle").textContent = SITE_DATA.hero.ticketTitle;
  document.getElementById("ticketDate").textContent = SITE_DATA.hero.ticketDate;

  statsPanel.innerHTML = SITE_DATA.stats.map((stat) => `
    <div class="stat-card">
      <b>${stat.value}</b>
      <span>${stat.label}</span>
    </div>
  `).join("");
}

function openMemory(memory) {
  lightboxImg.src = memory.image;
  lightboxTitle.textContent = memory.title;
  lightboxDesc.textContent = memory.desc;
  lightboxCategory.textContent = memory.categoryLabel;
  lightboxDate.textContent = `Date: ${memory.date}`;
  lightboxLocation.textContent = `Location: ${memory.location}`;

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function memoryCardTemplate(memory) {
  return `
    <article class="memory-card reveal" data-category="${memory.category}" tabindex="0">
      <img src="${memory.image}" alt="${memory.title}">
      <div class="memory-card-content">
        <span class="category-pill">${memory.categoryLabel}</span>
        <h3>${memory.title}</h3>
        <p>${memory.desc}</p>
        <div class="memory-meta">
          <span>▣ ${memory.date}</span>
          <span>☉ ${memory.location}</span>
        </div>
      </div>
    </article>
  `;
}

function renderMemories() {
  const first = SITE_DATA.memories[0];

  featuredMemory.innerHTML = `
    <img src="${first.image}" alt="${first.title}">
    <div class="featured-memory-content">
      <span class="category-pill">${first.categoryLabel}</span>
      <h3>${first.title}</h3>
      <p>${first.desc}</p>
    </div>
  `;

  featuredMemory.addEventListener("click", () => openMemory(first));

  memoryList.innerHTML = SITE_DATA.memories.slice(1).map(memoryCardTemplate).join("");

  document.querySelectorAll(".memory-card").forEach((card, index) => {
    const memory = SITE_DATA.memories[index + 1];

    card.addEventListener("click", () => openMemory(memory));

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        openMemory(memory);
      }
    });
  });
}

function renderVideos() {
  const firstVideo = SITE_DATA.videos[0];

  document.getElementById("mainVideoTitle").textContent = firstVideo.title;
  document.getElementById("mainVideoDesc").textContent = firstVideo.desc;

  mainVideo.poster = firstVideo.poster;
  mainVideo.querySelector("source").src = firstVideo.src;
  mainVideo.load();

  mediaList.innerHTML = SITE_DATA.videos.slice(1).map((video, index) => `
    <article class="media-item reveal" data-video-index="${index + 1}">
      <img src="${video.poster}" alt="${video.title}">
      <div>
        <h3>${video.title}</h3>
        <p>${video.desc}</p>
        <small>${video.duration}</small>
      </div>
      <button class="play-dot" type="button">▶</button>
    </article>
  `).join("");

  document.querySelectorAll(".media-item").forEach((item) => {
    item.addEventListener("click", () => {
      const video = SITE_DATA.videos[Number(item.dataset.videoIndex)];

      document.getElementById("mainVideoTitle").textContent = video.title;
      document.getElementById("mainVideoDesc").textContent = video.desc;

      mainVideo.poster = video.poster;
      mainVideo.querySelector("source").src = video.src;
      mainVideo.load();

      mainVideo.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });
  });
}

function renderTimeline() {
  timelineList.innerHTML = SITE_DATA.timeline.map((item) => `
    <article class="timeline-item reveal">
      <div class="timeline-number">${item.number}</div>
      <div>
        <small>${item.date}</small>
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
      </div>
    </article>
  `).join("");
}

function renderPlaylist() {
  const playlist = SITE_DATA.playlist;

  queueCount.textContent = `${playlist.tracks.length} Tracks`;

  document.getElementById("personalNoteTitle").textContent = playlist.noteTitle;
  document.getElementById("personalNote").textContent = playlist.note;

  trackQueue.innerHTML = playlist.tracks.map((track, index) => `
    <button class="track-row ${index === currentTrackIndex ? "active" : ""}" data-track-index="${index}" type="button">
      <span class="track-number">${String(index + 1).padStart(2, "0")}</span>

      <span>
        <span class="track-title">${track.title}</span>
        <span class="track-artist">${track.artist}</span>
      </span>

      <span class="track-duration">${track.duration}</span>
    </button>
  `).join("");

  document.querySelectorAll(".track-row").forEach((row) => {
    row.addEventListener("click", () => {
      loadTrack(Number(row.dataset.trackIndex), true);
    });
  });

  loadTrack(currentTrackIndex, false);
}

function loadTrack(index, autoplay = false) {
  const tracks = SITE_DATA.playlist.tracks;

  currentTrackIndex = (index + tracks.length) % tracks.length;

  const track = tracks[currentTrackIndex];

  document.getElementById("albumCover").src = track.cover;
  document.getElementById("songTitle").textContent = track.title;
  document.getElementById("songArtist").textContent = `${track.artist} • Concert Memory Mood`;

  document.getElementById("miniSong").textContent = track.title;
  document.getElementById("miniArtist").textContent = track.artist;
  document.querySelector(".mini-player img").src = track.cover;

  currentTrackNumber.textContent = `Track ${String(currentTrackIndex + 1).padStart(2, "0")}`;
  currentTrackDuration.textContent = track.duration;

  audio.src = track.src;
  progressBar.style.width = "0%";

  document.querySelectorAll(".track-row").forEach((row, rowIndex) => {
    row.classList.toggle("active", rowIndex === currentTrackIndex);
  });

  miniPlay.textContent = "▶";
  mainPlay.textContent = "▶";

  if (autoplay) {
    audio.play().then(() => {
      miniPlay.textContent = "Ⅱ";
      mainPlay.textContent = "Ⅱ";
    }).catch(() => {
      alert(`File lagu belum ada: ${track.src}`);
    });
  }
}

function setupFilters() {
  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach((item) => {
        item.classList.remove("active");
      });

      chip.classList.add("active");

      const filter = chip.dataset.filter;

      document.querySelectorAll(".memory-card").forEach((card) => {
        card.classList.toggle("hide", filter !== "all" && card.dataset.category !== filter);
      });

      const first = SITE_DATA.memories.find((item) => {
        return filter === "all" || item.category === filter;
      }) || SITE_DATA.memories[0];

      featuredMemory.innerHTML = `
        <img src="${first.image}" alt="${first.title}">
        <div class="featured-memory-content">
          <span class="category-pill">${first.categoryLabel}</span>
          <h3>${first.title}</h3>
          <p>${first.desc}</p>
        </div>
      `;

      featuredMemory.onclick = () => openMemory(first);
    });
  });
}

function setupTheme() {
  const saved = localStorage.getItem("exo-theme");

  if (saved === "light") {
    document.body.classList.add("light");
    themeToggle.textContent = "☀";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");

    const isLight = document.body.classList.contains("light");

    themeToggle.textContent = isLight ? "☀" : "☾";
    localStorage.setItem("exo-theme", isLight ? "light" : "dark");
  });
}

function setupMenu() {
  menuToggle.addEventListener("click", () => {
    sideMenu.classList.add("open");
  });

  closeMenu.addEventListener("click", () => {
    sideMenu.classList.remove("open");
  });

  sideMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      sideMenu.classList.remove("open");
    });
  });
}

function setupAudio() {
  function toggleAudio() {
    const currentTrack = SITE_DATA.playlist.tracks[currentTrackIndex];

    if (audio.paused) {
      audio.play().then(() => {
        miniPlay.textContent = "Ⅱ";
        mainPlay.textContent = "Ⅱ";
      }).catch(() => {
        alert(`File lagu belum ada: ${currentTrack.src}`);
      });
    } else {
      audio.pause();
      miniPlay.textContent = "▶";
      mainPlay.textContent = "▶";
    }
  }

  miniPlay.addEventListener("click", toggleAudio);
  mainPlay.addEventListener("click", toggleAudio);

  prevTrack.addEventListener("click", () => {
    loadTrack(currentTrackIndex - 1, true);
  });

  nextTrack.addEventListener("click", () => {
    loadTrack(currentTrackIndex + 1, true);
  });

  audio.addEventListener("timeupdate", () => {
    const percent = audio.duration
      ? (audio.currentTime / audio.duration) * 100
      : 0;

    progressBar.style.width = `${percent}%`;
  });

  audio.addEventListener("ended", () => {
    loadTrack(currentTrackIndex + 1, true);
  });
}

function setupLightbox() {
  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
}

function setupReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.13
  });

  document.querySelectorAll(".reveal").forEach((item) => {
    observer.observe(item);
  });
}

function setupBottomNav() {
  const navLinks = document.querySelectorAll(".bottom-nav a");
  const sections = [...document.querySelectorAll("section[id]")];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = entry.target.getAttribute("id");

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    });
  }, {
    rootMargin: "-45% 0px -45% 0px",
    threshold: 0
  });

  sections.forEach((section) => {
    observer.observe(section);
  });
}

renderHero();
renderMemories();
renderVideos();
renderTimeline();
renderPlaylist();

setupFilters();
setupTheme();
setupMenu();
setupAudio();
setupLightbox();
setupReveal();
setupBottomNav();