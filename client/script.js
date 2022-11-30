
const   testDiv = document.getElementById('test'),
        nameInput = document.getElementById('name'),
        passwordInput = document.getElementById('password'),
        form = document.getElementById('form'),
        logOutBtn = document.getElementById('logOut'),
        registrationBtn = document.getElementById('registrationBtn'),
        loginBtn = document.getElementById('loginBtn'),
        wrapper = document.querySelector('.wrapper'),
        messageDiv = document.getElementById('messageDiv'),
        cross = document.getElementById('cross'),
        createBtn = document.getElementById('createBtn'),
        createName = document.getElementById('createName'),
        createForm = document.getElementById('createForm'),
        createModal = document.getElementById('createModal')
//arr with responce(orders)
let responceArr = null
//id element to edit
let id
//login and regist. req
function request(url){
    fetch(`http://localhost:5000/auth/${url}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true'
        }, 
        body: JSON.stringify({username: nameInput.value, password: passwordInput.value, orders: []})
        })
        .then(res => res.json())
        .then(res => localStorage.setItem('userData', JSON.stringify(res)))
        .then(res => getList())
        .then(res => getAllOrders())
}
//get all orders req
function getAllOrders(){
    if(!!newObject.token) {
        fetch(`http://localhost:5000/orders/`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Authorization': `Bearer ${newObject.token}`
        }
        }).then(res => res.json())
        .then(res => localStorage.setItem('userOrders', JSON.stringify(res)))
        .then(res => getList())
    }
}
//create edit delete orders req
function ordersReq(url, method, body){
        fetch(`http://localhost:5000/orders/${url}`, {
        method,
        headers: {
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Authorization': `Bearer ${newObject.token}`
        }, 
        body
        }).then(res => getAllOrders())
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
})

createForm.addEventListener('submit', (e) => {
    e.preventDefault()
})
//log out (clear all user data)
function logOut() {
    localStorage.removeItem('userData')
    localStorage.removeItem('userOrders')
    responceArr = null
    form.classList.remove('hide')
    createModal.classList.add('hide')
    logOutBtn.classList.add('hide')
    createForm.classList.add('hide')
}
//get orders from LS
loadOrdersFromLS = () => {
    responceArr = localStorage.getItem('userOrders')
}
//close error modal
closeError = () => {
    messageDiv.innerHTML = ''
    messageDiv.classList.add('hide')
    messageDiv.classList.remove('flex')
}
//get element to edit
getElement = (idx) => {
    createForm.classList.remove('hide')
    createBtn.innerHTML = 'edit'
    id = idx
    let element = responceArr.find(({_id}) => _id === idx)
    createName.value = element.name
}
//delete order
deleteOrder = (idx) => {
    localStorage.removeItem('userOrders')
    responceArr = null
    ordersReq(`delete/${idx}`, "DELETE")
}
//toggle create form
function showCreateForm () {
    createBtn.innerHTML = 'create'
    createForm.classList.toggle('hide')
}
//regregistration btn
registrationBtn.onclick = () => {
    request('registration')
}
//login btn
loginBtn.onclick = async () => {
    request('login')
    if(!!newObject.token) {
        createModal.classList.remove('hide')
        logOutBtn.classList.remove('hide')
    }
}
//logout btn
logOutBtn.onclick = () => {
    logOut()
    getList()
    logOutBtn.classList.add('hide')
}
//create btn
createBtn.onclick = () => {
    //edit 
    if(createBtn.innerHTML === ('edit')) {
        if(createName.value === '' || createName.value === ' ') {
            messageDiv.innerHTML = 'Name can not be empty'
            messageDiv.classList.remove('hide')
            messageDiv.classList.add('flex')
            return setTimeout(closeError, 2000)
        } 
        localStorage.removeItem('userOrders')
        responceArr = null
        createForm.classList.add('hide')
        ordersReq(`edit/${id}`, "POST", JSON.stringify({name: createName.value}))
        createName.innerHTML = ''
    //create
    } else {
        createName.innerHTML = ''
        localStorage.removeItem('userOrders')
        responceArr = null
        createForm.classList.add('hide')
        ordersReq('create', "POST", JSON.stringify({name: createName.value, position: Date.now()}))
        createName.innerHTML = ''
    }
}
//close create form
cross.onclick = () => {
    showCreateForm()
}
//object with data about user(token, userId)
let newObject
//render all orders
function getList() {
    
    newObject = JSON.parse(localStorage.getItem('userData'))
    responceArr = JSON.parse(localStorage.getItem('userOrders'))
    //check for user data
    if(newObject == null) {
        newObject = {token: null}
        messageDiv.innerHTML = ``
        wrapper.innerHTML = ''
        logOutBtn.classList.remove('flex')
        logOutBtn.classList.add('hide')
    }
    
    if(!!newObject.message) {
        logOutBtn.classList.add('hide')
        messageDiv.classList.remove('hide')
        messageDiv.classList.add('flex')
        messageDiv.innerHTML = newObject.message
        setTimeout(closeError, 2000)
        localStorage.removeItem('userData')
    }
    //if is token 
    if(!!newObject.token) {
        form.classList.add('hide')
        if(responceArr === null || responceArr.length === 0){
            wrapper.innerHTML = `no orders`
        } else {
            createModal.classList.remove('hide')
            wrapper.innerHTML = ``
            responceArr.sort((a, b) =>  a.position - b.position )
            for(let i=0; i <= responceArr.length; i++) {
                wrapper.innerHTML += `
                <div class="flex">
                    <div class="item" draggable="true" id=${responceArr[i].position}>
                        <div>Rating: <span class="rating">${i+1}</span></div>
                        <div>Name: <span class="name">${responceArr[i].name}</span></div>
                    </div>
                    <div class="btns">
                        <i class="fa fa-edit hover" id=${responceArr[i]._id} onclick=getElement(this.id) style="font-size:20px"></i>
                        <i class="fa fa-trash hover" id=${responceArr[i]._id} onclick=deleteOrder(this.id) style="font-size:24px"></i>
                    </div>
                </div>
            `
            addEventListeners()
            }
        }
        createModal.classList.remove('hide')
        logOutBtn.classList.remove('hide')
    }
}

function swapItems(from, to) {
    let fromItem = responceArr.find(({position}) => position == from)
    let toItem = responceArr.find(({position}) => position == to)

    if(dragEndIndex) {
        localStorage.removeItem('userOrders')
        responceArr = null
        ordersReq(`edit/dragAndDrop`, "POST", JSON.stringify({firstId: fromItem._id, secondId: toItem._id, first: fromItem.position, second: toItem.position}))
    }
}

function dragStart() {
    dragStartIndex = this.getAttribute('id')
}

function dragOver(e) {
    e.preventDefault()
}

function dragEnter() {
    this.classList.add('over')
}

function dragDdrop() {
    dragEndIndex = this.getAttribute('id')
    swapItems(dragStartIndex, dragEndIndex)

    this.classList.remove('over')
}

function dragLeave() {
    this.classList.remove('over')
}

function addEventListeners() {
    const draggables = document.querySelectorAll('.item')
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', dragStart)
        draggable.addEventListener('dragover', dragOver)
        draggable.addEventListener('dragenter', dragEnter)
        draggable.addEventListener('drop', dragDdrop)
        draggable.addEventListener('dragleave', dragLeave)
    })
}


getList()