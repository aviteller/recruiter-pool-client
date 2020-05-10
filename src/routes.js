import Cookies from "./Cookies";
import Home from "./components/Home.svelte";
import Login from "./components/Login.svelte";
import Register from "./components/Register.svelte";
import NotFound from "./components/NotFound.svelte";
import AccessDenied from "./components/AccessDenied.svelte";
import Users from "./components/admin/Users.svelte";
import ChatRooms from "./components/admin/ChatRooms.svelte";
import ChatRoom from "./components/ChatRoom.svelte";
import Companies from "./components/admin/Companies.svelte";
import EditUser from "./components/admin/EditUser.svelte";
import EditCompany from "./components/admin/EditCompany.svelte";
import EditJob from "./components/admin/EditJob.svelte";

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
  ) {
    return true;
  } else {
    return false;
  }
};

let routes;
const urlParams = new URLSearchParams(window.location.search);

if (!urlParams.has("routemap")) {
  routes = {
    "/": userLoggedIn() ? Home : Login,
    "/home/:mode?": userLoggedIn() ? Home : Login,
    "/login": Login,
    "/register": Register,
    "/admin/users": userLoggedIn && authorized("admin") ? Users : AccessDenied,
    "/room/:slug": userLoggedIn() ? ChatRoom : AccessDenied,
    "/admin/companies":
      userLoggedIn && authorized("admin") ? Companies : AccessDenied,
    "/admin/users/:id":
      userLoggedIn() && authorized("admin") ? EditUser : Login,
    "/admin/companies/:id":
      userLoggedIn() && authorized("admin") ? EditCompany : Login,
    "/admin/jobs/:id": userLoggedIn() && authorized("admin") ? EditJob : Login,
    "/admin/chatrooms":
      userLoggedIn() && authorized("admin") ? ChatRooms : Login,
    "*": NotFound,
  };
}

export default routes;
