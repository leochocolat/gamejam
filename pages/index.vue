<template>
    <div class="page-home">

        <div class="settlers" v-if="notClick">
            <div 
                class="settler"
                v-for="(settler, i) in settlers"
                    :key="i"
            >
                <SettlersCard 
                    :settler="settler"
                    @on-click="onClickSettlers"
                />
            </div>
        </div>

        <div class="population" v-if="notClick">
            <PopulationCard
                :population="$mapManager.populations[0]"
                :picture="populationPictures[0].picture"
            />
        </div>

        <div class="ressource" v-if="notClick">
            <RessourceCard
                :ressource="$mapManager._resources[0]"
                :picture="ressourcePictures[0].picture"
            />
        </div>

        <HomeModal/>
        <ConsigneModal :settlers="settlers"/>

        <div class="btn">
            <BackgroundButton class="btn-line"/>
            <button 
                class="btn"
                type="button"
                @mouseenter="onMouseEnter()"
                @mouseleave="onMouseLeave()"
                @click="showWar()"
            >
                valider
            </button>
        </div>
    </div>
</template>

<script src="./home/script.js"></script>
<style src="./home/style.scss" lang="scss" scoped></style>
