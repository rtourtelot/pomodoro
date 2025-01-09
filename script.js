class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60; // 25 minutes in seconds
        this.breakTime = 5 * 60; // 5 minutes in seconds
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

        this.originalTitle = document.title;
        this.updateTitleDisplay();
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
        document.title = timeString 
            ? `(${timeString}) ${mode} - Pomodoro`
            : this.originalTitle;
    }

    toggleStartPause() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startPauseButton.textContent = 'Pause';
            this.startPauseButton.style.backgroundColor = '#EA580C'; // Update to match our current color scheme
            this.timer = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();

                if (this.timeLeft === 0) {
                    this.switchMode();
                }
            }, 1000);
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
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const pomodoro = new PomodoroTimer();
}); 