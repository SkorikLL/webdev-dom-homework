const host = "https://wedev-api.sky.pro/api/v2/:leonid-skorik/comments";
const userURL = "https://wedev-api.sky.pro/api/user/login";

//export let token = "asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k";
export let token = localStorage.getItem("token");
export const setToken = (newToken) => {
  token = newToken;
  localStorage.setItem("token", token);
};

export let userName = localStorage.getItem("userName");
export const setUserName = (newUserName) => {
  userName = newUserName;
  localStorage.setItem("userName", userName);
};

export function getTodos() {
  return fetch(host, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    if (response.status === 200) {
      console.log(response);
      return response.json();
    } else if (response.status === 401) {
      // password = prompt("Введите верный пароль");
      //renderUsers();
      throw new Error("Нет авторизации");
    }
  });
}

//!
export function deleteTodos() {
  return fetch(host + user.id, {
    method: "DELETE",
  }).then((response) => {
    return response.json();
  });
}

export function postTodos(nameInputElement, commentInputElement) {
  return fetch(host, {
    method: "POST",
    body: JSON.stringify({
      name: nameInputElement.value,
      text: commentInputElement.value,
      date: new Date(),
      likes: 0,
      isLike: false,
      //POST-запрос будет в половине случаев отвечать 500-й ошибкой, если в теле запроса передать параметр forceError: true
      //forceError: true,
    }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    console.log(response);
    //201 успешный сценарий
    if (response.status === 201) {
      return response.json();
    } else if (response.status === 400) {
      throw new Error("Неверный запрос");
    } else if (response.status === 500) {
      throw new Error("Сервер сломался, попробуй позже");
    } else if (response.status === 401) {
      // password = prompt("Введите верный пароль");
      //renderUsers();
      throw new Error("Нет авторизации POST");
    } else {
      //Код который обработает ошибку
      //1 способ через throw new Error()
      throw new Error("Сервер упал");
      //2 способ через Promise.reject()
      //return Promise.reject('Сервер упал');
    }
  });
}

export function login({ login, password }) {
  return fetch(userURL, {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    console.log(response);
    //201 успешный сценарий
    if (response.status === 201) {
      return response.json();
    } else if (response.status === 400) {
      throw new Error("Неверный пароль или логин!");
    } else if (response.status === 500) {
      throw new Error("Сервер сломался, попробуй позже");
    } else if (response.status === 401) {
      // password = prompt("Введите верный пароль");
      //renderUsers();
      throw new Error("Нет авторизации POST");
    } else {
      //Код который обработает ошибку
      //1 способ через throw new Error()
      throw new Error("Сервер упал");
      //2 способ через Promise.reject()
      //return Promise.reject('Сервер упал');
    }
  });
}
