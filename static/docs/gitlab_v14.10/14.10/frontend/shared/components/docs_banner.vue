<script>
export default {
  props: {
    text: {
      type: String,
      required: false,
      default: '',
    },
    show: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      isVisible: this.show,
    };
  },
  mounted() {
    this.toggleBanner(this.isVisible);
  },
  methods: {
    toggleBanner(isVisible) {
      this.$emit('toggle', isVisible);
      this.isVisible = isVisible;
    },
  },
};
</script>

<template>
  <div v-if="isVisible" class="banner position-fixed w-100 text-center">
    <span v-if="text">{{ text }}</span>
    <slot></slot>
    <!-- TODO: Replace the 'x' below with a gl-icon component once gitlab-ui becomes available in the docs -->
    <button class="btn btn-close pull-right" @click="toggleBanner(false)">x</button>
  </div>
</template>
