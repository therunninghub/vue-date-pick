<template>
    <vue-date-picker
        class="datePickExample"
        v-model="date"
        :format="format"
        :parseDate="parseDate"
        :formatDate="formatDate"
        :inputAttributes="{size: 32}"
    />
</template>

<script>
import VueDatePicker from '../../../src/VueDatePicker';
import fecha from 'fecha';

export default {
    components: { VueDatePicker },
    data: () => ({
        format: 'dddd MMMM Do, YYYY',
        date: fecha.format(new Date(), 'dddd MMMM Do, YYYY')
    }),
    methods: {
        parseDate(dateString, format) {
            return fecha.parse(dateString, format);
        },
        formatDate(dateObj, format) {
            return fecha.format(dateObj, format);
        }
    }
};
</script>
