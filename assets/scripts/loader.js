window.onload = function () {
    // Your code here
    setTimeout(function () {
      var loadingScreen = document.getElementById("loading-screen");
      var consoleDiv = document.getElementById("console");
      var progressBarFill = document.getElementById("progress-bar-fill");
      var progressText = document.getElementById("progress-text");
      var bootingText = document.getElementById("booting-text");

      var bootingDialog = [
        "Booting up... <span class='blinking-cursor'>&#9608;</span>",
        "Loading modules... <span class='blinking-cursor'>&#9608;</span>",
        "Establishing connection...<span class='blinking-cursor'>&#9608;</span> ",
        "Initializing system...<span class='blinking-cursor'>&#9608;</span>",
        "Preparing display...<span class='blinking-cursor'>&#9608;</span>",
        "System ready!",
      ];

      var progress = 0;
      var dialogIndex = 0; // Initialize dialog index
      var progressInterval = setInterval(function () {
        progress += 20; // Increment progress by 20% (adjust as needed)
        progressBarFill.style.width = progress + "%"; // Update the progress bar fill width
        progressText.innerHTML = "Progress: " + progress + "%"; // Update the progress text
        bootingText.innerHTML = bootingDialog[dialogIndex]; // Update the booting text with the current dialog
        dialogIndex = (dialogIndex + 1) % bootingDialog.length; // Move to the next dialog index

        if (progress >= 120) {
          clearInterval(progressInterval); // Stop the progress interval

          // Fade out loading screen and fade in console content
          loadingScreen.style.opacity = 0;
          setTimeout(function () {
            loadingScreen.style.display = "none";
            consoleDiv.style.opacity = 1;
          }, 2000);
        }
      }, 750); // Update the progress and booting dialog every 0.75 seconds (adjust as needed)
    }, 2000); // Simulate a 2-second loading delay
  };