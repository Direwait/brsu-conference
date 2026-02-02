const { fetch: originalFetch } = window, 
    
functions = {
    'front/page/profile.html': profile,
    'front/page/personal-requests.html': renderAllRequests,
    'front/page/department-requests.html': renderAllRequestsFormAdmin,
    'front/page/accepted-requests.html': renderAllRequestsFormAdminAproved,
}

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
let edit_request = {}, request_changes = {};

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

window.fetch = async (...args) => {
    let [resource, config] = args;
    if (!config) config = {};
    config.credentials = 'include';
    if (!config.headers['withToken']) {
        let response = await originalFetch(resource, config);
        return response;
    }
    let token = JSON.parse(decodeURIComponent(atob(localStorage.getItem('conf_data')))).accessToken;
    config.headers = {
        ...config.headers,
        authorization: `Bearer ${token}`
    };

    let response = await originalFetch(resource, config);

    if (response.status == 401 && !config.headers.retry)
    {
        try {
            await fetch('https://conf_server.brsu.by:8888/users/refresh', {
                headers: { retry: true, 'withToken': false }
            }).then(response => response.json())
            .then(async (data) => {
                if (data.message && config.headers.retry) {
                    localStorage.removeItem('conf_data');
                    location.reload();
                    return;
                }

                localStorage.setItem('conf_data', btoa(encodeURIComponent(JSON.stringify({
                    accessToken: data.accessToken,
                    user: data.user
                }))));

                config.headers = {
                    ...config.headers,
                    authorization: `Bearer ${data.accessToken}`
                };
                response = await originalFetch(resource, config);
            });
        } catch (e) {
            throw new Error('Unauthorized');
        }
    }

    return response;
}

document.addEventListener('DOMContentLoaded', async () =>  {
    let userData = null;
    
    const savedPage = localStorage.getItem('lastPage') || 'front/page/about.html';
    if (savedPage !== 'front/page/registration.html' && savedPage !== 'front/page/login.html') {
        changeContent(savedPage);
    }
    
    try {
        let data = localStorage.getItem('conf_data');
        if (!data) return;
        let decoded = decodeURIComponent(atob(data));
        if (!decoded) return;
        let token = JSON.parse(decoded).accessToken;
        if (!token) return;
        userData = JSON.parse(decodeURIComponent(atob(localStorage.getItem('conf_data'))));
        if (userData.accessToken)
            await fetch('https://conf_server.brsu.by:8888/users/refresh', {
                headers: {'withToken': false}
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) return;
                localStorage.setItem('conf_data', btoa(encodeURIComponent(JSON.stringify({
                    accessToken: data.accessToken,
                    user: data.user
                }))));
                userData = data;
            });
    } catch (e) {
        localStorage.removeItem('conf_data');
        console.log(e);
    }

    document.querySelectorAll('.auth').forEach(e => e.classList.remove('hidden'));
    document.querySelectorAll('.no-auth').forEach(e => e.classList.add('hidden'));

    if (userData.user.role == 'admin') {
        document.querySelectorAll('.admin').forEach(e => e.classList.remove('hidden'));
        document.querySelector('.menu').setAttribute('style-type', 'small');
    }
});

function changeContent(fileName) {
    localStorage.setItem('lastPage', fileName);
    fetch(fileName, {headers: {'withToken': false}})
        .then(response => response.text())
        .then(data => {
            document.getElementById('content').innerHTML = data;
            if (Object.keys(functions).includes(fileName))
                functions[fileName]();
        })
        .catch(error => {
            console.error('Ошибка загрузки файла:', error);
        });
}


async function updateRequestStatus(requestId, requestStatus) {
    try {
        const response = await fetch(`https://conf_server.brsu.by:8888/requests/response/${requestId}`, {
            method: `PUT`,
            headers: {
                'content-type': 'application/json',
                'withToken': true
            },
            body: JSON.stringify({
                status: requestStatus
            }) 
        });

        hideById(requestId)
        return response.ok;
    } catch (error) {
        console.error("Ошибка обновление статуса заявки по id")
    }
}
function hideById(id) {
    const request = document.querySelector(`[data-id="${id}"]`);
    if (request)
        request.style.display = 'none';
}

async function getAllRequestByUser() {
    try {
        const userId = JSON.parse(decodeURIComponent(atob(localStorage.getItem('conf_data')))).user.id;
        const response = await fetch(`https://conf_server.brsu.by:8888/requests/get-personal/${userId}`, {
            method: `GET`,
            headers: {
            'content-type': 'application/json',
            'withToken': true      
            }
        });
        const listOfRequestwithReports = await response.json();
        return listOfRequestwithReports;
    } catch (error) {
        console.error("Ошибка с получениям списка заявок пользователя", error);
    }
}

async function getAllRequestForAdmin(status) {
    try {
        const response = await fetch(`https://conf_server.brsu.by:8888/requests/get-all/${status}`, {
            method: `GET`,
            headers: {
            'content-type': 'application/json',
            'withToken': true      
            }
        });
        const listOfRequestwithReports = await response.json();
        return listOfRequestwithReports;
    } catch (error) {
        console.error("Ошибка с получениям списка заявок пользователя", error);
    }
}

async function deleteRequestById(requestId) {
    try {
        const response = await fetch(`https://conf_server.brsu.by:8888/requests/remove/${requestId}`, {
            method: `DELETE`,
            headers: {
            'content-type': 'application/json',
            'withToken': true      
            }
        });
        return response.ok;
    } catch (error) {
        console.error("Ошибка с удаленния заявки по id", error);
    }
}

function parseToRequestWithReports(requestsList) {
    if (!Array.isArray(requestsList)) {
        throw new Error(`RequestList должен быть массив объектов`)
    }
    return requestsList.map(
        (item, index) => {
                return new RequestCardWithReports(item);
    })
}
class RequestCardWithReports {
    constructor(requestData) {
        this.requestId = requestData.request.id;
        this.housingNeed = requestData.request.housing_need;
        this.requestStatus = requestData.request.status || `pending`;
        this.reports = requestData.reports || [];
    }
}

async function renderAllRequests() {

    try {
        
        const rawData = await getAllRequestByUser();
        //const rawData = await getAllRequestForAdmin();
        
        if (!Array.isArray(rawData)) {
            return; // СТОП рендер
        }
 
        const requestCards = parseToRequestWithReports(rawData);
        const html = requestCards.map(card => renderRequestItem(card)).join('');
        
        const container = document.querySelector('.request-list');
        if (container) {
            container.innerHTML = html;
        }
        
        document.querySelectorAll('.request-delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = this.dataset.id;
                console.log('Удалить заявку:', requestId);
            });
        });
        
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
                    <button onclick="deleteRequestById('${requestCards.requestId}')" class="request-delete-btn" id="${requestCards.requestId}">
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
        <div class="report-item" data-report-id="${report.id || index}">
            <div class="report-header">
                <span class="report-number">Доклад #${index + 1} 📎</span>
            </div>
            <div class="report-content">
                <div><strong>Название: ${report.report_title || 'Без названия'}</div> 
                <div><strong>Авторы:</strong> ${report.report_authors || 'Не указаны'}</div>
                <div><strong>Формат:</strong> ${report.report_form || 'Не указан'}</div> 
                <div><strong>Направление:</strong> ${report.scientific_direction}</div> 
                ${report.report_filename 
                    ? `<div><strong>Файл:</strong> <a class="report-link" href="https://conf_server.brsu.by:8888/${report.report_filename}" target="_blank">Скачать</a></div>` 
                    : ''
                }
            </div>
        </div><br>
    `).join('');
}

function renderRequestItemForAdmin(requestCards) {
    const hasReports = requestCards.requestReports && 
                       Array.isArray(requestCards.requestReports) && 
                       requestCards.reports.length > 0;

    if (requestCards.requestStatus == 'pending') { 
        requestCards.requestStatus = 'В ожидании';
    }

    else if (requestCards.requestStatus == 'approved') {
        requestCards.requestStatus = 'Принята';        
    }
    else requestCards.requestStatus = 'Отклонено';
    
    return `
        <div class="request-item" data-id="${requestCards.requestId}">
            <ul class="request-info">
                <div>Потребность в жилье? ${requestCards.housingNeed === 1 ? 'Да' : 'Нет'}</div>
                <div>Статус: ${requestCards.requestStatus}</div>
                <div>
                    <button onclick="deleteRequestById('${requestCards.requestId}')" class="request-delete-btn" id="${requestCards.requestId}">
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

/*дубляж*/
async function renderAllRequestsFormAdminAproved() {

    try {

        const rawData = await getAllRequestForAdmin('approved');
        const requestCards = parseToRequestWithReports(rawData);

        const html = requestCards.map(card => renderRequestItem(card)).join('');
        const container = document.querySelector('.request-list');
        if (container) {
            container.innerHTML = html;
        }
        
        document.querySelectorAll('.request-delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = this.dataset.id;
                console.log('Удалить заявку:', requestId);
            });
        });
        
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
        
        document.querySelectorAll('.request-delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = this.dataset.id;
                console.log('Удалить заявку:', requestId);
            });
        });
        
    } catch (error) {
        console.error('Ошибка рендера:', error);
    }
}