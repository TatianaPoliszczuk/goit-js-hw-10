import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


let userSelectedDate = null;
const startButton = document.querySelector('[data-start]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');
let timerInterval = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      iziToast.error({
         title: 'Error',
         message: 'Please choose a date in the future',
         position: 'topCenter', 
         timeout: 3000, 
      });
      startButton.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
  },
};

flatpickr('#datetime-picker', options);

startButton.addEventListener('click', () => {
  if (timerInterval) clearInterval(timerInterval);

  startButton.disabled = true;
  document.querySelector('#datetime-picker').disabled = true;

  timerInterval = setInterval(() => {
    const currentTime = new Date();
    const timeLeft = userSelectedDate - currentTime;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      iziToast.success({
          title: 'Success',
          message: 'Countdown completed!',
          position: 'topCenter',
          timeout: 3000,
      });
      updateTimerUI(0);
      document.querySelector('#datetime-picker').disabled = false;
      return;
    }

    updateTimerUI(timeLeft);
  }, 1000);
});

function updateTimerUI(ms) {
  const time = convertMs(ms);
  daysEl.textContent = addLeadingZero(time.days);
  hoursEl.textContent = addLeadingZero(time.hours);
  minutesEl.textContent = addLeadingZero(time.minutes);
  secondsEl.textContent = addLeadingZero(time.seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}