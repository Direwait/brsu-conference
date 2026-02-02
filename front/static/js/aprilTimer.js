function toggleText(id) {
    var textDiv = document.getElementById(id);
    if (textDiv.classList.contains('show')) {
        textDiv.classList.remove('show');
    } else {
        textDiv.classList.add('show');
    }
}

function calculateDays() {
    const currentDate = new Date();
    const targetDate = new Date(currentDate.getFullYear(), 3, 25);
    if (currentDate > targetDate) {
        targetDate.setFullYear(targetDate.getFullYear() + 1);
    }
    const timeDifference = targetDate - currentDate;
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    document.getElementById("days").textContent = days;
}
calculateDays();
setInterval(calculateDays, 60*60*24*1000);