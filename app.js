const INITIAL_EVENTS = [
  {
    id: 1,
    title: "Sunday Divine Liturgy",
    time: "Sunday at 09:30 AM",
    location: "Main Sanctuary",
    desc: "A congregational experience with full choir ministry, worship, and biblical teaching."
  },
  {
    id: 2,
    title: "Midweek Bible Study",
    time: "Wednesday at 07:00 PM",
    location: "Auditorium B",
    desc: "Systematic scripture reading and interactive discussions for small groups."
  },
  {
    id: 3,
    title: "Youth Impact & Worship",
    time: "Saturday at 06:00 PM",
    location: "Community Center",
    desc: "Vibrant fellowship, contemporary worship, and dedicated youth mentorship sessions."
  }
];

const INITIAL_PRAYERS = [
  {
    id: 1710001,
    date: "2026-10-18",
    name: "Samuel Vance",
    contact: "samuel.vance@example.com",
    category: "Healing",
    message: "Seeking complete healing and recovery following open orthopedic surgery.",
    status: "Approved"
  },
  {
    id: 1710002,
    date: "2026-10-19",
    name: "Rebecca Henderson",
    contact: "+1 555-0192",
    category: "Family",
    message: "Prayers for peace, resolution, and spiritual clarity during family relocation.",
    status: "Pending"
  }
];

function getStoredData(key, fallback) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
}

function setStoredData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

let events = getStoredData("chms_events", INITIAL_EVENTS);
let prayers = getStoredData("chms_prayers", INITIAL_PRAYERS);

function triggerToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

document.addEventListener("click", (e) => {
  const triggerBtn = e.target.closest("[data-modal]");
  if (triggerBtn) {
    const modalId = triggerBtn.getAttribute("data-modal");
    openModal(modalId);
    return;
  }

  const closeBtn = e.target.closest("[data-close]");
  if (closeBtn) {
    const modalId = closeBtn.getAttribute("data-close");
    closeModal(modalId);
    return;
  }

  if (e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-overlay").forEach((m) => {
      m.classList.remove("active");
    });
    document.body.style.overflow = "auto";
  }
});

function renderPublicEvents() {
  const container = document.getElementById("eventsContainer");
  if (!container) return;

  container.innerHTML = "";
  events.forEach((ev) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-primary); margin-bottom: 8px;">
        ${ev.time}
      </div>
      <h3>${ev.title}</h3>
      <p>${ev.desc}</p>
      <div style="font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
        ${ev.location}
      </div>
    `;
    container.appendChild(card);
  });

  const counter = document.getElementById("statEventsCount");
  if (counter) counter.innerText = events.length;

  const answeredCounter = document.getElementById("statPrayersAnswered");
  if (answeredCounter) {
    const approved = prayers.filter((p) => p.status === "Approved").length;
    answeredCounter.innerText = approved;
  }
}

const publicPrayerForm = document.getElementById("publicPrayerForm");
if (publicPrayerForm) {
  publicPrayerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newReq = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      name: document.getElementById("reqName").value.trim(),
      contact: document.getElementById("reqContact").value.trim(),
      category: document.getElementById("reqCategory").value,
      message: document.getElementById("reqMessage").value.trim(),
      status: "Pending"
    };

    prayers.unshift(newReq);
    setStoredData("chms_prayers", prayers);

    publicPrayerForm.reset();
    closeModal("prayerModal");
    triggerToast("Your request was logged successfully.");
    renderPublicEvents();
  });
}

function renderAdminTable(dataToRender = prayers) {
  const tableBody = document.getElementById("adminPrayerTable");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (dataToRender.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">No records matched your criteria.</td></tr>`;
    return;
  }

  dataToRender.forEach((req) => {
    const tr = document.createElement("tr");
    const isApproved = req.status === "Approved";

    tr.innerHTML = `
      <td style="color: var(--text-muted); font-size: 0.85rem;">${req.date}</td>
      <td style="font-weight: 600;">
        ${req.name}<br>
        <span style="font-size: 0.78rem; font-weight: normal; color: var(--text-muted);">${req.contact}</span>
      </td>
      <td><span style="background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">${req.category}</span></td>
      <td style="max-width: 320px; font-size: 0.9rem;">${req.message}</td>
      <td>
        <span class="status ${isApproved ? "status-approved" : "status-pending"}">
          ${req.status}
        </span>
      </td>
      <td>
        ${!isApproved ? `<button type="button" class="btn-action approve" onclick="approveRequest(${req.id})">Approve</button>` : ""}
        <button type="button" class="btn-action delete" onclick="deleteRequest(${req.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  updateAdminMetrics();
}

function updateAdminMetrics() {
  const pendingEl = document.getElementById("adminPendingCount");
  const approvedEl = document.getElementById("adminApprovedCount");
  const eventsEl = document.getElementById("adminEventsCount");

  if (pendingEl) pendingEl.innerText = prayers.filter((p) => p.status === "Pending").length;
  if (approvedEl) approvedEl.innerText = prayers.filter((p) => p.status === "Approved").length;
  if (eventsEl) eventsEl.innerText = events.length;
}

function approveRequest(id) {
  prayers = prayers.map((p) => (p.id === id ? { ...p, status: "Approved" } : p));
  setStoredData("chms_prayers", prayers);
  renderAdminTable();
  triggerToast("Record marked as approved.");
}

function deleteRequest(id) {
  if (confirm("Are you sure you want to delete this record?")) {
    prayers = prayers.filter((p) => p.id !== id);
    setStoredData("chms_prayers", prayers);
    renderAdminTable();
    triggerToast("Record removed from database.");
  }
}

const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();
    const filtered = prayers.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.message.toLowerCase().includes(query)
    );
    renderAdminTable(filtered);
  });
}

const createEventForm = document.getElementById("createEventForm");
if (createEventForm) {
  createEventForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newEvent = {
      id: Date.now(),
      title: document.getElementById("eventTitle").value.trim(),
      time: document.getElementById("eventTime").value.trim(),
      location: document.getElementById("eventLocation").value.trim(),
      desc: document.getElementById("eventDesc").value.trim()
    };

    events.unshift(newEvent);
    setStoredData("chms_events", events);

    createEventForm.reset();
    closeModal("eventModal");
    triggerToast("Event published successfully.");
    updateAdminMetrics();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderPublicEvents();
  renderAdminTable();
});