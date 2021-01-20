<template>
    <vue-date-picker
        class="datePickExample"
        v-model="date"
    >
        <template v-slot:default="{toggle, inputValue}">
            <button class="customInputBtn" @click="toggle">
                 {{ inputValue || 'Toggle calendar' }}
            </button>
        </template>
    </vue-date-picker>
</template>

<script>
import VueDatePicker from '../../../src/VueDatePicker';

export default {
    components: { VueDatePicker },
    data: () => ({
        date: ''
    })
};
</script>

<style lang="scss" scoped>
.customInputBtn {
    margin:0; padding: 0; border: 0; cursor: pointer; background: none;
    font-size: 1.5em; padding: 15px;
    border-radius: 4px; border: 1px solid #e0e0e0;
    box-shadow: 0 0.1em 0.3em rgba(0,0,0,0.05);
    transition: color 0.3s, border 0.2s;

    &::-moz-focus-inner {
        padding: 0; border: 0;
    }

    &:hover, &:focus {
        border-color: #fe5800;
        color: darken(#fe5800, 20%);
        outline: 0;
    }
}
</style>
