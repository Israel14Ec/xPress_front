import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const token = localStorage.getItem('AUTH_TOKEN');
console.log(token);

const echoConfig = {
    broadcaster: 'pusher',
    key: 'df03ae27a8fe092e5efa',
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
