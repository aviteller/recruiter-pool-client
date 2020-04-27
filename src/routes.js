import Cookies from "./Cookies";
import Home from "./components/Home.svelte";
import Login from "./components/Login.svelte";
import Register from "./components/Register.svelte";
import NotFound from "./components/NotFound.svelte";
import AccessDenied from "./components/AccessDenied.svelte";
import Users from "./components/Users.svelte";
import EditUser from "./components/EditUser.svelte";

let c = new Cookies();

const userLoggedIn = () => {
  let jwt;
  // console.log(c.getCookie("user-token"))
  if ((jwt = c.getCookie("user-jwt"))) {
    return true;
  } else return false;
};

const authorized = (...roles) => {
  if (
    roles.includes(
      c.getCookie("user-jwt") && JSON.parse(c.getCookie("user-jwt")).role
    )
  )
    return true;
  else return false;
};

let routes;
const urlParams = new URLSearchParams(window.location.search);

if (!urlParams.has("routemap")) {
  routes = {
    "/": userLoggedIn() ? Home : Login,
    "/home/:mode?": userLoggedIn() ? Home : Login,
    "/login": Login,
    "/register": Register,
    "/users": userLoggedIn && authorized("admin") ? Users : AccessDenied,
    "/users/:id": userLoggedIn() ? EditUser : Login,
    // "/eatenmeal/:id": userLoggedIn() ? EditEatenMeal : Login,
    // "/person/:id": userLoggedIn() ? EditPerson : Login,
    "*": NotFound,
  };
}

export default routes;
