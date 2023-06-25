// LOG IN PAGE

const $loginForm = document.querySelector('.cta-form')

$loginForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = $loginForm.elements.email.value
  const password = $loginForm.elements.password.value

  const response = fetch(`home`, { // change == hosting
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })

  const data = await (await response).json()
  const dataResponse = await response

  if (dataResponse.status === 200) {
    localStorage.setItem('keyData', `${data.token}`)
    $loginForm.elements.email.value = ''
    $loginForm.elements.password.value = ''
    return window.location.href = '/continue'
  }
})
