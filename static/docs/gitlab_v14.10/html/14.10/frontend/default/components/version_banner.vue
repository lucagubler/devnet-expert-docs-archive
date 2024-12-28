<script>
import DocsBanner from '../../shared/components/docs_banner.vue';

export default {
  components: {
    DocsBanner,
  },
  props: {
    isOutdated: {
      type: Boolean,
      required: true,
    },
    latestVersionUrl: {
      type: String,
      required: true,
    },
    archivesUrl: {
      type: String,
      required: true,
    },
  },
  methods: {
    toggleVersionBanner(isVisible) {
      this.$emit('toggleVersionBanner', isVisible);
    },
  },
};
</script>

<template>
  <docs-banner :show="isOutdated" @toggle="toggleVersionBanner">
    This is <a :href="archivesUrl">archived documentation</a> for GitLab. Go to
    <a :href="latestVersionUrl">the latest</a>.
  </docs-banner>
</template>
