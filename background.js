// Run automatically every time the browser starts
chrome.runtime.onStartup.addListener(() => {
    console.log("Browser session started. Running automatic cleaning task by injecting content script...");

    // Query the active tab to perform the cleaning task
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            console.log("Found active tab. Injecting cleaning script...");
            const activeTab = tabs[0];

            // Inject the content script into the active tab
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                files: ["content.js"]
            }, () => {
                if (chrome.runtime.lastError) {
                    console.error("Error injecting script:", chrome.runtime.lastError.message);
                } else {
                    console.log("Cleaning script injected successfully.");
                }
            });
        } else {
            console.error("No active tab found for cleaning task.");
        }
    });
});


// Setting the Chrome Cleaning Alarm

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setAlarm") {
        chrome.alarms.clearAll(() => {
            chrome.alarms.create("clearLocalStorage", {
                delayInMinutes: request.minutes,
                periodInMinutes: request.minutes,
            });
            sendResponse({ success: true });
        });
        return true;
    } else if (request.action === "cleanNow") {
        cleanLocalStorageAndReloadTab();
        sendResponse({ success: true });
    }
});

// Listen for the Chrome Alarm to trigger
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "clearLocalStorage") {
        cleanLocalStorageAndReloadTab();
    }
});

// Add click listener for extension icon
chrome.action.onClicked.addListener((tab) => {
    cleanLocalStorageAndReloadTab(); // Trigger "clean now" when the icon is clicked
});

// Function to clear local storage and reload the active tab
function cleanLocalStorageAndReloadTab() {
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () => {
                    const videoQuality = localStorage.getItem("video-quality");
                    localStorage.clear();
                    if (videoQuality) {
                        localStorage.setItem("video-quality", videoQuality);
                    }
                    // alert("Local storage cleaned!");
                    
                    window.location.reload();
                },
                
            });
        }
    });
}

