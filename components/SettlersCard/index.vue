<template>
    <div 
        :class="[
                    'settlerCard',
                    `card-${settler.name}`,
                    {'active' : settler.active === true},
                ]"
        :style="`borderColor: ${ settler.colorActive }`"
        @mouseenter="onMouseEnter(settler.name,settler.active)"
        @mouseleave="onMouseLeave(settler.name,settler.active)"
        @click="onClick(settler)"
    >
        <div class="settlerCard-identity">
            <div class="settlerCard-identity--background">
                <IconStain 
                    v-if="settler.active"
                    :color="settler.colorActive"/> 
                <IconStain v-else/> 
            </div>
            <div class="settlerCard-identity--name">
                <p>{{settler.name}}</p>
            </div>
        </div>
        <div class="settlerCard-ressources">
            <div class="settlerCard-ressources--picture">
                <img
                    :src="settler.picture"
                    alt="Settlers ressources"
                >
            </div>
            <div class="settlerCard-ressources--score">
                <p><span>{{settler.score}}</span>/4</p>
            </div>
        </div>
        <div
            v-if="settler.borderConflict"
            class="settlerCard-borderConflict"
        >
            <BorderConflict/>
        </div>
    </div>

</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
