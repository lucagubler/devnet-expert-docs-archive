<script>
import { flattenItems } from '../../shared/toc/flatten_items';
import CollapsibleContainer from './collapsible_container.vue';
import TableOfContentsList from './table_of_contents_list.vue';

export default {
  name: 'TableOfContents',
  components: {
    CollapsibleContainer,
    TableOfContentsList,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    helpAndFeedbackId: {
      type: String,
      required: false,
      default: '',
    },
    hasHelpAndFeedback: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      isCollapsed: true,
    };
  },
  computed: {
    helpAndFeedbackItems() {
      if (!this.hasHelpAndFeedback) {
        return [];
      }

      return [
        {
          text: 'Help and feedback',
          href: `#${this.helpAndFeedbackId}`,
          id: null,
          items: [],
          withSeparator: true,
        },
      ];
    },
    allItems() {
      // Flatten the items so that only one is highlighted at a time
      return flattenItems(this.items.concat(this.helpAndFeedbackItems));
    },
    collapseIconClass() {
      return this.isCollapsed ? 'fa-angle-right' : 'fa-angle-down';
    },
  },
  methods: {
    toggleCollapse() {
      this.$refs.container.collapse(!this.isCollapsed);
    },
  },
};
</script>
<template>
  <div class="markdown-toc table-of-contents-container position-sticky">
    <div class="table-of-contents">
      <h4 class="border-0 toc-sm d-xl-none">
        <a
          class="d-flex text-decoration-none border-bottom-0"
          href="#"
          role="button"
          :aria-expanded="!isCollapsed"
          aria-controls="markdown-toc"
          data-testid="collapse"
          @click.prevent="toggleCollapse"
        >
          <i
            class="fa d-flex align-items-center justify-content-center mr-1 gl-w-3"
            :class="collapseIconClass"
            role="presentation"
          ></i>
          On this page
        </a>
      </h4>
      <h4 class="border-0 gl-font-base font-weight-bold toc-lg">On this page</h4>
      <collapsible-container ref="container" v-model="isCollapsed" data-testid="container">
        <table-of-contents-list :items="allItems" class="my-0" data-testid="main-list" />
      </collapsible-container>
    </div>
  </div>
</template>
