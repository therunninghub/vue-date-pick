<template>
  <vue-date-picker
    class="datePickExample"
    v-model="date"
    v-bind="pickerProps"
  />
</template>

<script>
import VueDatePicker from '../../../src/VueDatePicker';

export default {
  components: { VueDatePicker },
  props: {
    value: String,
    pickerProps: Object
  },
  data() {
    return {
      date: this.value
    }
  }
};
</script>
