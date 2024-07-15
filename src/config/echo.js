import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const token = localStorage.getItem('AUTH_TOKEN');
console.log(token);

const echoConfig = {
    broadcaster: 'pusher',
    key: "df03ae27a8fe092e5efa",
    cluster: 'mt1',
    encrypted: true,
    authEndpoint: 'https://xpressback-production.up.railway.app/broadcasting/auth',
    auth: {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
};

const echoInstance = new Echo(echoConfig);

export default echoInstance;
