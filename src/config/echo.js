import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const token = localStorage.getItem('AUTH_TOKEN')
console.log(token)
const echoConfig = {
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_KEY, 
    wsHost: window.location.hostname, 
    wsPort: 6001, 
    forceTLS: false, 
    disableStats: true,
    cluster: 'mt1',
    authEndpoint: 'http://localhost:8000/broadcasting/auth',
    auth: {
        headers: {
             Authorization: `Bearer ${token}`,
         }
    }
};


const echoInstance = new Echo(echoConfig);

export default echoInstance;
