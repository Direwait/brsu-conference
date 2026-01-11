const { ServiceException } = require("@smithy/smithy-client");

function deleteReport(){

}

function addReportForm(){
    const reportForm = document.querySelector(".form-add-report");
    const clonedForm = reportForm.cloneNode(true)
    
    const inputs = clonedForm.querySelectorAll('input','select')
    .forEach(input => input.value = '');

    const deleteBtn = clonedForm.querySelector('button[onclick="deleteReport()"]');
    deleteBtn.style.display = 'inline-block';
 
    deleteBtn.onclick = function() {
        clonedForm.remove();
    };
    
    const addButton = document.querySelector('button[onclick="addReportForm()"]');
    addButton.parentNode.insertBefore(clonedForm, addButton);
}

function addReport() {
    const id = JSON.parse(decodeURIComponent(atob(localStorage.getItem('conf_data')))).user.id;
    //const token = JSON.parse(decodeURIComponent(atob(localStorage.getItem('conf_data')))).accessToken;
    
    const allReports = [];
    
    document.querySelectorAll('.form-add-report').forEach((div, index) => {
        const report = {
            key: `report${index + 1}`,
            report_title: div.querySelector('#report_title').value,
            report_form: div.querySelector('#report_form').value,
            scientific_direction: div.querySelector('#scientific_direction').value, 
            authors: div.querySelector('#report_authors').value
        };
        
        allReports.push(report);
    });


    let reportData = new FormData();
    reportData.append('userID', id);
    reportData.append('housing_need', document.querySelector('#housing_need').checked ? "1" : "0");
    reportData.append('reports', JSON.stringify(allReports));

    document.querySelectorAll('.form-add-report').forEach((div, index) => {
        const fileInput = div.querySelector('input[type="file"]');
        reportData.append(`report${index + 1}`, fileInput.files[0]);
    });

    fetch("http://localhost:8888/requests/insert", {
    method: 'POST',
    credentials: "include",
    headers: {
        'withToken': true
    },
        body: reportData
    })
    .then(response => {
        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
            }
        return response.json();
    })
    .then(data => {
        
        console.log(data);
        // location.reload();
    });
}


