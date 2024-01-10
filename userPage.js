import { getTodos } from "/api.js";

//Объект
let users = [];
const date = new Date();
const listCommentsElements = document.querySelector(".comments");
const commentInputElement = document.querySelector(".add-form-text"); // пользователь вводить свой комментарий

//Делаем запрос в сервер API метод GET
export function fetchPromiseGet() {
  return getTodos().then((responseData) => {
    const appComments = responseData.comments.map((comment) => {
      return {
        name: comment.author.name,
        id: comment.id,
        time: new Date(comment.date),
        comment: comment.text,
        quantityLike: comment.likes,
        isLike: false,
      };
    });
    users = appComments;
    renderUsers();
  });
}

//Добавить обработку клика значка "Комментарий" (Пользовать сможет ответить на комментарий)
function userClickComment() {
  const allComments = document.querySelectorAll(".comment");
  for (const comment of allComments) {
    comment.addEventListener("click", () => {
      const index = comment.dataset.index;
      const textElementContent = users[index].comment;
      commentInputElement.value = `> ${textElementContent}\n ${users[index].name}\n`;
    });
  }
}

//Добавить обработку клика значка "Like"
function userClickLike() {
  const allButtonLikes = document.querySelectorAll(".like-button");
  for (const buttonLike of allButtonLikes) {
    buttonLike.addEventListener("click", (event) => {
      event.stopPropagation(); //останавливает всплытие события вверх по дереву.
      const index = buttonLike.dataset.index;
      if (users[index].isLike === false) {
        users[index].quantityLike++;
        users[index].isLike = true;
      } else {
        users[index].quantityLike--;
        users[index].isLike = false;
      }
      renderUsers();
    });
  }
}

export const renderUsers = () => {
  //const appElement = document.getElementById("app");

  const userHTML = users
    .map((user, index) => {
      return `<li data-index="${index}" class="comment">
        <div class="comment-header">
          <div>${user.name}</div>
          <div>${user.time.getDate()}.${
        user.time.getMonth() + 1
      }.${user.time.toLocaleDateString("ru-RU", {
        year: "2-digit",
      })} ${user.time.getHours()}:${user.time.getMinutes()}</div>
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
        user.isLike ? "-active-like" : ""
      }"></button>
          </div>
        </div>
      </li>`;
    })
    .join("");

  //   const appHtml = `
  //       <div class="container">
  //     <span class="loadingText"></span>
  //     <ul class="comments">${userHTML}
  //       //список рендерится из JS
  //     </ul>
  //     <span class="loadingTextForm"></span>
  //     <div class="add-form">

  //       <input type="text" class="add-form-name" placeholder="Введите ваше имя" />
  //       <textarea type="textarea" class="add-form-text" placeholder="Введите ваш комментарий" rows="4"></textarea>
  //       <div class="add-form-row">
  //         <button class="add-form-button">Написать</button>
  //         <button class="del-form-button">Удалить последний комментарий</button>
  //       </div>
  //     </div>
  //   </div>

  // `;
  //appElement.innerHTML = appHtml;
  listCommentsElements.innerHTML = userHTML;

  userClickComment();
  userClickLike();
};
