const degrees = {
    'candidate': 'Кандидат наук',
    'doctor': 'Доктор наук',
    'none': 'Отсутствует'
},
titles = {
    'docent': 'доцент',
    'professor': 'профессор',
    'none': 'Отсутствует'
};

class RequestCardWithReports {
    constructor(requestData) {
        this.requestId = requestData.request.id;
        this.housingNeed = requestData.request.housing_need;
        this.requestStatus = requestData.request.status || `pending`;
        this.reports = requestData.reports || [];
    }
}

function toggleText(id) {
    var textDiv = document.getElementById(id);
    if (textDiv.classList.contains('show')) {
        textDiv.classList.remove('show');
    } else {
        textDiv.classList.add('show');
        initializeGallery();
    }
}

function initializeGallery() {
    const galleryImages = document.querySelectorAll(".gallery img");
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.querySelector(".close");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    if (galleryImages.length === 0) return;

    let currentIndex = 0;

    galleryImages.forEach((img, index) => {
        img.onclick = function () {
            currentIndex = index;
            openModal();
        };
    });

    function openModal() {
        modalImg.src = galleryImages[currentIndex].src;
        modal.style.display = "flex";
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        document.body.classList.add("no-scroll");
    }

    function closeModal() {
        modal.style.display = "none";
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.classList.remove("no-scroll");
    }

    closeBtn.onclick = closeModal;

    prevBtn.onclick = function () {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryImages.length - 1;
        modalImg.src = galleryImages[currentIndex].src;
    };

    nextBtn.onclick = function () {
        currentIndex = (currentIndex < galleryImages.length - 1) ? currentIndex + 1 : 0;
        modalImg.src = galleryImages[currentIndex].src;
    };

    modal.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    };

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape" && modal.style.display === "flex") {
            closeModal();
        }
    });
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

function hideById(id, behaivor) {
    const request = document.querySelector(`[data-id="${id}"]`);
    if (!request) return;
    
    if (behaivor === "rejected" || !behaivor) {
        request.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        request.style.boxShadow = '0 0 25px red, 0 0 40px  #95082b';
        request.style.transform = 'translateY(20px) scale(0.95)';
        request.style.opacity = '0';
        request.style.filter = 'blur(3px) hue-rotate(10deg)';
        request.style.background = 'linear-gradient(to bottom, rgba(255, 50, 50, 0.3), rgba(255, 0, 0, 0.5))';
        
        setTimeout(() => {
            request.style.display = 'none';
            request.style.transform = '';
            request.style.opacity = '1';
            request.style.filter = '';
            request.style.boxShadow = '';
            request.style.background = '';
        }, 340);
        return;
    }
    request.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
    request.style.transform = 'translateY(-80px) scale(1.05)';
    request.style.opacity = '0';
    request.style.boxShadow = `
        0 0 20px rgba(252, 227, 0, 0.8),
        0 0 50px rgba(252, 227, 0, 0.5),
        0 0 100px rgba(252, 227, 0, 0.2),
        inset 0 0 20px rgba(255, 255, 200, 0.3)
    `;
    request.style.filter = 'blur(1px) brightness(2) contrast(1.2) drop-shadow(0 0 10px #fce300)';
    request.style.background = 'radial-gradient(circle at center, rgba(252, 227, 0, 0.3), rgba(252, 227, 0, 0.1))';

    setTimeout(() => {
        request.style.display = 'none';
        request.style.transform = '';
        request.style.opacity = '1';
        request.style.boxShadow = '';
        request.style.filter = '';
        request.style.background = '';
    }, 320);
}

calculateDays();
setInterval(calculateDays, 60 * 60 * 24 * 1000);

function parseToRequestWithReports(requestsList) {
    if (!Array.isArray(requestsList)) {
        throw new Error(`RequestList должен быть массив объектов`)
    }
    return requestsList.map(
        (item, index) => {
                return new RequestCardWithReports(item);
    })
};
