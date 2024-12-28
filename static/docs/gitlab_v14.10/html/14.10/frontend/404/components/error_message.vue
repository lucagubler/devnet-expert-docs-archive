<script>
import GlLink from '@gitlab/ui/dist/components/base/link/link';

export default {
  components: {
    GlLink,
  },
  inject: {
    archivesPath: {
      type: String,
      default: '',
    },
  },
  props: {
    isProduction: {
      type: Boolean,
      required: true,
    },
    isOffline: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<template>
  <div class="d-flex justify-content-center">
    <h2 class="py-4">There's no page at this address!</h2>

    <p v-if="isProduction && isOffline" class="gray js-error-description">
      You attempted to view an older version of the documentation that is no longer available on
      this site. Please select a newer version from the menu above or access an
      <gl-link :href="archivesPath" target="_blank">archive</gl-link> of the older version.
    </p>
  </div>
</template>
