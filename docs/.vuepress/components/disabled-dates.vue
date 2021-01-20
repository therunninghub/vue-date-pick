<template>
    <vue-date-picker
        class="datePickExample"
        v-model="date"
        :isDateDisabled="isFutureDate"
    />
</template>

<script>
import VueDatePicker from '../../../src/VueDatePicker';

export default {
    components: { VueDatePicker },
    data: () => ({
        date: ''
    }),
    methods: {
        isFutureDate(date) {
            const currentDate = new Date();
            return date > currentDate;
        }
    }
};
</script>
