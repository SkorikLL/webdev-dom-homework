import { renderLogin } from './loginPage.js'
import { getTodos, token, postTodos, userName } from '/api.js'
import { format } from 'date-fns'

//Объект
let users = []
const listCommentsElements = document.querySelector('.comments')

//При первом запуске показывает сообщение "Пожалуйста подождите, загружаю комментарии.....", после того как наши комментарии загрузятся сообщение удаляется.
export function fetchPromiseGetStart() {
    return fetchPromiseGet().then(() => {})
}

//Делаем запрос в сервер API метод GET
export function fetchPromiseGet() {
    return getTodos().then((responseData) => {
        const appComments = responseData.comments.map((comment) => {
            return {
                name: comment.author.name,
                id: comment.id,
                time: comment.date,
                comment: comment.text,
                quantityLike: comment.likes,
                isLike: false,
            }
        })
        users = appComments
        renderUsers()
    })
}

//Добавить обработку клика значка "Комментарий" (Пользовать сможет ответить на комментарий)
function userClickComment() {
    const allComments = document.querySelectorAll('.comment')

    const commentInputElement = document.querySelector('.add-form-text') // пользователь вводить свой комментарий

    for (const comment of allComments) {
        comment.addEventListener('click', () => {
            const index = comment.dataset.index
            const textElementContent = users[index].comment
            commentInputElement.value = `> ${textElementContent}\n ${users[index].name}\n`
        })
    }
}

//Добавить обработку клика значка "Like"
function userClickLike() {
    const allButtonLikes = document.querySelectorAll('.like-button')
    for (const buttonLike of allButtonLikes) {
        buttonLike.addEventListener('click', (event) => {
            event.stopPropagation() //останавливает всплытие события вверх по дереву.
            const index = buttonLike.dataset.index
            if (users[index].isLike === false) {
                users[index].quantityLike++
                users[index].isLike = true
            } else {
                users[index].quantityLike--
                users[index].isLike = false
            }
            renderUsers()
        })
    }
}

export const renderUsers = () => {
    const appHTML = document.getElementById('app')
    const userHTML = users
        .map((user, index) => {
            const now = new Date(user.time)
            const createDate = format(now, 'yyyy-MM-dd hh.mm.ss')
            return `
      <li data-index="${index}" class="comment">
            <div class="comment-header">
              <div>${user.name}</div>
               <div>${createDate}</div>
            </div>
            <div class="comment-body">
              <div class="comment-text">
                ${user.comment}
              </div>
            </div>
            <div class="comment-footer">
              <div class="likes">
                <span data-index="${index}" class="likes-counter">${
                    user.quantityLike
                }</span>
                <button data-index="${index}" class="like-button ${
                    user.isLike ? '-active-like' : ''
                }"></button>
              </div>
            </div>
          </li>          
          `
        })
        .join('')

    const formHtml = `
  <div class="add-form">
                      <input
                        type="text"
                        class="add-form-name"
                        placeholder="Введите ваше имя" value="${userName}" disabled
                      />
                      <textarea
                        type="textarea"
                        class="add-form-text"
                        placeholder="Введите ваш комментарий"
                        rows="4"
                      ></textarea>
                      <div class="add-form-row">
                        <button class="add-form-button">Написать</button>
                        <button class="del-form-button">
                          Удалить последний комментарий
                        </button>
                      </div>
                
              `

    appHTML.innerHTML = `
  <ul class="comments">${userHTML}</ul>
  <span class="loadingAddComment"></span>
  ${
      token
          ? formHtml
          : '<span class="loadingTextForm">Что бы добавить комментарий, <b class="authTextForm">авторизуйтесь</b></span>'
  }
  `

    function openLogin() {
        if (token) {
            return
        }
        const authTextFormElement = document.querySelector('.authTextForm')

        authTextFormElement.addEventListener('click', () => {
            renderLogin()
        })
    }

    openLogin()
    userClickComment()
    userClickLike()
    userClickDel()

    function userClickDel() {
        if (!token) {
            return
        }
        const buttonDel = document.querySelector('.del-form-button') //кнопка "Удалить последний комментарий"
        const nameInputElement = document.querySelector('.add-form-name') // пользователь вводить свое имя
        const commentInputElement = document.querySelector('.add-form-text') // пользователь вводить свой комментарий
        const buttonElement = document.querySelector('.add-form-button') //кнопка "Написать"
        const loadingAddCommentElement =
            document.querySelector('.loadingAddComment')

        buttonElement.addEventListener('click', () => {
            renderUsers()
            nameInputElement.classList.remove('error')
            commentInputElement.classList.remove('error')

            if (
                (nameInputElement.value === '') &
                (commentInputElement.value === '')
            ) {
                nameInputElement.classList.add('error')
                commentInputElement.classList.add('error')
                //buttonElement.setAttribute('disabled', '');
                return
            } else if (nameInputElement.value === '') {
                nameInputElement.classList.add('error')
                // buttonElement.setAttribute('disabled', '');
                return
            } else if (commentInputElement.value === '') {
                commentInputElement.classList.add('error')
                //buttonElement.setAttribute('disabled', '');
                return
            } else {
                //Отключаем кнопку и добавляем ей надпись "Элемент добавляется..." (нужно что бы пользователь не нажал на кнопку много раз)
                buttonElement.disabled = true
                buttonElement.textContent = 'Элемент добавляется...'
                //Добавляемся сообщение "Комментарий добавляется..."
                loadingAddCommentElement.textContent =
                    'Комментарий добавляется...'
                //Делаем запрос в сервер API метод POST
                postTodos(nameInputElement, commentInputElement)
                    .then(() => {
                        return fetchPromiseGet()
                    })
                    .then(() => {
                        //После обработки всех данных включаем кнопку и убираем сообщение "Комментарий добавляется..."
                        buttonElement.disabled = false
                        buttonElement.textContent = 'Написать'
                        loadingAddCommentElement.textContent = ''
                    }) //catch срабатывает при отклонений Promise
                    // обработка упавшего интернета
                    .catch((error) => {
                        buttonElement.disabled = false
                        buttonElement.textContent = 'Написать'

                        //TODO: Отправлять в систему сбора ошибок
                        console.warn(error)
                        if (error.message === 'Неверный запрос') {
                            alert('Имя и комм. должны быть не короче 3х симв.')
                        } else if (
                            error.message === 'Сервер сломался, попробуй позже'
                        ) {
                            alert('Сервер сломался, попробуй позже')
                        } else {
                            alert('У вас сломался интернет, попробуйте позже')
                        }
                    })
                renderUsers()
            }

            if (
                (commentInputElement.value !== '') &
                (nameInputElement.value !== '')
            ) {
                commentInputElement.classList.remove('error')
                return
            }
        })

        //Добавить обработку клика кнопки "Удалить последний комментарий"
        buttonDel.addEventListener('click', () => {
            const lastChildComment = listCommentsElements.lastElementChild
            lastChildComment.remove()
            //fetchPromiseDel();
        })
    }
}
