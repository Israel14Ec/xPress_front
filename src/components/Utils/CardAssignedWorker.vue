<template>
    
    <div class="bg-gray-100 rounded-lg px-2 py-1 mb-5">
        <div class="text-sm">
            <p class="text-gray-600 font-semibold">
                {{ user.name + " " + user.last_name }}</p>
            <p >{{ user.phone_number }}</p>
            <p >{{ user.email }}</p>
        </div>
    </div>
</template>

<script setup>

defineProps({
    user: Object
})

</script>

