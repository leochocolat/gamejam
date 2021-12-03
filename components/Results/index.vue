<template>
    <div
        v-if="notClick"
        class="results-modal"
    >
        <div class="results-modal-title">
            <p>vous avez perdu...</p>
            <BackgroundButton1 class="results-modal-title--line" />
        </div>

        <p v-if="war.diplomatic ===0">
            Vous avez respecté les volontés de chaque dirigeant mais vous avez déclenché <span>({{ war.population }})</span> conflit(s) entre les populations locales et <span>({{ war.strike }})</span> révolution(s)
        </p>
        <p v-else>
            Vous n'avez pas respecté les volontés de chaque dirigeant. Vous avez déclenché <span>({{ war.diplomatic }})</span> conflit(s) diplomatique, <span>({{ war.population }})</span> conflit(s) entre les populations locales et <span>({{ war.strike }})</span> révolution(s)
        </p>

        <div class="results-modal-btn">
            <BackgroundButton2 class="results-modal-btn-line" />
            <button
                class="btn"
                type="button"
                @mouseenter="onMouseEnter()"
                @mouseleave="onMouseLeave()"
                @click="closeModal()"
            >
                suivant
            </button>
        </div>
    </div>

</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
