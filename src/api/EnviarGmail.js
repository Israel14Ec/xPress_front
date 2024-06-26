// Importa el objeto Axios configurado desde "../config/axios"
import api from "../config/axios";

// Define la función para enviar la respuesta al servidor
const enviarRespuesta = async (selectedMessage, from, subject, replyContent, closeReplyModal) => {
    try {
        // Construye el objeto de datos para enviar al servidor
        const data = {
            
            to: from,
            subject: subject,
            content: replyContent,
            // Puedes agregar otros parámetros que necesites enviar al servidor
        };

        // Realiza la solicitud POST al servidor utilizando el objeto Axios configurado
        const response = await api.post('/gmail/send-reply', data, {
            withCredentials: true, // Para enviar cookies y permitir CORS
            headers: {
                'Content-Type': 'application/json', // Especifica el tipo de contenido JSON
                'Access-Control-Allow-Origin': import.meta.env.VITE_GMAIL_CORS // Especifica el origen permitido para CORS
            }
        });

        // Maneja la respuesta del servidor si es necesario
        console.log('Respuesta del servidor:', response.data);
    } catch (error) {
        // Maneja cualquier error que ocurra durante la solicitud
        throw error;
    }
};

// Exporta la función enviarRespuesta para que pueda ser utilizada en otros archivos
export default enviarRespuesta;
