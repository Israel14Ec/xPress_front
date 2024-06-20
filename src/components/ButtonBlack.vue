    <template>
        <div class="py-2 px-3 inline-block rounded-md border border-gray-700 cursor-pointer">
                    <div class="flex flex-row gap-1">
                        <div class="w-4 my-auto">
                            <slot></slot>
                        </div>
                    <div>
                        <p class="font-semibold text-xs"><slot name="text"/></p>
                </div>
            </div>
        </div>
    </template>

    <script setup>

    </script>
