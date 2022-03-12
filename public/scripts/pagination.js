'use strict'

let lis = document.querySelectorAll('li.page-item')
const nextLi = lis[lis.length - 1]
const prevLi = lis[0]

function formSubmit(path, params, method) {
  const form = document.createElement('form')
  form.method = method
  form.action = path

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input')
      hiddenField.type = 'hidden'
      hiddenField.name = key
      hiddenField.value = params[key]

      form.appendChild(hiddenField)
    }
  }

  document.body.appendChild(form)
  form.submit()
}

for (let i = 1; i < lis.length - 1; i++) {
  lis[i].addEventListener('click', (event) => {
    event.preventDefault()
    formSubmit(submitRoute, { page: lis[i].id }, 'get')
  })
}
prevLi.addEventListener('click', (event) => {
  const activeLi = document.querySelector('.active')
  event.preventDefault()
  if (prevLi.classList.contains('disabled')) {
    prevLi.style.pointerEvents = 'none'
  } else {
    formSubmit(submitRoute, { page: parseInt(activeLi.id) - 1 }, 'get')
  }
})
nextLi.addEventListener('click', (event) => {
  const activeLi = document.querySelector('.active')
  event.preventDefault()
  if (nextLi.classList.contains('disabled')) {
    nextLi.style.pointerEvents = 'none'
  } else {
    formSubmit(submitRoute, { page: parseInt(activeLi.id) + 1 }, 'get')
  }
})
