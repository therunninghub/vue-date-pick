# Examples

## Calendar widget
Vue Date Picker can be used in calendar widget form.

<calendar-widget></calendar-widget>

<details>
    <summary>
    Show code
    </summary>

```vue
<template>
    <vue-date-picker
        v-model="date"
        :hasInputElement="false"
    />
</template>

<script>
import VueDatePicker from '@therunninghub/vue-date-picker';

export default {
    components: { VueDatePicker },
    data: () => ({
        date: '2019-02-12'
    })
};
</script>
```
</details>

## Date format
Simple date picker with custom format (default is 'YYYY-MM-DD'):

<picker-wrapper
    value="2019.01.01"
    :pickerProps="{format: 'YYYY.MM.DD'}"
></picker-wrapper>

<details>
    <summary>
    Show code
    </summary>

```vue
<template>
    <vue-date-picker
        v-model="date"
        :format="'YYYY.MM.DD'"
    />
</template>

<script>
import VueDatePicker from '@therunninghub/vue-date-picker';

export default {
    components: { VueDatePicker },
    data: () => ({
        date: '2019.01.01'
    })
};
</script>
```
</details>

## Display format
Use display format prop when UI date format is different from raw data format.

<picker-wrapper
    value="2019-01-01"
    :pickerProps="{displayFormat: 'DD.MM.YYYY'}"
></picker-wrapper>

<details>
    <summary>
    Show code
    </summary>

```vue
<template>
    <vue-date-picker
        v-model="date"
        :displayFormat="'DD.MM.YYYY'"
    />
</template>

<script>
import VueDatePicker from '@therunninghub/vue-date-picker';

export default {
    components: { VueDatePicker },
    data: () => ({
        date: '2019-01-01'
    })
};
</script>
```
</details>

## Custom date parser
Vue Date Picker comes with simple date parser.
If you need to work with complex date formats feel free to inject implementation of your choice.

<custom-engine></custom-engine>

<details>
    <summary>
    Show code
    </summary>

```vue
<template>
    <vue-date-picker
        v-model="date"
        :format="format"
        :parseDate="parseDate"
        :formatDate="formatDate"
        :inputAttributes="{size: 32}"
    />
</template>

<script>
import VueDatePicker from '@therunninghub/vue-date-picker';
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
```
</details>

## Date time picker
Date picker with controls for hours and minutes:

<picker-wrapper
    value="2019-01-01 14:30"
    :pickerProps="{format: 'YYYY-MM-DD HH:mm', pickTime: true}"
></picker-wrapper>

<details>
    <summary>
    Show code
    </summary>

```vue
<template>
    <vue-date-picker
        v-model="date"
        :pickTime="true"
        :format="'YYYY-MM-DD HH:mm'"
    />
</template>

<script>
import VueDatePicker from '@therunninghub/vue-date-picker';

export default {
    components: { VueDatePicker },
    data: () => ({
        date: '2019-01-01 14:30'
    })
};
</script>
```
</details>

## Date time picker (AM/PM)
Date time picker with hours displayed using 12 hour clock:

<picker-wrapper
    value="2019-01-01 14:30"
    :pickerProps="{format: 'YYYY-MM-DD HH:mm', displayFormat: 'YYYY.MM.DD H:mm A', pickTime: true, use12HourClock: true}"
></picker-wrapper>

<details>
    <summary>
    Show code
    </summary>

```vue
<template>
    <vue-date-picker
        v-model="date"
        :pickTime="true"
        :use12HourClock="true"
        :format="'YYYY-MM-DD HH:mm'"
        :displayFormat="'YYYY.MM.DD H:mm A'"
    />
</template>

<script>
import VueDatePicker from '@therunninghub/vue-date-picker';

export default {
    components: { VueDatePicker },
    data: () => ({
        date: '2019-01-01 14:30'
    })
};
</script>
```
</details>

## Custom start period
Open calendar UI with custom start month / year period:

<picker-wrapper
    value=""
    :pickerProps="{startPeriod: {month: 0, year: 2020}}"
></picker-wrapper>

<details>
    <summary>
    Show code
    </summary>

```vue
<template>
    <vue-date-picker
        :startPeriod="{month: 0, year: 2020}}"
    />
</template>

<script>
import VueDatePicker from '@therunninghub/vue-date-picker';

export default {
    components: {VueDatePicker}
};
</script>
```
</details>

## Custom content with slot
Replace default input controls with custom slot content:

<custom-input></custom-input>

<details>
    <summary>
    Show code
    </summary>

```vue
<template>
    <vue-date-picker v-model="date">
        <template v-slot:default="{toggle, inputValue}">
            <button @click="toggle">
                 {{ inputValue || 'Toggle calendar' }}
            </button>
        </template>
    </vue-date-picker>
</template>

<script>
import VueDatePicker from '@therunninghub/vue-date-picker';

export default {
    components: { VueDatePicker },
    data: () => ({
        date: ''
    })
};
</script>
```
</details>

## Disabling dates
Set "isDateDisabled" function as component prop to disable dates:

<disabled-dates></disabled-dates>

<details>
    <summary>
    Show code
    </summary>

```vue
<template>
    <vue-date-picker
        v-model="date"
        :isDateDisabled="isFutureDate"
    />
</template>

<script>
import VueDatePicker from '@therunninghub/vue-date-picker';

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
```
</details>

## Disabling manual input
Manual user input can be disabled by setting input readonly attribute via "inputAttributes" prop.

<picker-wrapper
    value="2019.01.01"
    :pickerProps="{inputAttributes: {readonly: true}}"
></picker-wrapper>

<details>
    <summary>
    Show code
    </summary>

```vue
<template>
    <vue-date-picker
        v-model="date"
        :inputAttributes="{readonly: true}"
    />
</template>

<script>
import VueDatePicker from '@therunninghub/vue-date-picker';

export default {
    components: { VueDatePicker },
    data: () => ({
        date: '2018-12-29'
    })
};
</script>
```
</details>

## Disable editing and picker UI
Disable input editing and calendar UI by setting "editable" prop to false.

<picker-wrapper
    value="2019.01.01"
    :pickerProps="{editable: false}"
></picker-wrapper>

<details>
    <summary>
    Show code
    </summary>

```vue
<template>
    <vue-date-picker
        v-model="date"
        :editable="false"
    />
</template>

<script>
import VueDatePicker from '@therunninghub/vue-date-picker';

export default {
    components: { VueDatePicker },
    data: () => ({
        date: '2018-12-29'
    })
};
</script>
```
</details>

## Start week on Sunday
Sunday can be set as the first day of the week via "startWeekOnSunday" prop.

<picker-wrapper
    value="2019.01.01"
    :pickerProps="{startWeekOnSunday: true}"
></picker-wrapper>

<details>
    <summary>
    Show code
    </summary>

```vue
<template>
    <vue-date-picker
        v-model="date"
        :startWeekOnSunday="true"
    />
</template>

<script>
import VueDatePicker from '@therunninghub/vue-date-picker';

export default {
    components: { VueDatePicker },
    data: () => ({
        date: '2019-01-01'
    })
};
</script>
```
</details>

## Change selectable years
Dropdown for selecteble years can be customized via selectableYearRange prop
(default value is 40 years from and after current year).

<picker-wrapper
    value="2019.01.01"
    :pickerProps="{
        selectableYearRange: {from: 2015, to: 2020}
    }"
></picker-wrapper>

<details>
    <summary>
    Show code
    </summary>

```vue
<template>
    <vue-date-picker
        v-model="date"
        :selectableYearRange="{from: 1985, to: 2020}"
    />
</template>

<script>
import VueDatePicker from '@therunninghub/vue-date-picker';

export default {
    components: { VueDatePicker },
    data: () => ({
        date: '2019-01-01'
    })
};
</script>
```
</details>
