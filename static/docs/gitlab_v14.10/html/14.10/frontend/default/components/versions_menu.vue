<script>
import { GlDropdown, GlDropdownItem, GlDropdownDivider } from '@gitlab/ui';
import { getVersions } from '../../services/fetch_versions';
import { isGitLabHosted } from '../environment';

export default {
  components: {
    GlDropdown,
    GlDropdownItem,
    GlDropdownDivider,
  },
  data() {
    return {
      versions: {},
      activeVersion: '',
    };
  },
  async created() {
    // Only build this menu if this is a GitLab-hosted copy of the site.
    // Self-hosted Docs will only contain a single version.
    if (isGitLabHosted()) {
      try {
        this.versions = await getVersions();
        this.activeVersion = this.getActiveVersion(this.versions);
      } catch (err) {
        console.error(`Failed to fetch versions.json: ${err}`); // eslint-disable-line no-console
      }
    }
  },
  methods: {
    getVersionPath(versionNumber) {
      let path = window.location.pathname;

      // If we're viewing an older version, drop its version prefix when creating links.
      if (this.activeVersion !== this.versions.next) {
        const pathArr = window.location.pathname.split('/').filter((n) => n);
        pathArr.shift();
        path = `/${pathArr.join('/')}`;
      }

      if (versionNumber) {
        path = `/${versionNumber}${path}`;
      }
      return path;
    },
    getActiveVersion(versions) {
      let activeVersion = versions.next;

      // Check if the first item in the URL path is a valid version.
      // If so, that should be the active menu item.
      const versionPath = window.location.pathname.split('/')[1];

      Object.keys(versions).forEach((key) => {
        if (
          versions[key] === versionPath ||
          (versions[key].constructor === Array && versions[key].includes(versionPath))
        ) {
          activeVersion = versionPath;
        }
      });
      return activeVersion;
    },
  },
};
</script>

<template>
  <gl-dropdown
    v-if="versions.next"
    :text="activeVersion"
    class="mb-2 mb-md-0 mr-md-3 ml-md-3 d-flex"
    data-testid="versions-menu"
  >
    <gl-dropdown-item :href="getVersionPath()">
      <span data-testid="next-version">{{ versions.next }}</span> (not yet released)
    </gl-dropdown-item>
    <gl-dropdown-divider />

    <gl-dropdown-item :href="getVersionPath(versions.current)">
      {{ versions.current }} (recently released)
    </gl-dropdown-item>
    <gl-dropdown-item v-for="v in versions.last_minor" :key="v" :href="getVersionPath(v)">
      {{ v }}
    </gl-dropdown-item>
    <gl-dropdown-divider />

    <gl-dropdown-item v-for="v in versions.last_major" :key="v" :href="getVersionPath(v)">
      {{ v }}
    </gl-dropdown-item>
    <gl-dropdown-divider />

    <gl-dropdown-item href="/archives">Archives</gl-dropdown-item>
  </gl-dropdown>
</template>
