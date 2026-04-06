function hidePopup(requestId, isForDelete) {
    const popup = document.querySelector('.popup-warning');
    if (isForDelete)
        deleteRequestById(requestId);
    if (popup) {
        popup.remove();
        // Восстанавливаем скролл
        document.body.classList.remove("no-scroll");
    }
}

function popupDeleteWarning(requestId) {
    return `
    <div class="popup-warning">
        <h2>Вы уверены что хотите <span>удалить</span> заявку?</h2>
        <div class="popup-warning-conainer">
            <button onclick="hidePopup('${requestId}', false)" class="popup-cancel-btn">
                Нет
            </button>
            <button onclick="hidePopup('${requestId}', true)" class="popup-aprove-btn">
                Удалить её
            </button>
        </div>
    </div>`;
}

function showDeletePopup(requestId) {
    document.querySelector('.popup-warning')?.remove();
    document.body.insertAdjacentHTML('beforeend', popupDeleteWarning(requestId));
    document.body.classList.add("no-scroll");
}
