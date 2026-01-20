<script>
document.addEventListener("DOMContentLoaded", () => {
  const bannerVideo = document.querySelector('video[src*="1462022977347391569/020617_2.mp4"]');

  if (!bannerVideo) return;

  // Ensure required attributes
  bannerVideo.muted = true;
  bannerVideo.autoplay = true;
  bannerVideo.loop = true;
  bannerVideo.playsInline = true;

  // Attempt to play immediately
  bannerVideo.play().catch(() => {
    // If blocked, wait for user interaction
    const tryPlayOnInteract = () => {
      
      bannerVideo.play().catch(() => {
        console.warn("Autoplay blocked until user interacts:", bannerVideo.src);
      });
      window.removeEventListener("click", tryPlayOnInteract);
      window.removeEventListener("touchstart", tryPlayOnInteract);
    };

    window.addEventListener("click", tryPlayOnInteract);
    window.addEventListener("touchstart", tryPlayOnInteract);
  });
});
</script>


<script>
document.addEventListener("DOMContentLoaded", function() {
    // Select the admin edit button
    const button = document.querySelector('a[href*="/admin/products/"][href$="/edit"]');

    if (button) {
        // Replace text with cog emoji
        button.textContent = "⚙️ Manage Competition";

        // Style button for site theme + importance
        button.style.display = "inline-flex";
        button.style.alignItems = "center";
        button.style.gap = "0.5rem";
        button.style.fontWeight = "700";
        button.style.background = "linear-gradient(90deg, #8181ec, #4f3ff7)"; // blue → purple
        button.style.color = "#ffffff";
        button.style.boxShadow = "0 4px 12px rgba(129, 129, 236, 0.5)";
        button.style.transition = "all 0.3s ease";
        button.style.borderRadius = "0.75rem";
        button.style.padding = "0.5rem 1rem";
        button.style.border = "2px solid #8181ec";

        // Hover effect: glow + scale
        button.addEventListener("mouseover", () => {
            button.style.transform = "scale(1.05)";
            button.style.boxShadow = "0 6px 20px rgba(129, 129, 236, 0.8)";
        });
        button.addEventListener("mouseout", () => {
            button.style.transform = "scale(1)";
            button.style.boxShadow = "0 4px 12px rgba(129, 129, 236, 0.5)";
        });
    }
});
</script>

  <script>
document.addEventListener("DOMContentLoaded", function () {
  // Find the logo image
  const logo = document.querySelector('img[src="https://static.rafflex.io/test.rafflex.uk/images/01KF6ZCB1YHC6VRNBT6T4QCVG4.png"]');

  if (logo) {
    // Create a new video element
    const video = document.createElement("video");
    video.src = "https://cdn.discordapp.com/attachments/1462022924708876321/1462204783762079858/SWIFT_920_x_240_px_2.mp4?ex=696d57d2&is=696c0652&hm=2d98aa13d64ac55966419b4d7b324c7910bada7baa6cd41af1b591089ad06920&";
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.style.maxHeight = "5rem"; // match original image height
    video.style.width = "auto";     // maintain aspect ratio
    video.style.display = "block";

    // Replace the image with the video
    logo.parentNode.replaceChild(video, logo);
  }
});



<script>
document.addEventListener("DOMContentLoaded", function() {
  // Select the video inside your link
  const video = document.querySelector('a[href="https://test.rafflex.uk/competition/penny-pops"] video');

  if (!video) return;

  // Ensure it's muted and plays inline
  video.muted = true;
  video.playsInline = true;

  // Attempt autoplay
  const playPromise = video.play();
  
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.log("Video autoplay started on mobile/desktop");
      })
      .catch(() => {
        // fallback: wait for first touch to start video
        const resumeAutoplay = () => {
          video.play();
          document.removeEventListener("touchstart", resumeAutoplay);
        };
        document.addEventListener("touchstart", resumeAutoplay, { once: true });
      });
  }
});
</script>