# Customizing appearance

## CSS
Vue Date Picker colors can be adjusted with following selectors if you are using library css file directly (@therunninghub/vue-date-picker/dist/VueDatePicker.css)
```css
.vdpArrowPrev:after {
    border-right-color: #cc99cd;
}

.vdpArrowNext:after {
    border-left-color: #cc99cd;
}

.vdpCell.selectable:hover .vdpCellContent,
.vdpCell.selected .vdpCellContent {
    background: #cc99cd;
}

.vdpCell.today {
    color: #cc99cd;
}

.vdpTimeUnit > input:hover,
.vdpTimeUnit > input:focus {
    border-bottom-color: #cc99cd;
}
```

## SCSS
If you are compiling your css files with sass - library source scss file can be imported.
Add your customizations to override default styling.

```scss
$vdpColor: #fe5800 !default;
$vdpTextColor: $white !default;
$vdpBorderRadius: 0.25rem !default;
$vdpClearButtonColor: #dc3545 !default;
$vdpPeriodControlHoverTextColor: $white !default;
$vdpPeriodControlHoverBackgroundColor: #6c757d !default;
$vdpInputReadOnlyBackgroundColor: $white !default;
$vdpPeriodControlButtonBorderRadius: $vdpBorderRadius !default;
$vdpSelectedDateBorderRadius: 100% !default;
$vdpSelectedMonthBorderRadius: $vdpBorderRadius !default;

@import '@therunninghub/vue-date-picker/src/VueDatePicker.scss';
```
