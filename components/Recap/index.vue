<template>
    <div class="recap">

        <div class="title">
            bilan
            <BilanUnderline class="bilan-container" />
        </div>

        <div class="wars-container">

            <div class="war population">

                <div class="image-container">
                    <img src="/pictures/population.png" alt="">    
                </div>

                <div class="content-container">

                    <div class="war-title">
                        <span class="number">{{ war.population }}</span> guerre(s)
                    </div>

                    <div class="war-content">
                        en réunissant en un même pays des populations trop différentes ou en séparant celles similaires, vous avez créé des guerres de territoire
                    </div>

                </div>

            </div>

            <div class="war strike">

                <div class="image-container">
                    <img src="/pictures/strike.png" alt="">    
                </div>

                <div class="content-container">

                    <div class="war-title">
                        <span class="number">{{ war.strike }}</span> révolution(s)
                    </div>

                    <div class="war-content">
                        mécontents de la situation géographique, des peuples se soulèvent contre votre répartition arbitraire
                    </div>

                </div>

            </div>

            <div class="war diplomatic">

                <div class="image-container">
                    <img src="/pictures/diplomatic.png" alt="">    
                </div>

                <div class="content-container">

                    <div class="war-title">
                        <span class="number">{{ war.diplomatic }}</span> conflit(s) diplomatique(s)
                    </div>

                    <div class="war-content">
                        En ne respectant pas votre mission, vous avez déclenché un conflit diplomatique pour les ressources entre 2 puissances
                    </div>

                </div>

            </div>

        </div>

        <div class="button-container" @click="clickHandler">
            <div class="border"></div>
            <BackgroundButton class="background-button" />
            <button class="button">rejouer</button>

        </div>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>