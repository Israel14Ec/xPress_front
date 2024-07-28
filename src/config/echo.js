import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

export function initEcho() {
    
    const token = localStorage.getItem('AUTH_TOKEN');

    if (window.echoInstance) {
        window.echoInstance.disconnect();
    }

    const echoConfig = {
        broadcaster: 'pusher',
        key: import.meta.env.VITE_PUSHER_KEY,
        cluster: import.meta.env.VITE_CLUSTER,
        encrypted: true,
        authEndpoint: import.meta.env.VITE_AUTH_ENDPOINT,
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    };

    window.echoInstance = new Echo(echoConfig);
    handleGlobalEvents();
    return window.echoInstance
}


//Maneja la reconexión
function handleGlobalEvents() {
    window.echoInstance.connector.pusher.connection.bind('connected', () => {
        console.log('Successfully connected to WebSocket.');
    });

    window.echoInstance.connector.pusher.connection.bind('disconnected', () => {
        console.warn('Disconnected from WebSocket, attempting to reconnect...');
        initEcho()
    });
}

//Desconectar laravel echo
export function disconnectEcho() {
    window.echoInstance.disconnect()
    console.log('Disconnected from Echo.');
}
