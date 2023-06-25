// SIGN UP PAGE

$signUpForm = document.querySelector('.sign-form')

$signUpForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const firstName = $signUpForm.elements.firstName.value
  const surname = $signUpForm.elements.surname.value
  const email = $signUpForm.elements.email.value
  const password = $signUpForm.elements.password.value

  // console.log(firstName, surname, email, password)

  const response = fetch(`users/signup`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ firstName, surname, email, password })
  })

  const data = await (await response).json()
  const dataResponse = await response

  console.log(data)
  console.log(dataResponse)

  if (dataResponse.status === 201) {
    localStorage.setItem('keyData', `${data.token}`) // use process.env on the key
    $signUpForm.elements.firstName.value = ''
    $signUpForm.elements.surname.value = ''
    $signUpForm.elements.email.value = ''
    $signUpForm.elements.password.value = ''
    return window.location.href = '/continue'
  }


  // you must throw errors if either of the email and password or both have issues.
})