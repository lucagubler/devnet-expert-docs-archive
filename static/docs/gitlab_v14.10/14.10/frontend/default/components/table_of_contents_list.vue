<script>
export default {
  name: 'TableOfContentsList',
  props: {
    items: {
      type: Array,
      required: true,
    },
    level: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  computed: {
    allItems() {
      return this.items.map((item) => {
        const level = this.level + (item.level || 0);

        return {
          ...item,
          level,
          levelClass: `toc-level-${level}`,
        };
      });
    },
  },
};
</script>
<template>
  <ul class="nav nav-pills flex-column">
    <li v-for="(item, index) in allItems" :key="`${item.text}_${index}`" class="mb-0">
      <a :id="item.id" class="nav-link d-block" :href="item.href" :class="item.levelClass">{{
        item.text
      }}</a>
      <table-of-contents-list
        v-if="item.items && item.items.length"
        :items="item.items"
        :level="item.level + 1"
      />
    </li>
  </ul>
</template>
