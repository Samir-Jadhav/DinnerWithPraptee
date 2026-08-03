(function () {
  const card = document.querySelector(".card");
  const button = document.querySelector(".open-btn");
  const messageScreens = [...document.querySelectorAll(".message-screen")];
  const scene = document.querySelector(".scene");
  const finalStage = document.querySelector(".final-stage");
  const waxSeal = document.querySelector(".wax-seal");
  const invitationCard = document.querySelector(".invitation-card");
  const yesButton = document.querySelector(".invitation-yes");
  const maybeButton = document.querySelector(".invitation-maybe");
  const invitationActions = document.querySelector(".invitation-actions");
  const maybeMessageSlot = document.querySelector(".maybe-message-slot");
  const maybeMessage = document.querySelector(".maybe-escape-message");
  const thankYou = document.querySelector(".success-celebration");
  const thankYouTitle = thankYou?.querySelector("p");
  const thankYouText = thankYou?.querySelector("span");
  const successFinal = document.querySelector(".success-final");
  const successStatus = document.querySelector(".success-status");
  const backButton = document.querySelector(".back-button");
  const musicToggle = document.querySelector(".music-toggle");
  const music = document.querySelector("#background-music");
  const cursor = document.querySelector(".gold-cursor");
  const sounds = {
    click: document.querySelector("#sound-click"),
    envelope: document.querySelector("#sound-envelope"),
    wax: document.querySelector("#sound-wax"),
    whoosh: document.querySelector("#sound-whoosh"),
    success: document.querySelector("#sound-success")
  };
  let maybeCooldown = false;
  let maybeMessageTimer;
  let navigationState = 0;
  const successTimers = [];
  const escapeMessages = [
    "Are you sure? 😊",
    "Just one dinner... 🍽️",
    "I promise I'll choose good food 😄",
    "You almost caught me.",
    "Maybe give the other button a try ❤️",
    "I'm a little shy.",
    "One evening... that's all I'm asking.",
    "Still thinking? 😊",
    "Almost... 😄",
    "That button is feeling a little nervous.",
    "A dinner date sounds nicer, doesn't it?",
    "So close, yet so far. ✨",
    "The Yes button looks very welcoming.",
    "I have excellent dessert recommendations.",
    "Perhaps the universe is nudging you. 🌙",
    "Just imagine the conversation.",
    "This button has places to be.",
    "Good food deserves good company.",
    "A tiny adventure never hurt anyone.",
    "I saved the best seat for you.",
    "One kind yes could make my day.",
    "The menu is already excited. 😄",
    "I promise to order something delicious.",
    "The stars are rooting for dinner. ✦",
    "You are making this button blush.",
    "Maybe the answer is hiding in gold.",
    "A lovely evening is only one click away.",
    "This little button is a fast one.",
    "Dinner comes with good stories.",
    "The other button is much easier to catch.",
    "I hear the Yes button is very polite.",
    "No pressure, just a hopeful invitation.",
    "A table for two sounds rather nice.",
    "The restaurant might miss us both.",
    "One evening can become a sweet memory.",
    "This escape is purely theatrical.",
    "A small yes, a beautiful night.",
    "I promise not to steal your fries. 🍟",
    "The candlelight is waiting patiently.",
    "Maybe this is your sign.",
    "A good meal is better shared.",
    "I would really enjoy your company.",
    "This button believes in second chances.",
    "The Yes button has excellent taste.",
    "One dinner, zero awkward speeches.",
    "The playlist is already being curated.",
    "You make even a button feel shy.",
    "Could be the start of a lovely evening.",
    "A quiet dinner sounds wonderful.",
    "The night is young, this button is quick.",
    "The answer can be simple. ❤️",
    "I am respectfully cheering for Yes.",
    "A little sparkle never hurts. ✨",
    "Dinner plans look good on you.",
    "No rush, but this button is restless.",
    "The table is patiently holding our place.",
    "One click could make a memory."
  ];
  const availableEscapeMessages = [...escapeMessages];
  const usedEscapeMessages = new Set();
  const dynamicMessageParts = {
    openings: ["Just...", "Maybe...", "Come on...", "Honestly...", "One..."],
    middles: ["dinner", "evening", "conversation", "chance", "smile", "memory", "moment"],
    endings: ["would mean a lot.", "is all I'm asking.", "❤️", "😊", "perhaps?", "together.", "could be enough."]
  };

  const getNextEscapeMessage = () => {
    if (availableEscapeMessages.length) {
      const messageIndex = Math.floor(Math.random() * availableEscapeMessages.length);
      const [message] = availableEscapeMessages.splice(messageIndex, 1);
      usedEscapeMessages.add(message);
      return message;
    }

    let message;
    let attempts = 0;
    do {
      const { openings, middles, endings } = dynamicMessageParts;
      message = `${openings[Math.floor(Math.random() * openings.length)]} ${middles[Math.floor(Math.random() * middles.length)]} ${endings[Math.floor(Math.random() * endings.length)]}`;
      attempts += 1;
    } while (usedEscapeMessages.has(message) && attempts < 500);

    if (usedEscapeMessages.has(message)) message = `${message} (${usedEscapeMessages.size + 1})`;

    usedEscapeMessages.add(message);
    return message;
  };

  const playSound = (name, volume = 0.2) => {
    const sound = sounds[name];
    if (!sound) return;
    sound.volume = volume;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  };

  let musicRequested = false;
  let musicRetryPending = false;

  const setMusicToggleState = (isPlaying) => {
    if (!musicToggle) return;
    musicToggle.classList.toggle("is-playing", isPlaying);
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
    musicToggle.setAttribute("aria-label", isPlaying ? "Turn background music off" : "Turn background music on");
    musicToggle.querySelector(".music-toggle__label").textContent = isPlaying ? "Music On" : "Music Off";
  };

  const playBackgroundMusic = () => {
    if (!music || !musicRequested) return;
    music.volume = 0.18;
    music.loop = true;
    music.play().then(() => {
      musicRetryPending = false;
      setMusicToggleState(true);
    }).catch((error) => {
      musicRetryPending = true;
      setMusicToggleState(false);
      console.error("Background music playback was blocked. It will retry after the next interaction.", error);
    });
  };

  if (music) {
    music.volume = 0.18;
    music.loop = true;
    music.addEventListener("error", () => {
      musicRetryPending = false;
      const source = music.currentSrc || music.src;
      console.error(`Background music failed to load: ${source}`, music.error);
    });
    music.addEventListener("playing", () => setMusicToggleState(true));
    music.addEventListener("pause", () => {
      if (!musicRequested) setMusicToggleState(false);
    });
  }

  musicToggle?.addEventListener("click", () => {
    if (!music) return;
    if (musicRequested) {
      musicRequested = false;
      musicRetryPending = false;
      music.pause();
      setMusicToggleState(false);
      return;
    }

    musicRequested = true;
    playBackgroundMusic();
  });

  document.addEventListener("pointerdown", () => {
    if (musicRetryPending && musicRequested) playBackgroundMusic();
  }, { capture: true });

  if (window.matchMedia("(pointer: fine)").matches && cursor) {
    let lastTrail = 0;
    document.addEventListener("pointermove", (event) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursor.classList.add("is-visible");
      if (Date.now() - lastTrail > 120) {
        lastTrail = Date.now();
        const trail = document.createElement("span");
        trail.className = "cursor-sparkle";
        trail.textContent = "✦";
        trail.style.left = `${event.clientX}px`;
        trail.style.top = `${event.clientY}px`;
        document.body.appendChild(trail);
        trail.addEventListener("animationend", () => trail.remove(), { once: true });
      }
    });
    document.addEventListener("pointerover", (event) => cursor.classList.toggle("is-active", Boolean(event.target.closest("button"))));
    document.addEventListener("pointerout", (event) => {
      if (event.target.closest("button")) cursor.classList.remove("is-active");
    });
  }

  const showMessageScreen = (screenIndex) => {
    messageScreens.forEach((screen, index) => {
      const isActive = index === screenIndex;
      screen.classList.toggle("is-active", isActive);
      screen.setAttribute("aria-hidden", String(!isActive));
    });
    scene?.classList.toggle("envelope-mode", screenIndex === 2);
    navigationState = screenIndex + 1;
    backButton?.classList.toggle("is-visible", navigationState > 0);
  };

  const resetSuccessScreen = () => {
    successTimers.forEach((timer) => window.clearTimeout(timer));
    successTimers.length = 0;
    finalStage?.classList.remove("is-accepted", "is-success-faded");
    scene?.classList.remove("is-celebrating");
    thankYou?.classList.remove("is-visible", "is-leaving");
    thankYou?.setAttribute("aria-hidden", "true");
    successFinal?.classList.remove("is-revealing");
    successFinal?.setAttribute("aria-hidden", "true");
    successStatus?.classList.remove("is-visible");
    successStatus?.setAttribute("aria-hidden", "true");
  };

  const resetFinalScreen = () => {
    resetSuccessScreen();
    finalStage?.classList.remove("is-opened");
    waxSeal?.setAttribute("aria-expanded", "false");
    invitationCard?.setAttribute("aria-hidden", "true");
  };

  const setNavigationState = (state) => {
    navigationState = state;
    backButton?.classList.toggle("is-visible", state > 0);
  };

  const scheduleSuccess = (callback, delay) => {
    const timer = window.setTimeout(callback, delay);
    successTimers.push(timer);
  };

  if (card) {
    const reset = () => {
      card.style.transform = "perspective(1400px) rotateX(0deg) rotateY(0deg)";
    };

    document.addEventListener("pointermove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      const rotateY = x * 6;
      const rotateX = -y * 6;
      card.style.transform = `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    document.addEventListener("pointerleave", reset);
    reset();
  }

  if (button) {
    button.addEventListener("click", () => {
      if (!card) return;

      card.classList.add("is-open");
      playSound("click");
      playSound("whoosh", 0.16);
      showMessageScreen(0);
      button.disabled = true;
    });
  }

  messageScreens.forEach((screen, index) => {
    const nextButton = screen.querySelector(".message-next");
    if (!nextButton) return;

    nextButton.addEventListener("click", () => {
      playSound("click");
      playSound("whoosh", 0.16);
      showMessageScreen(index + 1);
    });
  });

  waxSeal?.addEventListener("click", () => {
    if (finalStage?.classList.contains("is-opened")) return;
    finalStage?.classList.add("is-opened");
    setNavigationState(4);
    playSound("wax", 0.22);
    window.setTimeout(() => playSound("envelope", 0.2), 220);
    waxSeal.setAttribute("aria-expanded", "true");
    invitationCard?.setAttribute("aria-hidden", "false");
  });

  const moveMaybeButton = () => {
    if (!maybeButton || !invitationCard || !finalStage?.classList.contains("is-opened") || maybeCooldown) return;
    maybeCooldown = true;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) maybeButton.style.position = "absolute";
    const cardBounds = invitationCard.getBoundingClientRect();
    const buttonBounds = maybeButton.getBoundingClientRect();
    const yesBounds = yesButton?.getBoundingClientRect();
    const padding = isMobile ? 12 : 40;
    const maxX = Math.max(padding, cardBounds.width - buttonBounds.width - padding);
    const maxY = Math.max(padding, cardBounds.height - buttonBounds.height - padding);
    const messageBottom = maybeMessageSlot ? maybeMessageSlot.getBoundingClientRect().bottom - cardBounds.top + 16 : padding;
    const minY = isMobile ? Math.min(Math.max(padding, messageBottom), maxY) : padding;
    let x = 0;
    let y = 0;

    for (let attempt = 0; attempt < 40; attempt += 1) {
      x = padding + Math.random() * (maxX - padding);
      y = minY + Math.random() * (maxY - minY);
      const candidate = { left: cardBounds.left + x, right: cardBounds.left + x + buttonBounds.width, top: cardBounds.top + y, bottom: cardBounds.top + y + buttonBounds.height };
      const overlapsYes = yesBounds && candidate.left < yesBounds.right + 12 && candidate.right > yesBounds.left - 12 && candidate.top < yesBounds.bottom + 12 && candidate.bottom > yesBounds.top - 12;
      if (!overlapsYes) break;
    }

    const rotation = -6 + Math.random() * 12;
    maybeButton.style.left = `${x}px`;
    maybeButton.style.top = `${y}px`;
    maybeButton.style.bottom = "auto";
    maybeButton.style.setProperty("--maybe-rotation", `${rotation}deg`);
    maybeButton.style.transform = `rotate(${rotation}deg)`;
    maybeButton.classList.remove("is-bouncing");
    maybeButton.classList.add("is-moving");
    window.requestAnimationFrame(() => maybeButton.classList.add("is-bouncing"));
    maybeButton.addEventListener("animationend", () => {
      maybeButton.classList.remove("is-bouncing", "is-moving");
      maybeButton.style.setProperty("--maybe-rotation", "0deg");
      maybeButton.style.transform = "rotate(0deg)";
    }, { once: true });

    if (maybeMessage) {
      window.clearTimeout(maybeMessageTimer);
      maybeMessage.textContent = getNextEscapeMessage();
      maybeMessage.classList.remove("is-visible");
      void maybeMessage.offsetWidth;
      maybeMessage.classList.add("is-visible");
      maybeMessageTimer = window.setTimeout(() => maybeMessage.classList.remove("is-visible"), 1800);
    }

    const particleLayer = document.querySelector(".heart-particles");
    const stageBounds = finalStage.getBoundingClientRect();
    if (particleLayer) {
      for (let index = 0; index < 4; index += 1) {
        const sparkle = document.createElement("span");
        sparkle.className = "maybe-sparkle";
        sparkle.textContent = "✦";
        sparkle.style.left = `${buttonBounds.left - stageBounds.left + buttonBounds.width / 2}px`;
        sparkle.style.top = `${buttonBounds.top - stageBounds.top + buttonBounds.height / 2}px`;
        sparkle.style.setProperty("--sparkle-size", `${8 + Math.random() * 6}px`);
        sparkle.style.setProperty("--sparkle-x", `${-28 + Math.random() * 56}px`);
        sparkle.style.setProperty("--sparkle-y", `${-34 + Math.random() * 38}px`);
        particleLayer.appendChild(sparkle);
        sparkle.addEventListener("animationend", () => sparkle.remove(), { once: true });
      }
    }

    window.setTimeout(() => { maybeCooldown = false; }, 460);
  };

  const keepMaybeButtonInCard = () => {
    if (!maybeButton || !invitationCard || maybeButton.style.position !== "absolute") return;
    const cardBounds = invitationCard.getBoundingClientRect();
    const buttonBounds = maybeButton.getBoundingClientRect();
    const padding = window.matchMedia("(max-width: 767px)").matches ? 12 : 40;
    const maxX = Math.max(padding, cardBounds.width - buttonBounds.width - padding);
    const maxY = Math.max(padding, cardBounds.height - buttonBounds.height - padding);
    const messageBottom = maybeMessageSlot ? maybeMessageSlot.getBoundingClientRect().bottom - cardBounds.top + 16 : padding;
    const minY = window.matchMedia("(max-width: 767px)").matches ? Math.min(Math.max(padding, messageBottom), maxY) : padding;
    maybeButton.style.left = `${Math.min(Math.max(padding, Number.parseFloat(maybeButton.style.left) || padding), maxX)}px`;
    maybeButton.style.top = `${Math.min(Math.max(minY, Number.parseFloat(maybeButton.style.top) || minY), maxY)}px`;
  };

  window.addEventListener("resize", keepMaybeButtonInCard);

  invitationCard?.addEventListener("pointermove", (event) => {
    if (!maybeButton) return;
    const bounds = maybeButton.getBoundingClientRect();
    const distance = Math.hypot(event.clientX - (bounds.left + bounds.width / 2), event.clientY - (bounds.top + bounds.height / 2));
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && distance < 100) moveMaybeButton();
  });

  maybeButton?.addEventListener("pointerenter", () => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) moveMaybeButton();
  });

  maybeButton?.addEventListener("click", (event) => {
    event.preventDefault();
    playSound("click");
    moveMaybeButton();
  });

  backButton?.addEventListener("click", () => {
    playSound("click");

    if (navigationState === 5) {
      resetSuccessScreen();
      setNavigationState(4);
      return;
    }

    if (navigationState === 4) {
      finalStage?.classList.remove("is-opened");
      invitationCard?.setAttribute("aria-hidden", "true");
      waxSeal?.setAttribute("aria-expanded", "false");
      setNavigationState(3);
      return;
    }

    if (navigationState === 3) {
      resetFinalScreen();
      showMessageScreen(1);
      return;
    }

    if (navigationState === 2) {
      showMessageScreen(0);
      return;
    }

    if (navigationState === 1) {
      messageScreens.forEach((screen) => {
        screen.classList.remove("is-active");
        screen.setAttribute("aria-hidden", "true");
      });
      card?.classList.remove("is-open");
      button.disabled = false;
      scene?.classList.remove("envelope-mode");
      setNavigationState(0);
    }
  });

  yesButton?.addEventListener("click", () => {
    if (finalStage?.classList.contains("is-accepted")) return;
    playSound("click");
    finalStage?.classList.add("is-accepted");
    setNavigationState(5);
    scene?.classList.add("is-celebrating");
    thankYouTitle.textContent = "Thank you ❤️";
    thankYouText.textContent = "I'm really looking forward to seeing you.";
    thankYou?.setAttribute("aria-hidden", "false");
    window.dispatchEvent(new Event("invitation:celebrate"));
    thankYouTitle.innerHTML = "&#10084;&#65039; Yay!";
    thankYouText.innerHTML = "I had a feeling<br>you'd click &ldquo;Yes.&rdquo; &#128522;";
    scheduleSuccess(() => finalStage?.classList.add("is-success-faded"), 600);
    scheduleSuccess(() => thankYou?.classList.add("is-visible"), 600);
    scheduleSuccess(() => playSound("success", 0.24), 700);
    scheduleSuccess(() => thankYou?.classList.add("is-leaving"), 5100);
    scheduleSuccess(() => {
      thankYou?.classList.remove("is-visible");
      thankYou?.setAttribute("aria-hidden", "true");
      successFinal?.setAttribute("aria-hidden", "false");
      successFinal?.classList.add("is-revealing");
    }, 6900);
   scheduleSuccess(() => {
    successStatus?.setAttribute("aria-hidden", "false");
    successStatus?.classList.add("is-visible");

    sendTelegramNotification();

}, 11800)

    const particleLayer = document.querySelector(".heart-particles");
    if (!particleLayer) return;
    for (let index = 0; index < 46; index += 1) {
      const particle = document.createElement("span");
      particle.className = "celebration-particle";
      particle.textContent = index % 3 === 0 ? "✦" : "♥";
      particle.style.left = `${12 + Math.random() * 76}%`;
      particle.style.animationDelay = `${Math.random() * 0.7}s`;
      particle.style.setProperty("--particle-size", `${12 + Math.random() * 16}px`);
      particle.style.setProperty("--particle-drift", `${-70 + Math.random() * 140}px`);
      particleLayer.appendChild(particle);
      particle.addEventListener("animationend", () => particle.remove(), { once: true });
    }
  });
})();
async function sendTelegramNotification() {

    try {

        await fetch('/api/sendTelegram', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                time: new Date().toLocaleString('en-IN', {

                    dateStyle: 'full',
                    timeStyle: 'medium'

                })

            })

        });

        console.log("Telegram notification sent ❤️");

    } catch (err) {

        console.error(err);

    }

}
