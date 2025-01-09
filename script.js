class PomodoroTimer {
    constructor() {
        // Initialize title-related properties first
        this.titleElement = document.querySelector('h1');
        this.defaultTitle = this.titleElement.textContent;
        this.originalTitle = document.title;

        // Rest of the constructor initialization
        this.workTime = 25 * 60;
        this.breakTime = 5 * 60;
        this.timeLeft = this.workTime;
        this.isRunning = false;
        this.isWorkTime = true;
        this.timer = null;

        // DOM elements
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.modeText = document.getElementById('mode-text');
        
        // Buttons
        this.startPauseButton = document.getElementById('startPause');
        document.getElementById('reset').addEventListener('click', () => this.reset());
        this.startPauseButton.addEventListener('click', () => this.toggleStartPause());

        this.modeToggleButton = document.getElementById('modeToggle');
        this.modeToggleButton.addEventListener('click', () => {
            this.isWorkTime = !this.isWorkTime;
            this.timeLeft = this.isWorkTime ? this.workTime : this.breakTime;
            if (this.isRunning) {
                this.pause();
            }
            this.updateModeDisplay();
            this.updateDisplay();
        });

        // Task dialog setup
        this.taskDialog = document.getElementById('taskDialog');
        this.taskInput = document.getElementById('taskInput');
        
        document.getElementById('startTask').addEventListener('click', () => {
            this.startTaskSession();
        });

        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.startTaskSession();
            }
        });

        // Add event listeners for dialog dismissal
        this.taskDialog.addEventListener('click', (e) => {
            // Only close if clicking the overlay background, not the dialog itself
            if (e.target === this.taskDialog) {
                this.dismissDialog();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.taskDialog.style.display === 'flex') {
                this.dismissDialog();
            }
        });

        // Initial display update
        this.updateDisplay();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update the timer display
        this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');
        
        // Update the page title
        this.updateTitleDisplay(timeString);
    }

    updateTitleDisplay(timeString = '') {
        const mode = this.isWorkTime ? 'Work' : 'Break';
        const task = this.titleElement.textContent !== this.defaultTitle ? this.titleElement.textContent : '';
        
        if (timeString) {
            document.title = task 
                ? `(${timeString}) ${task} - ${mode}`
                : `(${timeString}) ${mode} - Pomodoro`;
        } else {
            document.title = task 
                ? `${task} - Pomodoro`
                : this.originalTitle;
        }
    }

    toggleStartPause() {
        if (this.isRunning) {
            this.pause();
        } else {
            if (this.isWorkTime && this.titleElement.textContent === this.defaultTitle) {
                this.showTaskDialog();
            } else {
                this.startTimer();
            }
        }
    }

    pause() {
        this.isRunning = false;
        this.startPauseButton.textContent = 'Start';
        this.startPauseButton.style.backgroundColor = '#4F46E5'; // Update to match our current color scheme
        clearInterval(this.timer);
    }

    reset() {
        this.pause();
        this.isWorkTime = true;
        this.timeLeft = this.workTime;
        this.titleElement.textContent = this.defaultTitle;
        this.updateModeDisplay();
        this.updateDisplay();
    }

    updateModeDisplay() {
        // Only update the mode text, keep the icon as is
        this.modeText.textContent = this.isWorkTime ? 'Work Time' : 'Break Time';
    }

    switchMode() {
        this.pause();
        this.isWorkTime = !this.isWorkTime;
        this.timeLeft = this.isWorkTime ? this.workTime : this.breakTime;
        this.updateModeDisplay();
        this.updateDisplay();
        
        // Play notification sound
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.play();
    }

    showTaskDialog() {
        this.taskDialog.style.display = 'flex';
        this.taskInput.focus();
    }

    startTaskSession() {
        const task = this.taskInput.value.trim();
        if (task) {
            this.titleElement.textContent = task;
        }
        this.taskDialog.style.display = 'none';
        this.taskInput.value = '';
        this.startTimer();
    }

    startTimer() {
        this.isRunning = true;
        this.startPauseButton.textContent = 'Pause';
        this.startPauseButton.style.backgroundColor = '#EA580C';
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            if (this.timeLeft === 0) {
                this.switchMode();
            }
        }, 1000);
    }

    dismissDialog() {
        this.taskDialog.style.display = 'none';
        this.taskInput.value = '';
        this.startTimer(); // Start the timer without setting a task
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const pomodoro = new PomodoroTimer();
}); 