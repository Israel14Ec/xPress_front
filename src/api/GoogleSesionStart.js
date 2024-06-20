import api from "../config/axios";

export default {
  redirectToGoogle() {
    const url = '/google/auth'; // URL de la solicitud

    return api.get(url, { withCredentials: true });
  }
}
