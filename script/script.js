// Get DOM elements
const addAssBtn = document.getElementById("addBtn");
const assignmentsList = document.getElementById("assignments-list");
const assTitle = document.getElementById("titleInput");
const assCourse = document.getElementById("courseInput");
const assDueDate = document.getElementById("dueDateInput");
const reminderFreq = document.getElementById("reminderFreqInput");

// Initialize assignments from localStorage or fallback to empty array
let assignments = JSON.parse(localStorage.getItem("assignments")) || [];
let storedUserName = localStorage.getItem("userName") || "";

// Run this when page is loaded
window.onload = pageReady;

function pageReady() {
  // Prompt for username if not stored already
  if (!storedUserName) {
    storedUserName = prompt(
      "Welcome to Homework Hero! What's your name?",
      "Student"
    ).trim();
    localStorage.setItem("userName", storedUserName);
  }

  // Set personalized greeting
  document.getElementById(
    "userGreeting"
  ).innerHTML = `Hello ${storedUserName}, Never miss another assignment deadline!`;

  // Display existing assignments if any
  if (assignments.length >= 1) {
    displayAssignments();
  }

  // Check reminders immediately and then every minute
  checkReminders();

  // Event listener for adding a new assignment
  addAssBtn.addEventListener("click", addAssignment);

  // Periodically refresh reminders and list
  setInterval(checkReminders, 60000); // every 60 seconds
  setInterval(displayAssignments, 60000); // update countdowns live
}

function addAssignment(event) {
  event.preventDefault();

  const currentDate = new Date();
  const dueDate = new Date(assDueDate.value);
  let timeDifference = dueDate.getTime() - currentDate.getTime();
  let daysRemaining = Math.floor(timeDifference / 86400000); // Convert ms to days

  // Input validation with user feedback
  if (assTitle.value === "") {
    assTitle.focus();
    document.getElementById("reqTitle").innerHTML = "*Required";
    document.getElementById("reqTitle").style.color = "red";
    return false;
  } else if (assCourse.value === "") {
    assCourse.focus();
    document.getElementById("reqCourse").innerHTML = "*Required";
    document.getElementById("reqCourse").style.color = "red";
    return false;
  } else if (assDueDate.value === "") {
    assDueDate.focus();
    document.getElementById("reqDate").innerHTML = "*Required";
    document.getElementById("reqDate").style.color = "red";
    return false;
  } else if (reminderFreq.value === "") {
    reminderFreq.focus();
    document.getElementById("reqRem").innerHTML = "*Required";
    document.getElementById("reqRem").style.color = "red";
    return false;
  } else if (dueDate < currentDate) {
    assDueDate.focus();
    document.getElementById("reqDate").innerHTML =
      "*Due date cannot be in the past";
    document.getElementById("reqDate").style.color = "red";
    return false;
  } else {
    // Create new assignment object
    const newAssignment = {
      title: assTitle.value,
      course: assCourse.value,
      dueDate: assDueDate.value,
      reminder: reminderFreq.value,
      completed: false,
      daysRemaining: daysRemaining,
      createdAt: new Date(),
      lastReminded: null,
    };

    // Save and display
    assignments.push(newAssignment);
    saveAssignments();
    displayAssignments();

    // Reset form
    assTitle.value = "";
    assCourse.value = "";
    assDueDate.value = "";

    // Clear error messages
    document.getElementById("reqCourse").innerHTML = "";
    document.getElementById("reqTitle").innerHTML = "";
    document.getElementById("reqDate").innerHTML = "";
    document.getElementById("reqRem").innerHTML = "";
    return true;
  }
}

// Display all assignments in the DOM
function displayAssignments() {
  assignmentsList.innerHTML = "";

  if (assignments.length === 0) {
    assignmentsList.innerHTML =
      "<p>No assignments yet. Add your first assignment above!</p>";
    return;
  }

  assignments.forEach((assignment, index) => {
    // Format due date for display
    const displayDueDate = new Date(assignment.dueDate).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );

    // Calculate remaining time
    const msRemaining = new Date(assignment.dueDate).getTime() - Date.now();
    const totalMinutes = Math.floor(msRemaining / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const currentDate = new Date();
    const dueDate = new Date(assignment.dueDate);
    let timeDifference = dueDate.getTime() - currentDate.getTime();
    let daysRemaining = Math.floor(timeDifference / 86400000);

    // Set how remaining time should be displayed
    let daysRemCont;
    if (msRemaining <= 0) {
      daysRemCont = "Past Due!!!";
    } else if (daysRemaining === 0) {
      daysRemCont = `${hours}h ${minutes}m left`;
    } else if (daysRemaining === 1) {
      if (hours % 24 === 0 && minutes === 0) {
        daysRemCont = `1 day left`;
      } else {
        daysRemCont = `1 day ${hours % 24}h ${minutes}m left`;
      }
    } else {
      daysRemCont = `${daysRemaining} days`;
    }

    // Render assignment block
    const assignmentItem = document.createElement("div");
    assignmentItem.innerHTML = `<div id="assList${index}">
            <p><strong>Course Code:</strong> ${assignment.course}</p>
            <p><strong>Title:</strong> ${assignment.title}</p>
            <p><strong>Due Date:</strong> ${displayDueDate}</p>
            <p><strong>Reminder:</strong> ${getReminderText(
              assignment.reminder
            )}</p>
            <p style="color: red;"><strong>Due: </strong> ${daysRemCont}</p>

            <button class="compBtn" data-index="${index}">Completed</button>
            <button class="deleteBtn" data-index="${index}" style="background-color: red">Delete</button>
        </div>`;

    // Style if assignment is completed
    if (assignment.completed) {
      assignmentItem.style.textDecoration = "line-through";
      assignmentItem.style.opacity = "0.6";
    }

    assignmentsList.appendChild(assignmentItem);
  });

  // Hook up Complete buttons
  document.querySelectorAll(".compBtn").forEach((button) => {
    button.addEventListener("click", (ind) => {
      const index = ind.target.getAttribute("data-index");
      assignments[index].completed = !assignments[index].completed;
      saveAssignments();
      displayAssignments();
    });
  });

  // Hook up Delete buttons
  document.querySelectorAll(".deleteBtn").forEach((button) => {
    button.addEventListener("click", (ind) => {
      const index = ind.target.getAttribute("data-index");
      assignments.splice(index, 1);
      saveAssignments();
      displayAssignments();
    });
  });
}

// Persist to localStorage
function saveAssignments() {
  localStorage.setItem("assignments", JSON.stringify(assignments));
}

// Reminder engine — runs every 60 seconds
function checkReminders() {
  const now = new Date();

  assignments.forEach((assignment) => {
    if (assignment.completed) return;

    const dueDate = new Date(assignment.dueDate);
    const createdAt = new Date(assignment.createdAt);
    const reminderType = assignment.reminder;
    const lastReminded = assignment.lastReminded
      ? new Date(assignment.lastReminded)
      : null;
    const minutesSinceLast = lastReminded
      ? (now - lastReminded) / (1000 * 60)
      : Infinity;

    const remindUser = (message) => {
      alert(message);
      assignment.lastReminded = new Date();
      saveAssignments();
    };

    // Daily reminder: once every 24 hours before due date
    if (reminderType === "daily") {
      const baseTime = lastReminded || createdAt;
      const msSinceBase = now - baseTime;
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (now < dueDate && msSinceBase >= twentyFourHours) {
        remindUser(
          `${storedUserName}, your ${assignment.title.toUpperCase()} assignment is due on ${dueDate.toLocaleString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }
          )}`
        );
      }
    }
    // Weekly reminder: once every 7 days
    else if (reminderType === "weekly") {
      const baseTime = lastReminded || createdAt;
      const msSinceBase = now - baseTime;
      const sevenDays = 7 * 24 * 60 * 60 * 1000;

      if (now < dueDate && msSinceBase >= sevenDays) {
        remindUser(
          `${storedUserName}, your weekly reminder for ${assignment.title.toUpperCase()} is here. Due: ${dueDate.toLocaleString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }
          )}`
        );
      }
    }
    // Urgent reminder: less than 2 hours left and hasn't reminded in the last hour
    else if (reminderType === "urgent") {
      const msBeforeDue = dueDate.getTime() - now.getTime();
      if (
        msBeforeDue <= 2 * 60 * 60 * 1000 &&
        msBeforeDue > 0 &&
        minutesSinceLast >= 60
      ) {
        remindUser(
          `${storedUserName}, you have less than 2 hours left for ${assignment.title.toUpperCase()}! Due at ${dueDate.toLocaleString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }
          )}`
        );
      }
    }
  });
}

// Map reminder values to user-friendly labels
function getReminderText(value) {
  const map = {
    daily: "Daily",
    weekly: "Weekly",
    urgent: "Two hours before deadline",
  };
  return map[value] || value;
}
