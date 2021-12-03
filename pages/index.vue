<template>
    <div class="page-home">
        <div v-if="notClick" class="settlers">
            <div
                v-for="(settler, i) in settlers"
                :key="i"
                class="settler"
            >
                <SettlersCard
                    :active-settler="activeSettler"
                    :settler="settler"
                    :index="i"
                    ref="settler"
                />
            </div>
        </div>

        <div v-if="notClick && population" class="population">
            <PopulationCard
                :population="population"
                :picture="`pictures/population/${population.id}.png`"
            />
        </div>

        <div v-if="notClick && resource" class="ressource">
            <RessourceCard
                :ressource="resource"
                :picture="`pictures/ressources/${resource.id}.png`"
            />
        </div>

        <HomeModal />
        <ConsigneModal :settlers="settlers" />

        <div class="btn-container button-validate" ref="validate">
            <div class="btn">
                <BackgroundButton class="btn-line" />
                <button
                    class="btn"
                    type="button"
                    @mouseenter="onMouseEnter"
                    @mouseleave="onMouseLeave"
                    @click="showWar"
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

        <div class="bilan-container" ref="recap">

            <Recap v-if="showRecap" :war="war" />

        </div>
    </div>
</template>

<script src="./home/script.js"></script>
<style src="./home/style.scss" lang="scss" scoped></style>
