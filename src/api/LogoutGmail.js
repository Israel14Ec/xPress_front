// services/GmailService.js
import api from "../config/axios";

export default {
  logoutGmail() {
    return api.get('/gmail/logout', { withCredentials: true});
  }
}
