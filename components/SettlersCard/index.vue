<template>
    <div
        :class="[
            'settlerCard',
            `card-${settler.id}`,
            {'active' : !!activeSettler && settler.id === activeSettler.id},
        ]"
        :style="`borderColor: ${ settler.color }`"
        @click="onClick(settler)"
    >
        <div class="settlerCard-identity">
            <div class="settlerCard-identity--background">
                <IconStain
                    v-if="!!activeSettler && settler.id === activeSettler.id"
                    :color="settler.color"
                />
                <IconStain v-else />
            </div>
            <div class="settlerCard-identity--name">
                <p>{{ settler.id }}</p>
            </div>
        </div>
        <div class="settlerCard-ressources">
            <div class="settlerCard-ressources--picture">
                <img
                    :src="`pictures/ressources/${settler.targetResourceId}.png`"
                    alt="Settlers ressources"
                >
            </div>
            <div class="settlerCard-ressources--score">
                <p><span>{{ settler.targetResourceCount }}</span>/{{ settler.targetResourceAmount }}</p>
            </div>
        </div>
        <div
            v-if="settler.borderConflict"

            class="settlerCard-borderConflict"
        >
            <BorderConflict />
        </div>
    </div>

</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
