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
