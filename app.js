(() => {
  "use strict";

  const CONFIG = typeof WEDDING_CONFIG !== "undefined" ? WEDDING_CONFIG : (window.WEDDING_CONFIG || {});
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const fallback = {
    brideName: "[Bride]",
    groomName: "[Groom]",
    familyName: "the family",
    weddingDate: "",
    weddingDateLabel: "[Wedding date]",
    invitationLine: "Together with their families, they invite you to celebrate their wedding.",
    countdownHeading: "To the beginning of forever.",
    closingLine: "A warm invite from",
    whatsappCaption: "You are warmly invited to celebrate the wedding of {bride} & {groom}. 💛\n\n{date}\n{venue}\n\nWe would love to celebrate this special day with you!",
    whatsappPhone: "",
    assets: {}
  };

  const cfg = { ...fallback, ...CONFIG, assets: { ...fallback.assets, ...(CONFIG.assets || {}) } };
  const events = Array.isArray(cfg.events) ? cfg.events : [];
  let countdownTimer;

  function clean(value, empty = "") {
    return value == null ? empty : String(value).trim();
  }

  function setText(selector, value, empty = "") {
    const element = $(selector);
    if (element) element.textContent = clean(value, empty);
  }

  function setImage(selector, src, alt) {
    const image = $(selector);
    if (!image || !src) return;
    image.src = src;
    if (alt) image.alt = alt;
  }

  /* ------------------------------------------------------------
     DOOR
     ------------------------------------------------------------ */
  function openDoors() {
    const screen = $("#doorScreen");
    const invitation = $("#invitation");
    const button = $("#enterButton");
    if (!screen || screen.classList.contains("is-opening")) return;

    // Attempt to play audio
    const audio = $("#bgAudio");
    const audioToggle = $("#audioToggle");
    if (audio && cfg.assets.backgroundAudio) {
      audio.play().catch(() => console.log("Audio autoplay prevented by browser"));
      if (audioToggle) audioToggle.style.display = "flex";
    }

    screen.classList.add("is-opening");
    button?.setAttribute("aria-disabled", "true");
    invitation?.setAttribute("aria-hidden", "false");
    invitation?.classList.add("is-visible");
    document.body.classList.add("door-locked");

    window.setTimeout(() => {
      screen.classList.add("is-open");
      document.body.classList.remove("door-locked");
      setupRevealAnimations();
    }, 1600);
  }

  function setupDoor() {
    const screen = $("#doorScreen");
    const stage = $("#doorStage");
    const button = $("#enterButton");
    const door = cfg.assets.door;
    if (door) {
      $$(".door-panel").forEach((panel) => {
        panel.style.backgroundImage = `url("${door}")`;
      });
    }

    const bride = clean(cfg.brideName, "");
    const groom = clean(cfg.groomName, "");
    if (bride && groom) setText("#doorNames", `${bride} & ${groom}`);

    button?.addEventListener("click", openDoors);
    stage?.addEventListener("click", (event) => {
      if (event.target === stage) openDoors();
    });
    screen?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") openDoors();
    });
  }

  /* ------------------------------------------------------------
     CONFIG -> DOM
     ------------------------------------------------------------ */
  function applyConfig() {
    const bride = clean(cfg.brideName, "[Bride]");
    const groom = clean(cfg.groomName, "[Groom]");
    const family = clean(cfg.familyName, "the family");

    document.title = bride && groom && bride !== "[Bride]" && groom !== "[Groom]"
      ? `${bride} & ${groom} — Wedding Invitation`
      : "Wedding Invitation";

    setText("#brideName", bride, "[Bride]");
    setText("#groomName", groom, "[Groom]");
    setText("#familyName", family.toLowerCase().startsWith("the ") ? family : `the ${family}`);
    setText("#weddingDateLabel", cfg.weddingDateLabel, "[Wedding date]");
    setText("#invitationLine", cfg.invitationLine, fallback.invitationLine);
    setText("#countdownHeading", cfg.countdownHeading, fallback.countdownHeading);
    setText("#closingLine", cfg.closingLine, fallback.closingLine);

    setImage("#couplePhoto", cfg.assets.couplePhoto, "Couple photograph");
    setImage("#invitationImageEn", cfg.assets.invitationEn, "English Wedding invitation");
    setImage("#invitationImageKn", cfg.assets.invitationKn, "Kannada Wedding invitation");

    if (cfg.assets.backgroundAudio) {
      const audioSource = $("#bgAudioSource");
      if (audioSource) audioSource.src = cfg.assets.backgroundAudio;
      $("#bgAudio")?.load();
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && cfg.assets.ogImage) ogImage.setAttribute("content", cfg.assets.ogImage);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && bride !== "[Bride]" && groom !== "[Groom]") {
      ogTitle.setAttribute("content", `${bride} & ${groom} — Wedding Invitation`);
    }
  }

  /* ------------------------------------------------------------
     COUNTDOWN
     ------------------------------------------------------------ */
  function startCountdown() {
    const target = new Date(clean(cfg.weddingDate)).getTime();
    const card = $(".countdown-card");
    if (!card || !Number.isFinite(target)) {
      $("#countdownGrid")?.classList.add("not-configured");
      return;
    }

    const tick = () => {
      const remaining = target - Date.now();
      if (remaining <= 0) {
        clearInterval(countdownTimer);
        card.classList.add("ended");
        return;
      }
      const days = Math.floor(remaining / 86400000);
      const hours = Math.floor((remaining % 86400000) / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setText("#days", String(days).padStart(2, "0"));
      setText("#hours", String(hours).padStart(2, "0"));
      setText("#minutes", String(minutes).padStart(2, "0"));
      setText("#seconds", String(seconds).padStart(2, "0"));
    };

    tick();
    countdownTimer = window.setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------
     EVENTS
     ------------------------------------------------------------ */
  function renderEvents() {
    const list = $("#eventsList");
    if (!list) return;

    if (!events.length) {
      list.innerHTML = `<div class="empty-events">Add your ceremonies in <strong>config.js</strong>.</div>`;
      $("#eventsProgress")?.classList.add("hidden");
      return;
    }

    list.innerHTML = events.map((event, index) => `
      <article class="event-card" tabindex="0" data-index="${index}" style="--stagger:${index % 4}">
        <div class="event-card-inner">
          <span class="event-name">${escapeHtml(event.name || "Event")}</span>
          <span class="event-date">${escapeHtml(event.date || "")}</span>
          <span class="event-time">${escapeHtml(event.time || "")}</span>
          ${event.venue ? `<span class="event-venue">${escapeHtml(event.venue)}</span>` : ""}
          ${event.description ? `<span class="event-description">${escapeHtml(event.description)}</span>` : ""}
          <span class="event-location">${event.maps ? "Tap for location ↗" : "Location to be added"}</span>
        </div>
      </article>
    `).join("");

    list.querySelectorAll(".event-card").forEach((card, index) => {
      const event = events[index];
      const activate = () => {
        if (event?.maps) window.open(event.maps, "_blank", "noopener,noreferrer");
      };
      card.addEventListener("click", activate);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
      });
    });
  }

  function setupEventScroller() {
    const viewport = $("#eventsViewport");
    const list = $("#eventsList");
    const progress = $("#eventsProgress span");
    if (!viewport || !list || !progress) return;

    const update = () => {
      const max = viewport.scrollWidth - viewport.clientWidth;
      const ratio = max > 0 ? viewport.scrollLeft / max : 0;
      progress.style.transform = `scaleX(${Math.max(0, Math.min(1, ratio))})`;
    };

    viewport.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ------------------------------------------------------------
     SCROLL REVEAL (fade / slide-up / scale / blur)
     ------------------------------------------------------------ */
  function setupRevealAnimations() {
    const elements = $$("[data-animate], .event-card");
    if (!elements.length) return;

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      elements.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

    elements.forEach((element) => {
      if (element.dataset.animateDelay) {
        element.style.setProperty("--stagger", element.dataset.animateDelay);
      }
      if (!element.classList.contains("in-view")) observer.observe(element);
    });
  }

  /* ------------------------------------------------------------
     SUBTLE PARALLAX (hero photo / ornaments)
     ------------------------------------------------------------ */
  function setupParallax() {
    if (prefersReducedMotion) return;
    const targets = $$("[data-parallax]").map((el) => ({
      el,
      factor: parseFloat(el.dataset.parallax) || 0.1
    }));
    if (!targets.length) return;

    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      targets.forEach(({ el, factor }) => {
        el.style.transform = `translateY(${Math.min(y * factor, 60)}px)`;
      });
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------
     WHATSAPP SHARE — sends the invitation image itself
     ------------------------------------------------------------ */
  function formatCaption() {
    const firstEvent = events[0] || {};
    const venue = firstEvent.venue || "";
    return clean(cfg.whatsappCaption, fallback.whatsappCaption)
      .replaceAll("{bride}", clean(cfg.brideName, ""))
      .replaceAll("{groom}", clean(cfg.groomName, ""))
      .replaceAll("{date}", clean(cfg.weddingDateLabel, ""))
      .replaceAll("{venue}", venue);
  }

  function whatsappTextUrl(caption) {
    const phone = clean(cfg.whatsappPhone, "").replace(/[^0-9]/g, "");
    const base = phone ? `https://wa.me/${phone}` : "https://wa.me/";
    return `${base}?text=${encodeURIComponent(caption)}`;
  }

  async function getInvitationFile(imageId) {
    const image = $(`#${imageId}`);
    if (!image?.src) throw new Error("Invitation image is not configured.");

    const response = await fetch(image.src, { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load invitation image.");
    const blob = await response.blob();
    const extension = blob.type.includes("jpeg") || blob.type.includes("jpg") ? "jpg" : "png";
    return new File([blob], `wedding-invitation.${extension}`, { type: blob.type || "image/png" });
  }

  async function shareInvitation(imageId, buttonEl) {
    const note = $("#shareNote");
    buttonEl?.classList.add("is-loading");

    try {
      const file = await getInvitationFile(imageId);

      // Preferred path: native share sheet with the image FILE.
      // Choosing WhatsApp here sends the picture itself as media, not a link.
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Wedding Invitation",
          files: [file]
        });
        if (note) note.textContent = "Choose WhatsApp in the share sheet to send the invitation as media.";
        return;
      }

      // Fallback for browsers that cannot share files: WhatsApp's web/link
      // scheme has no way to attach a local image automatically, so we
      // download the invitation image and open WhatsApp.
      downloadInvitation(file);
      window.open("https://wa.me/", "_blank", "noopener,noreferrer");
      showToast("Invitation image downloaded. Attach it in WhatsApp.");
    } catch (error) {
      if (error?.name === "AbortError") return;
      window.open("https://wa.me/", "_blank", "noopener,noreferrer");
      showToast("WhatsApp opened. Please attach the downloaded image.");
    } finally {
      buttonEl?.classList.remove("is-loading");
    }
  }

  function downloadInvitation(file) {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 4200);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[char]));
  }

  /* ------------------------------------------------------------
     LIGHTBOX
     ------------------------------------------------------------ */
  function setupLightbox() {
    const modal = $("#lightboxModal");
    const img = $("#lightboxImage");
    const close = $("#closeLightbox");

    if (!modal || !img) return;

    $$(".lightbox-trigger").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        img.src = trigger.src;
        modal.showModal();
        document.body.style.overflow = "hidden";
      });
    });

    const closeModal = () => {
      modal.close();
      document.body.style.overflow = "";
    };

    close?.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  /* ------------------------------------------------------------
     AUDIO CONTROL
     ------------------------------------------------------------ */
  function setupAudio() {
    const audio = $("#bgAudio");
    const toggleBtn = $("#audioToggle");
    const iconOn = $("#audioIconOn");
    const iconOff = $("#audioIconOff");

    if (!audio || !toggleBtn) return;

    toggleBtn.addEventListener("click", () => {
      if (audio.muted) {
        audio.muted = false;
        if (iconOn) iconOn.style.display = "block";
        if (iconOff) iconOff.style.display = "none";
      } else {
        audio.muted = true;
        if (iconOn) iconOn.style.display = "none";
        if (iconOff) iconOff.style.display = "block";
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        audio.pause();
      } else {
        const screen = $("#doorScreen");
        if (screen && screen.classList.contains("is-open")) {
          audio.play().catch(() => {});
        }
      }
    });
  }

  /* ------------------------------------------------------------
     VIDEO SCROLLER
     ------------------------------------------------------------ */
  let introVideoPhase = true;
  function setupVideoScroller() {
    const scroller = $("#videoScroller");
    const video = $("#introVideo");
    const prompt = $("#videoPrompt");
    const doorScreen = $("#doorScreen");

    if (!scroller || !video || !doorScreen) return;

    if (cfg.assets.introVideo) {
      const source = $("#introVideoSource");
      if (source) source.src = cfg.assets.introVideo;
      video.load();
    } else {
      // If no video configured, skip phase entirely
      finishVideoPhase();
      return;
    }

    let ticking = false;

    function updateVideo() {
      if (!introVideoPhase) return;

      const rect = scroller.getBoundingClientRect();
      const maxScroll = rect.height - window.innerHeight;
      const scrollPos = -rect.top; 

      if (prompt && scrollPos > 50) {
        prompt.style.opacity = "0";
      }

      let progress = scrollPos / maxScroll;
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      // Ensure video metadata is loaded before seeking
      if (video.duration) {
        // Safari might throw errors if we seek past duration
        const targetTime = progress * video.duration;
        video.currentTime = Math.min(targetTime, video.duration - 0.1); 
      }

      if (progress >= 1) {
        finishVideoPhase();
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking && introVideoPhase) {
        window.requestAnimationFrame(updateVideo);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    function finishVideoPhase() {
      introVideoPhase = false;
      scroller.classList.add("is-done");
      
      setTimeout(() => {
        scroller.style.display = "none";
        doorScreen.style.display = "";
        window.scrollTo(0, 0);
      }, 1000);
    }
  }

  function init() {
    applyConfig();
    setupVideoScroller();
    setupDoor();
    startCountdown();
    renderEvents();
    setupEventScroller();
    setupParallax();
    setupRevealAnimations();
    setupLightbox();
    setupAudio();
    
    $("#shareButtonEn")?.addEventListener("click", (e) => shareInvitation("invitationImageEn", e.currentTarget));
    $("#shareButtonKn")?.addEventListener("click", (e) => shareInvitation("invitationImageKn", e.currentTarget));
  }

  init();
})();
