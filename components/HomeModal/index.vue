<template>
    <div 
        class="home" id="home"
        v-if="notClick"
    >
            <div class="home-logo" ref="logo">
                <div class="home-logo--image">
                    <Logo/>
                </div>
            </div>
            <div class="home-btn" ref="button">
                 <BackgroundButton class="home-button-background"/>
                <button 
                    class="btn"
                    type="button"
                    @mouseenter="onMouseEnter"
                    @mouseleave="onMouseLeave"
                    @click="closeModal"
                >
                    Commencer
                </button>
            </div>
    </div>

</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
