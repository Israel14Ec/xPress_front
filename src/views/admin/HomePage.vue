<template>
  <div class="max-w-[95%] mb-16 mx-auto bg-white h-screen p-5 rounded-lg">
    <!-- Modal de éxito o error -->
    <div class="modal" v-if="successMessage || errorMessage">
      <div class="modal-content">
        <span class="close" @click="closeMessage">&times;</span>
        <p v-if="successMessage">¡Respuesta enviada con éxito!</p>
        <p v-if="errorMessage">Error: {{ errorMessage }}</p>
      </div>
    </div>

    <div class="flex flex-col md:flex-row justify-between items-center ">
      <div class="flex flex-row gap-3 items-center">
        <img src="/GmailIcon.png" alt="icono de gmail" class="h-7">
        <h2 class="text-xl text-gray-700 font-semibold">Correo Gmail</h2>
      </div>

      <!-- Botones de acción -->
      <div v-if="!loggedIn">
        <div class="btn-container">
          <ButtonBlack v-if="NewMessage" class="text-white hover:bg-gray-500 bg-gray-700" @click="openSentModal">
            <ChatBubbleOvalLeftIcon />
            <template #text>Nuevo mensaje</template>
          </ButtonBlack>

          <ButtonBlack v-if="NewMessage" class="text-white hover:bg-red-400 bg-red-500" @click="logout">
            <ArrowLeftOnRectangleIcon />
            <template #text>Cerrar sesión</template>
          </ButtonBlack>

        </div>
      </div>
    </div>


    <!-- Contenedor de mensajes -->
    <div v-if="!loading">
      <div class="messages-container" v-if="!NoLogged">
        <div class="messages-selection">
          <div class="flex flex-row gap-5 cursor-pointer">

            <div :class="[
              'text-sm hover:border-b-2 hover:border-blue-500 inline-block',
              MensajeEnviado ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'
              ]" 
              @click="fetchMessages"
            >
              <p>Recibidos</p>
            </div>

            <div :class="[
              'text-sm hover:border-b-2 hover:border-blue-500 inline-block',
              !MensajeEnviado ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'
              ]" 
              @click="fetchMessagesSent"
            >
                  Enviados
            </div>
          </div>
        </div>

        <!-- Buscador -->
        <input type="text" v-model="searchQuery" placeholder="Buscar mensajes..." class="search-input">
        <br>
        <br>
        <!-- Lista de mensajes -->
        <ul class="message-list" v-if="filteredMessages.length > 0">
          <li v-for="(message, index) in filteredMessages" :key="index" class="message-item">
            <div class="message-details" @click="openMessageModal(message)">
              <div class="message-from">De: {{ message.from }}</div>
              <div class="message-from">Para: {{ message.to || 'Mi' }}</div>
              <div class="message-subject">{{ message.subject }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Mensaje de carga -->
    <div v-if="loading" class="text-center">
      <Spinner />
    </div>

    <!--Mensaje de no inicio de sesión-->
    <div v-if="NoLogged">
      <div class="md:w-1/2 shadow-2xl rounded-lg px-7 py-5 mx-auto">
        <h3 class="font-semibold text-lg mb-5">Inició de sesión</h3>
        <p class="">Para ver la bandeja de entrada de gmail inicié sesión, con su cuenta de google</p>
        <div class="flex justify-center">
          <ButtonBlack class="text-white hover:bg-gray-500 bg-gray-700" @click="login">
            <UserCircleIcon />
            <template #text>Iniciar sesión</template>
          </ButtonBlack>
        </div>

      </div>
    </div>
  </div>

  <div class="modal" v-if="messageModal">
    <div class="modal-content">
      <div class="modal-header">
        <span class="close" @click="closeMessageModal">&times;</span>
        <h2>{{ selectedMessage.subject }}</h2>
      </div>
      <div class="modal-body">
        <p><strong>De: {{ selectedMessage.from }}</strong></p>
        <p><strong>Para: {{ selectedMessage.to || 'Mi' }}</strong></p>
        <p>{{ selectedMessage.snippet }}</p>
      </div>
      <div class="modal-footer">
        <button v-if="MensajeEnviado" @click="openReplyModal" class="btn btn-primary">Responder</button>
      </div>
    </div>
  </div>
  <!-- Modal para responder al mensaje -->
  <div class="modal" v-if="replyModal">
    <div class="modal-content">
      <span class="close" @click="closeReplyModal">&times;</span>
      <h4>Responder al mensaje de: </h4>
      <div class="modal-body">
        <p><strong>{{ selectedMessage.from }}</strong></p>

        <p>{{ selectedMessage.subject }}</p>
        <p>{{ selectedMessage.snippet }}</p>
      </div>
      <textarea v-model="replyContent" rows="5" placeholder="Escribe tu respuesta aquí..."
        class="reply-textarea"></textarea>
      <button @click="sendReply" class="btn btn-primary">Enviar</button>
    </div>
  </div>
  <!-- Modal para enviar mesaje -->
  <div class="modal" v-if="SentModal">
    <div class="modal-content">
      <span class="close" @click="closeSentModal">&times;</span>
      <h4>Enviar mensaje </h4>
      <div class="modal-body">

        <input class="search-input" type="text" v-model="from" placeholder="Correo del remitente">

        <input class="search-input" type="text" v-model="subject" placeholder="Asunto del mensaje">
      </div>
      <textarea v-model="replyContent" rows="5" placeholder="Escribe tu mesaje aquí..."
        class="reply-textarea"></textarea>

      <button @click="sendReply" class="btn btn-primary">Enviar</button>
    </div>



  </div>

</template>


<script setup>

import { ref, onMounted, computed } from 'vue';
import GmailService from '@/api/ListGmail.js';
import GmailLogin from '@/api/GoogleSesionStart.js';
import enviarRespuesta from '@/api/EnviarGmail.js';
import logoutGmail from '@/api/LogoutGmail.js';
import listMessagesEnv from '@/api/ListSentMessage.js';
import ButtonBlack from '../../components/ButtonBlack.vue'
import { ArrowLeftOnRectangleIcon, ChatBubbleOvalLeftIcon, UserCircleIcon } from '@heroicons/vue/24/solid'
import Spinner from '../../components/Spinner.vue'

const loggedIn = ref(false);
const messages = ref([]);
const searchQuery = ref('');
const selectedMessage = ref(null);
const replyContent = ref('');
const messageModal = ref(false);
const replyModal = ref(false);
const SentModal = ref(false);
const from = ref('');
const subject = ref('');
const successMessage = ref(false);
const NoLogged = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const NewMessage = ref(false);
const MensajeEnviado = ref(false);
const login = async () => {
  try {
    const response = await GmailLogin.redirectToGoogle();
    // Verificar si la respuesta es una URL
    if (response.data && typeof response.data.authUrl === 'string' && response.data.authUrl.startsWith('http')) {
      // Redirigir al usuario a la URL obtenida
      window.location.href = response.data.authUrl;
    } else {
      // Manejar cualquier otro tipo de respuesta (por ejemplo, si no es una URL)
      console.error('La respuesta no es una URL válida:', response);
    }
  } catch (error) {
    // Manejar cualquier error
    console.error(error);
  }
};



const logout = () => {
  logoutGmail.logoutGmail()
    .then(() => {
      window.location.reload(); // Recargar la página actual después de cerrar sesión
    })
    .catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
};


onMounted(async () => {

  await fetchMessages();
});

const fetchMessages = async () => {
  try {
    loading.value = true;
    const response = await GmailService.listMessages();
    loading.value = false;
    messages.value = response.data.messages;
    MensajeEnviado.value = true;
    NewMessage.value = true;
    NoLogged.value = false; // Cambia NoLogged a false si se cargaron mensajes correctamente
  } catch (error) {
    NoLogged.value = true;
    loading.value = false;

    console.error('Error al obtener los mensajes:', error);

  }
};

const handleFetchMessages = async () => {
  await fetchMessages();
};


const fetchMessagesSent = async () => {
  try {

    loading.value = true;
    const response = await listMessagesEnv.listMessagesSent();
    loading.value = false;
    messages.value = response.data.messages;
    MensajeEnviado.value = false;
    NewMessage.value = true;
    NoLogged.value = false; // Cambia NoLogged a false si se cargaron mensajes correctamente

  } catch (error) {
    console.error('Error al obtener los mensajes:', error);
    loading.value = false;
    NoLogged.value = true; // Mantiene NoLogged como true si hay un error al cargar mensajes

  }
};


// Filtrar los mensajes basados en el texto ingresado en el buscador
const filteredMessages = computed(() => {
  return messages.value.filter(message => {
    return message.subject.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      message.from.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

// Abrir modal para ver el mensaje completo
const openMessageModal = (message) => {
  selectedMessage.value = message;
  messageModal.value = true;
};

// Cerrar modal de ver mensaje completo
const closeMessageModal = () => {
  selectedMessage.value = null;
  messageModal.value = false;
};

// Abrir modal para responder al mensaje
const openReplyModal = () => {
  replyModal.value = true;
};

// Cerrar modal de responder al mensaje
const closeReplyModal = () => {
  replyContent.value = '';
  replyModal.value = false;
};

const openSentModal = () => {
  from.value = '';
  subject.value = '';
  SentModal.value = true;
};

// Cerrar modal de enviar al mensaje
const closeSentModal = () => {
  replyContent.value = '';
  SentModal.value = false; // Corregir aquí
};

// Enviar respuesta al mensaje
const sendReply = async () => {
  try {
    if (!replyContent.value.trim()) {
      console.error('El contenido de la respuesta está vacío.');
      return;
    }

    if (selectedMessage.value) {
      // Respondiendo a un mensaje existente
      const fromEmail = selectedMessage.value.from.match(/<([^>]+)>/)[1];
      const response = await enviarRespuesta(selectedMessage.value, fromEmail, selectedMessage.value.subject, replyContent.value, closeReplyModal);
      console.log('Respuesta del servidor:', response);
      closeReplyModal();
      closeMessageModal();

      successMessage.value = true; // Mostrar mensaje de éxito
    } else {
      // Enviando un nuevo mensaje
      const response = await enviarRespuesta(null, from.value, subject.value, replyContent.value, closeSentModal);
      console.log('Respuesta del servidor:', response);
      closeSentModal();
      successMessage.value = true; // Mostrar mensaje de éxito
    }

    // Ocultar automáticamente el mensaje de éxito después de 3 segundos
    setTimeout(() => {
      successMessage.value = false;
    }, 3000);
  } catch (error) {
    closeReplyModal();
    closeMessageModal();
    closeSentModal();
    console.error('Error al enviar la respuesta:', error);
    errorMessage.value = ' Vuelva a intentarlo, revise que la dirección de correo sea válida ' + error.message; // Mostrar mensaje de error
    setTimeout(() => {
      errorMessage.value = false;
    }, 3000);
  }
};

const closeMessage = () => {
  successMessage.value = false; // Ocultar mensaje de éxito
  errorMessage.value = ''; // Limpiar mensaje de error
};


</script>


<style scoped>
/* Estilos para el modal */
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  right: 0%;
  /* Alineado a la derecha */
  top: 0;
  width: calc(100% - 287px);
  /* Resta el ancho de los botones de inicio y cierre de sesión */
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: auto;
}

.modal-content {
  background-color: #fefefe;
  padding: 20px 40px;
  /* Mayor espacio a la izquierda y derecha */
  border: 1px solid #888;
  border-radius: 5px;
  margin-top: 10%;
  /* Ajuste para separar del contenido */
  margin-right: 10px;
  /* Espacio a la derecha */
  margin-left: 10px;
}

/* Añadir espacio entre párrafos */
.modal-content p {
  margin-bottom: 15px;
}

/* Añadir encabezados con estilo */
.modal-content h2 {
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 10px;
}

/* Añadir un separador visual */
.modal-content hr {
  border: 1px solid #ddd;
  margin-top: 15px;
  margin-bottom: 15px;
}


/* Añadir un botón de cierre con estilo */
.close-button {
  background-color: #dc3545;
  /* Rojo */
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 15px;
  float: right;
}

.close-button:hover {
  background-color: #c82333;
  /* Rojo más oscuro */
}


.reply-textarea {
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.btn-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  gap: 10px;
  /* Ajuste para separar del contenido */
}

.btn {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: 10px;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #dc3545;
  color: #fff;
}

.btn-secondary:hover {
  background-color: #c82333;
}

.btn-response {
  background-color: blue;
  color: white;
}

/* Estilos para el buscador */
.search-input {
  width: calc(100% - 40px);
  /* Resta el espacio a la derecha para el botón de búsqueda */
  padding: 8px;
  margin-bottom: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Estilos para la lista de mensajes */
.messages-container {
  margin-top: 20px;
}

.messages-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.message-list {
  list-style: none;
  padding: 0;
}

.message-item {
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message-details {
  padding: 10px;
}

.message-from {
  font-weight: bold;
}

.message-subject {
  margin-top: 5px;
}

.messages-selection {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.btn-square {
  width: 150px;
  /* Ajusta el ancho según tus preferencias */
  height: 50px;
  /* Ajusta la altura según tus preferencias */
  border-radius: 0;
  /* Borra el radio del borde */
}

.messages-selection {
  display: flex;
  justify-content: left;
  margin-bottom: 20px;
}

.btn-square {
  width: 150px;
  /* Ajusta el ancho según tus preferencias */
  height: 50px;
  /* Ajusta la altura según tus preferencias */
  border-radius: 0;
  /* Borra el radio del borde */
  transition: all 0.3s ease;
  /* Transición suave para todos los cambios */
}

.messages-selection .btn {
  margin: 0 5px;
}

.messages-selection .btn:active {
  transform: translateY(2px);
  /* Simula el botón hundido cuando se hace clic */
}

.messages-selection .btn.active {
  background-color: blue;
  /* Color de fondo para resaltar el botón seleccionado */
  color: #fff;
  /* Color de texto para resaltar el botón seleccionado */
  transform: translateY(2px);
  /* Simula el botón hundido cuando está seleccionado */
}
</style>