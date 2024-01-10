//import { renderLogin } from "./loginPage.js";
import { fetchPromiseGet, renderUsers } from "./userPage.js";
import { postTodos } from "/api.js";

// Код писать здесь
const nameInputElement = document.querySelector(".add-form-name"); // пользователь вводить свое имя
const commentInputElement = document.querySelector(".add-form-text"); // пользователь вводить свой комментарий
const buttonElement = document.querySelector(".add-form-button"); //кнопка "Написать"
const listCommentsElements = document.querySelector(".comments");
const buttonDel = document.querySelector(".del-form-button"); //кнопка "Удалить последний комментарий"
const loadingTextElement = document.querySelector(".loadingText");
const loadingTextFormElement = document.querySelector(".loadingTextForm");

//При первом запуске показывает сообщение "Пожалуйста подождите, загружаю комментарии.....", после того как наши комментарии загрузятся сообщение удаляется.
function fetchPromiseGetStart() {
  loadingTextElement.textContent =
    "Пожалуйста подождите, загружаю комментарии.....";
  fetchPromiseGet().then(() => {
    loadingTextElement.textContent = "";
  });
}

fetchPromiseGetStart();

//Добавить обработку клика кнопки "Написать"
buttonElement.addEventListener("click", () => {
  renderUsers();
  nameInputElement.classList.remove("error");
  commentInputElement.classList.remove("error");

  if ((nameInputElement.value === "") & (commentInputElement.value === "")) {
    nameInputElement.classList.add("error");
    commentInputElement.classList.add("error");
    //buttonElement.setAttribute('disabled', '');
    return;
  } else if (nameInputElement.value === "") {
    nameInputElement.classList.add("error");
    // buttonElement.setAttribute('disabled', '');
    return;
  } else if (commentInputElement.value === "") {
    commentInputElement.classList.add("error");
    //buttonElement.setAttribute('disabled', '');
    return;
  } else {
    //Отключаем кнопку и добавляем ей надпись "Элемент добавляется..." (нужно что бы пользователь не нажал на кнопку много раз)
    buttonElement.disabled = true;
    buttonElement.textContent = "Элемент добавляется...";
    //Добавляемся сообщение "Комментарий добавляется..."
    loadingTextFormElement.textContent = "Комментарий добавляется...";
    //Делаем запрос в сервер API метод POST
    postTodos(nameInputElement, commentInputElement)
      .then((responseData) => {
        return fetchPromiseGet();
      })
      .then((data) => {
        //После обработки всех данных включаем кнопку и убираем сообщение "Комментарий добавляется..."
        buttonElement.disabled = false;
        buttonElement.textContent = "Написать";
        loadingTextFormElement.textContent = "";
      }) //catch срабатывает при отклонений Promise
      // обработка упавшего интернета
      .catch((error) => {
        buttonElement.disabled = false;
        buttonElement.textContent = "Написать";

        //TODO: Отправлять в систему сбора ошибок
        console.warn(error);
        if (error.message === "Неверный запрос") {
          alert("Имя и комментарий должны быть не короче 3х символов");
        } else if (error.message === "Сервер сломался, попробуй позже") {
          alert("Сервер сломался, попробуй позже");
        } else {
          alert("Кажется, у вас сломался интернет, попробуйте позже");
        }
      });
    renderUsers();
  }

  if ((commentInputElement.value != "") & (nameInputElement.value != "")) {
    commentInputElement.classList.remove("error");
    return;
  }
});

//Добавить обработку клика кнопки "Удалить последний комментарий"
buttonDel.addEventListener("click", () => {
  const lastChildComment = listCommentsElements.lastElementChild;
  lastChildComment.remove();
  //fetchPromiseDel();
});
