const headerSearch = document.querySelector('.header__search');
const headerSearchInput = document.querySelector('.header__search-input');
const loader = document.querySelector('.scammer-list__loader')
const overlay = document.querySelector('.overlay')
const overlayImage = document.querySelector('.overlay img')
const removeBtn = document.querySelector('.times-icon')
const searchRemove = document.querySelector('.header__search-remove')
const scammerApi = 'https://621b329ffaa12ee45007cf63.mockapi.io/scamlist'
const scammerList = document.querySelector('.scammer-list')

// Event
headerSearchInput.addEventListener('click', (e) => {
    e.stopPropagation()
    headerSearch.classList.add('active')
})
headerSearchInput.addEventListener('change', debounceFn(function (e) {
    let path = scammerApi 
    if(e.target.value !== "") {
        path = `${scammerApi}?accountNumber=${e.target.value}`
        searchRemove.classList.add('active')
    }
    getScammerList(path)
}, 500))

headerSearchInput.addEventListener('keyup', (e)=> {
    if(e.target.value.length > 0) {
        searchRemove.classList.add('active')
    }else{
        searchRemove.classList.remove('active')

    }
})


searchRemove.addEventListener('click', ()=>{
    headerSearchInput.value = ""
    searchRemove.classList.remove('active')
    getScammerList()

})

window.addEventListener('click', (e) => {
    const active = document.querySelector('.active')
    if(active) {
        headerSearch.classList.remove('active')
    }
})

/* Function */
function start() {
    getScammerList()
}start()

function debounceFn(func, wait, immediate) {
    let timeout;
    return function () {
      let context = this,
        args = arguments;
      let later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
}

function renderItem(item) {
    const template = `
    <div class="scammer-item">
        <div class="scammer-header">
            <div class="scammer-header__number-${item.id}">
                #${item.id < 10? '0' : ''}${item.id}
            </div>
            <span class="scammer-header__name">
                ${item.accountHolder}
            </span>
            <span class="scammer-header__more">
                Xem Chi Tiết
               
            </span> 
        </div>
        <div class="scammer-info">
            <div class="scammer-info__item">
                <div class="scammer-info__title">
                    <i class="fas fa-user"></i>
                    Họ Tên:
                </div>
                <div id="info-name" class="scammer-info__name">
                    ${item.accountHolder}
                    
                </div>
                
            </div>
            <div class="scammer-info__item">
                <div class="scammer-info__title">
                    <i class="fas fa-phone"></i>
                    SĐT:
                </div>
                <div id="info-name" class="scammer-info__name">
                    ${item.phoneNumber}
                </div>
            </div>
            <div class="scammer-info__item">
                <div class="scammer-info__title">
                    <i class="far fa-address-card"></i>
                    STK:
                </div>
                <div id="info-name" class="scammer-info__name">
                    ${item.accountNumber}
                </div>
            </div>
            <div class="scammer-info__item">
                <div class="scammer-info__title">
                    <i class="fas fa-university"></i>
                    Ngân Hàng:
                </div>
                <div id="info-name" class="scammer-info__name">
                    ${item.bank}
                </div>
            </div>
            <div class="scammer-info__item scammer-info__item-img">
                <div class="scammer-info__title">
                    <i class="fas fa-image"></i>
                    Ảnh Chụp Bằng Chứng:
                </div>
                <img src="${item.image}" alt="" class="scammer-info__img">
            </div>
            <div class="scammer-info__item scammer-info__item-desc">
                <div class="scammer-info__title">
                    <i class="fas fa-edit"></i>
                    Hình Thức Lừa Đảo:
                </div>
                <div class="scammer-info__name">
                    ${item.content}
                </div>
            </div>
            <div class="scammer-author">
                <div class="scammer-author__heading">Người Tố Cáo:</div>
                <div class="scammer-author__info">
                    <div class="scammer-author__info-item">
                        <div class="scammer-info__title">Họ Và Tên:</div>
                        <div id="info-name" class="scammer-info__name">${item.authorName}</div>
                    </div>
                    <div class="scammer-author__info-item">
                        <div class="scammer-info__title">Liên Hệ:</div>
                        <div id="info-name" class="scammer-info__name">${item.authorPhone}</div>
                    </div>
                    <div class="scammer-author__info-item">
                        <div class="scammer-info__title">Trạng thái:</div>
                        <div id="info-name" class="scammer-info__name">${item.option}</div>
                    </div>
                    <div class="scammer-author__info-item">
                    
                        <div class="scammer-info__title">Trạng thái:</div>
                        <div id="info-name" class="scammer-info__name">${item.abc}</div>
                       
                    </div>
                </div>
                
            </div>
            <div class="scammer-button">
            <button onclick='handleDelete(${item.id})' class="btn btn-submit">
                        <div class="loader"></div>
                        <span> Xóa </span>
                    </button>
            </div>
           
        </div>
    </div>
`
scammerList.insertAdjacentHTML('afterbegin', template)
}
function handleDelete(id){
    var option={
        method : 'DELETE',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    }
    fetch(scammerApi + '/' + id, option)
    .then(function(response){
        response.json()
    })
    .then(function(){
        var itemDelete = document.querySelector('.scammer-header__number-'+ id)
        if (itemDelete){
            itemDelete.remove()
            showSuccessToast()
            start()
            
            
        }
    });
}
function showSuccessToast() {
    toast({
        title: "Thành công!",
        message: "Đã xóa thành công!",
        type: "success",
        duration: 3000
    });
}

async function getScammerList(link = scammerApi) {
    loader.classList.add('active')
    const res = await fetch(link)
    const data = await res.json()
    scammerList.innerHTML = ''
    if(data.length > 0 && Array.isArray(data)) {
        data.forEach(item => {
            renderItem(item)
        })
    }
    loader.classList.remove('active')

}

function getUrlImage(urlImage) {
    const template = `
    <div class="overlay">
        <img src="${urlImage}" alt="">
    </div>
    `
    document.body.insertAdjacentHTML('beforeend', template)
}

// Event
scammerList.addEventListener('click', (e) => {
    if(e.target.matches('.scammer-header')) {
        const scammerInfo = e.target.nextElementSibling
        scammerInfo.style.height = `${scammerInfo.scrollHeight}px`
        scammerInfo.classList.toggle('active')
        if(!scammerInfo.classList.contains('active')) {
            scammerInfo.style.height = `0px`
        }
    }else if(e.target.matches('.scammer-info__img')) {
        const urlImage = e.target.getAttribute('src')
        getUrlImage(urlImage)
    }
})

document.body.addEventListener('click', (e) => {
    if(e.target.matches('.overlay')){
        e.target.parentNode.removeChild(e.target)
    }
})


setTimeout(()=> {
    document.body.addEventListener('click', (e) => {
        if(e.target.matches('.modal')) {
            e.target.parentNode.removeChild(e.target)
        }else if(e.target.matches('.modal-close')) {
            const modal = document.querySelector('.modal')
            if(modal) {
                modal.parentNode.removeChild(modal)
            }
        }
    })
},2500)

setTimeout(() =>{
    const btnGoUp = document.querySelector('.btn-goup')
    btnGoUp.style.bottom = '80px'
}, 3500)
