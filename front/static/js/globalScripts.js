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

class RequestCardWithReports {
    constructor(requestData) {
        this.requestId = requestData.request.id;
        this.housingNeed = requestData.request.housing_need;
        this.requestStatus = requestData.request.status || `pending`;
        this.reports = requestData.reports || [];
    }
}

function hideById(id) {
    const request = document.querySelector(`[data-id="${id}"]`);
    if (request)
        request.style.display = 'none';
}

calculateDays();
setInterval(calculateDays, 60 * 60 * 24 * 1000);

degrees = {
    'candidate': 'Кандидат наук',
    'doctor': 'Доктор наук',
    'none': 'Отсутствует'
},

titles = {
    'docent': 'доцент',
    'professor': 'профессор',
    'none': 'Отсутствует'
};

function parseToRequestWithReports(requestsList) {
    if (!Array.isArray(requestsList)) {
        throw new Error(`RequestList должен быть массив объектов`)
    }
    return requestsList.map(
        (item, index) => {
                return new RequestCardWithReports(item);
    })
};
