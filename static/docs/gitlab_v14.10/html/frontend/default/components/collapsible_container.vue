<script>
import { getOuterHeight } from '../../shared/dom';

export default {
  name: 'CollapsibleContainer',
  model: {
    prop: 'isCollapsed',
    event: 'change',
  },
  props: {
    isCollapsed: {
      type: Boolean,
      required: true,
    },
    collapsingClass: {
      type: String,
      required: false,
      default: 'sm-collapsing',
    },
    collapsedClass: {
      type: String,
      required: false,
      default: 'sm-collapsed',
    },
  },
  data() {
    return {
      isCollapsing: false,
      collapsingHeight: 0,
    };
  },
  computed: {
    styles() {
      if (this.isCollapsing) {
        return {
          height: `${this.collapsingHeight}px`,
        };
      }

      return {};
    },
    classes() {
      if (this.isCollapsing) {
        return this.collapsingClass;
      }
      if (this.isCollapsed) {
        return this.collapsedClass;
      }

      return '';
    },
  },
  methods: {
    collapse(shouldCollapse) {
      if (this.isCollapsing) {
        return;
      }
      // Right away let's flag that we're collapsing so we don't accept anymore updates
      this.isCollapsing = true;

      // Let's let our parent go ahead and treat us as collapsed.
      this.$emit('change', shouldCollapse);

      // Get start/stop height based on if we're collapsing or expanding
      const containerHeight = getOuterHeight(this.$el);
      const startHeight = shouldCollapse ? containerHeight : 0;
      const stopHeight = shouldCollapse ? 0 : containerHeight;

      // Kick off transition
      this.collapsingHeight = startHeight;
      setTimeout(() => {
        this.collapsingHeight = stopHeight;
      }, 50);

      setTimeout(() => {
        this.isCollapsing = false;
      }, 400);
    },
  },
};
</script>
<template>
  <div :class="classes" :style="styles">
    <slot></slot>
  </div>
</template>
