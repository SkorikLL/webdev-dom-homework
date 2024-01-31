import { login, setToken, setUserName } from './api.js'
import { renderUsers } from './userPage.js'

export const renderLogin = () => {
    const appElement = document.getElementById('app')
    const loginHtml = `
  <ul class="comments"></ul>
      <div class="formAuthorization">    
    <h1>Страница входа</h1>
    <div class="form">
        <h3 class="form-title">Форма входа</h3>
        <div class="form-row ">
            <input type="text" id="login-input" class="input add-form-name" placeholder="Введите логин" />
            <input type="password" id="password-input" class="input add-form-name" placeholder="Введите пароль" />
        </div>
        <br />
        <button class="add-form-button" id="login-button">Войти</button>
    </div>
    </div>`

    appElement.innerHTML = loginHtml

    const formAuthorizationElement =
        document.querySelector('.formAuthorization')
    const buttonElement = document.getElementById('login-button')
    const loginInputElement = document.getElementById('login-input')
    const passwordInputElement = document.getElementById('password-input')

    buttonElement.addEventListener('click', () => {
        if (
            (loginInputElement.value === '') &
            (passwordInputElement.value === '')
        ) {
            loginInputElement.classList.add('error')
            passwordInputElement.classList.add('error')
            return
        } else if (loginInputElement.value === '') {
            loginInputElement.classList.add('error')
            return
        } else if (passwordInputElement.value === '') {
            passwordInputElement.classList.add('error')
            return
        } else {
            buttonElement.disabled = true
            buttonElement.textContent = 'Элемент добавляется...'
        }
        login({
            login: loginInputElement.value,
            password: passwordInputElement.value,
        })
            .then((responseData) => {
                setToken(responseData.user.token)
                setUserName(responseData.user.name)
            })
            .then(() => {
                buttonElement.disabled = false
                buttonElement.textContent = 'Войти'
                formAuthorizationElement.classList.add('hidden')

                renderUsers()
            })
            .catch((error) => {
                buttonElement.disabled = false
                buttonElement.textContent = 'Войти'

                //TODO: Отправлять в систему сбора ошибок
                console.warn(error)
                if (error.message === 'Неверный пароль или логин!') {
                    alert('Вы ввели неверный логин или пароль')
                }
            })
    })
}
