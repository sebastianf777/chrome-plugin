// Content script to clean local storage and reload the page
console.log("Content script started. Checking if cleaning has been performed...");

// Use sessionStorage instead of localStorage to manage the flag for the current session
if (!sessionStorage.getItem("cleaningPerformed")) {
    console.log("Cleaning local storage for the first time in this session...");
    
    const videoQuality = localStorage.getItem("video-quality");
    localStorage.clear();

    // Preserve the `video-quality` value if it exists
    if (videoQuality) {
        localStorage.setItem("video-quality", videoQuality);
    }

    // Set a flag to indicate that the cleaning has been done for the current session
    sessionStorage.setItem("cleaningPerformed", "true");
    console.log("Local storage cleaned and flag set. Reloading the page...");
    
    // Reload the page after cleaning
    window.location.reload();
} else {
    console.log("Cleaning already performed for this session. No further action needed.");
}
