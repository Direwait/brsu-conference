const functions = {
    'front/page/profile.html': profile,
    'front/page/personal-requests.html': renderAllRequests,
    'front/page/department-requests.html': renderAllRequestsFormAdmin,
    'front/page/accepted-requests.html': renderAllRequestsFormAdminAproved,
};

function profile() {
    let name = document.querySelector('#profile #name');
        degree = document.querySelector('#profile #degree'),
        place_of_work = document.querySelector('#profile #place-of-work'),
        job_title = document.querySelector('#profile #job-title'),
        email = document.querySelector('#profile #email'),
        userData = JSON.parse(decodeURIComponent(atob(localStorage.getItem('conf_data'))));
    name.innerHTML = [userData.user.surname, userData.user.name, userData.user.fathername].join(' ');
    degree.innerHTML = [degrees[userData.user.academic_degree], titles[userData.user.academic_title]].join(', ');
    place_of_work.innerHTML = userData.user.work_address;
    job_title.innerHTML = userData.user.job_title;
    email.innerHTML = userData.user.email;

}

function changeContent(fileName) {
    localStorage.setItem('lastPage', fileName);
    fetch(fileName, {headers: {'withToken': false}})
        .then(response => response.text())
        .then(data => {
            document.getElementById('content').innerHTML = data;
            initializeGallery();
            if (Object.keys(functions).includes(fileName))
                functions[fileName]();
        })
        .catch(error => {
            console.error('Ошибка загрузки файла:', error);
        });
}

async function renderAllRequests() {
    try {
        const rawData = await getAllRequestByUser();
        if (!Array.isArray(rawData)) {
            return;
        }
        const requestCards = parseToRequestWithReports(rawData);
        const html = requestCards.map(card => renderRequestItem(card)).join('');
        
        const container = document.querySelector('.request-list');
        if (container) {
            container.innerHTML = html;
        }
    } catch (error) {
        console.error('Ошибка рендера:', error);
    }
}

function renderRequestItem(requestCards) {
    const hasReports = requestCards.requestReports && 
                       Array.isArray(requestCards.requestReports) && 
                       requestCards.reports.length > 0;

    if (requestCards.requestStatus == 'pending')
        requestCards.requestStatus = 'В ожидании';
    else if(requestCards.requestStatus == 'approved') requestCards.requestStatus = 'Принята';
    else requestCards.requestStatus = 'Отклонено';
    
    return `
        <div class="request-item" data-id="${requestCards.requestId}">
            <ul class="request-info">
                <div>Потребность в жилье? ${requestCards.housingNeed === 1 ? 'Да' : 'Нет'}</div>
                <div>Статус: ${requestCards.requestStatus}</div>
                <div>
                    <button onclick="showDeletePopup('${requestCards.requestId}')" class="request-delete-btn" id="${requestCards.requestId}">
                        Удалить
                    </button>
                </div>
            </ul>            
                ${renderReports(requestCards.reports)}
        </div>
    `;
}

function renderReports(reportsArray) {
    if (!reportsArray || !Array.isArray(reportsArray) || reportsArray.length === 0) {
        return 'Текущих заявок нет';
    }
    
    return reportsArray.map((report, index) => `
        <div class="report-item" data-report-id="${report.id}">
            <div class="report-header">
                <span class="report-number">Доклад #${index + 1} 📎</span>
            </div>
            <div class="report-content">
                <div><strong>Название:</strong> ${report.report_title || 'Без названия'}</div> 
                <div><strong>Авторы:</strong> ${report.report_authors || 'Не указаны'}</div>
                <div><strong>Формат:</strong> ${report.report_form === "ofline" ? 'очно' : 'онлайн'}</div> 
                <div><strong>Направление:</strong> ${report.scientific_direction}</div> 
                ${report.report_filename 
                    ? `<div><strong>Файл:</strong> <a class="report-link" href="https://conf_server.brsu.by:8888/${report.report_filename}" target="_blank">Скачать</a></div>` 
                    : '<div class="no-file"><strong>Файл:</strong> Не загружен</div>'
                }
            </div>
        </div><br>
    `).join('');
}

function renderRequestItemForAdmin(requestCards) {
    const hasReports = requestCards.requestReports && 
                       Array.isArray(requestCards.requestReports) && 
                       requestCards.reports.length > 0;

    if (requestCards.requestStatus == 'pending') 
        requestCards.requestStatus = 'В ожидании';
    else if (requestCards.requestStatus == 'approved')
        requestCards.requestStatus = 'Принята';        
    else requestCards.requestStatus = 'Отклонено';
    
    return `
        <div class="request-item" data-id="${requestCards.requestId}">
            <ul class="request-info">
                <div>Потребность в жилье? ${requestCards.housingNeed === 1 ? 'Да' : 'Нет'}</div>
                <div>Статус: ${requestCards.requestStatus}</div>
                <div>
                    <button onclick="showDeletePopup('${requestCards.requestId}')" class="request-delete-btn" id="${requestCards.requestId}">
                        Удалить
                    </button>
                </div>
            </ul>            
                ${renderReports(requestCards.reports)}
            <div style="text-align: center;">
                <button onclick="updateRequestStatus('${requestCards.requestId}', 'approved')" style="background-color: green">
                    ПРИНЯТЬ
                </button> 

                <button onclick="updateRequestStatus('${requestCards.requestId}', 'rejected')" style="background-color: red">
                    ОТКЛОНИТЬ
                </button> 
            </div>
        </div>
    `;
}

async function renderAllRequestsFormAdminAproved() {

    try {
        const rawData = await getAllRequestForAdmin('approved');
        const requestCards = parseToRequestWithReports(rawData);

        const html = requestCards.map(card => renderRequestItem(card)).join('');
        const container = document.querySelector('.request-list');
        if (container) {
            container.innerHTML = html;
        }
    } catch (error) {
        console.error('Ошибка рендера:', error);
    }
}

/*для админа*/
async function renderAllRequestsFormAdmin() {

    try {

        const rawData = await getAllRequestForAdmin('pending');
        const requestCards = parseToRequestWithReports(rawData);

        const html = requestCards.map(card => renderRequestItemForAdmin(card)).join('');
        const container = document.querySelector('.request-list');
        if (container) {
            container.innerHTML = html;
        }
        
        // document.querySelectorAll('.request-delete-btn').forEach(btn => {
        //     btn.addEventListener('click', function() {
        //         const requestId = this.dataset.id;
        //         console.log('Удалить заявку:', requestId);
        //     });
        // });
        
    } catch (error) {
        console.error('Ошибка рендера:', error);
    }
}
