# Getting started
Install via node package manager:
```bash
npm install @therunninghub/vue-date-picker
```
Integrate into your application via standard Vue api for registering and using components.
Vue Date Picker is designed for usage with v-model directive.
```vue
<template>
    <vue-date-picker v-model="date" />
</template>

<script>
import VueDatePicker from '@therunninghub/vue-date-picker';
import '@therunninghub/vue-date-picker/dist/VueDatePicker.css';

export default {
    components: { VueDatePicker },
    data: () => ({
        date: '2019-01-01'
    })
};
</script>
```
