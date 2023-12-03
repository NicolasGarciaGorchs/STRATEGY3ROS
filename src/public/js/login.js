const loginForm = document.getElementById('loginForm')
const responseLogin = document.getElementById('responseLogin')

loginForm.addEventListener('submit', async e => {
    try {
        e.preventDefault()

    const data = {} // array vacio de users
    const formData = new FormData(loginForm)

    formData.forEach((value, key) => (data[key]= value ))

    


    const response = await fetch('/auth/login', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data),
    })

    const newSession = await response.json()

    responseLogin.innerText = `${newSession.payload}`
    } catch(error) {
    responseLogin.innerText = `Hay un error ${error}`
    }   
})    