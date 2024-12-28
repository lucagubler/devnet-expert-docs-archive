(function() {
  const classes = ['core-only', 'core', 'starter-only', 'premium-only', 'ultimate-only', 'starter', 'premium', 'ultimate', 'free-only' , 'bronze-only', 'silver-only', 'gold-only', 'free', 'free-saas', 'free-self', 'premium-saas', 'premium-self', 'ultimate-saas', 'ultimate-self'];

  const BADGES_TITLES = {
    // Free
    free: 'Available in GitLab Free self-managed, GitLab Free SaaS, and higher tiers.',
    'free-self':
      'Available in GitLab Free self-managed and higher tiers. Not available in GitLab SaaS.',
    'free-only':
      'Available in GitLab Free SaaS and higher tiers. Not available in self-managed instances.',
    'free-saas':
      'Available in GitLab Free SaaS and higher tiers. Not available in self-managed instances.',
    // Premium
    premium: 'Available in GitLab Premium self-managed, GitLab Premium SaaS, and higher tiers.',
    'premium-saas':
      'Available in GitLab Premium SaaS and higher tiers. Not available in self-managed instances.',
    'silver-only':
      'Available in GitLab Premium SaaS and higher tiers. Not available in self-managed instances.',
    'premium-only':
      'Available in GitLab Premium self-managed and higher tiers. Not available in GitLab SaaS.',
    'premium-self':
      'Available in GitLab Premium self-managed and higher tiers. Not available in GitLab SaaS.',
    // Ultimate
    ultimate: 'Available in GitLab Ultimate self-managed and GitLab Ultimate SaaS.',
    'ultimate-only':
      'Available in GitLab Ultimate self-managed. Not available in GitLab SaaS.',
    'ultimate-self':
      'Available in GitLab Ultimate self-managed. Not available in GitLab SaaS.',
    'ultimate-saas':
      'Available in GitLab Ultimate SaaS. Not available in self-managed instances.',
    'gold-only':
      'Available in GitLab Ultimate SaaS. Not available in self-managed instances.',
    // Deprecated badges
    core: 'Available in GitLab Free self-managed, GitLab Free SaaS, and higher tiers',
    'core-only':
      'Available in GitLab Free self-managed and higher tiers. Not available in GitLab SaaS.',
    starter: 'Available in GitLab Starter, GitLab.com Bronze, and higher tiers.',
    'starter-only':
      'Available in GitLab Starter and higher tiers. Not available in GitLab.com.',
    'bronze-only':
      'Available in GitLab Bronze and higher tiers. Not available in self-managed instances.',
  };

  const BADGES_MAPPING = {
    // Free
    core: ['all tiers'],
    free: ['all tiers'],
    'core-only': ['all tiers', 'self-managed'],
    'free-self': ['all tiers', 'self-managed'],
    'free-only': ['all tiers', 'saas'],
    'free-saas': ['all tiers', 'saas'],
    // Premium
    premium: ['premium'],
    'silver-only': ['premium', 'saas'],
    'premium-only': ['premium', 'self-managed'],
    'premium-self': ['premium', 'self-managed'],
    'premium-saas': ['premium', 'saas'],
    // Ultimate
    ultimate: ['ultimate'],
    'ultimate-only': ['ultimate', 'self-managed'],
    'gold-only': ['ultimate', 'saas'],
    'ultimate-self': ['ultimate', 'self-managed'],
    'ultimate-saas': ['ultimate', 'saas'],
    // Deprecated badges
    starter: ['starter', 'bronze'],
    'starter-only': ['starter'],
    'bronze-only': ['bronze'],
  };

  const BADGES_CLASS = {
    // Tier class
    core: 'tier',
    starter: 'tier',
    premium: 'tier',
    ultimate: 'tier',
    'all tiers': 'tier',
    // GitLab SaaS
    bronze: 'saas',
    silver: 'saas',
    gold: 'saas',
    saas: 'saas',
    // GitLab self-managed
    'self-managed': 'self-managed',
  };

  function init() {
    var $badges = $('.badge-trigger');

    $badges.each(function() {
      convertBadge($(this));
    });

    $('[data-toggle="tooltip"]').tooltip();
  }

  function convertBadge($badge) {
    var small = isSmall($badge);
    var badgeType = retrieveBadgeType($badge);

    var smallBadgeTag = function(title) {
      return $('<span>', {
        class: 'badge-small',
        html: '<svg role="img" aria-label="note" class="gl-icon ml-1 mr-1 s14"><use href="/assets/images/icons.svg#information-o" /> <title> note </title> </svg>',
        'data-title': title,
      });
    };

    var largeBadgeTag = function(badge, badgeClass) {
      return $('<div>', {
        class: 'badge-display badge-' + badgeClass,
        text: badge,
      });
    };

    var template = function(title, badges) {
      var container = $('<a>', {
        class: 'badges-drop',
        'data-toggle': 'tooltip',
        'data-placement': 'top',
        'target': '_blank',
        title: title,
        href: 'https://about.gitlab.com/pricing/?glm_source=docs.gitlab.com&glm_content=badges-docs'
      });
      container.append($('<span>').append(badges));

      return container;
    };

    var tags = [];

    if (small) {
      tags.push(smallBadgeTag(BADGES_MAPPING[badgeType].join(' | ')));
    } else {
      $.each(BADGES_MAPPING[badgeType], function(i, badge) {
        tags.push(largeBadgeTag(badge, BADGES_CLASS[badge]));
      });
    }

    $badge.append($(template(BADGES_TITLES[badgeType], tags)));
  }

  // Get the badge type from a specific list of expected values in element class
  function retrieveBadgeType($badge) {
    const classType = $badge.attr('class').split(' ');
    const match = classes.filter(matchingClass => classType.includes(matchingClass));
    if (match) {
      return match.pop();
    }
  }

  // When badge is not in a HTML header, we use the small version
  function isSmall($badge) {
    return !$badge
      .parent()
      .prop('tagName')
      .match(/H1|H2|H3|H4|H5/);
  }

  $(function() {
    init();
  });
})();
