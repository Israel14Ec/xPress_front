
import api from "../config/axios";

export default {
  listMessagesSent() {
    return api.get('/gmail/sent-messages', { withCredentials: true, responseType: 'json' });
  }
}
