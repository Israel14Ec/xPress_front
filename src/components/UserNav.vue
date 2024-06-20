<template>
    <div class="flex sm:flex-row flex-col justify-between">
 
         <RouterLink
             :to="{name: 'login'}"
             class="hover:text-blue-400"
         >
             <div class="flex flex-row gap-6">
                 <img 
                     class="h-16 rounded-s-full w-24 bg-center"
                     src="../assets/img/logo.png" alt="logo"
                 >
                 <h1 class="text-start text-4xl my-auto text-yellow-400 font-bold">xPress</h1>
             </div>
         </RouterLink>
         
         
         <nav class="bg-gray-300 px-16 py-3 rounded-3xl flex gap-10 my-auto">
             <RouterLink
                 :to="{ name: 'login'}"
                 class="hover:text-blue-400 my-auto"
                 :class="{ 'text-blue-400': route.name === 'login' }"
 
             >
                 Inicio
             </RouterLink>
 
 
             <RouterLink
                 :to="{ name: 'createAccount'}"
                 class="hover:text-blue-400  my-auto"
                 :class="{ 'text-blue-400': route.name === 'createAccount' }"
             >
                 Registrarse
             </RouterLink>
 
 
             <RouterLink
                 :to="{ name: 'forgetPassword'}"
                 :class="{ 'text-blue-400': route.name === 'forgetPassword' }"
                 class="hover:text-blue-400 my-auto"
             >
                 Recuperar contraseña
             </RouterLink>
 
         </nav>
    </div>
 </template>
 
 <script setup>
     
     import {RouterLink} from 'vue-router'
     import {useRoute} from 'vue-router'
 
     const route = useRoute()
 
 </script>
 