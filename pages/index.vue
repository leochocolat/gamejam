<template>
    <div class="page-home">
        <div class="settlers">
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

        <div class="population">
            <PopulationCard
                :population="$mapManager.populations[0]"
                :picture="populationPictures[0].picture"
            />
        </div>

        <div class="ressource">
            <RessourceCard
                :ressource="$mapManager._resources[0]"
                :picture="ressourcePictures[0].picture"
            />
        </div>
    </div>
</template>

<script src="./home/script.js"></script>
<style src="./home/style.scss" lang="scss" scoped></style>
