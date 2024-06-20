<template>
    <div class="py-2 px-3 inline-block cursor-pointer shadow-lg mt-4">
        <div class="flex flex-row">
            <div class="my-auto px-2 w-10">
                <slot>
                </slot>
            </div>
            <p class="text-center font-semibold md:text-lg text-base"> <slot name="text" /> </p>
        </div>
        <p class="mt-1 text-sm"><slot name="description" /></p>
    </div>
</template>

