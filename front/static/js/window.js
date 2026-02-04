const { fetch: originalFetch } = window;

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
    initializeGallery();
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