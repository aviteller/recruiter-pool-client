import Cookies from "./Cookies";
import globalConfig from "./config";
let c = new Cookies();

export let cookieUser = c.getCookie("user-jwt")
  ? {
      id: JSON.parse(c.getCookie("user-jwt")).id,
      name: JSON.parse(c.getCookie("user-jwt")).name,
      token: JSON.parse(c.getCookie("user-jwt")).token,
    }
  : {};

export const mealTypeToString = (mealType) => {
  let mealReturn = mealTypeOptions.filter((meal) => meal.id == mealType);
  return mealReturn[0].text;
};


export const convertDateToAge = (dateString, returnString = true) => {
  if (!dateString) return 0;
  let firstDate = new Date(dateString);
  let diff = new Date(new Date() - firstDate);
  if (returnString) {
    return `${
      diff.toISOString().slice(0, 4) - 1970
    } years and ${diff.getMonth()} months`;
  } else {
    return diff;
  }
};

export const convertDateToString = (date) => {
  let options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  let dateThing = new Date(date);

  return dateThing.toLocaleDateString("en-UK", options);
};

export const waitFor = (ms) => new Promise((s) => setTimeout(s, ms));

export const customFetch = (endPoint, { body, ...customConfig } = {}) => {

  let authHeader = "";

  if(authHeader = c.getCookie('user-jwt')) {
    authHeader = `Bearer ${JSON.parse(authHeader).token}`;
  }

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if(authHeader != "" ) {
    headers.Authorization = authHeader
  }

  const config = {
    method: body ? "POST" : "GET",
    credentials: "include",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return window.fetch(globalConfig.apiUrl + endPoint, config).then(async (res) => {
    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      return Promise.reject(data);
    }
  });
};
export const customFetchFileUpload = (endPoint, { body, ...customConfig } = {}) => {

  let authHeader = "";

  if(authHeader = c.getCookie('user-jwt')) {
    authHeader = `Bearer ${JSON.parse(authHeader).token}`;
  }

  const headers = {
    // Accept: "application/json",
    // "Content-Type": "application/json",
  };

  if(authHeader != "" ) {
    headers.Authorization = authHeader
  }

  const config = {
    method: body ? "POST" : "GET",
    credentials: "include",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = body;
  }

  return window.fetch(globalConfig.apiUrl + endPoint, config).then(async (res) => {
    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      return Promise.reject(data);
    }
  });
};
