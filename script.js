function createStars() {
  const container = document.querySelector("body");
  for (let i = 0; i < 1000; i++) { // Generate 1000 stars
      const star = document.createElement("div");
      star.className = "star";
      star.style.width = ".1px";
      star.style.height = ".1px";
      star.style.top = Math.random() * 100 + "%";
      star.style.left = Math.random() * 100 + "%";
      container.appendChild(star);
  }
}
createStars();

document.addEventListener("DOMContentLoaded", function () {


  // 🚀 Modal Pop-up Logic
  const modal = document.getElementById("intro-modal");
  const startBtn = document.getElementById("start-btn");

  startBtn.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default anchor behavior
      modal.style.display = "none"; // Hide the modal
      document.body.style.overflow = "auto"; // Enable scrolling after closing
  });

  // Select elements
  const planets = document.querySelectorAll(".planet");
  const backgroundVideo = document.getElementById("background-video");
  const soundEffect = document.getElementById("sound-effect");
  const darkOverlay = document.getElementById("dark-overlay");

  // Background music elements
  const bgMusic = document.getElementById("background-music");
  const muteBtn = document.getElementById("mute-btn");
  const volumeSlider = document.getElementById("volume-slider");

  let tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  document.body.appendChild(tooltip);

  planets.forEach(planet => {
      planet.addEventListener("mouseenter", function (event) {
          const planetName = this.getAttribute("data-name");
          if (planetName) {
              tooltip.textContent = planetName;
              tooltip.style.opacity = "1";
          }
      });

      planet.addEventListener("mousemove", function (event) {
          tooltip.style.top = `${event.pageY + 10}px`;
          tooltip.style.left = `${event.pageX + 10}px`;
      });

      planet.addEventListener("mouseleave", function () {
          tooltip.style.opacity = "0";
          tooltip.textContent = "";
      });

      planet.addEventListener("click", function (event) {
          event.stopPropagation();
          event.preventDefault();

          if (!event.target.classList.contains("planet")) return;

          let videoSrc = this.getAttribute("data-video");
          let soundSrc = this.getAttribute("data-sound");
          let planetName = this.getAttribute("data-name");
          let nextPage = planetName.toLowerCase() + ".html"; // Redirect to planet-specific page

          // Check if it's the "Objective" (Moon)
          if (planetName === "Objective") {
              let randomVideos = ["videos/victory1.mp4", "videos/victory2.mp4", "videos/defeat1.mp4", "videos/defeat2.mp4"];
              let randomSounds = ["sounds/victory1.mp3", "sounds/victory2.mp3", "sounds/defeat1.mp3", "sounds/defeat2.mp3"];

              // Select a random video and sound
              videoSrc = randomVideos[Math.floor(Math.random() * randomVideos.length)];
              soundSrc = randomSounds[Math.floor(Math.random() * randomSounds.length)];

              nextPage = "index.html"; // Redirect back to index.html after video
          }

          if (videoSrc && soundSrc) {
              backgroundVideo.src = videoSrc;
              backgroundVideo.classList.add("visible");
              backgroundVideo.play().catch(error => console.log("Video error:", error));

              soundEffect.src = soundSrc;
              soundEffect.load(); // Ensure sound is properly loaded
              soundEffect.play().catch(error => console.log("Sound error:", error));

              darkOverlay.classList.add("visible");

              backgroundVideo.onloadedmetadata = () => {
                  let videoDuration = Math.min(backgroundVideo.duration * 1000, 12000) || 12000;
                  setTimeout(() => {
                      backgroundVideo.classList.remove("visible");
                      backgroundVideo.pause();
                      backgroundVideo.src = "";
                      darkOverlay.classList.remove("visible");
                      window.location.href = nextPage; // Redirect after video ends
                  }, videoDuration);
              };
          }
      });
  });

  // 🎵 Background Music Logic (Persistent Across Pages) 🎵
  // Load previous settings
  const savedTime = localStorage.getItem("bgMusicTime");
  const savedMuted = localStorage.getItem("bgMusicMuted");
  const savedVolume = localStorage.getItem("bgMusicVolume");

  if (savedTime) bgMusic.currentTime = parseFloat(savedTime);
  if (savedMuted === "true") {
      bgMusic.muted = true;
      muteBtn.textContent = "🔇";
  }
  if (savedVolume) {
      bgMusic.volume = parseFloat(savedVolume);
      volumeSlider.value = savedVolume;
  }

  bgMusic.play().catch(error => console.log("Autoplay blocked, user must interact first."));

  // Save settings before page change
  window.addEventListener("beforeunload", function () {
      localStorage.setItem("bgMusicTime", bgMusic.currentTime);
      localStorage.setItem("bgMusicMuted", bgMusic.muted);
      localStorage.setItem("bgMusicVolume", bgMusic.volume);
  });

  // Mute button
  muteBtn.addEventListener("click", function () {
      bgMusic.muted = !bgMusic.muted;
      muteBtn.textContent = bgMusic.muted ? "🔇" : "🔊";
      localStorage.setItem("bgMusicMuted", bgMusic.muted);
  });

  // Volume control
  volumeSlider.addEventListener("input", function () {
      bgMusic.volume = this.value;
      localStorage.setItem("bgMusicVolume", this.value);
  });
});
