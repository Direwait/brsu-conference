async function logout() {
    try {
        const response = await fetch('https://conf_server.brsu.by:8888/users/logout', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'withtoken': true
            }
        });
        if (response.ok) {
            localStorage.removeItem('conf_data');
            location.reload();
        } else {
            console.error('Ошибка сервера:', response.status);
        }
    } catch (error) { 
        console.error("Ошибка с запросом выхоода из профиля",error);
    }
}

async function codeOnEmail() {
    try {
        const email = document.getElementById('email').value;
        const response = await fetch('https://conf_server.brsu.by:8888/users/reset-code', {
            method: "POST",
            headers: {
                'content-type': 'application/json',
                'withtoken': false
            },
            body: JSON.stringify({
                email: email
            })
        });
        const responseData = await response.json();
        localStorage.setItem('resetUserId', responseData);
        console.log(localStorage.getItem('resetUserId'));
        changeContent('front/page/newPassword.html');
    } catch (error) {
        console.error("Ошибка с запросом на оптравку кода на почту", error)
    }
}

async function changePassword() {
    try {
        const code = document.getElementById('code').value;
        const password = document.getElementById('newPassword').value;
        
        const response = await fetch('https://conf_server.brsu.by:8888/users/reset-pass', {
            method: "POST",
            headers: {
                'content-type': 'application/json',
                'withtoken': false
            },
            body: JSON.stringify({
                id: localStorage.getItem('resetUserId'),
                code: code,
                password: password
            }) 
        });
        changeContent('front/page/login.html');
        return response.status;
    } catch (error) {
        console.error("ошибка", error)
    }
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
    fetch('https://conf_server.brsu.by:8888/users/login', {
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
    fetch('https://conf_server.brsu.by:8888/users/registration', {
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
        
        hideById(requestId);
        return response.ok;
    } catch (error) {
        console.error("Ошибка с удаленния заявки по id", error);
    }
}
