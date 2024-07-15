import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const token = localStorage.getItem('AUTH_TOKEN');
console.log(token);

const echoConfig = {
    broadcaster: 'pusher',
    key: 'miAppKeyProd',  // Este puede ser cualquier string ya que no estamos usando Pusher
    wsHost: 'xpressback-production.up.railway.app', // Apunta a tu dominio de WebSockets
    wsPort: 6001, // Puerto del servidor WebSockets
    wssPort: 6001, // Puerto seguro del servidor WebSockets
    forceTLS: true, // Usa true si estás usando SSL, false de lo contrario
    disableStats: true,
    cluster: 'mt1', // Puedes omitir esto si no usas Pusher
    enabledTransports: ['ws', 'wss'], // Solo habilitar WebSocket
    authEndpoint: 'https://xpressback-production.up.railway.app/broadcasting/auth', // Cambia a tu endpoint de autenticación
    auth: {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    },
};

const echoInstance = new Echo(echoConfig);

export default echoInstance;
