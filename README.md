# Homework Hero

Never miss another assignment deadline!

## Overview

Homework Hero is a simple, browser-based assignment tracker and reminder tool for students. It allows you to add, view, and manage your assignments, and provides timely reminders so you never miss a due date.

**Live Demo:** [Homework Hero](https://abjnr.github.io/homework-hero/)

## Features

- **Personalized Greeting:** Greets you by name and remembers you for future visits.
- **Add Assignments:** Enter assignment title, course code, due date, and set a reminder frequency.
- **Assignment List:** View all your assignments, their due dates, and how much time is left.
- **Reminders:** Get reminders based on your chosen frequency (daily, weekly, or urgent).
- **Mark as Completed:** Mark assignments as completed to keep your list organized.
- **Delete Assignments:** Remove assignments you no longer need.
- **Persistent Storage:** All data is saved in your browser’s localStorage, so your assignments are remembered even after closing the browser.

## How It Works

1. **Enter Your Name:** On your first visit, you’ll be prompted to enter your name for a personalized experience.
2. **Add Assignments:** Fill out the form with assignment details and click "Add Assignment".
3. **View Assignments:** All assignments are listed with due dates and time remaining.
4. **Reminders:** Reminders appear in the Reminders section based on your chosen frequency.
5. **Manage Assignments:** Mark assignments as completed or delete them as needed.

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla, no frameworks)
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) for data persistence

## Getting Started

1. **Clone or Download the Repository**
   ```bash
   git clone https://github.com/abjnr/homework-hero.git
   ```
2. **Open the App**
   - Open `index.html` in your web browser.
   - No server or build step required.


## File Structure
```markdown
.
├── index.html
├── script/
│   └── script.js
└── style/
    └── styles.css
```

## Customization

- You can modify the reminder logic or UI by editing `script/script.js` and `style/styles.css`.
- To reset your assignments and username, clear your browser’s localStorage for the site.

## License

This project is for educational purposes and is open for personal use and modification.
