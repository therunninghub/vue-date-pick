<template>
  <div class="vdpComponent" :class="{ vdpWithInput: hasInputElement }">
    <slot
      :open="open"
      :close="close"
      :toggle="toggle"
      :inputValue="inputValue"
      :processUserInput="processUserInput"
      :valueToInputFormat="valueToInputFormat"
    >
      <input
        v-if="hasInputElement"
        type="text"
        v-bind="inputAttributes"
        :readonly="isReadOnly"
        :value="inputValue"
        @input="editable && processUserInput($event.target.value)"
        @focus="editable && open()"
        @click="editable && open()"
      />
      <button v-if="editable && hasInputElement && inputValue" class="vdpClearInput" type="button" @click="clear" />
    </slot>
    <transition name="vdp-toggle-calendar">
      <div
        v-if="opened"
        ref="outerWrap"
        class="vdpOuterWrap"
        :class="[positionClass, { vdpFloating: hasInputElement }]"
        @click="closeViaOverlay"
      >
        <div class="vdpInnerWrap">
          <header :class="['vdpHeader', showMonthPicker || showYearPicker ? '' : 'datePicker']">
            <button
              class="vdpArrow vdpArrowPrev"
              :title="prevMonthCaption"
              type="button"
              :style="{
                display: showMonthPicker ? 'none' : undefined
              }"
              @click="onClickArrowPrev"
            >
              {{ prevMonthCaption }}
            </button>
            <button
              class="vdpArrow vdpArrowNext"
              type="button"
              :title="nextMonthCaption"
              :style="{
                display: showMonthPicker ? 'none' : undefined
              }"
              @click="onClickArrowNext"
            >
              {{ nextMonthCaption }}
            </button>
            <div class="vdpPeriodControls">
              <div class="vdpPeriodControl">
                <button :key="currentPeriod.month" :class="directionClass" type="button" @click="toggleMonthPicker">
                  {{ months[currentPeriod.month] }}
                </button>
              </div>
              <div class="vdpPeriodControl">
                <button :key="currentPeriod.year" :class="directionClass" type="button" @click="toggleYearPicker">
                  {{ currentPeriod.year }}
                </button>
              </div>
            </div>
          </header>
          <table v-if="!this.showMonthPicker && !this.showYearPicker" class="vdpTable">
            <thead>
              <tr>
                <th v-for="(weekday, weekdayIndex) in weekdaysSorted" :key="weekdayIndex" class="vdpHeadCell">
                  <span class="vdpHeadCellContent">{{ weekday }}</span>
                </th>
              </tr>
            </thead>
            <tbody :key="currentPeriod.year + '-' + currentPeriod.month" :class="directionClass">
              <tr v-for="(week, weekIndex) in currentPeriodDates" :key="weekIndex" class="vdpRow">
                <td
                  v-for="item in week"
                  :key="item.dateKey"
                  class="vdpCell"
                  :class="{
                    selectable: editable && !item.disabled,
                    selected: item.selected,
                    disabled: item.disabled,
                    today: item.today,
                    outOfRange: item.outOfRange
                  }"
                  :data-id="item.dateKey"
                  @click="editable && selectDateItem(item)"
                >
                  <div class="vdpCellContent date">{{ item.date.getDate() }}</div>
                </td>
              </tr>
            </tbody>
          </table>
          <table v-if="this.showMonthPicker" class="vdpTable">
            <tbody :key="currentPeriod.year + '-' + currentPeriod.month" :class="directionClass">
              <tr v-for="(monthRow, rowIndex) in computedMonths" :key="`month-row-${rowIndex}`" class="vdpRow">
                <td
                  v-for="item in monthRow"
                  :key="item.key"
                  class="vdpCell"
                  :class="{
                    selectable: editable && !item.disabled,
                    selected: item.value - 1 === currentPeriod.month,
                    disabled: item.disabled
                  }"
                  :data-id="item.key"
                  @click="selectMonthItem(item)"
                >
                  <div class="vdpCellContent month">{{ item.text }}</div>
                </td>
              </tr>
            </tbody>
          </table>
          <table v-if="this.showYearPicker" class="vdpTable">
            <tbody :key="currentPeriod.year + '-' + currentPeriod.month" :class="directionClass">
              <tr v-for="(yearRow, rowIndex) in computedYears" :key="`year-row-${rowIndex}`" class="vdpRow">
                <td
                  v-for="item in yearRow"
                  :key="item.key"
                  class="vdpCell"
                  :class="{
                    selectable: editable && !item.disabled,
                    selected: item.value === currentPeriod.year,
                    disabled: item.disabled
                  }"
                  :data-id="item.key"
                  @click="selectYearItem(item)"
                >
                  <div class="vdpCellContent year">{{ item.text }}</div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="pickTime && currentTime" class="vdpTimeControls">
            <span class="vdpTimeCaption">{{ setTimeCaption }}</span>
            <div class="vdpTimeUnit">
              <pre><span>{{ currentTime.hoursFormatted }}</span><br></pre>
              <input
                type="number"
                pattern="\d*"
                class="vdpHoursInput"
                :disabled="!editable"
                :value="currentTime.hoursFormatted"
                @input.prevent="inputHours"
                @focusin="onTimeInputFocus"
              />
            </div>
            <span v-if="pickMinutes" class="vdpTimeSeparator">:</span>
            <div v-if="pickMinutes" class="vdpTimeUnit">
              <pre><span>{{ currentTime.minutesFormatted }}</span><br></pre>
              <input
                v-if="pickMinutes"
                type="number"
                pattern="\d*"
                class="vdpMinutesInput"
                :disabled="!editable"
                :value="currentTime.minutesFormatted"
                @input="inputTime('setMinutes', $event)"
                @focusin="onTimeInputFocus"
              />
            </div>
            <span v-if="pickSeconds" class="vdpTimeSeparator">:</span>
            <div v-if="pickSeconds" class="vdpTimeUnit">
              <pre><span>{{ currentTime.secondsFormatted }}</span><br></pre>
              <input
                v-if="pickSeconds"
                type="number"
                pattern="\d*"
                class="vdpSecondsInput"
                :disabled="!editable"
                :value="currentTime.secondsFormatted"
                @input="inputTime('setSeconds', $event)"
                @focusin="onTimeInputFocus"
              />
            </div>
            <button
              v-if="use12HourClock"
              type="button"
              class="vdp12HourToggleBtn"
              :disabled="!editable"
              @click="set12HourClock(currentTime.isPM ? 'AM' : 'PM')"
            >
              {{ currentTime.isPM ? 'PM' : 'AM' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  areSameDates,
  boundNumber,
  chunkArray,
  isPM,
  isValidDate,
  isValidMonth,
  isValidFullYear,
  padNum,
  range,
  to12HourClock,
  to24HourClock
} from './utils/date';

const formatRE = /,|\.|-| |:|\/|\\/;
const dayRE = /D+/;
const monthRE = /M+/;
const yearRE = /Y+/;
const hoursRE = /h+/i;
const minutesRE = /m+/;
const secondsRE = /s+/;
const AMPMClockRE = /A/;

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    displayFormat: {
      type: String
    },
    editable: {
      type: Boolean,
      default: true
    },
    hasInputElement: {
      type: Boolean,
      default: true
    },
    inputAttributes: {
      type: Object
    },
    selectableYearRange: {
      type: [Number, Object, Function],
      default: undefined
    },
    disableInvalidMonths: {
      type: Boolean,
      default: false
    },
    startPeriod: {
      type: Object
    },
    parseDate: {
      type: Function
    },
    formatDate: {
      type: Function
    },
    pickTime: {
      type: Boolean,
      default: false
    },
    pickMinutes: {
      type: Boolean,
      default: true
    },
    pickSeconds: {
      type: Boolean,
      default: false
    },
    use12HourClock: {
      type: Boolean,
      default: false
    },
    isDateDisabled: {
      type: Function,
      default: () => false
    },
    nextMonthCaption: {
      type: String,
      default: 'Next month'
    },
    prevMonthCaption: {
      type: String,
      default: 'Previous month'
    },
    setTimeCaption: {
      type: String,
      default: 'Set time:'
    },
    mobileBreakpointWidth: {
      type: Number,
      default: 500
    },
    weekdays: {
      type: Array,
      default: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    months: {
      type: Array,
      default: () => [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
    },
    startWeekOnSunday: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      inputValue: this.valueToInputFormat(this.value),
      direction: undefined,
      positionClass: undefined,
      opened: !this.hasInputElement,
      currentPeriod: this.startPeriod || this.getPeriodFromValue(this.value, this.format),
      monthsPerRow: 3,
      yearsPerRow: 5,
      yearsPerPage: 20,
      tempYear: undefined,
      showMonthPicker: false,
      showYearPicker: false
    };
  },

  computed: {
    valueDate() {
      const value = this.value;
      const format = this.format;

      return value ? this.parseDateString(value, format) : undefined;
    },

    isReadOnly() {
      return !this.editable || (this.inputAttributes && this.inputAttributes.readonly);
    },

    isValidValue() {
      const valueDate = this.valueDate;

      return this.value ? Boolean(valueDate) : true;
    },

    currentPeriodDates() {
      const {year, month} = this.currentPeriod;
      const days = [];
      const date = new Date(year, month, 1);
      const today = new Date();
      const offset = this.startWeekOnSunday ? 1 : 0;

      // append prev month dates
      const startDay = date.getDay() || 7;

      if (startDay > 1 - offset) {
        for (let i = startDay - (2 - offset); i >= 0; i--) {
          const prevDate = new Date(date);
          prevDate.setDate(-i);
          days.push({outOfRange: true, date: prevDate});
        }
      }

      while (date.getMonth() === month) {
        days.push({date: new Date(date)});
        date.setDate(date.getDate() + 1);
      }

      // append next month dates
      const daysLeft = 7 - (days.length % 7);

      for (let i = 1; i <= daysLeft; i++) {
        const nextDate = new Date(date);
        nextDate.setDate(i);
        days.push({outOfRange: true, date: nextDate});
      }

      // define day states
      days.forEach((day) => {
        day.disabled = this.isDateDisabled(day.date);
        day.today = areSameDates(day.date, today);
        day.dateKey = [day.date.getFullYear(), day.date.getMonth() + 1, day.date.getDate()].join('-');
        day.selected = this.valueDate ? areSameDates(day.date, this.valueDate) : false;
      });

      return chunkArray(days, 7);
    },

    computedMonths() {
      const computedMonths = [];
      const len = this.months.length;
      let i, j;
      for (i = 0, j = len; i < j; i += this.monthsPerRow) {
        const monthRowValues = this.months.slice(i, i + this.monthsPerRow).map((m, k) => {
          const value = i + 1 + k;
          return {
            value,
            text: m,
            key: `month-${value}`,
            disabled:
              this.disableInvalidMonths && !isValidDate(this.valueDate.getDate(), value, this.valueDate.getFullYear())
          };
        });
        computedMonths.push(monthRowValues);
      }

      return computedMonths;
    },

    computedYears() {
      const computedYears = [];
      const currentYear = this.tempYear || this.currentPeriod.year;
      const startYear = Math.floor(currentYear / 10) * 10;
      const years = range(startYear, startYear + this.yearsPerPage - 1);
      const len = years.length;

      let i, j;
      for (i = 0, j = len; i < j; i += this.yearsPerRow) {
        const yearRowValues = years.slice(i, i + this.yearsPerRow).map((value, index) => {
          return {
            value,
            text: value,
            key: `year-${value}`,
            disabled: this.yearRange.length > 0 && !this.yearRange.includes(value)
          };
        });
        computedYears.push(yearRowValues);
      }

      return computedYears;
    },

    yearRange() {
      const currentYear = this.currentPeriod.year;
      const userRange = this.selectableYearRange;
      const userRangeType = typeof userRange;

      let yearsRange = [];

      if (userRangeType === 'number') {
        yearsRange = range(currentYear - userRange, currentYear + userRange);
      } else if (userRangeType === 'object') {
        yearsRange = range(userRange.from, userRange.to);
      } else if (userRangeType === 'function') {
        yearsRange = userRange(this);
      }

      return yearsRange;
    },

    currentTime() {
      const currentDate = this.valueDate;

      if (!currentDate) {
        return undefined;
      }

      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      const seconds = currentDate.getSeconds();

      return {
        hours,
        minutes,
        seconds,
        isPM: isPM(hours),
        hoursFormatted: (this.use12HourClock ? to12HourClock(hours) : hours).toString(),
        minutesFormatted: padNum(minutes, 2),
        secondsFormatted: padNum(seconds, 2)
      };
    },

    directionClass() {
      return this.direction ? `vdp${this.direction}Direction` : undefined;
    },

    weekdaysSorted() {
      if (this.startWeekOnSunday) {
        const weekdays = this.weekdays.slice();
        weekdays.unshift(weekdays.pop());
        return weekdays;
      } else {
        return this.weekdays;
      }
    }
  },

  watch: {
    value(value) {
      if (this.isValidValue) {
        this.inputValue = this.valueToInputFormat(value);
        this.currentPeriod = this.getPeriodFromValue(value, this.format);
      }
    },

    currentPeriod(currentPeriod, oldPeriod) {
      const currentDate = new Date(currentPeriod.year, currentPeriod.month).getTime();
      const oldDate = new Date(oldPeriod.year, oldPeriod.month).getTime();

      this.direction = currentDate !== oldDate ? (currentDate > oldDate ? 'Next' : 'Prev') : undefined;

      if (currentDate !== oldDate) {
        this.$emit('periodChange', {
          year: currentPeriod.year,
          month: currentPeriod.month
        });
      }
    }
  },

  beforeDestroy() {
    this.removeCloseEvents();
    this.teardownPosition();
  },

  methods: {
    valueToInputFormat(value) {
      return !this.displayFormat
        ? value
        : this.formatDateToString(this.parseDateString(value, this.format), this.displayFormat) || value;
    },

    getPeriodFromValue(dateString, format) {
      const date = this.parseDateString(dateString, format) || new Date();

      return {month: date.getMonth(), year: date.getFullYear()};
    },

    parseDateString(dateString, dateFormat) {
      return !dateString
        ? undefined
        : this.parseDate
          ? this.parseDate(dateString, dateFormat)
          : this.parseSimpleDateString(dateString, dateFormat);
    },

    formatDateToString(date, dateFormat) {
      return !date
        ? ''
        : this.formatDate
          ? this.formatDate(date, dateFormat)
          : this.formatSimpleDateToString(date, dateFormat);
    },

    parseSimpleDateString(dateString, dateFormat) {
      let day, month, year, hours, minutes, seconds;

      const dateParts = dateString.split(formatRE);
      const formatParts = dateFormat.split(formatRE);
      const partsSize = formatParts.length;

      for (let i = 0; i < partsSize; i++) {
        if (formatParts[i].match(dayRE)) {
          day = parseInt(dateParts[i], 10);
        } else if (formatParts[i].match(monthRE)) {
          month = parseInt(dateParts[i], 10);
        } else if (formatParts[i].match(yearRE)) {
          year = parseInt(dateParts[i], 10);
        } else if (formatParts[i].match(hoursRE)) {
          hours = parseInt(dateParts[i], 10);
        } else if (formatParts[i].match(minutesRE)) {
          minutes = parseInt(dateParts[i], 10);
        } else if (formatParts[i].match(secondsRE)) {
          seconds = parseInt(dateParts[i], 10);
        }
      }

      const resolvedDate = new Date([padNum(year, 4), padNum(month, 2), padNum(day, 2)].join('-'));

      if (isNaN(resolvedDate)) {
        return undefined;
      } else {
        const date = new Date(year, month - 1, day);

        [
          [year, 'setFullYear'],
          [hours, 'setHours'],
          [minutes, 'setMinutes'],
          [seconds, 'setSeconds']
        ].forEach(([value, method]) => {
          typeof value !== 'undefined' && date[method](value);
        });

        return date;
      }
    },

    formatSimpleDateToString(date, dateFormat) {
      return dateFormat
        .replace(yearRE, (match) => Number(date.getFullYear().toString().slice(-match.length)))
        .replace(monthRE, (match) => padNum(date.getMonth() + 1, match.length))
        .replace(dayRE, (match) => padNum(date.getDate(), match.length))
        .replace(hoursRE, (match) =>
          padNum(AMPMClockRE.test(dateFormat) ? to12HourClock(date.getHours()) : date.getHours(), match.length)
        )
        .replace(minutesRE, (match) => padNum(date.getMinutes(), match.length))
        .replace(secondsRE, (match) => padNum(date.getSeconds(), match.length))
        .replace(AMPMClockRE, (match) => (isPM(date.getHours()) ? 'PM' : 'AM'));
    },

    jumpMonth(step = 1) {
      const refDate = new Date(this.currentPeriod.year, this.currentPeriod.month);
      const jumpDate = new Date(refDate.getFullYear(), refDate.getMonth() + step);

      this.currentPeriod = {
        month: jumpDate.getMonth(),
        year: jumpDate.getFullYear()
      };
    },

    onClickArrowPrev(e) {
      if (this.showMonthPicker) {
        return;
      }
      if (this.showYearPicker) {
        const year = this.tempYear || this.currentPeriod.year;
        this.tempYear = Math.max(year - this.yearsPerPage, 0);
        return;
      }

      this.jumpMonth(-1);
    },

    onClickArrowNext(e) {
      if (this.showMonthPicker) {
        return;
      }
      if (this.showYearPicker) {
        const year = this.tempYear || this.currentPeriod.year;
        this.tempYear = Math.max(year + this.yearsPerPage, 0);
        return;
      }

      this.jumpMonth(1);
    },

    processUserInput(userText) {
      const userDate = this.parseDateString(userText, this.displayFormat || this.format);

      this.inputValue = userText;

      this.$emit('input', userDate ? this.formatDateToString(userDate, this.format) : userText);
    },

    toggleMonthPicker() {
      this.showMonthPicker = !this.showMonthPicker;
      this.onToggleMonthPicker();
    },

    onToggleMonthPicker() {
      if (this.showMonthPicker === true) {
        this.showYearPicker = false;
      }
    },

    toggleYearPicker() {
      this.showYearPicker = !this.showYearPicker;
      this.onToggleYearPicker();
    },

    onToggleYearPicker() {
      if (this.showYearPicker === true) {
        this.showMonthPicker = false;
      }
    },

    toggle() {
      return this.opened ? this.close() : this.open();
    },

    open() {
      if (!this.opened) {
        this.opened = true;
        this.currentPeriod = this.startPeriod || this.getPeriodFromValue(this.value, this.format);
        this.addCloseEvents();
        this.setupPosition();
      }
      this.direction = undefined;
    },

    close() {
      if (this.opened) {
        this.opened = false;
        this.direction = undefined;
        this.removeCloseEvents();
        this.teardownPosition();
      }
    },

    closeViaOverlay(e) {
      if (this.hasInputElement && e.target === this.$refs.outerWrap) {
        this.close();
      }
    },

    addCloseEvents() {
      if (!this.closeEventListener) {
        this.closeEventListener = (e) => this.inspectCloseEvent(e);
        ['click', 'keyup', 'focusin'].forEach((eventName) =>
          document.addEventListener(eventName, this.closeEventListener)
        );
      }
    },

    inspectCloseEvent(event) {
      if (event.keyCode) {
        event.keyCode === 27 && this.close();
      } else if (!(event.target === this.$el) && !this.$el.contains(event.target)) {
        if (
          (event.target.classList.contains('month') || event.target.classList.contains('year')) &&
          event.target.classList.contains('vdpCellContent')
        ) {
          return;
        }
        this.close();
      }
    },

    removeCloseEvents() {
      if (this.closeEventListener) {
        ['click', 'keyup', 'focusin'].forEach((eventName) =>
          document.removeEventListener(eventName, this.closeEventListener)
        );

        delete this.closeEventListener;
      }
    },

    setupPosition() {
      if (!this.positionEventListener) {
        this.positionEventListener = () => this.positionFloater();
        window.addEventListener('resize', this.positionEventListener);
      }

      this.positionFloater();
    },

    positionFloater() {
      const inputRect = this.$el.getBoundingClientRect();

      let verticalClass = 'vdpPositionTop';
      let horizontalClass = 'vdpPositionLeft';

      const calculate = () => {
        const rect = this.$refs.outerWrap.getBoundingClientRect();
        const floaterHeight = rect.height;
        const floaterWidth = rect.width;

        if (window.innerWidth > this.mobileBreakpointWidth) {
          // vertical
          if (
            inputRect.top + inputRect.height + floaterHeight > window.innerHeight &&
            inputRect.top - floaterHeight > 0
          ) {
            verticalClass = 'vdpPositionBottom';
          }

          // horizontal
          if (inputRect.left + floaterWidth > window.innerWidth) {
            horizontalClass = 'vdpPositionRight';
          }

          this.positionClass = ['vdpPositionReady', verticalClass, horizontalClass].join(' ');
        } else {
          this.positionClass = 'vdpPositionFixed';
        }
      };

      this.$refs.outerWrap ? calculate() : this.$nextTick(calculate);
    },

    teardownPosition() {
      if (this.positionEventListener) {
        this.positionClass = undefined;
        window.removeEventListener('resize', this.positionEventListener);
        delete this.positionEventListener;
      }
    },

    clear() {
      this.$emit('input', '');
    },

    selectDateItem(item) {
      if (!item.disabled) {
        const newDate = new Date(item.date);

        if (this.currentTime) {
          newDate.setHours(this.currentTime.hours);
          newDate.setMinutes(this.currentTime.minutes);
          newDate.setSeconds(this.currentTime.seconds);
        }

        this.$emit('input', this.formatDateToString(newDate, this.format));

        if (this.hasInputElement && !this.pickTime) {
          this.close();
        }
      }
    },

    selectMonthItem(item) {
      if (!item.disabled) {
        const newDate = this.updateValidDate({month: item.value});

        if (this.currentTime) {
          newDate.setHours(this.currentTime.hours);
          newDate.setMinutes(this.currentTime.minutes);
          newDate.setSeconds(this.currentTime.seconds);
        }

        this.$emit('input', this.formatDateToString(newDate, this.format));

        this.toggleMonthPicker();
      }
    },

    selectYearItem(item) {
      if (!item.disabled) {
        const newDate = this.updateValidDate({year: item.value});

        if (this.currentTime) {
          newDate.setHours(this.currentTime.hours);
          newDate.setMinutes(this.currentTime.minutes);
          newDate.setSeconds(this.currentTime.seconds);
        }

        this.$emit('input', this.formatDateToString(newDate, this.format));

        this.toggleYearPicker();
      }
    },

    set12HourClock(value) {
      const currentDate = new Date(this.valueDate);
      const currentHours = currentDate.getHours();

      currentDate.setHours(value === 'PM' ? currentHours + 12 : currentHours - 12);

      this.$emit('input', this.formatDateToString(currentDate, this.format));
    },

    inputHours(event) {
      const currentDate = new Date(this.valueDate);
      const currentHours = currentDate.getHours();
      const targetValue = parseInt(event.target.value, 10) || 0;
      const minHours = this.use12HourClock ? 1 : 0;
      const maxHours = this.use12HourClock ? 12 : 23;
      const numValue = boundNumber(targetValue, minHours, maxHours);

      currentDate.setHours(this.use12HourClock ? to24HourClock(numValue, isPM(currentHours)) : numValue);
      event.target.value = padNum(numValue, 1);
      this.$emit('input', this.formatDateToString(currentDate, this.format));
    },

    inputTime(method, event) {
      const currentDate = new Date(this.valueDate);
      const targetValue = parseInt(event.target.value) || 0;
      const numValue = boundNumber(targetValue, 0, 59);

      event.target.value = padNum(numValue, 2);
      currentDate[method](numValue);

      this.$emit('input', this.formatDateToString(currentDate, this.format));
    },

    onTimeInputFocus(event) {
      event.target.select && event.target.select();
    },

    updateValidDate({month, year}) {
      const valueDate = this.valueDate || new Date();
      const datePart = this.currentPeriod;

      if (isValidMonth(month)) {
        datePart.month = month;
      }

      if (isValidFullYear(year)) {
        datePart.year = year;
      }

      if (!isValidDate(valueDate.getDate(), datePart.month, datePart.year)) {
        datePart.month = month + 1;
        datePart.date = 0;
      } else {
        datePart.date = valueDate.getDate();
      }

      valueDate.setFullYear(datePart.year, datePart.month - 1, datePart.date);

      return valueDate;
    }
  }
};
</script>

<style lang="scss">
@import './VueDatePicker.scss';
</style>
