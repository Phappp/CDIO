const darkModeToggle = document.getElementById('darkModeToggle'); 
const body = document.body;
const titleElement = document.querySelector('.tilte'); 
const cardHeadersPrimary = document.querySelectorAll('.card-header.py-3.bg-primary.text-white');
const cardHeadersInfo = document.querySelectorAll('.card-header.py-3.bg-info.text-white');
const cardHeadersSuccess = document.querySelectorAll('.card-header.py-3.bg-success.text-white');
darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (titleElement) {
        titleElement.classList.toggle('dark-mode');
    }
    cardHeadersPrimary.forEach(header => header.classList.toggle('dark-mode'));
    cardHeadersInfo.forEach(header => header.classList.toggle('dark-mode'));
    cardHeadersSuccess.forEach(header => header.classList.toggle('dark-mode'));
    
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

// Kiểm tra trạng thái dark mode đã lưu khi tải trang (tùy chọn)
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    if (titleElement) {
        titleElement.classList.add('dark-mode');
    }
    cardHeadersPrimary.forEach(header => header.classList.add('dark-mode'));
    cardHeadersInfo.forEach(header => header.classList.add('dark-mode'));
    cardHeadersSuccess.forEach(header => header.classList.add('dark-mode'));
}