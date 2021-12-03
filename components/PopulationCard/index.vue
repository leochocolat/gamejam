<template>
    <div 
        class="population"
    >
        <div class="population-identity">
            <div class="population-identity--picture">
                <img
                    :src="picture"
                    alt="Population picture"
                >
            </div>
            <div class="population-identity--name">
                <p>{{population._id}}</p>
            </div>
            <div class="population-identity--line">
                     <LinePopulation/>
            </div>
        </div>
        <div class="population-properties">
            <div class="population-properties-language">
                <div class="population-properties-language--icon">
                     <IconLanguage/>
                </div>
                <div class="population-properties-language--name">
                    <p>{{population._properties.language.name}}</p>
                </div>
            </div>
            <div class="population-properties-religion">
                <div class="population-properties-religion--icon">
                     <IconReligion/>
                </div>
                <div class="population-properties-religion--name">
                    <p>{{population._properties.religion.name}}</p>
                </div>
            </div>
            <div class="population-properties-culture">
                <div class="population-properties-culture--icon">
                     <IconCulture/>
                </div>
                <div class="population-properties-culture--name">
                    <p>{{population._properties.culture.name}}</p>
                </div>
            </div>
        </div> 
    </div>

</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
