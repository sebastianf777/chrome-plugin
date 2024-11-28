document.addEventListener("DOMContentLoaded", () => {
    const setIntervalButton = document.getElementById("setInterval");
    const intervalOptions = document.getElementById("intervalOptions");
    const cleanNowButton = document.getElementById('cleanNow');
    const closePopupButton = document.getElementById('closePopup');


    // Add event listener for "Set Interval" button
    setIntervalButton.addEventListener("click", () => {
        const intervalMinutes = parseInt(intervalOptions.value, 10);

        chrome.runtime.sendMessage(
            { action: "setAlarm", minutes: intervalMinutes },
            (response) => {
                if (response?.success) {
                    // alert("Interval set successfully!");
                    showCountdownAndClose('Interval confirmed! Closing in', 5);

                } else {
                    alert(`Failed to set interval: ${response?.error || "Unknown error"}`);
                }
            }
        );

        // Close the popup after the interval is set
        setTimeout(() => {
            window.close();
        }, 7000); // Allow time for interactions before closing
    });

    // Add event listener for "Clean Now" button
    cleanNowButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: "cleanNow" }, (response) => {
            if (response?.success) {
                // showCountdownAndClose('Local Storage Cleanaed! Closing in', 5);
                window.close();

            } else {
                alert(`Failed to clean now: ${response?.error || 'Unknown error'}`);
            }
        });
    });
    // Add event listener for "OK" button
    closePopupButton.addEventListener('click', () => {
        window.close();
    });
    // Function to show a countdown and close the popup
    function showCountdownAndClose(message, seconds) {
        const countdownMessage = document.getElementById('countdownMessage');
        let remainingTime = seconds;

        countdownMessage.textContent = `${message} ${remainingTime}s`;

        const interval = setInterval(() => {
            remainingTime--;
            countdownMessage.textContent = `${message} ${remainingTime}s`;

            if (remainingTime <= 0) {
                clearInterval(interval);
                window.close();
            }
        }, 1000);
    }
    okButton.addEventListener("click", () => {
        okButton.style.display = "none";
    });

});
