const socket = io()


// elements
const messageForm = document.querySelector('#message-form')
const messageFormInput = document.querySelector('input')
const messageFormButton = document.querySelector('#submit-button')
const locationButton = document.querySelector('#send-location')
const messages = document.querySelector('#messages')

// templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
// options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message ele
    const newMessage = messages.lastElementChild

    // height of the new message
    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)

    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    // visible height
    const visibleHeight = messages.offsetHeight

    // Height of messages container
    const containerHeight = messages.scrollHeight

    // how far have i scrolled down
    const scrollOffset = messages.scrollTop + visibleHeight


    if (Math.round(containerHeight - newMessageHeight - 5) <= Math.ceil(scrollOffset)) {
        messages.scrollTop = messages.scrollHeight
    }

}
socket.on('locationMessage', (urlObj) => {
    const html = Mustache.render(locationTemplate, {
        username: urlObj.username,
        url: urlObj.url,
        createdAt: moment(urlObj.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})


socket.on('position', (position) => {
    console.log('Location:', position)
})

messageForm.addEventListener('submit', (e) =>{
    e.preventDefault()

    messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        messageFormButton.removeAttribute('disabled')
        messageFormInput.value = ''
        messageFormInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log('Message delivered')
    })
})

locationButton.addEventListener('click', () => {
    locationButton.setAttribute('disabled', 'disabled')
    if (!navigator.geolocation)  {
        return alert('geolocation not supported by browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendPosition', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            locationButton.removeAttribute('disabled')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})