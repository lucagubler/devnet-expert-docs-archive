<script>
import data from '@gitlab/svgs/dist/icons.json';
import { iconSizeOptions } from '../constants';

let iconValidator = () => true;

const { icons } = data;
iconValidator = (value) => {
  if (icons.includes(value)) {
    return true;
  }
  // eslint-disable-next-line no-console
  console.warn(`Icon '${value}' is not a known icon of @gitlab/svgs`);
  return false;
};

/** This is a re-usable vue component for rendering a svg sprite icon
 *  @example
 *  <icon
 *    name="retry"
 *    :size="32"
 *    class="top"
 *  />
 */
export default {
  props: {
    name: {
      type: String,
      required: true,
      validator: iconValidator,
    },
    size: {
      type: Number,
      required: false,
      default: 16,
      validator: (value) => iconSizeOptions.includes(value),
    },
    className: {
      type: String,
      required: false,
      default: '',
    },
  },

  computed: {
    iconSizeClass() {
      return this.size ? `s${this.size}` : '';
    },
    iconHref() {
      return `#${this.name}`;
    },
  },
};
</script>

<template>
  <svg :class="['gl-icon', iconSizeClass, className]">
    <use :href="iconHref" />
  </svg>
</template>
