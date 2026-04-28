import Axios from "axios";

export const connect = Axios.create({
  //baseURL: process.env.API_BASE_URL,
  headers: {
    "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    "x-rapidapi-host": process.env.RAPIDAPI_HOST,
    Accept: "application/json",
    "x-correlator": "b4333c46-49c0-4f62-80d7-f0ef930f1c46",
  },
  withCredentials: true,
  //withXSRFToken: true,
});

export default connect;
