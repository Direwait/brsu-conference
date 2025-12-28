const {fetch: originalFetch} = window, 

functions = {
    'profile.html': profile,
},

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
            await fetch('http://localhost:8888/users/refresh', {
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
    try {
        let data = localStorage.getItem('conf_data');
        if (!data) return;
        let decoded = decodeURIComponent(atob(data));
        if (!decoded) return;
        let token = JSON.parse(decoded).accessToken;
        if (!token) return;
        userData = JSON.parse(decodeURIComponent(atob(localStorage.getItem('conf_data'))));
        if (userData.accessToken)
            await fetch('http://localhost:8888/users/refresh', {
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

function changeContent(fileName) {
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

function login() {
    let email = document.querySelector('#email'),
        password = document.querySelector('#password'),
        message = document.querySelector('.message'),
        values = email.parentElement.parentElement.querySelectorAll('input'),
        oneEmpty = false;
    message.classList.add('hidden');
    message.innerHTML = '';
    for (let i = 0; i < values.childElementCount; i++)
        if (!values.children[i].value) {
            oneEmpty = true;
            break;
        }
    if (oneEmpty) {
        message.innerHTML = 'Все поля должны быть заполнены!';
        message.classList.remove('hidden');
        return;
    } 
    fetch('http://localhost:8888/users/login', {
        headers: {
            'content-type': 'application/json',
            'withToken': false
        },
        method: 'post',
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    }).then(response => response.json())
    .then(data => {
        if (data.message) {
            message.innerHTML = data.message;
            message.classList.remove('hidden');
            return;
        }
        localStorage.setItem('conf_data', btoa(encodeURIComponent(JSON.stringify({
            accessToken: data.accessToken,
            user: data.user
        }))));
        location.reload();
    });
}

function registration() {
    
    let surname = document.querySelector('#surname'),
        name = document.querySelector('#name'),
        fathername = document.querySelector('#fathername'),
        degree = document.querySelector('#select-degree'),
        title = document.querySelector('#select-title'),
        place = document.querySelector('#place-of-work'),
        job = document.querySelector('#job-title'),
        email = document.querySelector('#email'),
        password = document.querySelector('#password'),
        repeatPassword = document.querySelector('#repeat-password'),
        message = document.querySelector('.message'),
        oneEmpty = false,
        values = surname.parentElement;
    message.classList.add('hidden');
    message.innerHTML = '';
    for (let i = 0; i < values.childElementCount; i++)
        if (!values.children[i].value) {
            oneEmpty = true;
            break;
        }
    if (oneEmpty) {
        message.innerHTML = 'Все поля должны быть заполнены!';
        message.classList.remove('hidden');
        return
    }
    if (password.value !== repeatPassword.value) {
        message.innerHTML = 'Пароли не совпадают!';
        message.classList.remove('hidden');
        return;
    }
    fetch('http://localhost:8888/users/registration', {
        headers: {
            'content-type': 'application/json',
            'withToken': false
        },
        method: 'post',
        body: JSON.stringify({
            email: email.value,
            password: password.value,
            surname: surname.value,
            name: name.value,
            fathername: fathername.value,
            academic_degree: degree.value,
            academic_title: title.value,
            work_address: place.value,
            job_title: job.value
        })
    }).then(response => response.json())
    .then(data => {
        if (data.errors && data.errors.length) {
            let wrongEmail = false, wrongPass = false;
            for (let i = 0; i < data.errors.length; i++) {
                if (Object.values(data.errors[i]).indexOf('email') != -1)
                    wrongEmail = true;
                if (Object.values(data.errors[i]).indexOf('password') != -1)
                    wrongPass = true;
            }
            if (wrongEmail) {
                message.innerHTML = 'Неправильный адрес почты!';
                message.classList.remove('hidden');
                return;
            }

            if (wrongPass) {
                message.innerHTML = 'Длина пароля должна быть минимум 8 символов!';
                message.classList.remove('hidden');
                return;
            }
        }
        if (data.message) {
            message.innerHTML = data.message;
            message.classList.remove('hidden');
            return;
        }
        localStorage.setItem('conf_data', btoa(encodeURIComponent(JSON.stringify({
            accessToken: data.accessToken,
            user: data.user
        }))));
        location.reload();
    });
}
calculateDays();
setInterval(calculateDays, 1000);
