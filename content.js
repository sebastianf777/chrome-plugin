// Check for the 'cleanAlert' flag
if (localStorage.getItem('cleanAlert') === 'true') {
    // Show the alert
    // alert('Local storage cleaned!');

    // Remove the flag
    localStorage.removeItem('cleanAlert');
}
