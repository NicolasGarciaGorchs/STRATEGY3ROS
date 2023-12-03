const registerForm = document.getElementById('registerForm')
const responseRegister = document.getElementById('responseRegister')

registerForm.addEventListener('submit', async e => {
    try {
        e.preventDefault()

    const data = {} // array vacio de users
    const formData = new FormData(registerForm)

    formData.forEach((value, key) => (data[key]= value ))

    const response = await fetch('/auth/register', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data),
    })
    const newUser = await response.json()

    responseRegister.innerText = `El nuevo usuario tiene id: ${newUser.payload._id}`
    } catch(error) {
    responseRegister.innerText = `Hay un error ${error}`
    }   
})    
