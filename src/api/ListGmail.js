
import api from "../config/axios";

export default {
  listMessages() {
    return api.get('gmail/list-messages', { withCredentials: true, responseType: 'json' });
  }
}
