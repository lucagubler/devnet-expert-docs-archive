<script>
import GlButton from '@gitlab/ui/src/components/base/button/button.vue';

export default {
  components: {
    GlButton,
  },
  props: {
    targetSelector: {
      type: Array,
      required: true,
    },
  },
  methods: {
    toggle() {
      this.targetSelector.forEach((el) => {
        const target = document.querySelector(el);

        if (!target) {
          return;
        }

        target.classList.toggle('active');
      });
    },
  },
};
</script>

<template>
  <gl-button class="nav-toggle border-right-0" @click="toggle">
    <!--
    TODO: Replace arrows with 'angle-double-right' icon using the icon component from gitlab-ui
          We'll do this once https://gitlab.com/gitlab-org/gitlab-ui/issues/98 is complete.
          Issue to add gitlab-ui to this project: https://gitlab.com/gitlab-org/gitlab-docs/issues/443
    -->
    <div class="d-flex align-items-center">
      <span class="arrow"></span>
      <span class="arrow"></span>
      <div class="label">Collapse sidebar</div>
    </div>
  </gl-button>
</template>
