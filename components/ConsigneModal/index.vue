<template>
    <div 
        class="consigne" id="consigne"
        v-if="notClick"
    >
            <p>Après la découverte du continent de Gastelonia en l'an 303, les dirigeants des pays de <span class="pellatarte">Pellatarte</span>, <span class="prespure">Prespuré</span>, <span class="moulacake">Moulacake</span> et <span class="spatulia">Spatulia</span> cherchent à étendre leurs empires. Afin d'éviter toute discorde, ils vous confient la lourde tâche de découper le territoire en respectant leurs intérêts respectifs. </p>

            <div class="consigne-settlers">
                <div 
                    class="consigne-settlers--settler"
                    v-for="(settler, i) in settlers"
                        :key="i"
                >
                    <SettlersMiniCard 
                        :settler="settler"
                    />
                </div>
            </div>

            <div class="consigne-conflict">
                 <div
                    class="consigne-conflict--borderConflict"
                >
                    <BorderConflict/>
                </div>
                <p>pas de frontières communes !</p>
            </div>

            <p>Prenez garde aux Gasteloniens, les différentes populations ne peuvent cohabiter que si elles partagent aux moins deux critères culturels similaires. </p>

            <div class="consigne-img">
                <img src="pictures/consigne/fight_population.png">
            </div>

            <div class="consigne-btn">
                 <BackgroundButton class="consigne-btn-line"/>
                <button 
                    class="btn"
                    type="button"
                    @mouseenter="onMouseEnter()"
                    @mouseleave="onMouseLeave()"
                    @click="closeModal()"
                >
                    jouer
                </button>
            </div>
    </div>

</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
