// Initial visitor count in church
let visitorCount = 12;

// Initial total donation revenue
let totalRevenue = 5000;

// Active user name
let activeUser = "Guest";

// Editable sample events using arrays
let eventNames = [
    "Sunday Choir Gathering",
    "Youth Prayer Meeting",
    "Community Charity Drive"
];

let eventDates = [
    "29 November 2026",
    "02 December 2026",
    "06 December 2026"
];

let eventTimings = [
    "11:15 AM - 12:15 PM",
    "05:00 PM - 06:30 PM",
    "10:00 AM - 01:00 PM"
];

// Initial prayer requests using arrays
let prayerNames = [
    "Mary D'Souza",
    "John Abraham"
];

let prayerTexts = [
    "Please pray for my mother's health and recovery.",
    "Praying for peace and guidance for our church family."
];

// Church photos from photos/ folder
let photoPaths = [
    "photos/photo1.jpg",
    "photos/photo2.jpg",
    "photos/photo3.jpg"
];

let photoTitles = [
    "Grace Church Main Hall",
    "Sunday Prayer Service",
    "Community Fellowship"
];

// Switch active tab
function openTab(tabId) {
    let sections = document.getElementsByClassName("tab-section");

    for (let i = 0; i < sections.length; i++) {
        sections[i].classList.add("hidden-tab");
    }

    document.getElementById(tabId).classList.remove("hidden-tab");
}

// Show active username instead of Guest
function updateAuthUI() {
    document.getElementById("userBadge").innerText = "User: " + activeUser;
    document.getElementById("authMessage").innerText = "Current User: " + activeUser;
}

// Set username on register
function registerUser(event) {
    event.preventDefault();
    let nameVal = document.getElementById("regName").value.trim();

    if (nameVal !== "") {
        activeUser = nameVal;
        updateAuthUI();
        document.getElementById("registerForm").reset();
    }
}

// Set username on login
function loginUser(event) {
    event.preventDefault();
    let nameVal = document.getElementById("loginName").value.trim();

    if (nameVal !== "") {
        activeUser = nameVal;
        updateAuthUI();
        document.getElementById("loginForm").reset();
    }
}

// Reset back to Guest
function logoutUser() {
    activeUser = "Guest";
    updateAuthUI();
}

// Increase visitor count on Home tab
function increaseVisitor() {
    visitorCount = visitorCount + 1;
    document.getElementById("visitorCount").innerText = visitorCount;
    document.getElementById("visitorMessage").innerText = "Visitor count updated.";
}

// Display events with search filter
function displayEvents() {
    let tbody = document.getElementById("eventsTableBody");
    let searchText = document.getElementById("eventSearch").value.toLowerCase();
    let html = "";

    for (let i = 0; i < eventNames.length; i++) {
        let matchesSearch = eventNames[i].toLowerCase().indexOf(searchText) !== -1;

        if (matchesSearch) {
            html = html + "<tr>";
            html = html + "<td>" + eventNames[i] + "</td>";
            html = html + "<td>" + eventDates[i] + "</td>";
            html = html + "<td>" + eventTimings[i] + "</td>";
            html = html + "</tr>";
        }
    }

    tbody.innerHTML = html;
}

// Display submitted prayer requests
function displayPrayerRequests() {
    let listBox = document.getElementById("requestsList");
    let html = "";

    for (let i = 0; i < prayerNames.length; i++) {
        html = html + "<div class='request-item'>";
        html = html + "<strong>" + prayerNames[i] + "</strong>";
        html = html + "<p>" + prayerTexts[i] + "</p>";
        html = html + "</div>";
    }

    listBox.innerHTML = html;
}

// Submit new prayer request
function submitPrayerRequest(event) {
    event.preventDefault();

    let nameVal = document.getElementById("userName").value.trim();
    let textVal = document.getElementById("prayerText").value.trim();

    if (nameVal !== "" && textVal !== "") {
        prayerNames.push(nameVal);
        prayerTexts.push(textVal);
        displayPrayerRequests();
        document.getElementById("prayerForm").reset();
    }
}

// Allow only numeric keys in donation input
function allowOnlyNumbers(event) {
    let allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"];
    let isNumber = event.key >= "0" && event.key <= "9";
    let isAllowed = allowedKeys.indexOf(event.key) !== -1;

    if (!isNumber && !isAllowed) {
        event.preventDefault();
    }
}

// Add donation and update Total Revenue only
function addDonation(event) {
    event.preventDefault();

    let rawValue = document.getElementById("donationAmount").value.trim();
    let amount = Number(rawValue);

    if (rawValue !== "" && !isNaN(amount) && amount > 0) {
        totalRevenue = totalRevenue + amount;
        document.getElementById("totalRevenue").innerText = totalRevenue;
        document.getElementById("donationForm").reset();
    }
}

// Display photos from photos/ folder
function displayPhotos() {
    let gallery = document.getElementById("photoGallery");
    let html = "";

    for (let i = 0; i < photoPaths.length; i++) {
        html = html + "<div class='photo-card'>";
        html = html + "<img src='" + photoPaths[i] + "' alt='" + photoTitles[i] + "'>";
        html = html + "<p>" + photoTitles[i] + "</p>";
        html = html + "</div>";
    }

    gallery.innerHTML = html;
}

// Load initial sections
updateAuthUI();
displayEvents();
displayPrayerRequests();
displayPhotos();