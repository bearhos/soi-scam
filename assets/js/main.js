const menuBtn = document.querySelector('.header__menu-icon')
const menu = document.querySelector('.container__menu')


// Function 
function stopPropagation(e) {
    e.stopPropagation()
}

menuBtn.addEventListener('click', (e) =>{
    menu.classList.toggle('active')
    stopPropagation(e)
})

menu.addEventListener('click',stopPropagation)

document.body.addEventListener('click', () =>{
    const active = document.querySelector('.active')
    if(active) {
        menu.classList.remove('active')
    }
})