<template>
    <div 
        class="ressource"
    >
        <div class="ressource-identity">
            <div class="ressource-identity--picture">
                <img
                    :src="picture"
                    alt="Ressource picture"
                >
            </div>
            <div class="ressource-identity--name">
                <div class="ressource-identity--name--text">
                    <p>{{ressource._id}}</p>
                </div>
                <div class="ressource-identity--name--line">
                     <LineRessource/>
                </div>
            </div>
        </div>
    </div>

</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
