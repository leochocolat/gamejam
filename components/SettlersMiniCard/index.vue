<template>
    <div 
        class="settlerMiniCard"
        :style="`borderColor: ${ settler.colorActive }`"
    >
        <div class="settlerMiniCard-identity">
            <div class="settlerMiniCard-identity--picture">
                <img
                    :src="settler.face"
                    alt="Settlers face"
                >
            </div>
            <div class="settlerMiniCard-identity--background">
                <IconStain /> 
            </div>
            <div class="settlerMiniCard-identity--name">
                <p>{{settler.name}}</p>
            </div>
        </div>
        <div class="settlerMiniCard-ressources">
            <div class="settlerMiniCard-ressources--picture">
                <img
                    :src="settler.picture"
                    alt="Settlers ressources"
                >
            </div>
            <div class="settlerMiniCard-ressources--score">
                <p><span>0</span>/4</p>
            </div>
        </div>
        <div
            v-if="settler.borderConflict"
            class="settlerMiniCard-borderConflict"
        >
            <BorderConflict/>
        </div>
    </div>

</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
