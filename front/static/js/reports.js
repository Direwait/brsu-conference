function deleteReport(){

}

function addReport() {
    const id = JSON.parse(decodeURIComponent(atob(localStorage.getItem('conf_data')))).user.id;
    const token = JSON.parse(decodeURIComponent(atob(localStorage.getItem('conf_data')))).accessToken;

    const formData = new FormData();
    const reportFile = document.querySelector('#report_file').files[0]
    
    const reportData = {
        userID: id,
        housing_need: document.querySelector('#housing_need').checked ? "1" : "0",
        reports: JSON.stringify([{
            key: "report1",
            report_title: document.querySelector('#report_title').value,
            report_form: document.querySelector('#report_form').value,
            scientific_direction:  document.querySelector('#scientific_direction').value, 
            authors:  document.querySelector('#report_authors').value
        }]),
        reports1: reportFile
    }
    for (const [key,value] of Object.entries(reportData)){
        formData.append(key,value);
    }
    
    fetch("http://localhost:8888/requests/insert", {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`
    },
            body: formData
    })
    .then(response => {
        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
            }
        return response.json();
    })
;
}