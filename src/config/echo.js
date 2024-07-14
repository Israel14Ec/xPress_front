import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;
const echoConfig = {
    broadcaster: 'pusher',
    key: 'miAppKeyProd', // Puede ser cualquier string ya que no estamos usando Pusher
    wsHost: 'xpressback-production.up.railway.app', // Apunta a tu dominio de WebSockets
    wsPort: 6001, // Puerto del servidor WebSockets
    wssPort: 6001, // Puerto seguro del servidor WebSockets
    forceTLS: false, // Usa false si no estás usando SSL
    disableStats: true,
    enabledTransports: ['ws', 'wss'], // Solo habilitar WebSocket
};

window.Echo = new Echo(echoConfig);

export default window.Echo;
