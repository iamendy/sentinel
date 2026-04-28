import Axios from "axios";

export const connect = Axios.create({
  //baseURL: process.env.API_BASE_URL,
  headers: {
    "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    "x-rapidapi-host": process.env.RAPIDAPI_HOST,
    Accept: "application/json",
  },
  withCredentials: true,
  //withXSRFToken: true,
});

export default connect;
