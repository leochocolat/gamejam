<template>
    <div class="page-home">
        <div v-if="notClick" class="settlers">
            <div
                v-for="(settler, i) in $mapManager.settlers"
                :key="i"
                class="settler"
            >
                <SettlersCard
                    :settler="settler"
                />
            </div>
        </div>

        <div v-if="notClick" class="population">
            <PopulationCard
                :population="$mapManager.populations[0]"
                :picture="populationPictures[0].picture"
            />
        </div>

        <div v-if="notClick" class="ressource">
            <RessourceCard
                :ressource="$mapManager._resources[0]"
                :picture="ressourcePictures[0].picture"
            />
        </div>

        <HomeModal />
        <ConsigneModal :settlers="$mapManager.settlers" />

        <div class="btn-container">
            <div class="btn">
                <BackgroundButton class="btn-line" />
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

        <div class="timerComponent">
            <Timer
                v-if="!notClick"
                @on-ended="showResults"
            />
        </div>

        <div class="resultsComponent">
            <ResultsModal v-if="results" :war="war" />
        </div>
    </div>
</template>

<script src="./home/script.js"></script>
<style src="./home/style.scss" lang="scss" scoped></style>
