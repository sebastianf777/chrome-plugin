// List of User-Agent strings
const userAgents = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/537.36",
    "Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/537.36"
];

// Function to select a random User-Agent
function getRandomUserAgent() {
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Set random User-Agent on startup
chrome.runtime.onStartup.addListener(() => {
    console.log("Chrome startup detected. Setting random User-Agent...");
    chrome.storage.local.get("randomUserAgent", (data) => {
        if (!data.randomUserAgent) {
            const randomUserAgent = getRandomUserAgent();
            chrome.storage.local.set({ randomUserAgent });
            console.log("Random User-Agent set:", randomUserAgent);
        }
    });
});

// Add DeclarativeNetRequest rules on installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get("randomUserAgent", (data) => {
        const randomUserAgent = data.randomUserAgent || getRandomUserAgent();
        const rule = {
            id: 1,
            priority: 1,
            action: {
                type: "modifyHeaders",
                requestHeaders: [
                    {
                        header: "User-Agent",
                        operation: "set",
                        value: randomUserAgent
                    }
                ]
            },
            condition: {
                urlFilter: "*", // Specific site to test
                resourceTypes: [
                    "main_frame", 
                    "sub_frame", 
                    "xmlhttprequest", 
                    "script", 
                    "image", 
                    "stylesheet", 
                    "font", 
                    "media", 
                    "object", 
                    "ping", 
                    "csp_report", 
                    "websocket", 
                    "other"
                ]
            }
        };

        // Update the rules
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [1],
            addRules: [rule]
        }, () => {
            console.log("Dynamic rule added for User-Agent modification.");
            // Check active rules
            chrome.declarativeNetRequest.getDynamicRules((rules) => {
                console.log("Current Rules:", rules);
            });
        });
    });
});

// Clear local storage and reload active tab
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
                    window.location.reload();
                },
            });
        }
    });
}

// Add click listener for extension icon
chrome.action.onClicked.addListener(() => {
    cleanLocalStorageAndReloadTab();
});
