const reputationHeader = document.querySelectorAll('.reputation-item__header')
const searchInput = document.querySelector('#search-input')
const serachForm = document.querySelector('.form-search')
// Function
function showReputationBody(e) {
    const reputationBody = e.currentTarget.nextElementSibling
    reputationBody.style.height = `${reputationBody.scrollHeight}px`
    reputationBody.classList.toggle('active')
    if(!reputationBody.classList.contains('active')) {
        reputationBody.style.height = `0px`

    }
}



// Event
reputationHeader.forEach(item => item.addEventListener('click', showReputationBody))
searchInput.addEventListener('click', (e) => {
    e.stopPropagation();
    serachForm.classList.add('active');
})

document.body.addEventListener('click', (e) => {
    const active = document.querySelector('.active');
    if(active) {
        serachForm.classList.remove('active');
    }
})
