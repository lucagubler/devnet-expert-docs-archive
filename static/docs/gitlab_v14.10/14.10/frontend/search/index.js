(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function clone(value) {
	  if (typeof value === 'object' && value !== null) {
	    return _merge(Array.isArray(value) ? [] : {}, value);
	  }
	  return value;
	}

	function isObjectOrArrayOrFunction(value) {
	  return (
	    typeof value === 'function' ||
	    Array.isArray(value) ||
	    Object.prototype.toString.call(value) === '[object Object]'
	  );
	}

	function _merge(target, source) {
	  if (target === source) {
	    return target;
	  }

	  for (var key in source) {
	    if (
	      !Object.prototype.hasOwnProperty.call(source, key) ||
	      key === '__proto__'
	    ) {
	      continue;
	    }

	    var sourceVal = source[key];
	    var targetVal = target[key];

	    if (typeof targetVal !== 'undefined' && typeof sourceVal === 'undefined') {
	      continue;
	    }

	    if (
	      isObjectOrArrayOrFunction(targetVal) &&
	      isObjectOrArrayOrFunction(sourceVal)
	    ) {
	      target[key] = _merge(targetVal, sourceVal);
	    } else {
	      target[key] = clone(sourceVal);
	    }
	  }
	  return target;
	}

	/**
	 * This method is like Object.assign, but recursively merges own and inherited
	 * enumerable keyed properties of source objects into the destination object.
	 *
	 * NOTE: this behaves like lodash/merge, but:
	 * - does mutate functions if they are a source
	 * - treats non-plain objects as plain
	 * - does not work for circular objects
	 * - treats sparse arrays as sparse
	 * - does not convert Array-like objects (Arguments, NodeLists, etc.) to arrays
	 *
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @returns {Object} Returns `object`.
	 */

	function merge$6(target) {
	  if (!isObjectOrArrayOrFunction(target)) {
	    target = {};
	  }

	  for (var i = 1, l = arguments.length; i < l; i++) {
	    var source = arguments[i];

	    if (isObjectOrArrayOrFunction(source)) {
	      _merge(target, source);
	    }
	  }
	  return target;
	}

	var merge_1 = merge$6;

	// NOTE: this behaves like lodash/defaults, but doesn't mutate the target
	// it also preserve keys order
	var defaultsPure$3 = function defaultsPure() {
	  var sources = Array.prototype.slice.call(arguments);

	  return sources.reduceRight(function(acc, source) {
	    Object.keys(Object(source)).forEach(function(key) {
	      if (source[key] === undefined) {
	        return;
	      }
	      if (acc[key] !== undefined) {
	        // remove if already added, so that we can add it in correct order
	        delete acc[key];
	      }
	      acc[key] = source[key];
	    });
	    return acc;
	  }, {});
	};

	function intersection$1(arr1, arr2) {
	  return arr1.filter(function(value, index) {
	    return (
	      arr2.indexOf(value) > -1 &&
	      arr1.indexOf(value) === index /* skips duplicates */
	    );
	  });
	}

	var intersection_1 = intersection$1;

	// @MAJOR can be replaced by native Array#find when we change support
	var find$5 = function find(array, comparator) {
	  if (!Array.isArray(array)) {
	    return undefined;
	  }

	  for (var i = 0; i < array.length; i++) {
	    if (comparator(array[i])) {
	      return array[i];
	    }
	  }
	};

	function valToNumber$1(v) {
	  if (typeof v === 'number') {
	    return v;
	  } else if (typeof v === 'string') {
	    return parseFloat(v);
	  } else if (Array.isArray(v)) {
	    return v.map(valToNumber$1);
	  }

	  throw new Error('The value should be a number, a parsable string or an array of those.');
	}

	var valToNumber_1 = valToNumber$1;

	// https://github.com/babel/babel/blob/3aaafae053fa75febb3aa45d45b6f00646e30ba4/packages/babel-helpers/src/helpers.js#L604-L620
	function _objectWithoutPropertiesLoose$7(source, excluded) {
	  if (source === null) return {};
	  var target = {};
	  var sourceKeys = Object.keys(source);
	  var key;
	  var i;
	  for (i = 0; i < sourceKeys.length; i++) {
	    key = sourceKeys[i];
	    if (excluded.indexOf(key) >= 0) continue;
	    target[key] = source[key];
	  }
	  return target;
	}

	var omit$3 = _objectWithoutPropertiesLoose$7;

	function objectHasKeys$3(obj) {
	  return obj && Object.keys(obj).length > 0;
	}

	var objectHasKeys_1 = objectHasKeys$3;

	var isValidUserToken$1 = function isValidUserToken(userToken) {
	  if (userToken === null) {
	    return false;
	  }
	  return /^[a-zA-Z0-9_-]{1,64}$/.test(userToken);
	};

	/**
	 * Functions to manipulate refinement lists
	 *
	 * The RefinementList is not formally defined through a prototype but is based
	 * on a specific structure.
	 *
	 * @module SearchParameters.refinementList
	 *
	 * @typedef {string[]} SearchParameters.refinementList.Refinements
	 * @typedef {Object.<string, SearchParameters.refinementList.Refinements>} SearchParameters.refinementList.RefinementList
	 */

	var defaultsPure$2 = defaultsPure$3;
	var omit$2 = omit$3;
	var objectHasKeys$2 = objectHasKeys_1;

	var lib$1 = {
	  /**
	   * Adds a refinement to a RefinementList
	   * @param {RefinementList} refinementList the initial list
	   * @param {string} attribute the attribute to refine
	   * @param {string} value the value of the refinement, if the value is not a string it will be converted
	   * @return {RefinementList} a new and updated refinement list
	   */
	  addRefinement: function addRefinement(refinementList, attribute, value) {
	    if (lib$1.isRefined(refinementList, attribute, value)) {
	      return refinementList;
	    }

	    var valueAsString = '' + value;

	    var facetRefinement = !refinementList[attribute] ?
	      [valueAsString] :
	      refinementList[attribute].concat(valueAsString);

	    var mod = {};

	    mod[attribute] = facetRefinement;

	    return defaultsPure$2({}, mod, refinementList);
	  },
	  /**
	   * Removes refinement(s) for an attribute:
	   *  - if the value is specified removes the refinement for the value on the attribute
	   *  - if no value is specified removes all the refinements for this attribute
	   * @param {RefinementList} refinementList the initial list
	   * @param {string} attribute the attribute to refine
	   * @param {string} [value] the value of the refinement
	   * @return {RefinementList} a new and updated refinement lst
	   */
	  removeRefinement: function removeRefinement(refinementList, attribute, value) {
	    if (value === undefined) {
	      // we use the "filter" form of clearRefinement, since it leaves empty values as-is
	      // the form with a string will remove the attribute completely
	      return lib$1.clearRefinement(refinementList, function(v, f) {
	        return attribute === f;
	      });
	    }

	    var valueAsString = '' + value;

	    return lib$1.clearRefinement(refinementList, function(v, f) {
	      return attribute === f && valueAsString === v;
	    });
	  },
	  /**
	   * Toggles the refinement value for an attribute.
	   * @param {RefinementList} refinementList the initial list
	   * @param {string} attribute the attribute to refine
	   * @param {string} value the value of the refinement
	   * @return {RefinementList} a new and updated list
	   */
	  toggleRefinement: function toggleRefinement(refinementList, attribute, value) {
	    if (value === undefined) throw new Error('toggleRefinement should be used with a value');

	    if (lib$1.isRefined(refinementList, attribute, value)) {
	      return lib$1.removeRefinement(refinementList, attribute, value);
	    }

	    return lib$1.addRefinement(refinementList, attribute, value);
	  },
	  /**
	   * Clear all or parts of a RefinementList. Depending on the arguments, three
	   * kinds of behavior can happen:
	   *  - if no attribute is provided: clears the whole list
	   *  - if an attribute is provided as a string: clears the list for the specific attribute
	   *  - if an attribute is provided as a function: discards the elements for which the function returns true
	   * @param {RefinementList} refinementList the initial list
	   * @param {string} [attribute] the attribute or function to discard
	   * @param {string} [refinementType] optional parameter to give more context to the attribute function
	   * @return {RefinementList} a new and updated refinement list
	   */
	  clearRefinement: function clearRefinement(refinementList, attribute, refinementType) {
	    if (attribute === undefined) {
	      if (!objectHasKeys$2(refinementList)) {
	        return refinementList;
	      }
	      return {};
	    } else if (typeof attribute === 'string') {
	      return omit$2(refinementList, [attribute]);
	    } else if (typeof attribute === 'function') {
	      var hasChanged = false;

	      var newRefinementList = Object.keys(refinementList).reduce(function(memo, key) {
	        var values = refinementList[key] || [];
	        var facetList = values.filter(function(value) {
	          return !attribute(value, key, refinementType);
	        });

	        if (facetList.length !== values.length) {
	          hasChanged = true;
	        }
	        memo[key] = facetList;

	        return memo;
	      }, {});

	      if (hasChanged) return newRefinementList;
	      return refinementList;
	    }
	  },
	  /**
	   * Test if the refinement value is used for the attribute. If no refinement value
	   * is provided, test if the refinementList contains any refinement for the
	   * given attribute.
	   * @param {RefinementList} refinementList the list of refinement
	   * @param {string} attribute name of the attribute
	   * @param {string} [refinementValue] value of the filter/refinement
	   * @return {boolean}
	   */
	  isRefined: function isRefined(refinementList, attribute, refinementValue) {
	    var containsRefinements = !!refinementList[attribute] &&
	      refinementList[attribute].length > 0;

	    if (refinementValue === undefined || !containsRefinements) {
	      return containsRefinements;
	    }

	    var refinementValueAsString = '' + refinementValue;

	    return refinementList[attribute].indexOf(refinementValueAsString) !== -1;
	  }
	};

	var RefinementList$1 = lib$1;

	var merge$5 = merge_1;
	var defaultsPure$1 = defaultsPure$3;
	var intersection = intersection_1;
	var find$4 = find$5;
	var valToNumber = valToNumber_1;
	var omit$1 = omit$3;
	var objectHasKeys$1 = objectHasKeys_1;
	var isValidUserToken = isValidUserToken$1;

	var RefinementList = RefinementList$1;

	/**
	 * isEqual, but only for numeric refinement values, possible values:
	 * - 5
	 * - [5]
	 * - [[5]]
	 * - [[5,5],[4]]
	 */
	function isEqualNumericRefinement(a, b) {
	  if (Array.isArray(a) && Array.isArray(b)) {
	    return (
	      a.length === b.length &&
	      a.every(function(el, i) {
	        return isEqualNumericRefinement(b[i], el);
	      })
	    );
	  }
	  return a === b;
	}

	/**
	 * like _.find but using deep equality to be able to use it
	 * to find arrays.
	 * @private
	 * @param {any[]} array array to search into (elements are base or array of base)
	 * @param {any} searchedValue the value we're looking for (base or array of base)
	 * @return {any} the searched value or undefined
	 */
	function findArray(array, searchedValue) {
	  return find$4(array, function(currentValue) {
	    return isEqualNumericRefinement(currentValue, searchedValue);
	  });
	}

	/**
	 * The facet list is the structure used to store the list of values used to
	 * filter a single attribute.
	 * @typedef {string[]} SearchParameters.FacetList
	 */

	/**
	 * Structure to store numeric filters with the operator as the key. The supported operators
	 * are `=`, `>`, `<`, `>=`, `<=` and `!=`.
	 * @typedef {Object.<string, Array.<number|number[]>>} SearchParameters.OperatorList
	 */

	/**
	 * SearchParameters is the data structure that contains all the information
	 * usable for making a search to Algolia API. It doesn't do the search itself,
	 * nor does it contains logic about the parameters.
	 * It is an immutable object, therefore it has been created in a way that each
	 * changes does not change the object itself but returns a copy with the
	 * modification.
	 * This object should probably not be instantiated outside of the helper. It will
	 * be provided when needed. This object is documented for reference as you'll
	 * get it from events generated by the {@link AlgoliaSearchHelper}.
	 * If need be, instantiate the Helper from the factory function {@link SearchParameters.make}
	 * @constructor
	 * @classdesc contains all the parameters of a search
	 * @param {object|SearchParameters} newParameters existing parameters or partial object
	 * for the properties of a new SearchParameters
	 * @see SearchParameters.make
	 * @example <caption>SearchParameters of the first query in
	 *   <a href="http://demos.algolia.com/instant-search-demo/">the instant search demo</a></caption>
	{
	   "query": "",
	   "disjunctiveFacets": [
	      "customerReviewCount",
	      "category",
	      "salePrice_range",
	      "manufacturer"
	  ],
	   "maxValuesPerFacet": 30,
	   "page": 0,
	   "hitsPerPage": 10,
	   "facets": [
	      "type",
	      "shipping"
	  ]
	}
	 */
	function SearchParameters$2(newParameters) {
	  var params = newParameters ? SearchParameters$2._parseNumbers(newParameters) : {};

	  if (params.userToken !== undefined && !isValidUserToken(params.userToken)) {
	    console.warn('[algoliasearch-helper] The `userToken` parameter is invalid. This can lead to wrong analytics.\n  - Format: [a-zA-Z0-9_-]{1,64}');
	  }
	  /**
	   * This attribute contains the list of all the conjunctive facets
	   * used. This list will be added to requested facets in the
	   * [facets attribute](https://www.algolia.com/doc/rest-api/search#param-facets) sent to algolia.
	   * @member {string[]}
	   */
	  this.facets = params.facets || [];
	  /**
	   * This attribute contains the list of all the disjunctive facets
	   * used. This list will be added to requested facets in the
	   * [facets attribute](https://www.algolia.com/doc/rest-api/search#param-facets) sent to algolia.
	   * @member {string[]}
	   */
	  this.disjunctiveFacets = params.disjunctiveFacets || [];
	  /**
	   * This attribute contains the list of all the hierarchical facets
	   * used. This list will be added to requested facets in the
	   * [facets attribute](https://www.algolia.com/doc/rest-api/search#param-facets) sent to algolia.
	   * Hierarchical facets are a sub type of disjunctive facets that
	   * let you filter faceted attributes hierarchically.
	   * @member {string[]|object[]}
	   */
	  this.hierarchicalFacets = params.hierarchicalFacets || [];

	  // Refinements
	  /**
	   * This attribute contains all the filters that need to be
	   * applied on the conjunctive facets. Each facet must be properly
	   * defined in the `facets` attribute.
	   *
	   * The key is the name of the facet, and the `FacetList` contains all
	   * filters selected for the associated facet name.
	   *
	   * When querying algolia, the values stored in this attribute will
	   * be translated into the `facetFilters` attribute.
	   * @member {Object.<string, SearchParameters.FacetList>}
	   */
	  this.facetsRefinements = params.facetsRefinements || {};
	  /**
	   * This attribute contains all the filters that need to be
	   * excluded from the conjunctive facets. Each facet must be properly
	   * defined in the `facets` attribute.
	   *
	   * The key is the name of the facet, and the `FacetList` contains all
	   * filters excluded for the associated facet name.
	   *
	   * When querying algolia, the values stored in this attribute will
	   * be translated into the `facetFilters` attribute.
	   * @member {Object.<string, SearchParameters.FacetList>}
	   */
	  this.facetsExcludes = params.facetsExcludes || {};
	  /**
	   * This attribute contains all the filters that need to be
	   * applied on the disjunctive facets. Each facet must be properly
	   * defined in the `disjunctiveFacets` attribute.
	   *
	   * The key is the name of the facet, and the `FacetList` contains all
	   * filters selected for the associated facet name.
	   *
	   * When querying algolia, the values stored in this attribute will
	   * be translated into the `facetFilters` attribute.
	   * @member {Object.<string, SearchParameters.FacetList>}
	   */
	  this.disjunctiveFacetsRefinements = params.disjunctiveFacetsRefinements || {};
	  /**
	   * This attribute contains all the filters that need to be
	   * applied on the numeric attributes.
	   *
	   * The key is the name of the attribute, and the value is the
	   * filters to apply to this attribute.
	   *
	   * When querying algolia, the values stored in this attribute will
	   * be translated into the `numericFilters` attribute.
	   * @member {Object.<string, SearchParameters.OperatorList>}
	   */
	  this.numericRefinements = params.numericRefinements || {};
	  /**
	   * This attribute contains all the tags used to refine the query.
	   *
	   * When querying algolia, the values stored in this attribute will
	   * be translated into the `tagFilters` attribute.
	   * @member {string[]}
	   */
	  this.tagRefinements = params.tagRefinements || [];
	  /**
	   * This attribute contains all the filters that need to be
	   * applied on the hierarchical facets. Each facet must be properly
	   * defined in the `hierarchicalFacets` attribute.
	   *
	   * The key is the name of the facet, and the `FacetList` contains all
	   * filters selected for the associated facet name. The FacetList values
	   * are structured as a string that contain the values for each level
	   * separated by the configured separator.
	   *
	   * When querying algolia, the values stored in this attribute will
	   * be translated into the `facetFilters` attribute.
	   * @member {Object.<string, SearchParameters.FacetList>}
	   */
	  this.hierarchicalFacetsRefinements = params.hierarchicalFacetsRefinements || {};

	  var self = this;
	  Object.keys(params).forEach(function(paramName) {
	    var isKeyKnown = SearchParameters$2.PARAMETERS.indexOf(paramName) !== -1;
	    var isValueDefined = params[paramName] !== undefined;

	    if (!isKeyKnown && isValueDefined) {
	      self[paramName] = params[paramName];
	    }
	  });
	}

	/**
	 * List all the properties in SearchParameters and therefore all the known Algolia properties
	 * This doesn't contain any beta/hidden features.
	 * @private
	 */
	SearchParameters$2.PARAMETERS = Object.keys(new SearchParameters$2());

	/**
	 * @private
	 * @param {object} partialState full or part of a state
	 * @return {object} a new object with the number keys as number
	 */
	SearchParameters$2._parseNumbers = function(partialState) {
	  // Do not reparse numbers in SearchParameters, they ought to be parsed already
	  if (partialState instanceof SearchParameters$2) return partialState;

	  var numbers = {};

	  var numberKeys = [
	    'aroundPrecision',
	    'aroundRadius',
	    'getRankingInfo',
	    'minWordSizefor2Typos',
	    'minWordSizefor1Typo',
	    'page',
	    'maxValuesPerFacet',
	    'distinct',
	    'minimumAroundRadius',
	    'hitsPerPage',
	    'minProximity'
	  ];

	  numberKeys.forEach(function(k) {
	    var value = partialState[k];
	    if (typeof value === 'string') {
	      var parsedValue = parseFloat(value);
	      // global isNaN is ok to use here, value is only number or NaN
	      numbers[k] = isNaN(parsedValue) ? value : parsedValue;
	    }
	  });

	  // there's two formats of insideBoundingBox, we need to parse
	  // the one which is an array of float geo rectangles
	  if (Array.isArray(partialState.insideBoundingBox)) {
	    numbers.insideBoundingBox = partialState.insideBoundingBox.map(function(geoRect) {
	      if (Array.isArray(geoRect)) {
	        return geoRect.map(function(value) {
	          return parseFloat(value);
	        });
	      }
	      return geoRect;
	    });
	  }

	  if (partialState.numericRefinements) {
	    var numericRefinements = {};
	    Object.keys(partialState.numericRefinements).forEach(function(attribute) {
	      var operators = partialState.numericRefinements[attribute] || {};
	      numericRefinements[attribute] = {};
	      Object.keys(operators).forEach(function(operator) {
	        var values = operators[operator];
	        var parsedValues = values.map(function(v) {
	          if (Array.isArray(v)) {
	            return v.map(function(vPrime) {
	              if (typeof vPrime === 'string') {
	                return parseFloat(vPrime);
	              }
	              return vPrime;
	            });
	          } else if (typeof v === 'string') {
	            return parseFloat(v);
	          }
	          return v;
	        });
	        numericRefinements[attribute][operator] = parsedValues;
	      });
	    });
	    numbers.numericRefinements = numericRefinements;
	  }

	  return merge$5({}, partialState, numbers);
	};

	/**
	 * Factory for SearchParameters
	 * @param {object|SearchParameters} newParameters existing parameters or partial
	 * object for the properties of a new SearchParameters
	 * @return {SearchParameters} frozen instance of SearchParameters
	 */
	SearchParameters$2.make = function makeSearchParameters(newParameters) {
	  var instance = new SearchParameters$2(newParameters);

	  var hierarchicalFacets = newParameters.hierarchicalFacets || [];
	  hierarchicalFacets.forEach(function(facet) {
	    if (facet.rootPath) {
	      var currentRefinement = instance.getHierarchicalRefinement(facet.name);

	      if (currentRefinement.length > 0 && currentRefinement[0].indexOf(facet.rootPath) !== 0) {
	        instance = instance.clearRefinements(facet.name);
	      }

	      // get it again in case it has been cleared
	      currentRefinement = instance.getHierarchicalRefinement(facet.name);
	      if (currentRefinement.length === 0) {
	        instance = instance.toggleHierarchicalFacetRefinement(facet.name, facet.rootPath);
	      }
	    }
	  });

	  return instance;
	};

	/**
	 * Validates the new parameters based on the previous state
	 * @param {SearchParameters} currentState the current state
	 * @param {object|SearchParameters} parameters the new parameters to set
	 * @return {Error|null} Error if the modification is invalid, null otherwise
	 */
	SearchParameters$2.validate = function(currentState, parameters) {
	  var params = parameters || {};

	  if (currentState.tagFilters && params.tagRefinements && params.tagRefinements.length > 0) {
	    return new Error(
	      '[Tags] Cannot switch from the managed tag API to the advanced API. It is probably ' +
	      'an error, if it is really what you want, you should first clear the tags with clearTags method.');
	  }

	  if (currentState.tagRefinements.length > 0 && params.tagFilters) {
	    return new Error(
	      '[Tags] Cannot switch from the advanced tag API to the managed API. It is probably ' +
	      'an error, if it is not, you should first clear the tags with clearTags method.');
	  }

	  if (
	    currentState.numericFilters &&
	    params.numericRefinements &&
	    objectHasKeys$1(params.numericRefinements)
	  ) {
	    return new Error(
	      "[Numeric filters] Can't switch from the advanced to the managed API. It" +
	        ' is probably an error, if this is really what you want, you have to first' +
	        ' clear the numeric filters.'
	    );
	  }

	  if (objectHasKeys$1(currentState.numericRefinements) && params.numericFilters) {
	    return new Error(
	      "[Numeric filters] Can't switch from the managed API to the advanced. It" +
	      ' is probably an error, if this is really what you want, you have to first' +
	      ' clear the numeric filters.');
	  }

	  return null;
	};

	SearchParameters$2.prototype = {
	  constructor: SearchParameters$2,

	  /**
	   * Remove all refinements (disjunctive + conjunctive + excludes + numeric filters)
	   * @method
	   * @param {undefined|string|SearchParameters.clearCallback} [attribute] optional string or function
	   * - If not given, means to clear all the filters.
	   * - If `string`, means to clear all refinements for the `attribute` named filter.
	   * - If `function`, means to clear all the refinements that return truthy values.
	   * @return {SearchParameters}
	   */
	  clearRefinements: function clearRefinements(attribute) {
	    var patch = {
	      numericRefinements: this._clearNumericRefinements(attribute),
	      facetsRefinements: RefinementList.clearRefinement(
	        this.facetsRefinements,
	        attribute,
	        'conjunctiveFacet'
	      ),
	      facetsExcludes: RefinementList.clearRefinement(
	        this.facetsExcludes,
	        attribute,
	        'exclude'
	      ),
	      disjunctiveFacetsRefinements: RefinementList.clearRefinement(
	        this.disjunctiveFacetsRefinements,
	        attribute,
	        'disjunctiveFacet'
	      ),
	      hierarchicalFacetsRefinements: RefinementList.clearRefinement(
	        this.hierarchicalFacetsRefinements,
	        attribute,
	        'hierarchicalFacet'
	      )
	    };
	    if (
	      patch.numericRefinements === this.numericRefinements &&
	      patch.facetsRefinements === this.facetsRefinements &&
	      patch.facetsExcludes === this.facetsExcludes &&
	      patch.disjunctiveFacetsRefinements === this.disjunctiveFacetsRefinements &&
	      patch.hierarchicalFacetsRefinements === this.hierarchicalFacetsRefinements
	    ) {
	      return this;
	    }
	    return this.setQueryParameters(patch);
	  },
	  /**
	   * Remove all the refined tags from the SearchParameters
	   * @method
	   * @return {SearchParameters}
	   */
	  clearTags: function clearTags() {
	    if (this.tagFilters === undefined && this.tagRefinements.length === 0) return this;

	    return this.setQueryParameters({
	      tagFilters: undefined,
	      tagRefinements: []
	    });
	  },
	  /**
	   * Set the index.
	   * @method
	   * @param {string} index the index name
	   * @return {SearchParameters}
	   */
	  setIndex: function setIndex(index) {
	    if (index === this.index) return this;

	    return this.setQueryParameters({
	      index: index
	    });
	  },
	  /**
	   * Query setter
	   * @method
	   * @param {string} newQuery value for the new query
	   * @return {SearchParameters}
	   */
	  setQuery: function setQuery(newQuery) {
	    if (newQuery === this.query) return this;

	    return this.setQueryParameters({
	      query: newQuery
	    });
	  },
	  /**
	   * Page setter
	   * @method
	   * @param {number} newPage new page number
	   * @return {SearchParameters}
	   */
	  setPage: function setPage(newPage) {
	    if (newPage === this.page) return this;

	    return this.setQueryParameters({
	      page: newPage
	    });
	  },
	  /**
	   * Facets setter
	   * The facets are the simple facets, used for conjunctive (and) faceting.
	   * @method
	   * @param {string[]} facets all the attributes of the algolia records used for conjunctive faceting
	   * @return {SearchParameters}
	   */
	  setFacets: function setFacets(facets) {
	    return this.setQueryParameters({
	      facets: facets
	    });
	  },
	  /**
	   * Disjunctive facets setter
	   * Change the list of disjunctive (or) facets the helper chan handle.
	   * @method
	   * @param {string[]} facets all the attributes of the algolia records used for disjunctive faceting
	   * @return {SearchParameters}
	   */
	  setDisjunctiveFacets: function setDisjunctiveFacets(facets) {
	    return this.setQueryParameters({
	      disjunctiveFacets: facets
	    });
	  },
	  /**
	   * HitsPerPage setter
	   * Hits per page represents the number of hits retrieved for this query
	   * @method
	   * @param {number} n number of hits retrieved per page of results
	   * @return {SearchParameters}
	   */
	  setHitsPerPage: function setHitsPerPage(n) {
	    if (this.hitsPerPage === n) return this;

	    return this.setQueryParameters({
	      hitsPerPage: n
	    });
	  },
	  /**
	   * typoTolerance setter
	   * Set the value of typoTolerance
	   * @method
	   * @param {string} typoTolerance new value of typoTolerance ("true", "false", "min" or "strict")
	   * @return {SearchParameters}
	   */
	  setTypoTolerance: function setTypoTolerance(typoTolerance) {
	    if (this.typoTolerance === typoTolerance) return this;

	    return this.setQueryParameters({
	      typoTolerance: typoTolerance
	    });
	  },
	  /**
	   * Add a numeric filter for a given attribute
	   * When value is an array, they are combined with OR
	   * When value is a single value, it will combined with AND
	   * @method
	   * @param {string} attribute attribute to set the filter on
	   * @param {string} operator operator of the filter (possible values: =, >, >=, <, <=, !=)
	   * @param {number | number[]} value value of the filter
	   * @return {SearchParameters}
	   * @example
	   * // for price = 50 or 40
	   * searchparameter.addNumericRefinement('price', '=', [50, 40]);
	   * @example
	   * // for size = 38 and 40
	   * searchparameter.addNumericRefinement('size', '=', 38);
	   * searchparameter.addNumericRefinement('size', '=', 40);
	   */
	  addNumericRefinement: function(attribute, operator, v) {
	    var value = valToNumber(v);

	    if (this.isNumericRefined(attribute, operator, value)) return this;

	    var mod = merge$5({}, this.numericRefinements);

	    mod[attribute] = merge$5({}, mod[attribute]);

	    if (mod[attribute][operator]) {
	      // Array copy
	      mod[attribute][operator] = mod[attribute][operator].slice();
	      // Add the element. Concat can't be used here because value can be an array.
	      mod[attribute][operator].push(value);
	    } else {
	      mod[attribute][operator] = [value];
	    }

	    return this.setQueryParameters({
	      numericRefinements: mod
	    });
	  },
	  /**
	   * Get the list of conjunctive refinements for a single facet
	   * @param {string} facetName name of the attribute used for faceting
	   * @return {string[]} list of refinements
	   */
	  getConjunctiveRefinements: function(facetName) {
	    if (!this.isConjunctiveFacet(facetName)) {
	      return [];
	    }
	    return this.facetsRefinements[facetName] || [];
	  },
	  /**
	   * Get the list of disjunctive refinements for a single facet
	   * @param {string} facetName name of the attribute used for faceting
	   * @return {string[]} list of refinements
	   */
	  getDisjunctiveRefinements: function(facetName) {
	    if (!this.isDisjunctiveFacet(facetName)) {
	      return [];
	    }
	    return this.disjunctiveFacetsRefinements[facetName] || [];
	  },
	  /**
	   * Get the list of hierarchical refinements for a single facet
	   * @param {string} facetName name of the attribute used for faceting
	   * @return {string[]} list of refinements
	   */
	  getHierarchicalRefinement: function(facetName) {
	    // we send an array but we currently do not support multiple
	    // hierarchicalRefinements for a hierarchicalFacet
	    return this.hierarchicalFacetsRefinements[facetName] || [];
	  },
	  /**
	   * Get the list of exclude refinements for a single facet
	   * @param {string} facetName name of the attribute used for faceting
	   * @return {string[]} list of refinements
	   */
	  getExcludeRefinements: function(facetName) {
	    if (!this.isConjunctiveFacet(facetName)) {
	      return [];
	    }
	    return this.facetsExcludes[facetName] || [];
	  },

	  /**
	   * Remove all the numeric filter for a given (attribute, operator)
	   * @method
	   * @param {string} attribute attribute to set the filter on
	   * @param {string} [operator] operator of the filter (possible values: =, >, >=, <, <=, !=)
	   * @param {number} [number] the value to be removed
	   * @return {SearchParameters}
	   */
	  removeNumericRefinement: function(attribute, operator, paramValue) {
	    if (paramValue !== undefined) {
	      if (!this.isNumericRefined(attribute, operator, paramValue)) {
	        return this;
	      }
	      return this.setQueryParameters({
	        numericRefinements: this._clearNumericRefinements(function(value, key) {
	          return (
	            key === attribute &&
	            value.op === operator &&
	            isEqualNumericRefinement(value.val, valToNumber(paramValue))
	          );
	        })
	      });
	    } else if (operator !== undefined) {
	      if (!this.isNumericRefined(attribute, operator)) return this;
	      return this.setQueryParameters({
	        numericRefinements: this._clearNumericRefinements(function(value, key) {
	          return key === attribute && value.op === operator;
	        })
	      });
	    }

	    if (!this.isNumericRefined(attribute)) return this;
	    return this.setQueryParameters({
	      numericRefinements: this._clearNumericRefinements(function(value, key) {
	        return key === attribute;
	      })
	    });
	  },
	  /**
	   * Get the list of numeric refinements for a single facet
	   * @param {string} facetName name of the attribute used for faceting
	   * @return {SearchParameters.OperatorList} list of refinements
	   */
	  getNumericRefinements: function(facetName) {
	    return this.numericRefinements[facetName] || {};
	  },
	  /**
	   * Return the current refinement for the (attribute, operator)
	   * @param {string} attribute attribute in the record
	   * @param {string} operator operator applied on the refined values
	   * @return {Array.<number|number[]>} refined values
	   */
	  getNumericRefinement: function(attribute, operator) {
	    return this.numericRefinements[attribute] && this.numericRefinements[attribute][operator];
	  },
	  /**
	   * Clear numeric filters.
	   * @method
	   * @private
	   * @param {string|SearchParameters.clearCallback} [attribute] optional string or function
	   * - If not given, means to clear all the filters.
	   * - If `string`, means to clear all refinements for the `attribute` named filter.
	   * - If `function`, means to clear all the refinements that return truthy values.
	   * @return {Object.<string, OperatorList>}
	   */
	  _clearNumericRefinements: function _clearNumericRefinements(attribute) {
	    if (attribute === undefined) {
	      if (!objectHasKeys$1(this.numericRefinements)) {
	        return this.numericRefinements;
	      }
	      return {};
	    } else if (typeof attribute === 'string') {
	      return omit$1(this.numericRefinements, [attribute]);
	    } else if (typeof attribute === 'function') {
	      var hasChanged = false;
	      var numericRefinements = this.numericRefinements;
	      var newNumericRefinements = Object.keys(numericRefinements).reduce(function(memo, key) {
	        var operators = numericRefinements[key];
	        var operatorList = {};

	        operators = operators || {};
	        Object.keys(operators).forEach(function(operator) {
	          var values = operators[operator] || [];
	          var outValues = [];
	          values.forEach(function(value) {
	            var predicateResult = attribute({val: value, op: operator}, key, 'numeric');
	            if (!predicateResult) outValues.push(value);
	          });
	          if (outValues.length !== values.length) {
	            hasChanged = true;
	          }
	          operatorList[operator] = outValues;
	        });

	        memo[key] = operatorList;

	        return memo;
	      }, {});

	      if (hasChanged) return newNumericRefinements;
	      return this.numericRefinements;
	    }
	  },
	  /**
	   * Add a facet to the facets attribute of the helper configuration, if it
	   * isn't already present.
	   * @method
	   * @param {string} facet facet name to add
	   * @return {SearchParameters}
	   */
	  addFacet: function addFacet(facet) {
	    if (this.isConjunctiveFacet(facet)) {
	      return this;
	    }

	    return this.setQueryParameters({
	      facets: this.facets.concat([facet])
	    });
	  },
	  /**
	   * Add a disjunctive facet to the disjunctiveFacets attribute of the helper
	   * configuration, if it isn't already present.
	   * @method
	   * @param {string} facet disjunctive facet name to add
	   * @return {SearchParameters}
	   */
	  addDisjunctiveFacet: function addDisjunctiveFacet(facet) {
	    if (this.isDisjunctiveFacet(facet)) {
	      return this;
	    }

	    return this.setQueryParameters({
	      disjunctiveFacets: this.disjunctiveFacets.concat([facet])
	    });
	  },
	  /**
	   * Add a hierarchical facet to the hierarchicalFacets attribute of the helper
	   * configuration.
	   * @method
	   * @param {object} hierarchicalFacet hierarchical facet to add
	   * @return {SearchParameters}
	   * @throws will throw an error if a hierarchical facet with the same name was already declared
	   */
	  addHierarchicalFacet: function addHierarchicalFacet(hierarchicalFacet) {
	    if (this.isHierarchicalFacet(hierarchicalFacet.name)) {
	      throw new Error(
	        'Cannot declare two hierarchical facets with the same name: `' + hierarchicalFacet.name + '`');
	    }

	    return this.setQueryParameters({
	      hierarchicalFacets: this.hierarchicalFacets.concat([hierarchicalFacet])
	    });
	  },
	  /**
	   * Add a refinement on a "normal" facet
	   * @method
	   * @param {string} facet attribute to apply the faceting on
	   * @param {string} value value of the attribute (will be converted to string)
	   * @return {SearchParameters}
	   */
	  addFacetRefinement: function addFacetRefinement(facet, value) {
	    if (!this.isConjunctiveFacet(facet)) {
	      throw new Error(facet + ' is not defined in the facets attribute of the helper configuration');
	    }
	    if (RefinementList.isRefined(this.facetsRefinements, facet, value)) return this;

	    return this.setQueryParameters({
	      facetsRefinements: RefinementList.addRefinement(this.facetsRefinements, facet, value)
	    });
	  },
	  /**
	   * Exclude a value from a "normal" facet
	   * @method
	   * @param {string} facet attribute to apply the exclusion on
	   * @param {string} value value of the attribute (will be converted to string)
	   * @return {SearchParameters}
	   */
	  addExcludeRefinement: function addExcludeRefinement(facet, value) {
	    if (!this.isConjunctiveFacet(facet)) {
	      throw new Error(facet + ' is not defined in the facets attribute of the helper configuration');
	    }
	    if (RefinementList.isRefined(this.facetsExcludes, facet, value)) return this;

	    return this.setQueryParameters({
	      facetsExcludes: RefinementList.addRefinement(this.facetsExcludes, facet, value)
	    });
	  },
	  /**
	   * Adds a refinement on a disjunctive facet.
	   * @method
	   * @param {string} facet attribute to apply the faceting on
	   * @param {string} value value of the attribute (will be converted to string)
	   * @return {SearchParameters}
	   */
	  addDisjunctiveFacetRefinement: function addDisjunctiveFacetRefinement(facet, value) {
	    if (!this.isDisjunctiveFacet(facet)) {
	      throw new Error(
	        facet + ' is not defined in the disjunctiveFacets attribute of the helper configuration');
	    }

	    if (RefinementList.isRefined(this.disjunctiveFacetsRefinements, facet, value)) return this;

	    return this.setQueryParameters({
	      disjunctiveFacetsRefinements: RefinementList.addRefinement(
	        this.disjunctiveFacetsRefinements, facet, value)
	    });
	  },
	  /**
	   * addTagRefinement adds a tag to the list used to filter the results
	   * @param {string} tag tag to be added
	   * @return {SearchParameters}
	   */
	  addTagRefinement: function addTagRefinement(tag) {
	    if (this.isTagRefined(tag)) return this;

	    var modification = {
	      tagRefinements: this.tagRefinements.concat(tag)
	    };

	    return this.setQueryParameters(modification);
	  },
	  /**
	   * Remove a facet from the facets attribute of the helper configuration, if it
	   * is present.
	   * @method
	   * @param {string} facet facet name to remove
	   * @return {SearchParameters}
	   */
	  removeFacet: function removeFacet(facet) {
	    if (!this.isConjunctiveFacet(facet)) {
	      return this;
	    }

	    return this.clearRefinements(facet).setQueryParameters({
	      facets: this.facets.filter(function(f) {
	        return f !== facet;
	      })
	    });
	  },
	  /**
	   * Remove a disjunctive facet from the disjunctiveFacets attribute of the
	   * helper configuration, if it is present.
	   * @method
	   * @param {string} facet disjunctive facet name to remove
	   * @return {SearchParameters}
	   */
	  removeDisjunctiveFacet: function removeDisjunctiveFacet(facet) {
	    if (!this.isDisjunctiveFacet(facet)) {
	      return this;
	    }

	    return this.clearRefinements(facet).setQueryParameters({
	      disjunctiveFacets: this.disjunctiveFacets.filter(function(f) {
	        return f !== facet;
	      })
	    });
	  },
	  /**
	   * Remove a hierarchical facet from the hierarchicalFacets attribute of the
	   * helper configuration, if it is present.
	   * @method
	   * @param {string} facet hierarchical facet name to remove
	   * @return {SearchParameters}
	   */
	  removeHierarchicalFacet: function removeHierarchicalFacet(facet) {
	    if (!this.isHierarchicalFacet(facet)) {
	      return this;
	    }

	    return this.clearRefinements(facet).setQueryParameters({
	      hierarchicalFacets: this.hierarchicalFacets.filter(function(f) {
	        return f.name !== facet;
	      })
	    });
	  },
	  /**
	   * Remove a refinement set on facet. If a value is provided, it will clear the
	   * refinement for the given value, otherwise it will clear all the refinement
	   * values for the faceted attribute.
	   * @method
	   * @param {string} facet name of the attribute used for faceting
	   * @param {string} [value] value used to filter
	   * @return {SearchParameters}
	   */
	  removeFacetRefinement: function removeFacetRefinement(facet, value) {
	    if (!this.isConjunctiveFacet(facet)) {
	      throw new Error(facet + ' is not defined in the facets attribute of the helper configuration');
	    }
	    if (!RefinementList.isRefined(this.facetsRefinements, facet, value)) return this;

	    return this.setQueryParameters({
	      facetsRefinements: RefinementList.removeRefinement(this.facetsRefinements, facet, value)
	    });
	  },
	  /**
	   * Remove a negative refinement on a facet
	   * @method
	   * @param {string} facet name of the attribute used for faceting
	   * @param {string} value value used to filter
	   * @return {SearchParameters}
	   */
	  removeExcludeRefinement: function removeExcludeRefinement(facet, value) {
	    if (!this.isConjunctiveFacet(facet)) {
	      throw new Error(facet + ' is not defined in the facets attribute of the helper configuration');
	    }
	    if (!RefinementList.isRefined(this.facetsExcludes, facet, value)) return this;

	    return this.setQueryParameters({
	      facetsExcludes: RefinementList.removeRefinement(this.facetsExcludes, facet, value)
	    });
	  },
	  /**
	   * Remove a refinement on a disjunctive facet
	   * @method
	   * @param {string} facet name of the attribute used for faceting
	   * @param {string} value value used to filter
	   * @return {SearchParameters}
	   */
	  removeDisjunctiveFacetRefinement: function removeDisjunctiveFacetRefinement(facet, value) {
	    if (!this.isDisjunctiveFacet(facet)) {
	      throw new Error(
	        facet + ' is not defined in the disjunctiveFacets attribute of the helper configuration');
	    }
	    if (!RefinementList.isRefined(this.disjunctiveFacetsRefinements, facet, value)) return this;

	    return this.setQueryParameters({
	      disjunctiveFacetsRefinements: RefinementList.removeRefinement(
	        this.disjunctiveFacetsRefinements, facet, value)
	    });
	  },
	  /**
	   * Remove a tag from the list of tag refinements
	   * @method
	   * @param {string} tag the tag to remove
	   * @return {SearchParameters}
	   */
	  removeTagRefinement: function removeTagRefinement(tag) {
	    if (!this.isTagRefined(tag)) return this;

	    var modification = {
	      tagRefinements: this.tagRefinements.filter(function(t) {
	        return t !== tag;
	      })
	    };

	    return this.setQueryParameters(modification);
	  },
	  /**
	   * Generic toggle refinement method to use with facet, disjunctive facets
	   * and hierarchical facets
	   * @param  {string} facet the facet to refine
	   * @param  {string} value the associated value
	   * @return {SearchParameters}
	   * @throws will throw an error if the facet is not declared in the settings of the helper
	   * @deprecated since version 2.19.0, see {@link SearchParameters#toggleFacetRefinement}
	   */
	  toggleRefinement: function toggleRefinement(facet, value) {
	    return this.toggleFacetRefinement(facet, value);
	  },
	  /**
	   * Generic toggle refinement method to use with facet, disjunctive facets
	   * and hierarchical facets
	   * @param  {string} facet the facet to refine
	   * @param  {string} value the associated value
	   * @return {SearchParameters}
	   * @throws will throw an error if the facet is not declared in the settings of the helper
	   */
	  toggleFacetRefinement: function toggleFacetRefinement(facet, value) {
	    if (this.isHierarchicalFacet(facet)) {
	      return this.toggleHierarchicalFacetRefinement(facet, value);
	    } else if (this.isConjunctiveFacet(facet)) {
	      return this.toggleConjunctiveFacetRefinement(facet, value);
	    } else if (this.isDisjunctiveFacet(facet)) {
	      return this.toggleDisjunctiveFacetRefinement(facet, value);
	    }

	    throw new Error('Cannot refine the undeclared facet ' + facet +
	      '; it should be added to the helper options facets, disjunctiveFacets or hierarchicalFacets');
	  },
	  /**
	   * Switch the refinement applied over a facet/value
	   * @method
	   * @param {string} facet name of the attribute used for faceting
	   * @param {value} value value used for filtering
	   * @return {SearchParameters}
	   */
	  toggleConjunctiveFacetRefinement: function toggleConjunctiveFacetRefinement(facet, value) {
	    if (!this.isConjunctiveFacet(facet)) {
	      throw new Error(facet + ' is not defined in the facets attribute of the helper configuration');
	    }

	    return this.setQueryParameters({
	      facetsRefinements: RefinementList.toggleRefinement(this.facetsRefinements, facet, value)
	    });
	  },
	  /**
	   * Switch the refinement applied over a facet/value
	   * @method
	   * @param {string} facet name of the attribute used for faceting
	   * @param {value} value value used for filtering
	   * @return {SearchParameters}
	   */
	  toggleExcludeFacetRefinement: function toggleExcludeFacetRefinement(facet, value) {
	    if (!this.isConjunctiveFacet(facet)) {
	      throw new Error(facet + ' is not defined in the facets attribute of the helper configuration');
	    }

	    return this.setQueryParameters({
	      facetsExcludes: RefinementList.toggleRefinement(this.facetsExcludes, facet, value)
	    });
	  },
	  /**
	   * Switch the refinement applied over a facet/value
	   * @method
	   * @param {string} facet name of the attribute used for faceting
	   * @param {value} value value used for filtering
	   * @return {SearchParameters}
	   */
	  toggleDisjunctiveFacetRefinement: function toggleDisjunctiveFacetRefinement(facet, value) {
	    if (!this.isDisjunctiveFacet(facet)) {
	      throw new Error(
	        facet + ' is not defined in the disjunctiveFacets attribute of the helper configuration');
	    }

	    return this.setQueryParameters({
	      disjunctiveFacetsRefinements: RefinementList.toggleRefinement(
	        this.disjunctiveFacetsRefinements, facet, value)
	    });
	  },
	  /**
	   * Switch the refinement applied over a facet/value
	   * @method
	   * @param {string} facet name of the attribute used for faceting
	   * @param {value} value value used for filtering
	   * @return {SearchParameters}
	   */
	  toggleHierarchicalFacetRefinement: function toggleHierarchicalFacetRefinement(facet, value) {
	    if (!this.isHierarchicalFacet(facet)) {
	      throw new Error(
	        facet + ' is not defined in the hierarchicalFacets attribute of the helper configuration');
	    }

	    var separator = this._getHierarchicalFacetSeparator(this.getHierarchicalFacetByName(facet));

	    var mod = {};

	    var upOneOrMultipleLevel = this.hierarchicalFacetsRefinements[facet] !== undefined &&
	      this.hierarchicalFacetsRefinements[facet].length > 0 && (
	      // remove current refinement:
	      // refinement was 'beer > IPA', call is toggleRefine('beer > IPA'), refinement should be `beer`
	      this.hierarchicalFacetsRefinements[facet][0] === value ||
	      // remove a parent refinement of the current refinement:
	      //  - refinement was 'beer > IPA > Flying dog'
	      //  - call is toggleRefine('beer > IPA')
	      //  - refinement should be `beer`
	      this.hierarchicalFacetsRefinements[facet][0].indexOf(value + separator) === 0
	    );

	    if (upOneOrMultipleLevel) {
	      if (value.indexOf(separator) === -1) {
	        // go back to root level
	        mod[facet] = [];
	      } else {
	        mod[facet] = [value.slice(0, value.lastIndexOf(separator))];
	      }
	    } else {
	      mod[facet] = [value];
	    }

	    return this.setQueryParameters({
	      hierarchicalFacetsRefinements: defaultsPure$1({}, mod, this.hierarchicalFacetsRefinements)
	    });
	  },

	  /**
	   * Adds a refinement on a hierarchical facet.
	   * @param {string} facet the facet name
	   * @param {string} path the hierarchical facet path
	   * @return {SearchParameter} the new state
	   * @throws Error if the facet is not defined or if the facet is refined
	   */
	  addHierarchicalFacetRefinement: function(facet, path) {
	    if (this.isHierarchicalFacetRefined(facet)) {
	      throw new Error(facet + ' is already refined.');
	    }
	    if (!this.isHierarchicalFacet(facet)) {
	      throw new Error(facet + ' is not defined in the hierarchicalFacets attribute of the helper configuration.');
	    }
	    var mod = {};
	    mod[facet] = [path];
	    return this.setQueryParameters({
	      hierarchicalFacetsRefinements: defaultsPure$1({}, mod, this.hierarchicalFacetsRefinements)
	    });
	  },

	  /**
	   * Removes the refinement set on a hierarchical facet.
	   * @param {string} facet the facet name
	   * @return {SearchParameter} the new state
	   * @throws Error if the facet is not defined or if the facet is not refined
	   */
	  removeHierarchicalFacetRefinement: function(facet) {
	    if (!this.isHierarchicalFacetRefined(facet)) {
	      return this;
	    }
	    var mod = {};
	    mod[facet] = [];
	    return this.setQueryParameters({
	      hierarchicalFacetsRefinements: defaultsPure$1({}, mod, this.hierarchicalFacetsRefinements)
	    });
	  },
	  /**
	   * Switch the tag refinement
	   * @method
	   * @param {string} tag the tag to remove or add
	   * @return {SearchParameters}
	   */
	  toggleTagRefinement: function toggleTagRefinement(tag) {
	    if (this.isTagRefined(tag)) {
	      return this.removeTagRefinement(tag);
	    }

	    return this.addTagRefinement(tag);
	  },
	  /**
	   * Test if the facet name is from one of the disjunctive facets
	   * @method
	   * @param {string} facet facet name to test
	   * @return {boolean}
	   */
	  isDisjunctiveFacet: function(facet) {
	    return this.disjunctiveFacets.indexOf(facet) > -1;
	  },
	  /**
	   * Test if the facet name is from one of the hierarchical facets
	   * @method
	   * @param {string} facetName facet name to test
	   * @return {boolean}
	   */
	  isHierarchicalFacet: function(facetName) {
	    return this.getHierarchicalFacetByName(facetName) !== undefined;
	  },
	  /**
	   * Test if the facet name is from one of the conjunctive/normal facets
	   * @method
	   * @param {string} facet facet name to test
	   * @return {boolean}
	   */
	  isConjunctiveFacet: function(facet) {
	    return this.facets.indexOf(facet) > -1;
	  },
	  /**
	   * Returns true if the facet is refined, either for a specific value or in
	   * general.
	   * @method
	   * @param {string} facet name of the attribute for used for faceting
	   * @param {string} value, optional value. If passed will test that this value
	   * is filtering the given facet.
	   * @return {boolean} returns true if refined
	   */
	  isFacetRefined: function isFacetRefined(facet, value) {
	    if (!this.isConjunctiveFacet(facet)) {
	      return false;
	    }
	    return RefinementList.isRefined(this.facetsRefinements, facet, value);
	  },
	  /**
	   * Returns true if the facet contains exclusions or if a specific value is
	   * excluded.
	   *
	   * @method
	   * @param {string} facet name of the attribute for used for faceting
	   * @param {string} [value] optional value. If passed will test that this value
	   * is filtering the given facet.
	   * @return {boolean} returns true if refined
	   */
	  isExcludeRefined: function isExcludeRefined(facet, value) {
	    if (!this.isConjunctiveFacet(facet)) {
	      return false;
	    }
	    return RefinementList.isRefined(this.facetsExcludes, facet, value);
	  },
	  /**
	   * Returns true if the facet contains a refinement, or if a value passed is a
	   * refinement for the facet.
	   * @method
	   * @param {string} facet name of the attribute for used for faceting
	   * @param {string} value optional, will test if the value is used for refinement
	   * if there is one, otherwise will test if the facet contains any refinement
	   * @return {boolean}
	   */
	  isDisjunctiveFacetRefined: function isDisjunctiveFacetRefined(facet, value) {
	    if (!this.isDisjunctiveFacet(facet)) {
	      return false;
	    }
	    return RefinementList.isRefined(this.disjunctiveFacetsRefinements, facet, value);
	  },
	  /**
	   * Returns true if the facet contains a refinement, or if a value passed is a
	   * refinement for the facet.
	   * @method
	   * @param {string} facet name of the attribute for used for faceting
	   * @param {string} value optional, will test if the value is used for refinement
	   * if there is one, otherwise will test if the facet contains any refinement
	   * @return {boolean}
	   */
	  isHierarchicalFacetRefined: function isHierarchicalFacetRefined(facet, value) {
	    if (!this.isHierarchicalFacet(facet)) {
	      return false;
	    }

	    var refinements = this.getHierarchicalRefinement(facet);

	    if (!value) {
	      return refinements.length > 0;
	    }

	    return refinements.indexOf(value) !== -1;
	  },
	  /**
	   * Test if the triple (attribute, operator, value) is already refined.
	   * If only the attribute and the operator are provided, it tests if the
	   * contains any refinement value.
	   * @method
	   * @param {string} attribute attribute for which the refinement is applied
	   * @param {string} [operator] operator of the refinement
	   * @param {string} [value] value of the refinement
	   * @return {boolean} true if it is refined
	   */
	  isNumericRefined: function isNumericRefined(attribute, operator, value) {
	    if (value === undefined && operator === undefined) {
	      return !!this.numericRefinements[attribute];
	    }

	    var isOperatorDefined =
	      this.numericRefinements[attribute] &&
	      this.numericRefinements[attribute][operator] !== undefined;

	    if (value === undefined || !isOperatorDefined) {
	      return isOperatorDefined;
	    }

	    var parsedValue = valToNumber(value);
	    var isAttributeValueDefined =
	      findArray(this.numericRefinements[attribute][operator], parsedValue) !==
	      undefined;

	    return isOperatorDefined && isAttributeValueDefined;
	  },
	  /**
	   * Returns true if the tag refined, false otherwise
	   * @method
	   * @param {string} tag the tag to check
	   * @return {boolean}
	   */
	  isTagRefined: function isTagRefined(tag) {
	    return this.tagRefinements.indexOf(tag) !== -1;
	  },
	  /**
	   * Returns the list of all disjunctive facets refined
	   * @method
	   * @param {string} facet name of the attribute used for faceting
	   * @param {value} value value used for filtering
	   * @return {string[]}
	   */
	  getRefinedDisjunctiveFacets: function getRefinedDisjunctiveFacets() {
	    var self = this;

	    // attributes used for numeric filter can also be disjunctive
	    var disjunctiveNumericRefinedFacets = intersection(
	      Object.keys(this.numericRefinements).filter(function(facet) {
	        return Object.keys(self.numericRefinements[facet]).length > 0;
	      }),
	      this.disjunctiveFacets
	    );

	    return Object.keys(this.disjunctiveFacetsRefinements).filter(function(facet) {
	      return self.disjunctiveFacetsRefinements[facet].length > 0;
	    })
	      .concat(disjunctiveNumericRefinedFacets)
	      .concat(this.getRefinedHierarchicalFacets());
	  },
	  /**
	   * Returns the list of all disjunctive facets refined
	   * @method
	   * @param {string} facet name of the attribute used for faceting
	   * @param {value} value value used for filtering
	   * @return {string[]}
	   */
	  getRefinedHierarchicalFacets: function getRefinedHierarchicalFacets() {
	    var self = this;
	    return intersection(
	      // enforce the order between the two arrays,
	      // so that refinement name index === hierarchical facet index
	      this.hierarchicalFacets.map(function(facet) { return facet.name; }),
	      Object.keys(this.hierarchicalFacetsRefinements).filter(function(facet) {
	        return self.hierarchicalFacetsRefinements[facet].length > 0;
	      })
	    );
	  },
	  /**
	   * Returned the list of all disjunctive facets not refined
	   * @method
	   * @return {string[]}
	   */
	  getUnrefinedDisjunctiveFacets: function() {
	    var refinedFacets = this.getRefinedDisjunctiveFacets();

	    return this.disjunctiveFacets.filter(function(f) {
	      return refinedFacets.indexOf(f) === -1;
	    });
	  },

	  managedParameters: [
	    'index',

	    'facets',
	    'disjunctiveFacets',
	    'facetsRefinements',
	    'hierarchicalFacets',
	    'facetsExcludes',

	    'disjunctiveFacetsRefinements',
	    'numericRefinements',
	    'tagRefinements',
	    'hierarchicalFacetsRefinements'
	  ],
	  getQueryParams: function getQueryParams() {
	    var managedParameters = this.managedParameters;

	    var queryParams = {};

	    var self = this;
	    Object.keys(this).forEach(function(paramName) {
	      var paramValue = self[paramName];
	      if (managedParameters.indexOf(paramName) === -1 && paramValue !== undefined) {
	        queryParams[paramName] = paramValue;
	      }
	    });

	    return queryParams;
	  },
	  /**
	   * Let the user set a specific value for a given parameter. Will return the
	   * same instance if the parameter is invalid or if the value is the same as the
	   * previous one.
	   * @method
	   * @param {string} parameter the parameter name
	   * @param {any} value the value to be set, must be compliant with the definition
	   * of the attribute on the object
	   * @return {SearchParameters} the updated state
	   */
	  setQueryParameter: function setParameter(parameter, value) {
	    if (this[parameter] === value) return this;

	    var modification = {};

	    modification[parameter] = value;

	    return this.setQueryParameters(modification);
	  },
	  /**
	   * Let the user set any of the parameters with a plain object.
	   * @method
	   * @param {object} params all the keys and the values to be updated
	   * @return {SearchParameters} a new updated instance
	   */
	  setQueryParameters: function setQueryParameters(params) {
	    if (!params) return this;

	    var error = SearchParameters$2.validate(this, params);

	    if (error) {
	      throw error;
	    }

	    var self = this;
	    var nextWithNumbers = SearchParameters$2._parseNumbers(params);
	    var previousPlainObject = Object.keys(this).reduce(function(acc, key) {
	      acc[key] = self[key];
	      return acc;
	    }, {});

	    var nextPlainObject = Object.keys(nextWithNumbers).reduce(
	      function(previous, key) {
	        var isPreviousValueDefined = previous[key] !== undefined;
	        var isNextValueDefined = nextWithNumbers[key] !== undefined;

	        if (isPreviousValueDefined && !isNextValueDefined) {
	          return omit$1(previous, [key]);
	        }

	        if (isNextValueDefined) {
	          previous[key] = nextWithNumbers[key];
	        }

	        return previous;
	      },
	      previousPlainObject
	    );

	    return new this.constructor(nextPlainObject);
	  },

	  /**
	   * Returns a new instance with the page reset. Two scenarios possible:
	   * the page is omitted -> return the given instance
	   * the page is set -> return a new instance with a page of 0
	   * @return {SearchParameters} a new updated instance
	   */
	  resetPage: function() {
	    if (this.page === undefined) {
	      return this;
	    }

	    return this.setPage(0);
	  },

	  /**
	   * Helper function to get the hierarchicalFacet separator or the default one (`>`)
	   * @param  {object} hierarchicalFacet
	   * @return {string} returns the hierarchicalFacet.separator or `>` as default
	   */
	  _getHierarchicalFacetSortBy: function(hierarchicalFacet) {
	    return hierarchicalFacet.sortBy || ['isRefined:desc', 'name:asc'];
	  },

	  /**
	   * Helper function to get the hierarchicalFacet separator or the default one (`>`)
	   * @private
	   * @param  {object} hierarchicalFacet
	   * @return {string} returns the hierarchicalFacet.separator or `>` as default
	   */
	  _getHierarchicalFacetSeparator: function(hierarchicalFacet) {
	    return hierarchicalFacet.separator || ' > ';
	  },

	  /**
	   * Helper function to get the hierarchicalFacet prefix path or null
	   * @private
	   * @param  {object} hierarchicalFacet
	   * @return {string} returns the hierarchicalFacet.rootPath or null as default
	   */
	  _getHierarchicalRootPath: function(hierarchicalFacet) {
	    return hierarchicalFacet.rootPath || null;
	  },

	  /**
	   * Helper function to check if we show the parent level of the hierarchicalFacet
	   * @private
	   * @param  {object} hierarchicalFacet
	   * @return {string} returns the hierarchicalFacet.showParentLevel or true as default
	   */
	  _getHierarchicalShowParentLevel: function(hierarchicalFacet) {
	    if (typeof hierarchicalFacet.showParentLevel === 'boolean') {
	      return hierarchicalFacet.showParentLevel;
	    }
	    return true;
	  },

	  /**
	   * Helper function to get the hierarchicalFacet by it's name
	   * @param  {string} hierarchicalFacetName
	   * @return {object} a hierarchicalFacet
	   */
	  getHierarchicalFacetByName: function(hierarchicalFacetName) {
	    return find$4(
	      this.hierarchicalFacets,
	      function(f) {
	        return f.name === hierarchicalFacetName;
	      }
	    );
	  },

	  /**
	   * Get the current breadcrumb for a hierarchical facet, as an array
	   * @param  {string} facetName Hierarchical facet name
	   * @return {array.<string>} the path as an array of string
	   */
	  getHierarchicalFacetBreadcrumb: function(facetName) {
	    if (!this.isHierarchicalFacet(facetName)) {
	      return [];
	    }

	    var refinement = this.getHierarchicalRefinement(facetName)[0];
	    if (!refinement) return [];

	    var separator = this._getHierarchicalFacetSeparator(
	      this.getHierarchicalFacetByName(facetName)
	    );
	    var path = refinement.split(separator);
	    return path.map(function(part) {
	      return part.trim();
	    });
	  },

	  toString: function() {
	    return JSON.stringify(this, null, 2);
	  }
	};

	/**
	 * Callback used for clearRefinement method
	 * @callback SearchParameters.clearCallback
	 * @param {OperatorList|FacetList} value the value of the filter
	 * @param {string} key the current attribute name
	 * @param {string} type `numeric`, `disjunctiveFacet`, `conjunctiveFacet`, `hierarchicalFacet` or `exclude`
	 * depending on the type of facet
	 * @return {boolean} `true` if the element should be removed. `false` otherwise.
	 */
	var SearchParameters_1 = SearchParameters$2;

	function compareAscending(value, other) {
	  if (value !== other) {
	    var valIsDefined = value !== undefined;
	    var valIsNull = value === null;

	    var othIsDefined = other !== undefined;
	    var othIsNull = other === null;

	    if (
	      (!othIsNull && value > other) ||
	      (valIsNull && othIsDefined) ||
	      !valIsDefined
	    ) {
	      return 1;
	    }
	    if (
	      (!valIsNull && value < other) ||
	      (othIsNull && valIsDefined) ||
	      !othIsDefined
	    ) {
	      return -1;
	    }
	  }
	  return 0;
	}

	/**
	 * @param {Array<object>} collection object with keys in attributes
	 * @param {Array<string>} iteratees attributes
	 * @param {Array<string>} orders asc | desc
	 */
	function orderBy$2(collection, iteratees, orders) {
	  if (!Array.isArray(collection)) {
	    return [];
	  }

	  if (!Array.isArray(orders)) {
	    orders = [];
	  }

	  var result = collection.map(function(value, index) {
	    return {
	      criteria: iteratees.map(function(iteratee) {
	        return value[iteratee];
	      }),
	      index: index,
	      value: value
	    };
	  });

	  result.sort(function comparer(object, other) {
	    var index = -1;

	    while (++index < object.criteria.length) {
	      var res = compareAscending(object.criteria[index], other.criteria[index]);
	      if (res) {
	        if (index >= orders.length) {
	          return res;
	        }
	        if (orders[index] === 'desc') {
	          return -res;
	        }
	        return res;
	      }
	    }

	    // This ensures a stable sort in V8 and other engines.
	    // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
	    return object.index - other.index;
	  });

	  return result.map(function(res) {
	    return res.value;
	  });
	}

	var orderBy_1 = orderBy$2;

	var compact$2 = function compact(array) {
	  if (!Array.isArray(array)) {
	    return [];
	  }

	  return array.filter(Boolean);
	};

	// @MAJOR can be replaced by native Array#findIndex when we change support
	var findIndex$2 = function find(array, comparator) {
	  if (!Array.isArray(array)) {
	    return -1;
	  }

	  for (var i = 0; i < array.length; i++) {
	    if (comparator(array[i])) {
	      return i;
	    }
	  }
	  return -1;
	};

	var find$3 = find$5;

	/**
	 * Transform sort format from user friendly notation to lodash format
	 * @param {string[]} sortBy array of predicate of the form "attribute:order"
	 * @param {string[]} [defaults] array of predicate of the form "attribute:order"
	 * @return {array.<string[]>} array containing 2 elements : attributes, orders
	 */
	var formatSort$1 = function formatSort(sortBy, defaults) {
	  var defaultInstructions = (defaults || []).map(function(sort) {
	    return sort.split(':');
	  });

	  return sortBy.reduce(
	    function preparePredicate(out, sort) {
	      var sortInstruction = sort.split(':');

	      var matchingDefault = find$3(defaultInstructions, function(
	        defaultInstruction
	      ) {
	        return defaultInstruction[0] === sortInstruction[0];
	      });

	      if (sortInstruction.length > 1 || !matchingDefault) {
	        out[0].push(sortInstruction[0]);
	        out[1].push(sortInstruction[1]);
	        return out;
	      }

	      out[0].push(matchingDefault[0]);
	      out[1].push(matchingDefault[1]);
	      return out;
	    },
	    [[], []]
	  );
	};

	/**
	 * Replaces a leading - with \-
	 * @private
	 * @param {any} value the facet value to replace
	 * @returns any
	 */
	function escapeFacetValue$3(value) {
	  if (typeof value !== 'string') return value;

	  return String(value).replace(/^-/, '\\-');
	}

	/**
	 * Replaces a leading \- with -
	 * @private
	 * @param {any} value the escaped facet value
	 * @returns any
	 */
	function unescapeFacetValue$2(value) {
	  if (typeof value !== 'string') return value;

	  return value.replace(/^\\-/, '-');
	}

	var escapeFacetValue_1 = {
	  escapeFacetValue: escapeFacetValue$3,
	  unescapeFacetValue: unescapeFacetValue$2
	};

	var generateHierarchicalTree_1 = generateTrees;

	var orderBy$1 = orderBy_1;
	var find$2 = find$5;
	var prepareHierarchicalFacetSortBy = formatSort$1;
	var fv$1 = escapeFacetValue_1;
	var escapeFacetValue$2 = fv$1.escapeFacetValue;
	var unescapeFacetValue$1 = fv$1.unescapeFacetValue;

	function generateTrees(state) {
	  return function generate(hierarchicalFacetResult, hierarchicalFacetIndex) {
	    var hierarchicalFacet = state.hierarchicalFacets[hierarchicalFacetIndex];
	    var hierarchicalFacetRefinement =
	      (state.hierarchicalFacetsRefinements[hierarchicalFacet.name] &&
	        state.hierarchicalFacetsRefinements[hierarchicalFacet.name][0]) ||
	      '';
	    var hierarchicalSeparator = state._getHierarchicalFacetSeparator(
	      hierarchicalFacet
	    );
	    var hierarchicalRootPath = state._getHierarchicalRootPath(
	      hierarchicalFacet
	    );
	    var hierarchicalShowParentLevel = state._getHierarchicalShowParentLevel(
	      hierarchicalFacet
	    );
	    var sortBy = prepareHierarchicalFacetSortBy(
	      state._getHierarchicalFacetSortBy(hierarchicalFacet)
	    );

	    var rootExhaustive = hierarchicalFacetResult.every(function(facetResult) {
	      return facetResult.exhaustive;
	    });

	    var generateTreeFn = generateHierarchicalTree$1(
	      sortBy,
	      hierarchicalSeparator,
	      hierarchicalRootPath,
	      hierarchicalShowParentLevel,
	      hierarchicalFacetRefinement
	    );

	    var results = hierarchicalFacetResult;

	    if (hierarchicalRootPath) {
	      results = hierarchicalFacetResult.slice(
	        hierarchicalRootPath.split(hierarchicalSeparator).length
	      );
	    }

	    return results.reduce(generateTreeFn, {
	      name: state.hierarchicalFacets[hierarchicalFacetIndex].name,
	      count: null, // root level, no count
	      isRefined: true, // root level, always refined
	      path: null, // root level, no path
	      escapedValue: null,
	      exhaustive: rootExhaustive,
	      data: null
	    });
	  };
	}

	function generateHierarchicalTree$1(
	  sortBy,
	  hierarchicalSeparator,
	  hierarchicalRootPath,
	  hierarchicalShowParentLevel,
	  currentRefinement
	) {
	  return function generateTree(
	    hierarchicalTree,
	    hierarchicalFacetResult,
	    currentHierarchicalLevel
	  ) {
	    var parent = hierarchicalTree;

	    if (currentHierarchicalLevel > 0) {
	      var level = 0;

	      parent = hierarchicalTree;

	      while (level < currentHierarchicalLevel) {
	        /**
	         * @type {object[]]} hierarchical data
	         */
	        var data = parent && Array.isArray(parent.data) ? parent.data : [];
	        parent = find$2(data, function(subtree) {
	          return subtree.isRefined;
	        });
	        level++;
	      }
	    }

	    // we found a refined parent, let's add current level data under it
	    if (parent) {
	      // filter values in case an object has multiple categories:
	      //   {
	      //     categories: {
	      //       level0: ['beers', 'bières'],
	      //       level1: ['beers > IPA', 'bières > Belges']
	      //     }
	      //   }
	      //
	      // If parent refinement is `beers`, then we do not want to have `bières > Belges`
	      // showing up

	      var picked = Object.keys(hierarchicalFacetResult.data)
	        .map(function(facetValue) {
	          return [facetValue, hierarchicalFacetResult.data[facetValue]];
	        })
	        .filter(function(tuple) {
	          var facetValue = tuple[0];
	          return onlyMatchingTree(
	            facetValue,
	            parent.path || hierarchicalRootPath,
	            currentRefinement,
	            hierarchicalSeparator,
	            hierarchicalRootPath,
	            hierarchicalShowParentLevel
	          );
	        });

	      parent.data = orderBy$1(
	        picked.map(function(tuple) {
	          var facetValue = tuple[0];
	          var facetCount = tuple[1];

	          return format(
	            facetCount,
	            facetValue,
	            hierarchicalSeparator,
	            unescapeFacetValue$1(currentRefinement),
	            hierarchicalFacetResult.exhaustive
	          );
	        }),
	        sortBy[0],
	        sortBy[1]
	      );
	    }

	    return hierarchicalTree;
	  };
	}

	function onlyMatchingTree(
	  facetValue,
	  parentPath,
	  currentRefinement,
	  hierarchicalSeparator,
	  hierarchicalRootPath,
	  hierarchicalShowParentLevel
	) {
	  // we want the facetValue is a child of hierarchicalRootPath
	  if (
	    hierarchicalRootPath &&
	    (facetValue.indexOf(hierarchicalRootPath) !== 0 ||
	      hierarchicalRootPath === facetValue)
	  ) {
	    return false;
	  }

	  // we always want root levels (only when there is no prefix path)
	  return (
	    (!hierarchicalRootPath &&
	      facetValue.indexOf(hierarchicalSeparator) === -1) ||
	    // if there is a rootPath, being root level mean 1 level under rootPath
	    (hierarchicalRootPath &&
	      facetValue.split(hierarchicalSeparator).length -
	        hierarchicalRootPath.split(hierarchicalSeparator).length ===
	        1) ||
	    // if current refinement is a root level and current facetValue is a root level,
	    // keep the facetValue
	    (facetValue.indexOf(hierarchicalSeparator) === -1 &&
	      currentRefinement.indexOf(hierarchicalSeparator) === -1) ||
	    // currentRefinement is a child of the facet value
	    currentRefinement.indexOf(facetValue) === 0 ||
	    // facetValue is a child of the current parent, add it
	    (facetValue.indexOf(parentPath + hierarchicalSeparator) === 0 &&
	      (hierarchicalShowParentLevel ||
	        facetValue.indexOf(currentRefinement) === 0))
	  );
	}

	function format(
	  facetCount,
	  facetValue,
	  hierarchicalSeparator,
	  currentRefinement,
	  exhaustive
	) {
	  var parts = facetValue.split(hierarchicalSeparator);
	  return {
	    name: parts[parts.length - 1].trim(),
	    path: facetValue,
	    escapedValue: escapeFacetValue$2(facetValue),
	    count: facetCount,
	    isRefined:
	      currentRefinement === facetValue ||
	      currentRefinement.indexOf(facetValue + hierarchicalSeparator) === 0,
	    exhaustive: exhaustive,
	    data: null
	  };
	}

	var merge$4 = merge_1;
	var defaultsPure = defaultsPure$3;
	var orderBy = orderBy_1;
	var compact$1 = compact$2;
	var find$1 = find$5;
	var findIndex$1 = findIndex$2;
	var formatSort = formatSort$1;
	var fv = escapeFacetValue_1;
	var escapeFacetValue$1 = fv.escapeFacetValue;
	var unescapeFacetValue = fv.unescapeFacetValue;

	var generateHierarchicalTree = generateHierarchicalTree_1;

	/**
	 * @typedef SearchResults.Facet
	 * @type {object}
	 * @property {string} name name of the attribute in the record
	 * @property {object} data the faceting data: value, number of entries
	 * @property {object} stats undefined unless facet_stats is retrieved from algolia
	 */

	/**
	 * @typedef SearchResults.HierarchicalFacet
	 * @type {object}
	 * @property {string} name name of the current value given the hierarchical level, trimmed.
	 * If root node, you get the facet name
	 * @property {number} count number of objects matching this hierarchical value
	 * @property {string} path the current hierarchical value full path
	 * @property {boolean} isRefined `true` if the current value was refined, `false` otherwise
	 * @property {HierarchicalFacet[]} data sub values for the current level
	 */

	/**
	 * @typedef SearchResults.FacetValue
	 * @type {object}
	 * @property {string} name the facet value itself
	 * @property {number} count times this facet appears in the results
	 * @property {boolean} isRefined is the facet currently selected
	 * @property {boolean} isExcluded is the facet currently excluded (only for conjunctive facets)
	 */

	/**
	 * @typedef Refinement
	 * @type {object}
	 * @property {string} type the type of filter used:
	 * `numeric`, `facet`, `exclude`, `disjunctive`, `hierarchical`
	 * @property {string} attributeName name of the attribute used for filtering
	 * @property {string} name the value of the filter
	 * @property {number} numericValue the value as a number. Only for numeric filters.
	 * @property {string} operator the operator used. Only for numeric filters.
	 * @property {number} count the number of computed hits for this filter. Only on facets.
	 * @property {boolean} exhaustive if the count is exhaustive
	 */

	/**
	 * @param {string[]} attributes
	 */
	function getIndices(attributes) {
	  var indices = {};

	  attributes.forEach(function(val, idx) {
	    indices[val] = idx;
	  });

	  return indices;
	}

	function assignFacetStats(dest, facetStats, key) {
	  if (facetStats && facetStats[key]) {
	    dest.stats = facetStats[key];
	  }
	}

	/**
	 * @typedef {Object} HierarchicalFacet
	 * @property {string} name
	 * @property {string[]} attributes
	 */

	/**
	 * @param {HierarchicalFacet[]} hierarchicalFacets
	 * @param {string} hierarchicalAttributeName
	 */
	function findMatchingHierarchicalFacetFromAttributeName(
	  hierarchicalFacets,
	  hierarchicalAttributeName
	) {
	  return find$1(hierarchicalFacets, function facetKeyMatchesAttribute(
	    hierarchicalFacet
	  ) {
	    var facetNames = hierarchicalFacet.attributes || [];
	    return facetNames.indexOf(hierarchicalAttributeName) > -1;
	  });
	}

	/*eslint-disable */
	/**
	 * Constructor for SearchResults
	 * @class
	 * @classdesc SearchResults contains the results of a query to Algolia using the
	 * {@link AlgoliaSearchHelper}.
	 * @param {SearchParameters} state state that led to the response
	 * @param {array.<object>} results the results from algolia client
	 * @example <caption>SearchResults of the first query in
	 * <a href="http://demos.algolia.com/instant-search-demo">the instant search demo</a></caption>
	{
	   "hitsPerPage": 10,
	   "processingTimeMS": 2,
	   "facets": [
	      {
	         "name": "type",
	         "data": {
	            "HardGood": 6627,
	            "BlackTie": 550,
	            "Music": 665,
	            "Software": 131,
	            "Game": 456,
	            "Movie": 1571
	         },
	         "exhaustive": false
	      },
	      {
	         "exhaustive": false,
	         "data": {
	            "Free shipping": 5507
	         },
	         "name": "shipping"
	      }
	  ],
	   "hits": [
	      {
	         "thumbnailImage": "http://img.bbystatic.com/BestBuy_US/images/products/1688/1688832_54x108_s.gif",
	         "_highlightResult": {
	            "shortDescription": {
	               "matchLevel": "none",
	               "value": "Safeguard your PC, Mac, Android and iOS devices with comprehensive Internet protection",
	               "matchedWords": []
	            },
	            "category": {
	               "matchLevel": "none",
	               "value": "Computer Security Software",
	               "matchedWords": []
	            },
	            "manufacturer": {
	               "matchedWords": [],
	               "value": "Webroot",
	               "matchLevel": "none"
	            },
	            "name": {
	               "value": "Webroot SecureAnywhere Internet Security (3-Device) (1-Year Subscription) - Mac/Windows",
	               "matchedWords": [],
	               "matchLevel": "none"
	            }
	         },
	         "image": "http://img.bbystatic.com/BestBuy_US/images/products/1688/1688832_105x210_sc.jpg",
	         "shipping": "Free shipping",
	         "bestSellingRank": 4,
	         "shortDescription": "Safeguard your PC, Mac, Android and iOS devices with comprehensive Internet protection",
	         "url": "http://www.bestbuy.com/site/webroot-secureanywhere-internet-security-3-devi…d=1219060687969&skuId=1688832&cmp=RMX&ky=2d3GfEmNIzjA0vkzveHdZEBgpPCyMnLTJ",
	         "name": "Webroot SecureAnywhere Internet Security (3-Device) (1-Year Subscription) - Mac/Windows",
	         "category": "Computer Security Software",
	         "salePrice_range": "1 - 50",
	         "objectID": "1688832",
	         "type": "Software",
	         "customerReviewCount": 5980,
	         "salePrice": 49.99,
	         "manufacturer": "Webroot"
	      },
	      ....
	  ],
	   "nbHits": 10000,
	   "disjunctiveFacets": [
	      {
	         "exhaustive": false,
	         "data": {
	            "5": 183,
	            "12": 112,
	            "7": 149,
	            ...
	         },
	         "name": "customerReviewCount",
	         "stats": {
	            "max": 7461,
	            "avg": 157.939,
	            "min": 1
	         }
	      },
	      {
	         "data": {
	            "Printer Ink": 142,
	            "Wireless Speakers": 60,
	            "Point & Shoot Cameras": 48,
	            ...
	         },
	         "name": "category",
	         "exhaustive": false
	      },
	      {
	         "exhaustive": false,
	         "data": {
	            "> 5000": 2,
	            "1 - 50": 6524,
	            "501 - 2000": 566,
	            "201 - 500": 1501,
	            "101 - 200": 1360,
	            "2001 - 5000": 47
	         },
	         "name": "salePrice_range"
	      },
	      {
	         "data": {
	            "Dynex™": 202,
	            "Insignia™": 230,
	            "PNY": 72,
	            ...
	         },
	         "name": "manufacturer",
	         "exhaustive": false
	      }
	  ],
	   "query": "",
	   "nbPages": 100,
	   "page": 0,
	   "index": "bestbuy"
	}
	 **/
	/*eslint-enable */
	function SearchResults$2(state, results, options) {
	  var mainSubResponse = results[0];

	  this._rawResults = results;

	  var self = this;

	  // https://www.algolia.com/doc/api-reference/api-methods/search/#response
	  Object.keys(mainSubResponse).forEach(function(key) {
	    self[key] = mainSubResponse[key];
	  });

	  // Make every key of the result options reachable from the instance
	  Object.keys(options || {}).forEach(function(key) {
	    self[key] = options[key];
	  });

	  /**
	   * query used to generate the results
	   * @name query
	   * @member {string}
	   * @memberof SearchResults
	   * @instance
	   */
	  /**
	   * The query as parsed by the engine given all the rules.
	   * @name parsedQuery
	   * @member {string}
	   * @memberof SearchResults
	   * @instance
	   */
	  /**
	   * all the records that match the search parameters. Each record is
	   * augmented with a new attribute `_highlightResult`
	   * which is an object keyed by attribute and with the following properties:
	   *  - `value` : the value of the facet highlighted (html)
	   *  - `matchLevel`: full, partial or none depending on how the query terms match
	   * @name hits
	   * @member {object[]}
	   * @memberof SearchResults
	   * @instance
	   */
	  /**
	   * index where the results come from
	   * @name index
	   * @member {string}
	   * @memberof SearchResults
	   * @instance
	   */
	  /**
	   * number of hits per page requested
	   * @name hitsPerPage
	   * @member {number}
	   * @memberof SearchResults
	   * @instance
	   */
	  /**
	   * total number of hits of this query on the index
	   * @name nbHits
	   * @member {number}
	   * @memberof SearchResults
	   * @instance
	   */
	  /**
	   * total number of pages with respect to the number of hits per page and the total number of hits
	   * @name nbPages
	   * @member {number}
	   * @memberof SearchResults
	   * @instance
	   */
	  /**
	   * current page
	   * @name page
	   * @member {number}
	   * @memberof SearchResults
	   * @instance
	   */
	  /**
	   * The position if the position was guessed by IP.
	   * @name aroundLatLng
	   * @member {string}
	   * @memberof SearchResults
	   * @instance
	   * @example "48.8637,2.3615",
	   */
	  /**
	   * The radius computed by Algolia.
	   * @name automaticRadius
	   * @member {string}
	   * @memberof SearchResults
	   * @instance
	   * @example "126792922",
	   */
	  /**
	   * String identifying the server used to serve this request.
	   *
	   * getRankingInfo needs to be set to `true` for this to be returned
	   *
	   * @name serverUsed
	   * @member {string}
	   * @memberof SearchResults
	   * @instance
	   * @example "c7-use-2.algolia.net",
	   */
	  /**
	   * Boolean that indicates if the computation of the counts did time out.
	   * @deprecated
	   * @name timeoutCounts
	   * @member {boolean}
	   * @memberof SearchResults
	   * @instance
	   */
	  /**
	   * Boolean that indicates if the computation of the hits did time out.
	   * @deprecated
	   * @name timeoutHits
	   * @member {boolean}
	   * @memberof SearchResults
	   * @instance
	   */
	  /**
	   * True if the counts of the facets is exhaustive
	   * @name exhaustiveFacetsCount
	   * @member {boolean}
	   * @memberof SearchResults
	   * @instance
	   */
	  /**
	   * True if the number of hits is exhaustive
	   * @name exhaustiveNbHits
	   * @member {boolean}
	   * @memberof SearchResults
	   * @instance
	   */
	  /**
	   * Contains the userData if they are set by a [query rule](https://www.algolia.com/doc/guides/query-rules/query-rules-overview/).
	   * @name userData
	   * @member {object[]}
	   * @memberof SearchResults
	   * @instance
	   */
	  /**
	   * queryID is the unique identifier of the query used to generate the current search results.
	   * This value is only available if the `clickAnalytics` search parameter is set to `true`.
	   * @name queryID
	   * @member {string}
	   * @memberof SearchResults
	   * @instance
	   */

	  /**
	   * sum of the processing time of all the queries
	   * @member {number}
	   */
	  this.processingTimeMS = results.reduce(function(sum, result) {
	    return result.processingTimeMS === undefined
	      ? sum
	      : sum + result.processingTimeMS;
	  }, 0);

	  /**
	   * disjunctive facets results
	   * @member {SearchResults.Facet[]}
	   */
	  this.disjunctiveFacets = [];
	  /**
	   * disjunctive facets results
	   * @member {SearchResults.HierarchicalFacet[]}
	   */
	  this.hierarchicalFacets = state.hierarchicalFacets.map(function initFutureTree() {
	    return [];
	  });
	  /**
	   * other facets results
	   * @member {SearchResults.Facet[]}
	   */
	  this.facets = [];

	  var disjunctiveFacets = state.getRefinedDisjunctiveFacets();

	  var facetsIndices = getIndices(state.facets);
	  var disjunctiveFacetsIndices = getIndices(state.disjunctiveFacets);
	  var nextDisjunctiveResult = 1;

	  // Since we send request only for disjunctive facets that have been refined,
	  // we get the facets information from the first, general, response.

	  var mainFacets = mainSubResponse.facets || {};

	  Object.keys(mainFacets).forEach(function(facetKey) {
	    var facetValueObject = mainFacets[facetKey];

	    var hierarchicalFacet = findMatchingHierarchicalFacetFromAttributeName(
	      state.hierarchicalFacets,
	      facetKey
	    );

	    if (hierarchicalFacet) {
	      // Place the hierarchicalFacet data at the correct index depending on
	      // the attributes order that was defined at the helper initialization
	      var facetIndex = hierarchicalFacet.attributes.indexOf(facetKey);
	      var idxAttributeName = findIndex$1(state.hierarchicalFacets, function(f) {
	        return f.name === hierarchicalFacet.name;
	      });
	      self.hierarchicalFacets[idxAttributeName][facetIndex] = {
	        attribute: facetKey,
	        data: facetValueObject,
	        exhaustive: mainSubResponse.exhaustiveFacetsCount
	      };
	    } else {
	      var isFacetDisjunctive = state.disjunctiveFacets.indexOf(facetKey) !== -1;
	      var isFacetConjunctive = state.facets.indexOf(facetKey) !== -1;
	      var position;

	      if (isFacetDisjunctive) {
	        position = disjunctiveFacetsIndices[facetKey];
	        self.disjunctiveFacets[position] = {
	          name: facetKey,
	          data: facetValueObject,
	          exhaustive: mainSubResponse.exhaustiveFacetsCount
	        };
	        assignFacetStats(self.disjunctiveFacets[position], mainSubResponse.facets_stats, facetKey);
	      }
	      if (isFacetConjunctive) {
	        position = facetsIndices[facetKey];
	        self.facets[position] = {
	          name: facetKey,
	          data: facetValueObject,
	          exhaustive: mainSubResponse.exhaustiveFacetsCount
	        };
	        assignFacetStats(self.facets[position], mainSubResponse.facets_stats, facetKey);
	      }
	    }
	  });

	  // Make sure we do not keep holes within the hierarchical facets
	  this.hierarchicalFacets = compact$1(this.hierarchicalFacets);

	  // aggregate the refined disjunctive facets
	  disjunctiveFacets.forEach(function(disjunctiveFacet) {
	    var result = results[nextDisjunctiveResult];
	    var facets = result && result.facets ? result.facets : {};
	    var hierarchicalFacet = state.getHierarchicalFacetByName(disjunctiveFacet);

	    // There should be only item in facets.
	    Object.keys(facets).forEach(function(dfacet) {
	      var facetResults = facets[dfacet];

	      var position;

	      if (hierarchicalFacet) {
	        position = findIndex$1(state.hierarchicalFacets, function(f) {
	          return f.name === hierarchicalFacet.name;
	        });
	        var attributeIndex = findIndex$1(self.hierarchicalFacets[position], function(f) {
	          return f.attribute === dfacet;
	        });

	        // previous refinements and no results so not able to find it
	        if (attributeIndex === -1) {
	          return;
	        }

	        self.hierarchicalFacets[position][attributeIndex].data = merge$4(
	          {},
	          self.hierarchicalFacets[position][attributeIndex].data,
	          facetResults
	        );
	      } else {
	        position = disjunctiveFacetsIndices[dfacet];

	        var dataFromMainRequest = mainSubResponse.facets && mainSubResponse.facets[dfacet] || {};

	        self.disjunctiveFacets[position] = {
	          name: dfacet,
	          data: defaultsPure({}, facetResults, dataFromMainRequest),
	          exhaustive: result.exhaustiveFacetsCount
	        };
	        assignFacetStats(self.disjunctiveFacets[position], result.facets_stats, dfacet);

	        if (state.disjunctiveFacetsRefinements[dfacet]) {
	          state.disjunctiveFacetsRefinements[dfacet].forEach(function(refinementValue) {
	            // add the disjunctive refinements if it is no more retrieved
	            if (!self.disjunctiveFacets[position].data[refinementValue] &&
	              state.disjunctiveFacetsRefinements[dfacet].indexOf(unescapeFacetValue(refinementValue)) > -1) {
	              self.disjunctiveFacets[position].data[refinementValue] = 0;
	            }
	          });
	        }
	      }
	    });
	    nextDisjunctiveResult++;
	  });

	  // if we have some root level values for hierarchical facets, merge them
	  state.getRefinedHierarchicalFacets().forEach(function(refinedFacet) {
	    var hierarchicalFacet = state.getHierarchicalFacetByName(refinedFacet);
	    var separator = state._getHierarchicalFacetSeparator(hierarchicalFacet);

	    var currentRefinement = state.getHierarchicalRefinement(refinedFacet);
	    // if we are already at a root refinement (or no refinement at all), there is no
	    // root level values request
	    if (currentRefinement.length === 0 || currentRefinement[0].split(separator).length < 2) {
	      return;
	    }

	    var result = results[nextDisjunctiveResult];
	    var facets = result && result.facets
	      ? result.facets
	      : {};
	    Object.keys(facets).forEach(function(dfacet) {
	      var facetResults = facets[dfacet];
	      var position = findIndex$1(state.hierarchicalFacets, function(f) {
	        return f.name === hierarchicalFacet.name;
	      });
	      var attributeIndex = findIndex$1(self.hierarchicalFacets[position], function(f) {
	        return f.attribute === dfacet;
	      });

	      // previous refinements and no results so not able to find it
	      if (attributeIndex === -1) {
	        return;
	      }

	      // when we always get root levels, if the hits refinement is `beers > IPA` (count: 5),
	      // then the disjunctive values will be `beers` (count: 100),
	      // but we do not want to display
	      //   | beers (100)
	      //     > IPA (5)
	      // We want
	      //   | beers (5)
	      //     > IPA (5)
	      var defaultData = {};

	      if (currentRefinement.length > 0) {
	        var root = currentRefinement[0].split(separator)[0];
	        defaultData[root] = self.hierarchicalFacets[position][attributeIndex].data[root];
	      }

	      self.hierarchicalFacets[position][attributeIndex].data = defaultsPure(
	        defaultData,
	        facetResults,
	        self.hierarchicalFacets[position][attributeIndex].data
	      );
	    });

	    nextDisjunctiveResult++;
	  });

	  // add the excludes
	  Object.keys(state.facetsExcludes).forEach(function(facetName) {
	    var excludes = state.facetsExcludes[facetName];
	    var position = facetsIndices[facetName];

	    self.facets[position] = {
	      name: facetName,
	      data: mainSubResponse.facets[facetName],
	      exhaustive: mainSubResponse.exhaustiveFacetsCount
	    };
	    excludes.forEach(function(facetValue) {
	      self.facets[position] = self.facets[position] || {name: facetName};
	      self.facets[position].data = self.facets[position].data || {};
	      self.facets[position].data[facetValue] = 0;
	    });
	  });

	  /**
	   * @type {Array}
	   */
	  this.hierarchicalFacets = this.hierarchicalFacets.map(generateHierarchicalTree(state));

	  /**
	   * @type {Array}
	   */
	  this.facets = compact$1(this.facets);
	  /**
	   * @type {Array}
	   */
	  this.disjunctiveFacets = compact$1(this.disjunctiveFacets);

	  this._state = state;
	}

	/**
	 * Get a facet object with its name
	 * @deprecated
	 * @param {string} name name of the faceted attribute
	 * @return {SearchResults.Facet} the facet object
	 */
	SearchResults$2.prototype.getFacetByName = function(name) {
	  function predicate(facet) {
	    return facet.name === name;
	  }

	  return find$1(this.facets, predicate) ||
	    find$1(this.disjunctiveFacets, predicate) ||
	    find$1(this.hierarchicalFacets, predicate);
	};

	/**
	 * Get the facet values of a specified attribute from a SearchResults object.
	 * @private
	 * @param {SearchResults} results the search results to search in
	 * @param {string} attribute name of the faceted attribute to search for
	 * @return {array|object} facet values. For the hierarchical facets it is an object.
	 */
	function extractNormalizedFacetValues(results, attribute) {
	  function predicate(facet) {
	    return facet.name === attribute;
	  }

	  if (results._state.isConjunctiveFacet(attribute)) {
	    var facet = find$1(results.facets, predicate);
	    if (!facet) return [];

	    return Object.keys(facet.data).map(function(name) {
	      var value = escapeFacetValue$1(name);
	      return {
	        name: name,
	        escapedValue: value,
	        count: facet.data[name],
	        isRefined: results._state.isFacetRefined(attribute, value),
	        isExcluded: results._state.isExcludeRefined(attribute, name)
	      };
	    });
	  } else if (results._state.isDisjunctiveFacet(attribute)) {
	    var disjunctiveFacet = find$1(results.disjunctiveFacets, predicate);
	    if (!disjunctiveFacet) return [];

	    return Object.keys(disjunctiveFacet.data).map(function(name) {
	      var value = escapeFacetValue$1(name);
	      return {
	        name: name,
	        escapedValue: value,
	        count: disjunctiveFacet.data[name],
	        isRefined: results._state.isDisjunctiveFacetRefined(attribute, value)
	      };
	    });
	  } else if (results._state.isHierarchicalFacet(attribute)) {
	    return find$1(results.hierarchicalFacets, predicate);
	  }
	}

	/**
	 * Sort nodes of a hierarchical or disjunctive facet results
	 * @private
	 * @param {function} sortFn
	 * @param {HierarchicalFacet|Array} node node upon which we want to apply the sort
	 * @param {string[]} names attribute names
	 * @param {number} [level=0] current index in the names array
	 */
	function recSort(sortFn, node, names, level) {
	  level = level || 0;

	  if (Array.isArray(node)) {
	    return sortFn(node, names[level]);
	  }

	  if (!node.data || node.data.length === 0) {
	    return node;
	  }

	  var children = node.data.map(function(childNode) {
	    return recSort(sortFn, childNode, names, level + 1);
	  });
	  var sortedChildren = sortFn(children, names[level]);
	  var newNode = defaultsPure({data: sortedChildren}, node);
	  return newNode;
	}

	SearchResults$2.DEFAULT_SORT = ['isRefined:desc', 'count:desc', 'name:asc'];

	function vanillaSortFn(order, data) {
	  return data.sort(order);
	}

	/**
	 * @typedef FacetOrdering
	 * @type {Object}
	 * @property {string[]} [order]
	 * @property {'count' | 'alpha' | 'hidden'} [sortRemainingBy]
	 */

	/**
	 * Sorts facet arrays via their facet ordering
	 * @param {Array} facetValues the values
	 * @param {FacetOrdering} facetOrdering the ordering
	 * @returns {Array}
	 */
	function sortViaFacetOrdering(facetValues, facetOrdering) {
	  var orderedFacets = [];
	  var remainingFacets = [];

	  var order = facetOrdering.order || [];
	  /**
	   * an object with the keys being the values in order, the values their index:
	   * ['one', 'two'] -> { one: 0, two: 1 }
	   */
	  var reverseOrder = order.reduce(function(acc, name, i) {
	    acc[name] = i;
	    return acc;
	  }, {});

	  facetValues.forEach(function(item) {
	    // hierarchical facets get sorted using their raw name
	    var name = item.path || item.name;
	    if (reverseOrder[name] !== undefined) {
	      orderedFacets[reverseOrder[name]] = item;
	    } else {
	      remainingFacets.push(item);
	    }
	  });

	  orderedFacets = orderedFacets.filter(function(facet) {
	    return facet;
	  });

	  var sortRemainingBy = facetOrdering.sortRemainingBy;
	  var ordering;
	  if (sortRemainingBy === 'hidden') {
	    return orderedFacets;
	  } else if (sortRemainingBy === 'alpha') {
	    ordering = [['path', 'name'], ['asc', 'asc']];
	  } else {
	    ordering = [['count'], ['desc']];
	  }

	  return orderedFacets.concat(
	    orderBy(remainingFacets, ordering[0], ordering[1])
	  );
	}

	/**
	 * @param {SearchResults} results the search results class
	 * @param {string} attribute the attribute to retrieve ordering of
	 * @returns {FacetOrdering=}
	 */
	function getFacetOrdering(results, attribute) {
	  return (
	    results.renderingContent &&
	    results.renderingContent.facetOrdering &&
	    results.renderingContent.facetOrdering.values &&
	    results.renderingContent.facetOrdering.values[attribute]
	  );
	}

	/**
	 * Get a the list of values for a given facet attribute. Those values are sorted
	 * refinement first, descending count (bigger value on top), and name ascending
	 * (alphabetical order). The sort formula can overridden using either string based
	 * predicates or a function.
	 *
	 * This method will return all the values returned by the Algolia engine plus all
	 * the values already refined. This means that it can happen that the
	 * `maxValuesPerFacet` [configuration](https://www.algolia.com/doc/rest-api/search#param-maxValuesPerFacet)
	 * might not be respected if you have facet values that are already refined.
	 * @param {string} attribute attribute name
	 * @param {object} opts configuration options.
	 * @param {boolean} [opts.facetOrdering]
	 * Force the use of facetOrdering from the result if a sortBy is present. If
	 * sortBy isn't present, facetOrdering will be used automatically.
	 * @param {Array.<string> | function} opts.sortBy
	 * When using strings, it consists of
	 * the name of the [FacetValue](#SearchResults.FacetValue) or the
	 * [HierarchicalFacet](#SearchResults.HierarchicalFacet) attributes with the
	 * order (`asc` or `desc`). For example to order the value by count, the
	 * argument would be `['count:asc']`.
	 *
	 * If only the attribute name is specified, the ordering defaults to the one
	 * specified in the default value for this attribute.
	 *
	 * When not specified, the order is
	 * ascending.  This parameter can also be a function which takes two facet
	 * values and should return a number, 0 if equal, 1 if the first argument is
	 * bigger or -1 otherwise.
	 *
	 * The default value for this attribute `['isRefined:desc', 'count:desc', 'name:asc']`
	 * @return {FacetValue[]|HierarchicalFacet|undefined} depending on the type of facet of
	 * the attribute requested (hierarchical, disjunctive or conjunctive)
	 * @example
	 * helper.on('result', function(event){
	 *   //get values ordered only by name ascending using the string predicate
	 *   event.results.getFacetValues('city', {sortBy: ['name:asc']});
	 *   //get values  ordered only by count ascending using a function
	 *   event.results.getFacetValues('city', {
	 *     // this is equivalent to ['count:asc']
	 *     sortBy: function(a, b) {
	 *       if (a.count === b.count) return 0;
	 *       if (a.count > b.count)   return 1;
	 *       if (b.count > a.count)   return -1;
	 *     }
	 *   });
	 * });
	 */
	SearchResults$2.prototype.getFacetValues = function(attribute, opts) {
	  var facetValues = extractNormalizedFacetValues(this, attribute);
	  if (!facetValues) {
	    return undefined;
	  }

	  var options = defaultsPure({}, opts, {
	    sortBy: SearchResults$2.DEFAULT_SORT,
	    // if no sortBy is given, attempt to sort based on facetOrdering
	    // if it is given, we still allow to sort via facet ordering first
	    facetOrdering: !(opts && opts.sortBy)
	  });

	  var results = this;
	  var attributes;
	  if (Array.isArray(facetValues)) {
	    attributes = [attribute];
	  } else {
	    var config = results._state.getHierarchicalFacetByName(facetValues.name);
	    attributes = config.attributes;
	  }

	  return recSort(function(data, facetName) {
	    if (options.facetOrdering) {
	      var facetOrdering = getFacetOrdering(results, facetName);
	      if (Boolean(facetOrdering)) {
	        return sortViaFacetOrdering(data, facetOrdering);
	      }
	    }

	    if (Array.isArray(options.sortBy)) {
	      var order = formatSort(options.sortBy, SearchResults$2.DEFAULT_SORT);
	      return orderBy(data, order[0], order[1]);
	    } else if (typeof options.sortBy === 'function') {
	      return vanillaSortFn(options.sortBy, data);
	    }
	    throw new Error(
	      'options.sortBy is optional but if defined it must be ' +
	        'either an array of string (predicates) or a sorting function'
	    );
	  }, facetValues, attributes);
	};

	/**
	 * Returns the facet stats if attribute is defined and the facet contains some.
	 * Otherwise returns undefined.
	 * @param {string} attribute name of the faceted attribute
	 * @return {object} The stats of the facet
	 */
	SearchResults$2.prototype.getFacetStats = function(attribute) {
	  if (this._state.isConjunctiveFacet(attribute)) {
	    return getFacetStatsIfAvailable(this.facets, attribute);
	  } else if (this._state.isDisjunctiveFacet(attribute)) {
	    return getFacetStatsIfAvailable(this.disjunctiveFacets, attribute);
	  }

	  return undefined;
	};

	/**
	 * @typedef {Object} FacetListItem
	 * @property {string} name
	 */

	/**
	 * @param {FacetListItem[]} facetList (has more items, but enough for here)
	 * @param {string} facetName
	 */
	function getFacetStatsIfAvailable(facetList, facetName) {
	  var data = find$1(facetList, function(facet) {
	    return facet.name === facetName;
	  });
	  return data && data.stats;
	}

	/**
	 * Returns all refinements for all filters + tags. It also provides
	 * additional information: count and exhaustiveness for each filter.
	 *
	 * See the [refinement type](#Refinement) for an exhaustive view of the available
	 * data.
	 *
	 * Note that for a numeric refinement, results are grouped per operator, this
	 * means that it will return responses for operators which are empty.
	 *
	 * @return {Array.<Refinement>} all the refinements
	 */
	SearchResults$2.prototype.getRefinements = function() {
	  var state = this._state;
	  var results = this;
	  var res = [];

	  Object.keys(state.facetsRefinements).forEach(function(attributeName) {
	    state.facetsRefinements[attributeName].forEach(function(name) {
	      res.push(getRefinement(state, 'facet', attributeName, name, results.facets));
	    });
	  });

	  Object.keys(state.facetsExcludes).forEach(function(attributeName) {
	    state.facetsExcludes[attributeName].forEach(function(name) {
	      res.push(getRefinement(state, 'exclude', attributeName, name, results.facets));
	    });
	  });

	  Object.keys(state.disjunctiveFacetsRefinements).forEach(function(attributeName) {
	    state.disjunctiveFacetsRefinements[attributeName].forEach(function(name) {
	      res.push(getRefinement(state, 'disjunctive', attributeName, name, results.disjunctiveFacets));
	    });
	  });

	  Object.keys(state.hierarchicalFacetsRefinements).forEach(function(attributeName) {
	    state.hierarchicalFacetsRefinements[attributeName].forEach(function(name) {
	      res.push(getHierarchicalRefinement(state, attributeName, name, results.hierarchicalFacets));
	    });
	  });


	  Object.keys(state.numericRefinements).forEach(function(attributeName) {
	    var operators = state.numericRefinements[attributeName];
	    Object.keys(operators).forEach(function(operator) {
	      operators[operator].forEach(function(value) {
	        res.push({
	          type: 'numeric',
	          attributeName: attributeName,
	          name: value,
	          numericValue: value,
	          operator: operator
	        });
	      });
	    });
	  });

	  state.tagRefinements.forEach(function(name) {
	    res.push({type: 'tag', attributeName: '_tags', name: name});
	  });

	  return res;
	};

	/**
	 * @typedef {Object} Facet
	 * @property {string} name
	 * @property {Object} data
	 * @property {boolean} exhaustive
	 */

	/**
	 * @param {*} state
	 * @param {*} type
	 * @param {string} attributeName
	 * @param {*} name
	 * @param {Facet[]} resultsFacets
	 */
	function getRefinement(state, type, attributeName, name, resultsFacets) {
	  var facet = find$1(resultsFacets, function(f) {
	    return f.name === attributeName;
	  });
	  var count = facet && facet.data && facet.data[name] ? facet.data[name] : 0;
	  var exhaustive = (facet && facet.exhaustive) || false;

	  return {
	    type: type,
	    attributeName: attributeName,
	    name: name,
	    count: count,
	    exhaustive: exhaustive
	  };
	}

	/**
	 * @param {*} state
	 * @param {string} attributeName
	 * @param {*} name
	 * @param {Facet[]} resultsFacets
	 */
	function getHierarchicalRefinement(state, attributeName, name, resultsFacets) {
	  var facetDeclaration = state.getHierarchicalFacetByName(attributeName);
	  var separator = state._getHierarchicalFacetSeparator(facetDeclaration);
	  var split = name.split(separator);
	  var rootFacet = find$1(resultsFacets, function(facet) {
	    return facet.name === attributeName;
	  });

	  var facet = split.reduce(function(intermediateFacet, part) {
	    var newFacet =
	      intermediateFacet && find$1(intermediateFacet.data, function(f) {
	        return f.name === part;
	      });
	    return newFacet !== undefined ? newFacet : intermediateFacet;
	  }, rootFacet);

	  var count = (facet && facet.count) || 0;
	  var exhaustive = (facet && facet.exhaustive) || false;
	  var path = (facet && facet.path) || '';

	  return {
	    type: 'hierarchical',
	    attributeName: attributeName,
	    name: path,
	    count: count,
	    exhaustive: exhaustive
	  };
	}

	var SearchResults_1 = SearchResults$2;

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter$2() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	var events = EventEmitter$2;

	// Backwards-compat with node 0.10.x
	// EventEmitter.EventEmitter = EventEmitter;

	EventEmitter$2.prototype._events = undefined;
	EventEmitter$2.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter$2.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter$2.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter$2.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter$2.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter$2.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter$2.prototype.on = EventEmitter$2.prototype.addListener;

	EventEmitter$2.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter$2.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter$2.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter$2.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter$2.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter$2.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}

	function inherits$2(ctor, superCtor) {
	  ctor.prototype = Object.create(superCtor.prototype, {
	    constructor: {
	      value: ctor,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	}

	var inherits_1 = inherits$2;

	var EventEmitter$1 = events;
	var inherits$1 = inherits_1;

	/**
	 * A DerivedHelper is a way to create sub requests to
	 * Algolia from a main helper.
	 * @class
	 * @classdesc The DerivedHelper provides an event based interface for search callbacks:
	 *  - search: when a search is triggered using the `search()` method.
	 *  - result: when the response is retrieved from Algolia and is processed.
	 *    This event contains a {@link SearchResults} object and the
	 *    {@link SearchParameters} corresponding to this answer.
	 */
	function DerivedHelper$1(mainHelper, fn) {
	  this.main = mainHelper;
	  this.fn = fn;
	  this.lastResults = null;
	}

	inherits$1(DerivedHelper$1, EventEmitter$1);

	/**
	 * Detach this helper from the main helper
	 * @return {undefined}
	 * @throws Error if the derived helper is already detached
	 */
	DerivedHelper$1.prototype.detach = function() {
	  this.removeAllListeners();
	  this.main.detachDerivedHelper(this);
	};

	DerivedHelper$1.prototype.getModifiedState = function(parameters) {
	  return this.fn(parameters);
	};

	var DerivedHelper_1 = DerivedHelper$1;

	var merge$3 = merge_1;

	var requestBuilder$1 = {
	  /**
	   * Get all the queries to send to the client, those queries can used directly
	   * with the Algolia client.
	   * @private
	   * @return {object[]} The queries
	   */
	  _getQueries: function getQueries(index, state) {
	    var queries = [];

	    // One query for the hits
	    queries.push({
	      indexName: index,
	      params: requestBuilder$1._getHitsSearchParams(state)
	    });

	    // One for each disjunctive facets
	    state.getRefinedDisjunctiveFacets().forEach(function(refinedFacet) {
	      queries.push({
	        indexName: index,
	        params: requestBuilder$1._getDisjunctiveFacetSearchParams(state, refinedFacet)
	      });
	    });

	    // maybe more to get the root level of hierarchical facets when activated
	    state.getRefinedHierarchicalFacets().forEach(function(refinedFacet) {
	      var hierarchicalFacet = state.getHierarchicalFacetByName(refinedFacet);

	      var currentRefinement = state.getHierarchicalRefinement(refinedFacet);
	      // if we are deeper than level 0 (starting from `beer > IPA`)
	      // we want to get the root values
	      var separator = state._getHierarchicalFacetSeparator(hierarchicalFacet);
	      if (currentRefinement.length > 0 && currentRefinement[0].split(separator).length > 1) {
	        queries.push({
	          indexName: index,
	          params: requestBuilder$1._getDisjunctiveFacetSearchParams(state, refinedFacet, true)
	        });
	      }
	    });

	    return queries;
	  },

	  /**
	   * Build search parameters used to fetch hits
	   * @private
	   * @return {object.<string, any>}
	   */
	  _getHitsSearchParams: function(state) {
	    var facets = state.facets
	      .concat(state.disjunctiveFacets)
	      .concat(requestBuilder$1._getHitsHierarchicalFacetsAttributes(state));


	    var facetFilters = requestBuilder$1._getFacetFilters(state);
	    var numericFilters = requestBuilder$1._getNumericFilters(state);
	    var tagFilters = requestBuilder$1._getTagFilters(state);
	    var additionalParams = {
	      facets: facets.indexOf('*') > -1 ? ['*'] : facets,
	      tagFilters: tagFilters
	    };

	    if (facetFilters.length > 0) {
	      additionalParams.facetFilters = facetFilters;
	    }

	    if (numericFilters.length > 0) {
	      additionalParams.numericFilters = numericFilters;
	    }

	    return merge$3({}, state.getQueryParams(), additionalParams);
	  },

	  /**
	   * Build search parameters used to fetch a disjunctive facet
	   * @private
	   * @param  {string} facet the associated facet name
	   * @param  {boolean} hierarchicalRootLevel ?? FIXME
	   * @return {object}
	   */
	  _getDisjunctiveFacetSearchParams: function(state, facet, hierarchicalRootLevel) {
	    var facetFilters = requestBuilder$1._getFacetFilters(state, facet, hierarchicalRootLevel);
	    var numericFilters = requestBuilder$1._getNumericFilters(state, facet);
	    var tagFilters = requestBuilder$1._getTagFilters(state);
	    var additionalParams = {
	      hitsPerPage: 1,
	      page: 0,
	      attributesToRetrieve: [],
	      attributesToHighlight: [],
	      attributesToSnippet: [],
	      tagFilters: tagFilters,
	      analytics: false,
	      clickAnalytics: false
	    };

	    var hierarchicalFacet = state.getHierarchicalFacetByName(facet);

	    if (hierarchicalFacet) {
	      additionalParams.facets = requestBuilder$1._getDisjunctiveHierarchicalFacetAttribute(
	        state,
	        hierarchicalFacet,
	        hierarchicalRootLevel
	      );
	    } else {
	      additionalParams.facets = facet;
	    }

	    if (numericFilters.length > 0) {
	      additionalParams.numericFilters = numericFilters;
	    }

	    if (facetFilters.length > 0) {
	      additionalParams.facetFilters = facetFilters;
	    }

	    return merge$3({}, state.getQueryParams(), additionalParams);
	  },

	  /**
	   * Return the numeric filters in an algolia request fashion
	   * @private
	   * @param {string} [facetName] the name of the attribute for which the filters should be excluded
	   * @return {string[]} the numeric filters in the algolia format
	   */
	  _getNumericFilters: function(state, facetName) {
	    if (state.numericFilters) {
	      return state.numericFilters;
	    }

	    var numericFilters = [];

	    Object.keys(state.numericRefinements).forEach(function(attribute) {
	      var operators = state.numericRefinements[attribute] || {};
	      Object.keys(operators).forEach(function(operator) {
	        var values = operators[operator] || [];
	        if (facetName !== attribute) {
	          values.forEach(function(value) {
	            if (Array.isArray(value)) {
	              var vs = value.map(function(v) {
	                return attribute + operator + v;
	              });
	              numericFilters.push(vs);
	            } else {
	              numericFilters.push(attribute + operator + value);
	            }
	          });
	        }
	      });
	    });

	    return numericFilters;
	  },

	  /**
	   * Return the tags filters depending
	   * @private
	   * @return {string}
	   */
	  _getTagFilters: function(state) {
	    if (state.tagFilters) {
	      return state.tagFilters;
	    }

	    return state.tagRefinements.join(',');
	  },


	  /**
	   * Build facetFilters parameter based on current refinements. The array returned
	   * contains strings representing the facet filters in the algolia format.
	   * @private
	   * @param  {string} [facet] if set, the current disjunctive facet
	   * @return {array.<string>}
	   */
	  _getFacetFilters: function(state, facet, hierarchicalRootLevel) {
	    var facetFilters = [];

	    var facetsRefinements = state.facetsRefinements || {};
	    Object.keys(facetsRefinements).forEach(function(facetName) {
	      var facetValues = facetsRefinements[facetName] || [];
	      facetValues.forEach(function(facetValue) {
	        facetFilters.push(facetName + ':' + facetValue);
	      });
	    });

	    var facetsExcludes = state.facetsExcludes || {};
	    Object.keys(facetsExcludes).forEach(function(facetName) {
	      var facetValues = facetsExcludes[facetName] || [];
	      facetValues.forEach(function(facetValue) {
	        facetFilters.push(facetName + ':-' + facetValue);
	      });
	    });

	    var disjunctiveFacetsRefinements = state.disjunctiveFacetsRefinements || {};
	    Object.keys(disjunctiveFacetsRefinements).forEach(function(facetName) {
	      var facetValues = disjunctiveFacetsRefinements[facetName] || [];
	      if (facetName === facet || !facetValues || facetValues.length === 0) {
	        return;
	      }
	      var orFilters = [];

	      facetValues.forEach(function(facetValue) {
	        orFilters.push(facetName + ':' + facetValue);
	      });

	      facetFilters.push(orFilters);
	    });

	    var hierarchicalFacetsRefinements = state.hierarchicalFacetsRefinements || {};
	    Object.keys(hierarchicalFacetsRefinements).forEach(function(facetName) {
	      var facetValues = hierarchicalFacetsRefinements[facetName] || [];
	      var facetValue = facetValues[0];

	      if (facetValue === undefined) {
	        return;
	      }

	      var hierarchicalFacet = state.getHierarchicalFacetByName(facetName);
	      var separator = state._getHierarchicalFacetSeparator(hierarchicalFacet);
	      var rootPath = state._getHierarchicalRootPath(hierarchicalFacet);
	      var attributeToRefine;
	      var attributesIndex;

	      // we ask for parent facet values only when the `facet` is the current hierarchical facet
	      if (facet === facetName) {
	        // if we are at the root level already, no need to ask for facet values, we get them from
	        // the hits query
	        if (facetValue.indexOf(separator) === -1 || (!rootPath && hierarchicalRootLevel === true) ||
	          (rootPath && rootPath.split(separator).length === facetValue.split(separator).length)) {
	          return;
	        }

	        if (!rootPath) {
	          attributesIndex = facetValue.split(separator).length - 2;
	          facetValue = facetValue.slice(0, facetValue.lastIndexOf(separator));
	        } else {
	          attributesIndex = rootPath.split(separator).length - 1;
	          facetValue = rootPath;
	        }

	        attributeToRefine = hierarchicalFacet.attributes[attributesIndex];
	      } else {
	        attributesIndex = facetValue.split(separator).length - 1;

	        attributeToRefine = hierarchicalFacet.attributes[attributesIndex];
	      }

	      if (attributeToRefine) {
	        facetFilters.push([attributeToRefine + ':' + facetValue]);
	      }
	    });

	    return facetFilters;
	  },

	  _getHitsHierarchicalFacetsAttributes: function(state) {
	    var out = [];

	    return state.hierarchicalFacets.reduce(
	      // ask for as much levels as there's hierarchical refinements
	      function getHitsAttributesForHierarchicalFacet(allAttributes, hierarchicalFacet) {
	        var hierarchicalRefinement = state.getHierarchicalRefinement(hierarchicalFacet.name)[0];

	        // if no refinement, ask for root level
	        if (!hierarchicalRefinement) {
	          allAttributes.push(hierarchicalFacet.attributes[0]);
	          return allAttributes;
	        }

	        var separator = state._getHierarchicalFacetSeparator(hierarchicalFacet);
	        var level = hierarchicalRefinement.split(separator).length;
	        var newAttributes = hierarchicalFacet.attributes.slice(0, level + 1);

	        return allAttributes.concat(newAttributes);
	      }, out);
	  },

	  _getDisjunctiveHierarchicalFacetAttribute: function(state, hierarchicalFacet, rootLevel) {
	    var separator = state._getHierarchicalFacetSeparator(hierarchicalFacet);
	    if (rootLevel === true) {
	      var rootPath = state._getHierarchicalRootPath(hierarchicalFacet);
	      var attributeIndex = 0;

	      if (rootPath) {
	        attributeIndex = rootPath.split(separator).length;
	      }
	      return [hierarchicalFacet.attributes[attributeIndex]];
	    }

	    var hierarchicalRefinement = state.getHierarchicalRefinement(hierarchicalFacet.name)[0] || '';
	    // if refinement is 'beers > IPA > Flying dog',
	    // then we want `facets: ['beers > IPA']` as disjunctive facet (parent level values)

	    var parentLevel = hierarchicalRefinement.split(separator).length - 1;
	    return hierarchicalFacet.attributes.slice(0, parentLevel + 1);
	  },

	  getSearchForFacetQuery: function(facetName, query, maxFacetHits, state) {
	    var stateForSearchForFacetValues = state.isDisjunctiveFacet(facetName) ?
	      state.clearRefinements(facetName) :
	      state;
	    var searchForFacetSearchParameters = {
	      facetQuery: query,
	      facetName: facetName
	    };
	    if (typeof maxFacetHits === 'number') {
	      searchForFacetSearchParameters.maxFacetHits = maxFacetHits;
	    }
	    return merge$3(
	      {},
	      requestBuilder$1._getHitsSearchParams(stateForSearchForFacetValues),
	      searchForFacetSearchParameters
	    );
	  }
	};

	var requestBuilder_1 = requestBuilder$1;

	var version$2 = '3.8.2';

	var SearchParameters$1 = SearchParameters_1;
	var SearchResults$1 = SearchResults_1;
	var DerivedHelper = DerivedHelper_1;
	var requestBuilder = requestBuilder_1;

	var EventEmitter = events;
	var inherits = inherits_1;
	var objectHasKeys = objectHasKeys_1;
	var omit = omit$3;
	var merge$2 = merge_1;

	var version$1 = version$2;
	var escapeFacetValue = escapeFacetValue_1.escapeFacetValue;

	/**
	 * Event triggered when a parameter is set or updated
	 * @event AlgoliaSearchHelper#event:change
	 * @property {object} event
	 * @property {SearchParameters} event.state the current parameters with the latest changes applied
	 * @property {SearchResults} event.results the previous results received from Algolia. `null` before the first request
	 * @example
	 * helper.on('change', function(event) {
	 *   console.log('The parameters have changed');
	 * });
	 */

	/**
	 * Event triggered when a main search is sent to Algolia
	 * @event AlgoliaSearchHelper#event:search
	 * @property {object} event
	 * @property {SearchParameters} event.state the parameters used for this search
	 * @property {SearchResults} event.results the results from the previous search. `null` if it is the first search.
	 * @example
	 * helper.on('search', function(event) {
	 *   console.log('Search sent');
	 * });
	 */

	/**
	 * Event triggered when a search using `searchForFacetValues` is sent to Algolia
	 * @event AlgoliaSearchHelper#event:searchForFacetValues
	 * @property {object} event
	 * @property {SearchParameters} event.state the parameters used for this search it is the first search.
	 * @property {string} event.facet the facet searched into
	 * @property {string} event.query the query used to search in the facets
	 * @example
	 * helper.on('searchForFacetValues', function(event) {
	 *   console.log('searchForFacetValues sent');
	 * });
	 */

	/**
	 * Event triggered when a search using `searchOnce` is sent to Algolia
	 * @event AlgoliaSearchHelper#event:searchOnce
	 * @property {object} event
	 * @property {SearchParameters} event.state the parameters used for this search it is the first search.
	 * @example
	 * helper.on('searchOnce', function(event) {
	 *   console.log('searchOnce sent');
	 * });
	 */

	/**
	 * Event triggered when the results are retrieved from Algolia
	 * @event AlgoliaSearchHelper#event:result
	 * @property {object} event
	 * @property {SearchResults} event.results the results received from Algolia
	 * @property {SearchParameters} event.state the parameters used to query Algolia. Those might be different from the one in the helper instance (for example if the network is unreliable).
	 * @example
	 * helper.on('result', function(event) {
	 *   console.log('Search results received');
	 * });
	 */

	/**
	 * Event triggered when Algolia sends back an error. For example, if an unknown parameter is
	 * used, the error can be caught using this event.
	 * @event AlgoliaSearchHelper#event:error
	 * @property {object} event
	 * @property {Error} event.error the error returned by the Algolia.
	 * @example
	 * helper.on('error', function(event) {
	 *   console.log('Houston we got a problem.');
	 * });
	 */

	/**
	 * Event triggered when the queue of queries have been depleted (with any result or outdated queries)
	 * @event AlgoliaSearchHelper#event:searchQueueEmpty
	 * @example
	 * helper.on('searchQueueEmpty', function() {
	 *   console.log('No more search pending');
	 *   // This is received before the result event if we're not expecting new results
	 * });
	 *
	 * helper.search();
	 */

	/**
	 * Initialize a new AlgoliaSearchHelper
	 * @class
	 * @classdesc The AlgoliaSearchHelper is a class that ease the management of the
	 * search. It provides an event based interface for search callbacks:
	 *  - change: when the internal search state is changed.
	 *    This event contains a {@link SearchParameters} object and the
	 *    {@link SearchResults} of the last result if any.
	 *  - search: when a search is triggered using the `search()` method.
	 *  - result: when the response is retrieved from Algolia and is processed.
	 *    This event contains a {@link SearchResults} object and the
	 *    {@link SearchParameters} corresponding to this answer.
	 *  - error: when the response is an error. This event contains the error returned by the server.
	 * @param  {AlgoliaSearch} client an AlgoliaSearch client
	 * @param  {string} index the index name to query
	 * @param  {SearchParameters | object} options an object defining the initial
	 * config of the search. It doesn't have to be a {SearchParameters},
	 * just an object containing the properties you need from it.
	 */
	function AlgoliaSearchHelper$1(client, index, options) {
	  if (typeof client.addAlgoliaAgent === 'function') {
	    client.addAlgoliaAgent('JS Helper (' + version$1 + ')');
	  }

	  this.setClient(client);
	  var opts = options || {};
	  opts.index = index;
	  this.state = SearchParameters$1.make(opts);
	  this.lastResults = null;
	  this._queryId = 0;
	  this._lastQueryIdReceived = -1;
	  this.derivedHelpers = [];
	  this._currentNbQueries = 0;
	}

	inherits(AlgoliaSearchHelper$1, EventEmitter);

	/**
	 * Start the search with the parameters set in the state. When the
	 * method is called, it triggers a `search` event. The results will
	 * be available through the `result` event. If an error occurs, an
	 * `error` will be fired instead.
	 * @return {AlgoliaSearchHelper}
	 * @fires search
	 * @fires result
	 * @fires error
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.search = function() {
	  this._search({onlyWithDerivedHelpers: false});
	  return this;
	};

	AlgoliaSearchHelper$1.prototype.searchOnlyWithDerivedHelpers = function() {
	  this._search({onlyWithDerivedHelpers: true});
	  return this;
	};

	/**
	 * Gets the search query parameters that would be sent to the Algolia Client
	 * for the hits
	 * @return {object} Query Parameters
	 */
	AlgoliaSearchHelper$1.prototype.getQuery = function() {
	  var state = this.state;
	  return requestBuilder._getHitsSearchParams(state);
	};

	/**
	 * Start a search using a modified version of the current state. This method does
	 * not trigger the helper lifecycle and does not modify the state kept internally
	 * by the helper. This second aspect means that the next search call will be the
	 * same as a search call before calling searchOnce.
	 * @param {object} options can contain all the parameters that can be set to SearchParameters
	 * plus the index
	 * @param {function} [callback] optional callback executed when the response from the
	 * server is back.
	 * @return {promise|undefined} if a callback is passed the method returns undefined
	 * otherwise it returns a promise containing an object with two keys :
	 *  - content with a SearchResults
	 *  - state with the state used for the query as a SearchParameters
	 * @example
	 * // Changing the number of records returned per page to 1
	 * // This example uses the callback API
	 * var state = helper.searchOnce({hitsPerPage: 1},
	 *   function(error, content, state) {
	 *     // if an error occurred it will be passed in error, otherwise its value is null
	 *     // content contains the results formatted as a SearchResults
	 *     // state is the instance of SearchParameters used for this search
	 *   });
	 * @example
	 * // Changing the number of records returned per page to 1
	 * // This example uses the promise API
	 * var state1 = helper.searchOnce({hitsPerPage: 1})
	 *                 .then(promiseHandler);
	 *
	 * function promiseHandler(res) {
	 *   // res contains
	 *   // {
	 *   //   content : SearchResults
	 *   //   state   : SearchParameters (the one used for this specific search)
	 *   // }
	 * }
	 */
	AlgoliaSearchHelper$1.prototype.searchOnce = function(options, cb) {
	  var tempState = !options ? this.state : this.state.setQueryParameters(options);
	  var queries = requestBuilder._getQueries(tempState.index, tempState);
	  var self = this;

	  this._currentNbQueries++;

	  this.emit('searchOnce', {
	    state: tempState
	  });

	  if (cb) {
	    this.client
	      .search(queries)
	      .then(function(content) {
	        self._currentNbQueries--;
	        if (self._currentNbQueries === 0) {
	          self.emit('searchQueueEmpty');
	        }

	        cb(null, new SearchResults$1(tempState, content.results), tempState);
	      })
	      .catch(function(err) {
	        self._currentNbQueries--;
	        if (self._currentNbQueries === 0) {
	          self.emit('searchQueueEmpty');
	        }

	        cb(err, null, tempState);
	      });

	    return undefined;
	  }

	  return this.client.search(queries).then(function(content) {
	    self._currentNbQueries--;
	    if (self._currentNbQueries === 0) self.emit('searchQueueEmpty');
	    return {
	      content: new SearchResults$1(tempState, content.results),
	      state: tempState,
	      _originalResponse: content
	    };
	  }, function(e) {
	    self._currentNbQueries--;
	    if (self._currentNbQueries === 0) self.emit('searchQueueEmpty');
	    throw e;
	  });
	};

	 /**
	 * Start the search for answers with the parameters set in the state.
	 * This method returns a promise.
	 * @param {Object} options - the options for answers API call
	 * @param {string[]} options.attributesForPrediction - Attributes to use for predictions. If empty, `searchableAttributes` is used instead.
	 * @param {string[]} options.queryLanguages - The languages in the query. Currently only supports ['en'].
	 * @param {number} options.nbHits - Maximum number of answers to retrieve from the Answers Engine. Cannot be greater than 1000.
	 *
	 * @return {promise} the answer results
	 */
	AlgoliaSearchHelper$1.prototype.findAnswers = function(options) {
	  var state = this.state;
	  var derivedHelper = this.derivedHelpers[0];
	  if (!derivedHelper) {
	    return Promise.resolve([]);
	  }
	  var derivedState = derivedHelper.getModifiedState(state);
	  var data = merge$2(
	    {
	      attributesForPrediction: options.attributesForPrediction,
	      nbHits: options.nbHits
	    },
	    {
	      params: omit(requestBuilder._getHitsSearchParams(derivedState), [
	        'attributesToSnippet',
	        'hitsPerPage',
	        'restrictSearchableAttributes',
	        'snippetEllipsisText' // FIXME remove this line once the engine is fixed.
	      ])
	    }
	  );

	  var errorMessage = 'search for answers was called, but this client does not have a function client.initIndex(index).findAnswers';
	  if (typeof this.client.initIndex !== 'function') {
	    throw new Error(errorMessage);
	  }
	  var index = this.client.initIndex(derivedState.index);
	  if (typeof index.findAnswers !== 'function') {
	    throw new Error(errorMessage);
	  }
	  return index.findAnswers(derivedState.query, options.queryLanguages, data);
	};

	/**
	 * Structure of each result when using
	 * [`searchForFacetValues()`](reference.html#AlgoliaSearchHelper#searchForFacetValues)
	 * @typedef FacetSearchHit
	 * @type {object}
	 * @property {string} value the facet value
	 * @property {string} highlighted the facet value highlighted with the query string
	 * @property {number} count number of occurrence of this facet value
	 * @property {boolean} isRefined true if the value is already refined
	 */

	/**
	 * Structure of the data resolved by the
	 * [`searchForFacetValues()`](reference.html#AlgoliaSearchHelper#searchForFacetValues)
	 * promise.
	 * @typedef FacetSearchResult
	 * @type {object}
	 * @property {FacetSearchHit} facetHits the results for this search for facet values
	 * @property {number} processingTimeMS time taken by the query inside the engine
	 */

	/**
	 * Search for facet values based on an query and the name of a faceted attribute. This
	 * triggers a search and will return a promise. On top of using the query, it also sends
	 * the parameters from the state so that the search is narrowed down to only the possible values.
	 *
	 * See the description of [FacetSearchResult](reference.html#FacetSearchResult)
	 * @param {string} facet the name of the faceted attribute
	 * @param {string} query the string query for the search
	 * @param {number} [maxFacetHits] the maximum number values returned. Should be > 0 and <= 100
	 * @param {object} [userState] the set of custom parameters to use on top of the current state. Setting a property to `undefined` removes
	 * it in the generated query.
	 * @return {promise.<FacetSearchResult>} the results of the search
	 */
	AlgoliaSearchHelper$1.prototype.searchForFacetValues = function(facet, query, maxFacetHits, userState) {
	  var clientHasSFFV = typeof this.client.searchForFacetValues === 'function';
	  if (
	    !clientHasSFFV &&
	    typeof this.client.initIndex !== 'function'
	  ) {
	    throw new Error(
	      'search for facet values (searchable) was called, but this client does not have a function client.searchForFacetValues or client.initIndex(index).searchForFacetValues'
	    );
	  }
	  var state = this.state.setQueryParameters(userState || {});
	  var isDisjunctive = state.isDisjunctiveFacet(facet);
	  var algoliaQuery = requestBuilder.getSearchForFacetQuery(facet, query, maxFacetHits, state);

	  this._currentNbQueries++;
	  var self = this;

	  this.emit('searchForFacetValues', {
	    state: state,
	    facet: facet,
	    query: query
	  });

	  var searchForFacetValuesPromise = clientHasSFFV
	    ? this.client.searchForFacetValues([{indexName: state.index, params: algoliaQuery}])
	    : this.client.initIndex(state.index).searchForFacetValues(algoliaQuery);

	  return searchForFacetValuesPromise.then(function addIsRefined(content) {
	    self._currentNbQueries--;
	    if (self._currentNbQueries === 0) self.emit('searchQueueEmpty');

	    content = Array.isArray(content) ? content[0] : content;

	    content.facetHits.forEach(function(f) {
	      f.escapedValue = escapeFacetValue(f.value);
	      f.isRefined = isDisjunctive
	        ? state.isDisjunctiveFacetRefined(facet, f.escapedValue)
	        : state.isFacetRefined(facet, f.escapedValue);
	    });

	    return content;
	  }, function(e) {
	    self._currentNbQueries--;
	    if (self._currentNbQueries === 0) self.emit('searchQueueEmpty');
	    throw e;
	  });
	};

	/**
	 * Sets the text query used for the search.
	 *
	 * This method resets the current page to 0.
	 * @param  {string} q the user query
	 * @return {AlgoliaSearchHelper}
	 * @fires change
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.setQuery = function(q) {
	  this._change({
	    state: this.state.resetPage().setQuery(q),
	    isPageReset: true
	  });

	  return this;
	};

	/**
	 * Remove all the types of refinements except tags. A string can be provided to remove
	 * only the refinements of a specific attribute. For more advanced use case, you can
	 * provide a function instead. This function should follow the
	 * [clearCallback definition](#SearchParameters.clearCallback).
	 *
	 * This method resets the current page to 0.
	 * @param {string} [name] optional name of the facet / attribute on which we want to remove all refinements
	 * @return {AlgoliaSearchHelper}
	 * @fires change
	 * @chainable
	 * @example
	 * // Removing all the refinements
	 * helper.clearRefinements().search();
	 * @example
	 * // Removing all the filters on a the category attribute.
	 * helper.clearRefinements('category').search();
	 * @example
	 * // Removing only the exclude filters on the category facet.
	 * helper.clearRefinements(function(value, attribute, type) {
	 *   return type === 'exclude' && attribute === 'category';
	 * }).search();
	 */
	AlgoliaSearchHelper$1.prototype.clearRefinements = function(name) {
	  this._change({
	    state: this.state.resetPage().clearRefinements(name),
	    isPageReset: true
	  });

	  return this;
	};

	/**
	 * Remove all the tag filters.
	 *
	 * This method resets the current page to 0.
	 * @return {AlgoliaSearchHelper}
	 * @fires change
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.clearTags = function() {
	  this._change({
	    state: this.state.resetPage().clearTags(),
	    isPageReset: true
	  });

	  return this;
	};

	/**
	 * Adds a disjunctive filter to a faceted attribute with the `value` provided. If the
	 * filter is already set, it doesn't change the filters.
	 *
	 * This method resets the current page to 0.
	 * @param  {string} facet the facet to refine
	 * @param  {string} value the associated value (will be converted to string)
	 * @return {AlgoliaSearchHelper}
	 * @fires change
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.addDisjunctiveFacetRefinement = function(facet, value) {
	  this._change({
	    state: this.state.resetPage().addDisjunctiveFacetRefinement(facet, value),
	    isPageReset: true
	  });

	  return this;
	};

	/**
	 * @deprecated since version 2.4.0, see {@link AlgoliaSearchHelper#addDisjunctiveFacetRefinement}
	 */
	AlgoliaSearchHelper$1.prototype.addDisjunctiveRefine = function() {
	  return this.addDisjunctiveFacetRefinement.apply(this, arguments);
	};

	/**
	 * Adds a refinement on a hierarchical facet. It will throw
	 * an exception if the facet is not defined or if the facet
	 * is already refined.
	 *
	 * This method resets the current page to 0.
	 * @param {string} facet the facet name
	 * @param {string} path the hierarchical facet path
	 * @return {AlgoliaSearchHelper}
	 * @throws Error if the facet is not defined or if the facet is refined
	 * @chainable
	 * @fires change
	 */
	AlgoliaSearchHelper$1.prototype.addHierarchicalFacetRefinement = function(facet, value) {
	  this._change({
	    state: this.state.resetPage().addHierarchicalFacetRefinement(facet, value),
	    isPageReset: true
	  });

	  return this;
	};

	/**
	 * Adds a an numeric filter to an attribute with the `operator` and `value` provided. If the
	 * filter is already set, it doesn't change the filters.
	 *
	 * This method resets the current page to 0.
	 * @param  {string} attribute the attribute on which the numeric filter applies
	 * @param  {string} operator the operator of the filter
	 * @param  {number} value the value of the filter
	 * @return {AlgoliaSearchHelper}
	 * @fires change
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.addNumericRefinement = function(attribute, operator, value) {
	  this._change({
	    state: this.state.resetPage().addNumericRefinement(attribute, operator, value),
	    isPageReset: true
	  });

	  return this;
	};

	/**
	 * Adds a filter to a faceted attribute with the `value` provided. If the
	 * filter is already set, it doesn't change the filters.
	 *
	 * This method resets the current page to 0.
	 * @param  {string} facet the facet to refine
	 * @param  {string} value the associated value (will be converted to string)
	 * @return {AlgoliaSearchHelper}
	 * @fires change
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.addFacetRefinement = function(facet, value) {
	  this._change({
	    state: this.state.resetPage().addFacetRefinement(facet, value),
	    isPageReset: true
	  });

	  return this;
	};

	/**
	 * @deprecated since version 2.4.0, see {@link AlgoliaSearchHelper#addFacetRefinement}
	 */
	AlgoliaSearchHelper$1.prototype.addRefine = function() {
	  return this.addFacetRefinement.apply(this, arguments);
	};


	/**
	 * Adds a an exclusion filter to a faceted attribute with the `value` provided. If the
	 * filter is already set, it doesn't change the filters.
	 *
	 * This method resets the current page to 0.
	 * @param  {string} facet the facet to refine
	 * @param  {string} value the associated value (will be converted to string)
	 * @return {AlgoliaSearchHelper}
	 * @fires change
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.addFacetExclusion = function(facet, value) {
	  this._change({
	    state: this.state.resetPage().addExcludeRefinement(facet, value),
	    isPageReset: true
	  });

	  return this;
	};

	/**
	 * @deprecated since version 2.4.0, see {@link AlgoliaSearchHelper#addFacetExclusion}
	 */
	AlgoliaSearchHelper$1.prototype.addExclude = function() {
	  return this.addFacetExclusion.apply(this, arguments);
	};

	/**
	 * Adds a tag filter with the `tag` provided. If the
	 * filter is already set, it doesn't change the filters.
	 *
	 * This method resets the current page to 0.
	 * @param {string} tag the tag to add to the filter
	 * @return {AlgoliaSearchHelper}
	 * @fires change
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.addTag = function(tag) {
	  this._change({
	    state: this.state.resetPage().addTagRefinement(tag),
	    isPageReset: true
	  });

	  return this;
	};

	/**
	 * Removes an numeric filter to an attribute with the `operator` and `value` provided. If the
	 * filter is not set, it doesn't change the filters.
	 *
	 * Some parameters are optional, triggering different behavior:
	 *  - if the value is not provided, then all the numeric value will be removed for the
	 *  specified attribute/operator couple.
	 *  - if the operator is not provided either, then all the numeric filter on this attribute
	 *  will be removed.
	 *
	 * This method resets the current page to 0.
	 * @param  {string} attribute the attribute on which the numeric filter applies
	 * @param  {string} [operator] the operator of the filter
	 * @param  {number} [value] the value of the filter
	 * @return {AlgoliaSearchHelper}
	 * @fires change
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.removeNumericRefinement = function(attribute, operator, value) {
	  this._change({
	    state: this.state.resetPage().removeNumericRefinement(attribute, operator, value),
	    isPageReset: true
	  });

	  return this;
	};

	/**
	 * Removes a disjunctive filter to a faceted attribute with the `value` provided. If the
	 * filter is not set, it doesn't change the filters.
	 *
	 * If the value is omitted, then this method will remove all the filters for the
	 * attribute.
	 *
	 * This method resets the current page to 0.
	 * @param  {string} facet the facet to refine
	 * @param  {string} [value] the associated value
	 * @return {AlgoliaSearchHelper}
	 * @fires change
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.removeDisjunctiveFacetRefinement = function(facet, value) {
	  this._change({
	    state: this.state.resetPage().removeDisjunctiveFacetRefinement(facet, value),
	    isPageReset: true
	  });

	  return this;
	};

	/**
	 * @deprecated since version 2.4.0, see {@link AlgoliaSearchHelper#removeDisjunctiveFacetRefinement}
	 */
	AlgoliaSearchHelper$1.prototype.removeDisjunctiveRefine = function() {
	  return this.removeDisjunctiveFacetRefinement.apply(this, arguments);
	};

	/**
	 * Removes the refinement set on a hierarchical facet.
	 * @param {string} facet the facet name
	 * @return {AlgoliaSearchHelper}
	 * @throws Error if the facet is not defined or if the facet is not refined
	 * @fires change
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.removeHierarchicalFacetRefinement = function(facet) {
	  this._change({
	    state: this.state.resetPage().removeHierarchicalFacetRefinement(facet),
	    isPageReset: true
	  });

	  return this;
	};

	/**
	 * Removes a filter to a faceted attribute with the `value` provided. If the
	 * filter is not set, it doesn't change the filters.
	 *
	 * If the value is omitted, then this method will remove all the filters for the
	 * attribute.
	 *
	 * This method resets the current page to 0.
	 * @param  {string} facet the facet to refine
	 * @param  {string} [value] the associated value
	 * @return {AlgoliaSearchHelper}
	 * @fires change
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.removeFacetRefinement = function(facet, value) {
	  this._change({
	    state: this.state.resetPage().removeFacetRefinement(facet, value),
	    isPageReset: true
	  });

	  return this;
	};

	/**
	 * @deprecated since version 2.4.0, see {@link AlgoliaSearchHelper#removeFacetRefinement}
	 */
	AlgoliaSearchHelper$1.prototype.removeRefine = function() {
	  return this.removeFacetRefinement.apply(this, arguments);
	};

	/**
	 * Removes an exclusion filter to a faceted attribute with the `value` provided. If the
	 * filter is not set, it doesn't change the filters.
	 *
	 * If the value is omitted, then this method will remove all the filters for the
	 * attribute.
	 *
	 * This method resets the current page to 0.
	 * @param  {string} facet the facet to refine
	 * @param  {string} [value] the associated value
	 * @return {AlgoliaSearchHelper}
	 * @fires change
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.removeFacetExclusion = function(facet, value) {
	  this._change({
	    state: this.state.resetPage().removeExcludeRefinement(facet, value),
	    isPageReset: true
	  });

	  return this;
	};

	/**
	 * @deprecated since version 2.4.0, see {@link AlgoliaSearchHelper#removeFacetExclusion}
	 */
	AlgoliaSearchHelper$1.prototype.removeExclude = function() {
	  return this.removeFacetExclusion.apply(this, arguments);
	};

	/**
	 * Removes a tag filter with the `tag` provided. If the
	 * filter is not set, it doesn't change the filters.
	 *
	 * This method resets the current page to 0.
	 * @param {string} tag tag to remove from the filter
	 * @return {AlgoliaSearchHelper}
	 * @fires change
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.removeTag = function(tag) {
	  this._change({
	    state: this.state.resetPage().removeTagRefinement(tag),
	    isPageReset: true
	  });

	  return this;
	};

	/**
	 * Adds or removes an exclusion filter to a faceted attribute with the `value` provided. If
	 * the value is set then it removes it, otherwise it adds the filter.
	 *
	 * This method resets the current page to 0.
	 * @param  {string} facet the facet to refine
	 * @param  {string} value the associated value
	 * @return {AlgoliaSearchHelper}
	 * @fires change
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.toggleFacetExclusion = function(facet, value) {
	  this._change({
	    state: this.state.resetPage().toggleExcludeFacetRefinement(facet, value),
	    isPageReset: true
	  });

	  return this;
	};

	/**
	 * @deprecated since version 2.4.0, see {@link AlgoliaSearchHelper#toggleFacetExclusion}
	 */
	AlgoliaSearchHelper$1.prototype.toggleExclude = function() {
	  return this.toggleFacetExclusion.apply(this, arguments);
	};

	/**
	 * Adds or removes a filter to a faceted attribute with the `value` provided. If
	 * the value is set then it removes it, otherwise it adds the filter.
	 *
	 * This method can be used for conjunctive, disjunctive and hierarchical filters.
	 *
	 * This method resets the current page to 0.
	 * @param  {string} facet the facet to refine
	 * @param  {string} value the associated value
	 * @return {AlgoliaSearchHelper}
	 * @throws Error will throw an error if the facet is not declared in the settings of the helper
	 * @fires change
	 * @chainable
	 * @deprecated since version 2.19.0, see {@link AlgoliaSearchHelper#toggleFacetRefinement}
	 */
	AlgoliaSearchHelper$1.prototype.toggleRefinement = function(facet, value) {
	  return this.toggleFacetRefinement(facet, value);
	};

	/**
	 * Adds or removes a filter to a faceted attribute with the `value` provided. If
	 * the value is set then it removes it, otherwise it adds the filter.
	 *
	 * This method can be used for conjunctive, disjunctive and hierarchical filters.
	 *
	 * This method resets the current page to 0.
	 * @param  {string} facet the facet to refine
	 * @param  {string} value the associated value
	 * @return {AlgoliaSearchHelper}
	 * @throws Error will throw an error if the facet is not declared in the settings of the helper
	 * @fires change
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.toggleFacetRefinement = function(facet, value) {
	  this._change({
	    state: this.state.resetPage().toggleFacetRefinement(facet, value),
	    isPageReset: true
	  });

	  return this;
	};

	/**
	 * @deprecated since version 2.4.0, see {@link AlgoliaSearchHelper#toggleFacetRefinement}
	 */
	AlgoliaSearchHelper$1.prototype.toggleRefine = function() {
	  return this.toggleFacetRefinement.apply(this, arguments);
	};

	/**
	 * Adds or removes a tag filter with the `value` provided. If
	 * the value is set then it removes it, otherwise it adds the filter.
	 *
	 * This method resets the current page to 0.
	 * @param {string} tag tag to remove or add
	 * @return {AlgoliaSearchHelper}
	 * @fires change
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.toggleTag = function(tag) {
	  this._change({
	    state: this.state.resetPage().toggleTagRefinement(tag),
	    isPageReset: true
	  });

	  return this;
	};

	/**
	 * Increments the page number by one.
	 * @return {AlgoliaSearchHelper}
	 * @fires change
	 * @chainable
	 * @example
	 * helper.setPage(0).nextPage().getPage();
	 * // returns 1
	 */
	AlgoliaSearchHelper$1.prototype.nextPage = function() {
	  var page = this.state.page || 0;
	  return this.setPage(page + 1);
	};

	/**
	 * Decrements the page number by one.
	 * @fires change
	 * @return {AlgoliaSearchHelper}
	 * @chainable
	 * @example
	 * helper.setPage(1).previousPage().getPage();
	 * // returns 0
	 */
	AlgoliaSearchHelper$1.prototype.previousPage = function() {
	  var page = this.state.page || 0;
	  return this.setPage(page - 1);
	};

	/**
	 * @private
	 */
	function setCurrentPage(page) {
	  if (page < 0) throw new Error('Page requested below 0.');

	  this._change({
	    state: this.state.setPage(page),
	    isPageReset: false
	  });

	  return this;
	}

	/**
	 * Change the current page
	 * @deprecated
	 * @param  {number} page The page number
	 * @return {AlgoliaSearchHelper}
	 * @fires change
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.setCurrentPage = setCurrentPage;

	/**
	 * Updates the current page.
	 * @function
	 * @param  {number} page The page number
	 * @return {AlgoliaSearchHelper}
	 * @fires change
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.setPage = setCurrentPage;

	/**
	 * Updates the name of the index that will be targeted by the query.
	 *
	 * This method resets the current page to 0.
	 * @param {string} name the index name
	 * @return {AlgoliaSearchHelper}
	 * @fires change
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.setIndex = function(name) {
	  this._change({
	    state: this.state.resetPage().setIndex(name),
	    isPageReset: true
	  });

	  return this;
	};

	/**
	 * Update a parameter of the search. This method reset the page
	 *
	 * The complete list of parameters is available on the
	 * [Algolia website](https://www.algolia.com/doc/rest#query-an-index).
	 * The most commonly used parameters have their own [shortcuts](#query-parameters-shortcuts)
	 * or benefit from higher-level APIs (all the kind of filters and facets have their own API)
	 *
	 * This method resets the current page to 0.
	 * @param {string} parameter name of the parameter to update
	 * @param {any} value new value of the parameter
	 * @return {AlgoliaSearchHelper}
	 * @fires change
	 * @chainable
	 * @example
	 * helper.setQueryParameter('hitsPerPage', 20).search();
	 */
	AlgoliaSearchHelper$1.prototype.setQueryParameter = function(parameter, value) {
	  this._change({
	    state: this.state.resetPage().setQueryParameter(parameter, value),
	    isPageReset: true
	  });

	  return this;
	};

	/**
	 * Set the whole state (warning: will erase previous state)
	 * @param {SearchParameters} newState the whole new state
	 * @return {AlgoliaSearchHelper}
	 * @fires change
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.setState = function(newState) {
	  this._change({
	    state: SearchParameters$1.make(newState),
	    isPageReset: false
	  });

	  return this;
	};

	/**
	 * Override the current state without triggering a change event.
	 * Do not use this method unless you know what you are doing. (see the example
	 * for a legit use case)
	 * @param {SearchParameters} newState the whole new state
	 * @return {AlgoliaSearchHelper}
	 * @example
	 *  helper.on('change', function(state){
	 *    // In this function you might want to find a way to store the state in the url/history
	 *    updateYourURL(state)
	 *  })
	 *  window.onpopstate = function(event){
	 *    // This is naive though as you should check if the state is really defined etc.
	 *    helper.overrideStateWithoutTriggeringChangeEvent(event.state).search()
	 *  }
	 * @chainable
	 */
	AlgoliaSearchHelper$1.prototype.overrideStateWithoutTriggeringChangeEvent = function(newState) {
	  this.state = new SearchParameters$1(newState);
	  return this;
	};

	/**
	 * Check if an attribute has any numeric, conjunctive, disjunctive or hierarchical filters.
	 * @param {string} attribute the name of the attribute
	 * @return {boolean} true if the attribute is filtered by at least one value
	 * @example
	 * // hasRefinements works with numeric, conjunctive, disjunctive and hierarchical filters
	 * helper.hasRefinements('price'); // false
	 * helper.addNumericRefinement('price', '>', 100);
	 * helper.hasRefinements('price'); // true
	 *
	 * helper.hasRefinements('color'); // false
	 * helper.addFacetRefinement('color', 'blue');
	 * helper.hasRefinements('color'); // true
	 *
	 * helper.hasRefinements('material'); // false
	 * helper.addDisjunctiveFacetRefinement('material', 'plastic');
	 * helper.hasRefinements('material'); // true
	 *
	 * helper.hasRefinements('categories'); // false
	 * helper.toggleFacetRefinement('categories', 'kitchen > knife');
	 * helper.hasRefinements('categories'); // true
	 *
	 */
	AlgoliaSearchHelper$1.prototype.hasRefinements = function(attribute) {
	  if (objectHasKeys(this.state.getNumericRefinements(attribute))) {
	    return true;
	  } else if (this.state.isConjunctiveFacet(attribute)) {
	    return this.state.isFacetRefined(attribute);
	  } else if (this.state.isDisjunctiveFacet(attribute)) {
	    return this.state.isDisjunctiveFacetRefined(attribute);
	  } else if (this.state.isHierarchicalFacet(attribute)) {
	    return this.state.isHierarchicalFacetRefined(attribute);
	  }

	  // there's currently no way to know that the user did call `addNumericRefinement` at some point
	  // thus we cannot distinguish if there once was a numeric refinement that was cleared
	  // so we will return false in every other situations to be consistent
	  // while what we should do here is throw because we did not find the attribute in any type
	  // of refinement
	  return false;
	};

	/**
	 * Check if a value is excluded for a specific faceted attribute. If the value
	 * is omitted then the function checks if there is any excluding refinements.
	 *
	 * @param  {string}  facet name of the attribute for used for faceting
	 * @param  {string}  [value] optional value. If passed will test that this value
	   * is filtering the given facet.
	 * @return {boolean} true if refined
	 * @example
	 * helper.isExcludeRefined('color'); // false
	 * helper.isExcludeRefined('color', 'blue') // false
	 * helper.isExcludeRefined('color', 'red') // false
	 *
	 * helper.addFacetExclusion('color', 'red');
	 *
	 * helper.isExcludeRefined('color'); // true
	 * helper.isExcludeRefined('color', 'blue') // false
	 * helper.isExcludeRefined('color', 'red') // true
	 */
	AlgoliaSearchHelper$1.prototype.isExcluded = function(facet, value) {
	  return this.state.isExcludeRefined(facet, value);
	};

	/**
	 * @deprecated since 2.4.0, see {@link AlgoliaSearchHelper#hasRefinements}
	 */
	AlgoliaSearchHelper$1.prototype.isDisjunctiveRefined = function(facet, value) {
	  return this.state.isDisjunctiveFacetRefined(facet, value);
	};

	/**
	 * Check if the string is a currently filtering tag.
	 * @param {string} tag tag to check
	 * @return {boolean}
	 */
	AlgoliaSearchHelper$1.prototype.hasTag = function(tag) {
	  return this.state.isTagRefined(tag);
	};

	/**
	 * @deprecated since 2.4.0, see {@link AlgoliaSearchHelper#hasTag}
	 */
	AlgoliaSearchHelper$1.prototype.isTagRefined = function() {
	  return this.hasTagRefinements.apply(this, arguments);
	};


	/**
	 * Get the name of the currently used index.
	 * @return {string}
	 * @example
	 * helper.setIndex('highestPrice_products').getIndex();
	 * // returns 'highestPrice_products'
	 */
	AlgoliaSearchHelper$1.prototype.getIndex = function() {
	  return this.state.index;
	};

	function getCurrentPage() {
	  return this.state.page;
	}

	/**
	 * Get the currently selected page
	 * @deprecated
	 * @return {number} the current page
	 */
	AlgoliaSearchHelper$1.prototype.getCurrentPage = getCurrentPage;
	/**
	 * Get the currently selected page
	 * @function
	 * @return {number} the current page
	 */
	AlgoliaSearchHelper$1.prototype.getPage = getCurrentPage;

	/**
	 * Get all the tags currently set to filters the results.
	 *
	 * @return {string[]} The list of tags currently set.
	 */
	AlgoliaSearchHelper$1.prototype.getTags = function() {
	  return this.state.tagRefinements;
	};

	/**
	 * Get the list of refinements for a given attribute. This method works with
	 * conjunctive, disjunctive, excluding and numerical filters.
	 *
	 * See also SearchResults#getRefinements
	 *
	 * @param {string} facetName attribute name used for faceting
	 * @return {Array.<FacetRefinement|NumericRefinement>} All Refinement are objects that contain a value, and
	 * a type. Numeric also contains an operator.
	 * @example
	 * helper.addNumericRefinement('price', '>', 100);
	 * helper.getRefinements('price');
	 * // [
	 * //   {
	 * //     "value": [
	 * //       100
	 * //     ],
	 * //     "operator": ">",
	 * //     "type": "numeric"
	 * //   }
	 * // ]
	 * @example
	 * helper.addFacetRefinement('color', 'blue');
	 * helper.addFacetExclusion('color', 'red');
	 * helper.getRefinements('color');
	 * // [
	 * //   {
	 * //     "value": "blue",
	 * //     "type": "conjunctive"
	 * //   },
	 * //   {
	 * //     "value": "red",
	 * //     "type": "exclude"
	 * //   }
	 * // ]
	 * @example
	 * helper.addDisjunctiveFacetRefinement('material', 'plastic');
	 * // [
	 * //   {
	 * //     "value": "plastic",
	 * //     "type": "disjunctive"
	 * //   }
	 * // ]
	 */
	AlgoliaSearchHelper$1.prototype.getRefinements = function(facetName) {
	  var refinements = [];

	  if (this.state.isConjunctiveFacet(facetName)) {
	    var conjRefinements = this.state.getConjunctiveRefinements(facetName);

	    conjRefinements.forEach(function(r) {
	      refinements.push({
	        value: r,
	        type: 'conjunctive'
	      });
	    });

	    var excludeRefinements = this.state.getExcludeRefinements(facetName);

	    excludeRefinements.forEach(function(r) {
	      refinements.push({
	        value: r,
	        type: 'exclude'
	      });
	    });
	  } else if (this.state.isDisjunctiveFacet(facetName)) {
	    var disjRefinements = this.state.getDisjunctiveRefinements(facetName);

	    disjRefinements.forEach(function(r) {
	      refinements.push({
	        value: r,
	        type: 'disjunctive'
	      });
	    });
	  }

	  var numericRefinements = this.state.getNumericRefinements(facetName);

	  Object.keys(numericRefinements).forEach(function(operator) {
	    var value = numericRefinements[operator];

	    refinements.push({
	      value: value,
	      operator: operator,
	      type: 'numeric'
	    });
	  });

	  return refinements;
	};

	/**
	 * Return the current refinement for the (attribute, operator)
	 * @param {string} attribute attribute in the record
	 * @param {string} operator operator applied on the refined values
	 * @return {Array.<number|number[]>} refined values
	 */
	AlgoliaSearchHelper$1.prototype.getNumericRefinement = function(attribute, operator) {
	  return this.state.getNumericRefinement(attribute, operator);
	};

	/**
	 * Get the current breadcrumb for a hierarchical facet, as an array
	 * @param  {string} facetName Hierarchical facet name
	 * @return {array.<string>} the path as an array of string
	 */
	AlgoliaSearchHelper$1.prototype.getHierarchicalFacetBreadcrumb = function(facetName) {
	  return this.state.getHierarchicalFacetBreadcrumb(facetName);
	};

	// /////////// PRIVATE

	/**
	 * Perform the underlying queries
	 * @private
	 * @return {undefined}
	 * @fires search
	 * @fires result
	 * @fires error
	 */
	AlgoliaSearchHelper$1.prototype._search = function(options) {
	  var state = this.state;
	  var states = [];
	  var mainQueries = [];

	  if (!options.onlyWithDerivedHelpers) {
	    mainQueries = requestBuilder._getQueries(state.index, state);

	    states.push({
	      state: state,
	      queriesCount: mainQueries.length,
	      helper: this
	    });

	    this.emit('search', {
	      state: state,
	      results: this.lastResults
	    });
	  }

	  var derivedQueries = this.derivedHelpers.map(function(derivedHelper) {
	    var derivedState = derivedHelper.getModifiedState(state);
	    var derivedStateQueries = requestBuilder._getQueries(derivedState.index, derivedState);

	    states.push({
	      state: derivedState,
	      queriesCount: derivedStateQueries.length,
	      helper: derivedHelper
	    });

	    derivedHelper.emit('search', {
	      state: derivedState,
	      results: derivedHelper.lastResults
	    });

	    return derivedStateQueries;
	  });

	  var queries = Array.prototype.concat.apply(mainQueries, derivedQueries);
	  var queryId = this._queryId++;

	  this._currentNbQueries++;

	  try {
	    this.client.search(queries)
	      .then(this._dispatchAlgoliaResponse.bind(this, states, queryId))
	      .catch(this._dispatchAlgoliaError.bind(this, queryId));
	  } catch (error) {
	    // If we reach this part, we're in an internal error state
	    this.emit('error', {
	      error: error
	    });
	  }
	};

	/**
	 * Transform the responses as sent by the server and transform them into a user
	 * usable object that merge the results of all the batch requests. It will dispatch
	 * over the different helper + derived helpers (when there are some).
	 * @private
	 * @param {array.<{SearchParameters, AlgoliaQueries, AlgoliaSearchHelper}>}
	 *  state state used for to generate the request
	 * @param {number} queryId id of the current request
	 * @param {object} content content of the response
	 * @return {undefined}
	 */
	AlgoliaSearchHelper$1.prototype._dispatchAlgoliaResponse = function(states, queryId, content) {
	  // FIXME remove the number of outdated queries discarded instead of just one

	  if (queryId < this._lastQueryIdReceived) {
	    // Outdated answer
	    return;
	  }

	  this._currentNbQueries -= (queryId - this._lastQueryIdReceived);
	  this._lastQueryIdReceived = queryId;

	  if (this._currentNbQueries === 0) this.emit('searchQueueEmpty');

	  var results = content.results.slice();

	  states.forEach(function(s) {
	    var state = s.state;
	    var queriesCount = s.queriesCount;
	    var helper = s.helper;
	    var specificResults = results.splice(0, queriesCount);

	    var formattedResponse = helper.lastResults = new SearchResults$1(state, specificResults);

	    helper.emit('result', {
	      results: formattedResponse,
	      state: state
	    });
	  });
	};

	AlgoliaSearchHelper$1.prototype._dispatchAlgoliaError = function(queryId, error) {
	  if (queryId < this._lastQueryIdReceived) {
	    // Outdated answer
	    return;
	  }

	  this._currentNbQueries -= queryId - this._lastQueryIdReceived;
	  this._lastQueryIdReceived = queryId;

	  this.emit('error', {
	    error: error
	  });

	  if (this._currentNbQueries === 0) this.emit('searchQueueEmpty');
	};

	AlgoliaSearchHelper$1.prototype.containsRefinement = function(query, facetFilters, numericFilters, tagFilters) {
	  return query ||
	    facetFilters.length !== 0 ||
	    numericFilters.length !== 0 ||
	    tagFilters.length !== 0;
	};

	/**
	 * Test if there are some disjunctive refinements on the facet
	 * @private
	 * @param {string} facet the attribute to test
	 * @return {boolean}
	 */
	AlgoliaSearchHelper$1.prototype._hasDisjunctiveRefinements = function(facet) {
	  return this.state.disjunctiveRefinements[facet] &&
	    this.state.disjunctiveRefinements[facet].length > 0;
	};

	AlgoliaSearchHelper$1.prototype._change = function(event) {
	  var state = event.state;
	  var isPageReset = event.isPageReset;

	  if (state !== this.state) {
	    this.state = state;

	    this.emit('change', {
	      state: this.state,
	      results: this.lastResults,
	      isPageReset: isPageReset
	    });
	  }
	};

	/**
	 * Clears the cache of the underlying Algolia client.
	 * @return {AlgoliaSearchHelper}
	 */
	AlgoliaSearchHelper$1.prototype.clearCache = function() {
	  this.client.clearCache && this.client.clearCache();
	  return this;
	};

	/**
	 * Updates the internal client instance. If the reference of the clients
	 * are equal then no update is actually done.
	 * @param  {AlgoliaSearch} newClient an AlgoliaSearch client
	 * @return {AlgoliaSearchHelper}
	 */
	AlgoliaSearchHelper$1.prototype.setClient = function(newClient) {
	  if (this.client === newClient) return this;

	  if (typeof newClient.addAlgoliaAgent === 'function') {
	    newClient.addAlgoliaAgent('JS Helper (' + version$1 + ')');
	  }
	  this.client = newClient;

	  return this;
	};

	/**
	 * Gets the instance of the currently used client.
	 * @return {AlgoliaSearch}
	 */
	AlgoliaSearchHelper$1.prototype.getClient = function() {
	  return this.client;
	};

	/**
	 * Creates an derived instance of the Helper. A derived helper
	 * is a way to request other indices synchronised with the lifecycle
	 * of the main Helper. This mechanism uses the multiqueries feature
	 * of Algolia to aggregate all the requests in a single network call.
	 *
	 * This method takes a function that is used to create a new SearchParameter
	 * that will be used to create requests to Algolia. Those new requests
	 * are created just before the `search` event. The signature of the function
	 * is `SearchParameters -> SearchParameters`.
	 *
	 * This method returns a new DerivedHelper which is an EventEmitter
	 * that fires the same `search`, `result` and `error` events. Those
	 * events, however, will receive data specific to this DerivedHelper
	 * and the SearchParameters that is returned by the call of the
	 * parameter function.
	 * @param {function} fn SearchParameters -> SearchParameters
	 * @return {DerivedHelper}
	 */
	AlgoliaSearchHelper$1.prototype.derive = function(fn) {
	  var derivedHelper = new DerivedHelper(this, fn);
	  this.derivedHelpers.push(derivedHelper);
	  return derivedHelper;
	};

	/**
	 * This method detaches a derived Helper from the main one. Prefer using the one from the
	 * derived helper itself, to remove the event listeners too.
	 * @private
	 * @return {undefined}
	 * @throws Error
	 */
	AlgoliaSearchHelper$1.prototype.detachDerivedHelper = function(derivedHelper) {
	  var pos = this.derivedHelpers.indexOf(derivedHelper);
	  if (pos === -1) throw new Error('Derived helper already detached');
	  this.derivedHelpers.splice(pos, 1);
	};

	/**
	 * This method returns true if there is currently at least one on-going search.
	 * @return {boolean} true if there is a search pending
	 */
	AlgoliaSearchHelper$1.prototype.hasPendingRequests = function() {
	  return this._currentNbQueries > 0;
	};

	/**
	 * @typedef AlgoliaSearchHelper.NumericRefinement
	 * @type {object}
	 * @property {number[]} value the numbers that are used for filtering this attribute with
	 * the operator specified.
	 * @property {string} operator the faceting data: value, number of entries
	 * @property {string} type will be 'numeric'
	 */

	/**
	 * @typedef AlgoliaSearchHelper.FacetRefinement
	 * @type {object}
	 * @property {string} value the string use to filter the attribute
	 * @property {string} type the type of filter: 'conjunctive', 'disjunctive', 'exclude'
	 */

	var algoliasearch_helper = AlgoliaSearchHelper$1;

	var AlgoliaSearchHelper = algoliasearch_helper;

	var SearchParameters = SearchParameters_1;
	var SearchResults = SearchResults_1;

	/**
	 * The algoliasearchHelper module is the function that will let its
	 * contains everything needed to use the Algoliasearch
	 * Helper. It is a also a function that instanciate the helper.
	 * To use the helper, you also need the Algolia JS client v3.
	 * @example
	 * //using the UMD build
	 * var client = algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76');
	 * var helper = algoliasearchHelper(client, 'bestbuy', {
	 *   facets: ['shipping'],
	 *   disjunctiveFacets: ['category']
	 * });
	 * helper.on('result', function(event) {
	 *   console.log(event.results);
	 * });
	 * helper
	 *   .toggleFacetRefinement('category', 'Movies & TV Shows')
	 *   .toggleFacetRefinement('shipping', 'Free shipping')
	 *   .search();
	 * @example
	 * // The helper is an event emitter using the node API
	 * helper.on('result', updateTheResults);
	 * helper.once('result', updateTheResults);
	 * helper.removeListener('result', updateTheResults);
	 * helper.removeAllListeners('result');
	 * @module algoliasearchHelper
	 * @param  {AlgoliaSearch} client an AlgoliaSearch client
	 * @param  {string} index the name of the index to query
	 * @param  {SearchParameters|object} opts an object defining the initial config of the search. It doesn't have to be a {SearchParameters}, just an object containing the properties you need from it.
	 * @return {AlgoliaSearchHelper}
	 */
	function algoliasearchHelper(client, index, opts) {
	  return new AlgoliaSearchHelper(client, index, opts);
	}

	/**
	 * The version currently used
	 * @member module:algoliasearchHelper.version
	 * @type {number}
	 */
	algoliasearchHelper.version = version$2;

	/**
	 * Constructor for the Helper.
	 * @member module:algoliasearchHelper.AlgoliaSearchHelper
	 * @type {AlgoliaSearchHelper}
	 */
	algoliasearchHelper.AlgoliaSearchHelper = AlgoliaSearchHelper;

	/**
	 * Constructor for the object containing all the parameters of the search.
	 * @member module:algoliasearchHelper.SearchParameters
	 * @type {SearchParameters}
	 */
	algoliasearchHelper.SearchParameters = SearchParameters;

	/**
	 * Constructor for the object containing the results of the search.
	 * @member module:algoliasearchHelper.SearchResults
	 * @type {SearchResults}
	 */
	algoliasearchHelper.SearchResults = SearchResults;

	var algoliasearchHelper_1 = algoliasearchHelper;

	var nextMicroTask = Promise.resolve();

	var defer = function defer(callback) {
	  var progress = null;
	  var cancelled = false;

	  var fn = function fn() {
	    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    if (progress !== null) {
	      return;
	    }

	    progress = nextMicroTask.then(function () {
	      progress = null;

	      if (cancelled) {
	        cancelled = false;
	        return;
	      }

	      callback.apply(void 0, args);
	    });
	  };

	  fn.wait = function () {
	    if (progress === null) {
	      throw new Error('The deferred function should be called before calling `wait()`');
	    }

	    return progress;
	  };

	  fn.cancel = function () {
	    if (progress === null) {
	      return;
	    }

	    cancelled = true;
	  };

	  return fn;
	};

	var defer$1 = defer;

	function isDomElement(object) {
	  return object instanceof HTMLElement || Boolean(object) && object.nodeType > 0;
	}

	/**
	 * Return the container. If it's a string, it is considered a
	 * css selector and retrieves the first matching element. Otherwise
	 * test if it validates that it's a correct DOMElement.
	 *
	 * @param {string|HTMLElement} selectorOrHTMLElement CSS Selector or container node.
	 * @return {HTMLElement} Container node
	 * @throws Error when the type is not correct
	 */

	function getContainerNode(selectorOrHTMLElement) {
	  var isSelectorString = typeof selectorOrHTMLElement === 'string';
	  var domElement = isSelectorString ? document.querySelector(selectorOrHTMLElement) : selectorOrHTMLElement;

	  if (!isDomElement(domElement)) {
	    var errorMessage = 'Container must be `string` or `HTMLElement`.';

	    if (isSelectorString) {
	      errorMessage += " Unable to find ".concat(selectorOrHTMLElement);
	    }

	    throw new Error(errorMessage);
	  }

	  return domElement;
	}

	function uniq(array) {
	  return array.filter(function (value, index, self) {
	    return self.indexOf(value) === index;
	  });
	}

	function ownKeys$o(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$o(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$o(Object(source), true).forEach(function (key) { _defineProperty$s(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$o(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$s(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _toConsumableArray$2(arr) { return _arrayWithoutHoles$2(arr) || _iterableToArray$2(arr) || _unsupportedIterableToArray$2(arr) || _nonIterableSpread$2(); }

	function _nonIterableSpread$2() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

	function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

	function _iterableToArray$2(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

	function _arrayWithoutHoles$2(arr) { if (Array.isArray(arr)) return _arrayLikeToArray$2(arr); }

	function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

	function prepareTemplates( // can not use = {} here, since the template could have different constraints
	defaultTemplates) {
	  var templates = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  var allKeys = uniq([].concat(_toConsumableArray$2(Object.keys(defaultTemplates || {})), _toConsumableArray$2(Object.keys(templates))));
	  return allKeys.reduce(function (config, key) {
	    var defaultTemplate = defaultTemplates ? defaultTemplates[key] : undefined;
	    var customTemplate = templates[key];
	    var isCustomTemplate = customTemplate !== undefined && customTemplate !== defaultTemplate;
	    config.templates[key] = isCustomTemplate ? customTemplate // typescript doesn't recognize that this condition asserts customTemplate is defined
	    : defaultTemplate;
	    config.useCustomCompileOptions[key] = isCustomTemplate;
	    return config;
	  }, {
	    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	    templates: {},
	    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	    useCustomCompileOptions: {}
	  });
	}
	/**
	 * Prepares an object to be passed to the Template widget
	 */


	function prepareTemplateProps(_ref) {
	  var defaultTemplates = _ref.defaultTemplates,
	      templates = _ref.templates,
	      templatesConfig = _ref.templatesConfig;
	  var preparedTemplates = prepareTemplates(defaultTemplates, templates);
	  return _objectSpread$o({
	    templatesConfig: templatesConfig
	  }, preparedTemplates);
	}

	var compiler = {};

	/*
	 *  Copyright 2011 Twitter, Inc.
	 *  Licensed under the Apache License, Version 2.0 (the "License");
	 *  you may not use this file except in compliance with the License.
	 *  You may obtain a copy of the License at
	 *
	 *  http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *  Unless required by applicable law or agreed to in writing, software
	 *  distributed under the License is distributed on an "AS IS" BASIS,
	 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *  See the License for the specific language governing permissions and
	 *  limitations under the License.
	 */

	(function (exports) {
	(function (Hogan) {
	  // Setup regex  assignments
	  // remove whitespace according to Mustache spec
	  var rIsWhitespace = /\S/,
	      rQuot = /\"/g,
	      rNewline =  /\n/g,
	      rCr = /\r/g,
	      rSlash = /\\/g,
	      rLineSep = /\u2028/,
	      rParagraphSep = /\u2029/;

	  Hogan.tags = {
	    '#': 1, '^': 2, '<': 3, '$': 4,
	    '/': 5, '!': 6, '>': 7, '=': 8, '_v': 9,
	    '{': 10, '&': 11, '_t': 12
	  };

	  Hogan.scan = function scan(text, delimiters) {
	    var len = text.length,
	        IN_TEXT = 0,
	        IN_TAG_TYPE = 1,
	        IN_TAG = 2,
	        state = IN_TEXT,
	        tagType = null,
	        tag = null,
	        buf = '',
	        tokens = [],
	        seenTag = false,
	        i = 0,
	        lineStart = 0,
	        otag = '{{',
	        ctag = '}}';

	    function addBuf() {
	      if (buf.length > 0) {
	        tokens.push({tag: '_t', text: new String(buf)});
	        buf = '';
	      }
	    }

	    function lineIsWhitespace() {
	      var isAllWhitespace = true;
	      for (var j = lineStart; j < tokens.length; j++) {
	        isAllWhitespace =
	          (Hogan.tags[tokens[j].tag] < Hogan.tags['_v']) ||
	          (tokens[j].tag == '_t' && tokens[j].text.match(rIsWhitespace) === null);
	        if (!isAllWhitespace) {
	          return false;
	        }
	      }

	      return isAllWhitespace;
	    }

	    function filterLine(haveSeenTag, noNewLine) {
	      addBuf();

	      if (haveSeenTag && lineIsWhitespace()) {
	        for (var j = lineStart, next; j < tokens.length; j++) {
	          if (tokens[j].text) {
	            if ((next = tokens[j+1]) && next.tag == '>') {
	              // set indent to token value
	              next.indent = tokens[j].text.toString();
	            }
	            tokens.splice(j, 1);
	          }
	        }
	      } else if (!noNewLine) {
	        tokens.push({tag:'\n'});
	      }

	      seenTag = false;
	      lineStart = tokens.length;
	    }

	    function changeDelimiters(text, index) {
	      var close = '=' + ctag,
	          closeIndex = text.indexOf(close, index),
	          delimiters = trim(
	            text.substring(text.indexOf('=', index) + 1, closeIndex)
	          ).split(' ');

	      otag = delimiters[0];
	      ctag = delimiters[delimiters.length - 1];

	      return closeIndex + close.length - 1;
	    }

	    if (delimiters) {
	      delimiters = delimiters.split(' ');
	      otag = delimiters[0];
	      ctag = delimiters[1];
	    }

	    for (i = 0; i < len; i++) {
	      if (state == IN_TEXT) {
	        if (tagChange(otag, text, i)) {
	          --i;
	          addBuf();
	          state = IN_TAG_TYPE;
	        } else {
	          if (text.charAt(i) == '\n') {
	            filterLine(seenTag);
	          } else {
	            buf += text.charAt(i);
	          }
	        }
	      } else if (state == IN_TAG_TYPE) {
	        i += otag.length - 1;
	        tag = Hogan.tags[text.charAt(i + 1)];
	        tagType = tag ? text.charAt(i + 1) : '_v';
	        if (tagType == '=') {
	          i = changeDelimiters(text, i);
	          state = IN_TEXT;
	        } else {
	          if (tag) {
	            i++;
	          }
	          state = IN_TAG;
	        }
	        seenTag = i;
	      } else {
	        if (tagChange(ctag, text, i)) {
	          tokens.push({tag: tagType, n: trim(buf), otag: otag, ctag: ctag,
	                       i: (tagType == '/') ? seenTag - otag.length : i + ctag.length});
	          buf = '';
	          i += ctag.length - 1;
	          state = IN_TEXT;
	          if (tagType == '{') {
	            if (ctag == '}}') {
	              i++;
	            } else {
	              cleanTripleStache(tokens[tokens.length - 1]);
	            }
	          }
	        } else {
	          buf += text.charAt(i);
	        }
	      }
	    }

	    filterLine(seenTag, true);

	    return tokens;
	  };

	  function cleanTripleStache(token) {
	    if (token.n.substr(token.n.length - 1) === '}') {
	      token.n = token.n.substring(0, token.n.length - 1);
	    }
	  }

	  function trim(s) {
	    if (s.trim) {
	      return s.trim();
	    }

	    return s.replace(/^\s*|\s*$/g, '');
	  }

	  function tagChange(tag, text, index) {
	    if (text.charAt(index) != tag.charAt(0)) {
	      return false;
	    }

	    for (var i = 1, l = tag.length; i < l; i++) {
	      if (text.charAt(index + i) != tag.charAt(i)) {
	        return false;
	      }
	    }

	    return true;
	  }

	  // the tags allowed inside super templates
	  var allowedInSuper = {'_t': true, '\n': true, '$': true, '/': true};

	  function buildTree(tokens, kind, stack, customTags) {
	    var instructions = [],
	        opener = null,
	        tail = null,
	        token = null;

	    tail = stack[stack.length - 1];

	    while (tokens.length > 0) {
	      token = tokens.shift();

	      if (tail && tail.tag == '<' && !(token.tag in allowedInSuper)) {
	        throw new Error('Illegal content in < super tag.');
	      }

	      if (Hogan.tags[token.tag] <= Hogan.tags['$'] || isOpener(token, customTags)) {
	        stack.push(token);
	        token.nodes = buildTree(tokens, token.tag, stack, customTags);
	      } else if (token.tag == '/') {
	        if (stack.length === 0) {
	          throw new Error('Closing tag without opener: /' + token.n);
	        }
	        opener = stack.pop();
	        if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {
	          throw new Error('Nesting error: ' + opener.n + ' vs. ' + token.n);
	        }
	        opener.end = token.i;
	        return instructions;
	      } else if (token.tag == '\n') {
	        token.last = (tokens.length == 0) || (tokens[0].tag == '\n');
	      }

	      instructions.push(token);
	    }

	    if (stack.length > 0) {
	      throw new Error('missing closing tag: ' + stack.pop().n);
	    }

	    return instructions;
	  }

	  function isOpener(token, tags) {
	    for (var i = 0, l = tags.length; i < l; i++) {
	      if (tags[i].o == token.n) {
	        token.tag = '#';
	        return true;
	      }
	    }
	  }

	  function isCloser(close, open, tags) {
	    for (var i = 0, l = tags.length; i < l; i++) {
	      if (tags[i].c == close && tags[i].o == open) {
	        return true;
	      }
	    }
	  }

	  function stringifySubstitutions(obj) {
	    var items = [];
	    for (var key in obj) {
	      items.push('"' + esc(key) + '": function(c,p,t,i) {' + obj[key] + '}');
	    }
	    return "{ " + items.join(",") + " }";
	  }

	  function stringifyPartials(codeObj) {
	    var partials = [];
	    for (var key in codeObj.partials) {
	      partials.push('"' + esc(key) + '":{name:"' + esc(codeObj.partials[key].name) + '", ' + stringifyPartials(codeObj.partials[key]) + "}");
	    }
	    return "partials: {" + partials.join(",") + "}, subs: " + stringifySubstitutions(codeObj.subs);
	  }

	  Hogan.stringify = function(codeObj, text, options) {
	    return "{code: function (c,p,i) { " + Hogan.wrapMain(codeObj.code) + " }," + stringifyPartials(codeObj) +  "}";
	  };

	  var serialNo = 0;
	  Hogan.generate = function(tree, text, options) {
	    serialNo = 0;
	    var context = { code: '', subs: {}, partials: {} };
	    Hogan.walk(tree, context);

	    if (options.asString) {
	      return this.stringify(context, text, options);
	    }

	    return this.makeTemplate(context, text, options);
	  };

	  Hogan.wrapMain = function(code) {
	    return 'var t=this;t.b(i=i||"");' + code + 'return t.fl();';
	  };

	  Hogan.template = Hogan.Template;

	  Hogan.makeTemplate = function(codeObj, text, options) {
	    var template = this.makePartials(codeObj);
	    template.code = new Function('c', 'p', 'i', this.wrapMain(codeObj.code));
	    return new this.template(template, text, this, options);
	  };

	  Hogan.makePartials = function(codeObj) {
	    var key, template = {subs: {}, partials: codeObj.partials, name: codeObj.name};
	    for (key in template.partials) {
	      template.partials[key] = this.makePartials(template.partials[key]);
	    }
	    for (key in codeObj.subs) {
	      template.subs[key] = new Function('c', 'p', 't', 'i', codeObj.subs[key]);
	    }
	    return template;
	  };

	  function esc(s) {
	    return s.replace(rSlash, '\\\\')
	            .replace(rQuot, '\\\"')
	            .replace(rNewline, '\\n')
	            .replace(rCr, '\\r')
	            .replace(rLineSep, '\\u2028')
	            .replace(rParagraphSep, '\\u2029');
	  }

	  function chooseMethod(s) {
	    return (~s.indexOf('.')) ? 'd' : 'f';
	  }

	  function createPartial(node, context) {
	    var prefix = "<" + (context.prefix || "");
	    var sym = prefix + node.n + serialNo++;
	    context.partials[sym] = {name: node.n, partials: {}};
	    context.code += 't.b(t.rp("' +  esc(sym) + '",c,p,"' + (node.indent || '') + '"));';
	    return sym;
	  }

	  Hogan.codegen = {
	    '#': function(node, context) {
	      context.code += 'if(t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),' +
	                      'c,p,0,' + node.i + ',' + node.end + ',"' + node.otag + " " + node.ctag + '")){' +
	                      't.rs(c,p,' + 'function(c,p,t){';
	      Hogan.walk(node.nodes, context);
	      context.code += '});c.pop();}';
	    },

	    '^': function(node, context) {
	      context.code += 'if(!t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,1,0,0,"")){';
	      Hogan.walk(node.nodes, context);
	      context.code += '};';
	    },

	    '>': createPartial,
	    '<': function(node, context) {
	      var ctx = {partials: {}, code: '', subs: {}, inPartial: true};
	      Hogan.walk(node.nodes, ctx);
	      var template = context.partials[createPartial(node, context)];
	      template.subs = ctx.subs;
	      template.partials = ctx.partials;
	    },

	    '$': function(node, context) {
	      var ctx = {subs: {}, code: '', partials: context.partials, prefix: node.n};
	      Hogan.walk(node.nodes, ctx);
	      context.subs[node.n] = ctx.code;
	      if (!context.inPartial) {
	        context.code += 't.sub("' + esc(node.n) + '",c,p,i);';
	      }
	    },

	    '\n': function(node, context) {
	      context.code += write('"\\n"' + (node.last ? '' : ' + i'));
	    },

	    '_v': function(node, context) {
	      context.code += 't.b(t.v(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
	    },

	    '_t': function(node, context) {
	      context.code += write('"' + esc(node.text) + '"');
	    },

	    '{': tripleStache,

	    '&': tripleStache
	  };

	  function tripleStache(node, context) {
	    context.code += 't.b(t.t(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
	  }

	  function write(s) {
	    return 't.b(' + s + ');';
	  }

	  Hogan.walk = function(nodelist, context) {
	    var func;
	    for (var i = 0, l = nodelist.length; i < l; i++) {
	      func = Hogan.codegen[nodelist[i].tag];
	      func && func(nodelist[i], context);
	    }
	    return context;
	  };

	  Hogan.parse = function(tokens, text, options) {
	    options = options || {};
	    return buildTree(tokens, '', [], options.sectionTags || []);
	  };

	  Hogan.cache = {};

	  Hogan.cacheKey = function(text, options) {
	    return [text, !!options.asString, !!options.disableLambda, options.delimiters, !!options.modelGet].join('||');
	  };

	  Hogan.compile = function(text, options) {
	    options = options || {};
	    var key = Hogan.cacheKey(text, options);
	    var template = this.cache[key];

	    if (template) {
	      var partials = template.partials;
	      for (var name in partials) {
	        delete partials[name].instance;
	      }
	      return template;
	    }

	    template = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options);
	    return this.cache[key] = template;
	  };
	})(exports );
	}(compiler));

	var template = {};

	/*
	 *  Copyright 2011 Twitter, Inc.
	 *  Licensed under the Apache License, Version 2.0 (the "License");
	 *  you may not use this file except in compliance with the License.
	 *  You may obtain a copy of the License at
	 *
	 *  http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *  Unless required by applicable law or agreed to in writing, software
	 *  distributed under the License is distributed on an "AS IS" BASIS,
	 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *  See the License for the specific language governing permissions and
	 *  limitations under the License.
	 */

	(function (exports) {

	(function (Hogan) {
	  Hogan.Template = function (codeObj, text, compiler, options) {
	    codeObj = codeObj || {};
	    this.r = codeObj.code || this.r;
	    this.c = compiler;
	    this.options = options || {};
	    this.text = text || '';
	    this.partials = codeObj.partials || {};
	    this.subs = codeObj.subs || {};
	    this.buf = '';
	  };

	  Hogan.Template.prototype = {
	    // render: replaced by generated code.
	    r: function (context, partials, indent) { return ''; },

	    // variable escaping
	    v: hoganEscape,

	    // triple stache
	    t: coerceToString,

	    render: function render(context, partials, indent) {
	      return this.ri([context], partials || {}, indent);
	    },

	    // render internal -- a hook for overrides that catches partials too
	    ri: function (context, partials, indent) {
	      return this.r(context, partials, indent);
	    },

	    // ensurePartial
	    ep: function(symbol, partials) {
	      var partial = this.partials[symbol];

	      // check to see that if we've instantiated this partial before
	      var template = partials[partial.name];
	      if (partial.instance && partial.base == template) {
	        return partial.instance;
	      }

	      if (typeof template == 'string') {
	        if (!this.c) {
	          throw new Error("No compiler available.");
	        }
	        template = this.c.compile(template, this.options);
	      }

	      if (!template) {
	        return null;
	      }

	      // We use this to check whether the partials dictionary has changed
	      this.partials[symbol].base = template;

	      if (partial.subs) {
	        // Make sure we consider parent template now
	        if (!partials.stackText) partials.stackText = {};
	        for (key in partial.subs) {
	          if (!partials.stackText[key]) {
	            partials.stackText[key] = (this.activeSub !== undefined && partials.stackText[this.activeSub]) ? partials.stackText[this.activeSub] : this.text;
	          }
	        }
	        template = createSpecializedPartial(template, partial.subs, partial.partials,
	          this.stackSubs, this.stackPartials, partials.stackText);
	      }
	      this.partials[symbol].instance = template;

	      return template;
	    },

	    // tries to find a partial in the current scope and render it
	    rp: function(symbol, context, partials, indent) {
	      var partial = this.ep(symbol, partials);
	      if (!partial) {
	        return '';
	      }

	      return partial.ri(context, partials, indent);
	    },

	    // render a section
	    rs: function(context, partials, section) {
	      var tail = context[context.length - 1];

	      if (!isArray(tail)) {
	        section(context, partials, this);
	        return;
	      }

	      for (var i = 0; i < tail.length; i++) {
	        context.push(tail[i]);
	        section(context, partials, this);
	        context.pop();
	      }
	    },

	    // maybe start a section
	    s: function(val, ctx, partials, inverted, start, end, tags) {
	      var pass;

	      if (isArray(val) && val.length === 0) {
	        return false;
	      }

	      if (typeof val == 'function') {
	        val = this.ms(val, ctx, partials, inverted, start, end, tags);
	      }

	      pass = !!val;

	      if (!inverted && pass && ctx) {
	        ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
	      }

	      return pass;
	    },

	    // find values with dotted names
	    d: function(key, ctx, partials, returnFound) {
	      var found,
	          names = key.split('.'),
	          val = this.f(names[0], ctx, partials, returnFound),
	          doModelGet = this.options.modelGet,
	          cx = null;

	      if (key === '.' && isArray(ctx[ctx.length - 2])) {
	        val = ctx[ctx.length - 1];
	      } else {
	        for (var i = 1; i < names.length; i++) {
	          found = findInScope(names[i], val, doModelGet);
	          if (found !== undefined) {
	            cx = val;
	            val = found;
	          } else {
	            val = '';
	          }
	        }
	      }

	      if (returnFound && !val) {
	        return false;
	      }

	      if (!returnFound && typeof val == 'function') {
	        ctx.push(cx);
	        val = this.mv(val, ctx, partials);
	        ctx.pop();
	      }

	      return val;
	    },

	    // find values with normal names
	    f: function(key, ctx, partials, returnFound) {
	      var val = false,
	          v = null,
	          found = false,
	          doModelGet = this.options.modelGet;

	      for (var i = ctx.length - 1; i >= 0; i--) {
	        v = ctx[i];
	        val = findInScope(key, v, doModelGet);
	        if (val !== undefined) {
	          found = true;
	          break;
	        }
	      }

	      if (!found) {
	        return (returnFound) ? false : "";
	      }

	      if (!returnFound && typeof val == 'function') {
	        val = this.mv(val, ctx, partials);
	      }

	      return val;
	    },

	    // higher order templates
	    ls: function(func, cx, partials, text, tags) {
	      var oldTags = this.options.delimiters;

	      this.options.delimiters = tags;
	      this.b(this.ct(coerceToString(func.call(cx, text)), cx, partials));
	      this.options.delimiters = oldTags;

	      return false;
	    },

	    // compile text
	    ct: function(text, cx, partials) {
	      if (this.options.disableLambda) {
	        throw new Error('Lambda features disabled.');
	      }
	      return this.c.compile(text, this.options).render(cx, partials);
	    },

	    // template result buffering
	    b: function(s) { this.buf += s; },

	    fl: function() { var r = this.buf; this.buf = ''; return r; },

	    // method replace section
	    ms: function(func, ctx, partials, inverted, start, end, tags) {
	      var textSource,
	          cx = ctx[ctx.length - 1],
	          result = func.call(cx);

	      if (typeof result == 'function') {
	        if (inverted) {
	          return true;
	        } else {
	          textSource = (this.activeSub && this.subsText && this.subsText[this.activeSub]) ? this.subsText[this.activeSub] : this.text;
	          return this.ls(result, cx, partials, textSource.substring(start, end), tags);
	        }
	      }

	      return result;
	    },

	    // method replace variable
	    mv: function(func, ctx, partials) {
	      var cx = ctx[ctx.length - 1];
	      var result = func.call(cx);

	      if (typeof result == 'function') {
	        return this.ct(coerceToString(result.call(cx)), cx, partials);
	      }

	      return result;
	    },

	    sub: function(name, context, partials, indent) {
	      var f = this.subs[name];
	      if (f) {
	        this.activeSub = name;
	        f(context, partials, this, indent);
	        this.activeSub = false;
	      }
	    }

	  };

	  //Find a key in an object
	  function findInScope(key, scope, doModelGet) {
	    var val;

	    if (scope && typeof scope == 'object') {

	      if (scope[key] !== undefined) {
	        val = scope[key];

	      // try lookup with get for backbone or similar model data
	      } else if (doModelGet && scope.get && typeof scope.get == 'function') {
	        val = scope.get(key);
	      }
	    }

	    return val;
	  }

	  function createSpecializedPartial(instance, subs, partials, stackSubs, stackPartials, stackText) {
	    function PartialTemplate() {}    PartialTemplate.prototype = instance;
	    function Substitutions() {}    Substitutions.prototype = instance.subs;
	    var key;
	    var partial = new PartialTemplate();
	    partial.subs = new Substitutions();
	    partial.subsText = {};  //hehe. substext.
	    partial.buf = '';

	    stackSubs = stackSubs || {};
	    partial.stackSubs = stackSubs;
	    partial.subsText = stackText;
	    for (key in subs) {
	      if (!stackSubs[key]) stackSubs[key] = subs[key];
	    }
	    for (key in stackSubs) {
	      partial.subs[key] = stackSubs[key];
	    }

	    stackPartials = stackPartials || {};
	    partial.stackPartials = stackPartials;
	    for (key in partials) {
	      if (!stackPartials[key]) stackPartials[key] = partials[key];
	    }
	    for (key in stackPartials) {
	      partial.partials[key] = stackPartials[key];
	    }

	    return partial;
	  }

	  var rAmp = /&/g,
	      rLt = /</g,
	      rGt = />/g,
	      rApos = /\'/g,
	      rQuot = /\"/g,
	      hChars = /[&<>\"\']/;

	  function coerceToString(val) {
	    return String((val === null || val === undefined) ? '' : val);
	  }

	  function hoganEscape(str) {
	    str = coerceToString(str);
	    return hChars.test(str) ?
	      str
	        .replace(rAmp, '&amp;')
	        .replace(rLt, '&lt;')
	        .replace(rGt, '&gt;')
	        .replace(rApos, '&#39;')
	        .replace(rQuot, '&quot;') :
	      str;
	  }

	  var isArray = Array.isArray || function(a) {
	    return Object.prototype.toString.call(a) === '[object Array]';
	  };

	})(exports );
	}(template));

	/*
	 *  Copyright 2011 Twitter, Inc.
	 *  Licensed under the Apache License, Version 2.0 (the "License");
	 *  you may not use this file except in compliance with the License.
	 *  You may obtain a copy of the License at
	 *
	 *  http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *  Unless required by applicable law or agreed to in writing, software
	 *  distributed under the License is distributed on an "AS IS" BASIS,
	 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *  See the License for the specific language governing permissions and
	 *  limitations under the License.
	 */

	// This file is for use with Node.js. See dist/ for browser files.

	var Hogan = compiler;
	Hogan.Template = template.Template;
	Hogan.template = Hogan.Template;
	var hogan = Hogan;

	var hogan$1 = hogan;

	function _typeof$6(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$6 = function _typeof(obj) { return typeof obj; }; } else { _typeof$6 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$6(obj); }

	function ownKeys$n(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$n(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$n(Object(source), true).forEach(function (key) { _defineProperty$r(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$n(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$r(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	// We add all our template helper methods to the template as lambdas. Note
	// that lambdas in Mustache are supposed to accept a second argument of
	// `render` to get the rendered value, not the literal `{{value}}`. But
	// this is currently broken (see https://github.com/twitter/hogan.js/issues/222).
	function transformHelpersToHogan() {
	  var helpers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  var compileOptions = arguments.length > 1 ? arguments[1] : undefined;
	  var data = arguments.length > 2 ? arguments[2] : undefined;
	  return Object.keys(helpers).reduce(function (acc, helperKey) {
	    return _objectSpread$n(_objectSpread$n({}, acc), {}, _defineProperty$r({}, helperKey, function () {
	      var _this = this;

	      return function (text) {
	        var render = function render(value) {
	          return hogan$1.compile(value, compileOptions).render(_this);
	        };

	        return helpers[helperKey].call(data, text, render);
	      };
	    }));
	  }, {});
	}

	function renderTemplate(_ref) {
	  var templates = _ref.templates,
	      templateKey = _ref.templateKey,
	      compileOptions = _ref.compileOptions,
	      helpers = _ref.helpers,
	      data = _ref.data,
	      bindEvent = _ref.bindEvent;
	  var template = templates[templateKey];

	  if (typeof template !== 'string' && typeof template !== 'function') {
	    throw new Error("Template must be 'string' or 'function', was '".concat(_typeof$6(template), "' (key: ").concat(templateKey, ")"));
	  }

	  if (typeof template === 'function') {
	    return template(data, bindEvent);
	  }

	  var transformedHelpers = transformHelpersToHogan(helpers, compileOptions, data);
	  return hogan$1.compile(template, compileOptions).render(_objectSpread$n(_objectSpread$n({}, data), {}, {
	    helpers: transformedHelpers
	  })).replace(/[ \n\r\t\f\xA0]+/g, function (spaces) {
	    return spaces.replace(/(^|\xA0+)[^\xA0]+/g, '$1 ');
	  }).trim();
	}

	// We aren't using the native `Array.prototype.find` because the refactor away from Lodash is not
	// published as a major version.
	// Relying on the `find` polyfill on user-land, which before was only required for niche use-cases,
	// was decided as too risky.
	// @MAJOR Replace with the native `Array.prototype.find` method
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
	function find(items, predicate) {
	  var value;

	  for (var i = 0; i < items.length; i++) {
	    value = items[i]; // inlined for performance: if (Call(predicate, thisArg, [value, i, list])) {

	    if (predicate(value, i, items)) {
	      return value;
	    }
	  }

	  return undefined;
	}

	function getObjectType(object) {
	  return Object.prototype.toString.call(object).slice(8, -1);
	}

	function checkRendering(rendering, usage) {
	  if (rendering === undefined || typeof rendering !== 'function') {
	    throw new Error("The render function is not valid (received type ".concat(getObjectType(rendering), ").\n\n").concat(usage));
	  }
	}

	function noop() {}

	/**
	 * Logs a warning when this function is called, in development environment only.
	 */
	var deprecate = function deprecate(fn, message) {
	  return fn;
	};

	function getPropertyByPath(object, path) {
	  var parts = Array.isArray(path) ? path : path.split('.');
	  return parts.reduce(function (current, key) {
	    return current && current[key];
	  }, object);
	}

	function _typeof$5(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$5 = function _typeof(obj) { return typeof obj; }; } else { _typeof$5 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$5(obj); }

	/**
	 * This implementation is taken from Lodash implementation.
	 * See: https://github.com/lodash/lodash/blob/master/isPlainObject.js
	 */
	function getTag(value) {
	  if (value === null) {
	    return value === undefined ? '[object Undefined]' : '[object Null]';
	  }

	  return Object.prototype.toString.call(value);
	}

	function isObjectLike(value) {
	  return _typeof$5(value) === 'object' && value !== null;
	}
	/**
	 * Checks if `value` is a plain object.
	 *
	 * A plain object is an object created by the `Object`
	 * constructor or with a `[[Prototype]]` of `null`.
	 */


	function isPlainObject(value) {
	  if (!isObjectLike(value) || getTag(value) !== '[object Object]') {
	    return false;
	  }

	  if (Object.getPrototypeOf(value) === null) {
	    return true;
	  }

	  var proto = value;

	  while (Object.getPrototypeOf(proto) !== null) {
	    proto = Object.getPrototypeOf(proto);
	  }

	  return Object.getPrototypeOf(value) === proto;
	}

	function isPrimitive(obj) {
	  return obj !== Object(obj);
	}

	function isEqual(first, second) {
	  if (first === second) {
	    return true;
	  }

	  if (isPrimitive(first) || isPrimitive(second) || typeof first === 'function' || typeof second === 'function') {
	    return first === second;
	  }

	  if (Object.keys(first).length !== Object.keys(second).length) {
	    return false;
	  }

	  for (var _i = 0, _Object$keys = Object.keys(first); _i < _Object$keys.length; _i++) {
	    var key = _Object$keys[_i];

	    if (!(key in second)) {
	      return false;
	    }

	    if (!isEqual(first[key], second[key])) {
	      return false;
	    }
	  }

	  return true;
	}

	/**
	 * This implementation is taken from Lodash implementation.
	 * See: https://github.com/lodash/lodash/blob/4.17.11-npm/escape.js
	 */
	// Used to map characters to HTML entities.
	var htmlEscapes$1 = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;',
	  "'": '&#39;'
	}; // Used to match HTML entities and HTML characters.

	var regexUnescapedHtml = /[&<>"']/g;
	var regexHasUnescapedHtml = RegExp(regexUnescapedHtml.source);
	/**
	 * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
	 * corresponding HTML entities.
	 */

	function escape$1(value) {
	  return value && regexHasUnescapedHtml.test(value) ? value.replace(regexUnescapedHtml, function (character) {
	    return htmlEscapes$1[character];
	  }) : value;
	}

	/**
	 * This implementation is taken from Lodash implementation.
	 * See: https://github.com/lodash/lodash/blob/4.17.11-npm/unescape.js
	 */
	// Used to map HTML entities to characters.
	var htmlEscapes = {
	  '&amp;': '&',
	  '&lt;': '<',
	  '&gt;': '>',
	  '&quot;': '"',
	  '&#39;': "'"
	}; // Used to match HTML entities and HTML characters.

	var regexEscapedHtml = /&(amp|quot|lt|gt|#39);/g;
	var regexHasEscapedHtml = RegExp(regexEscapedHtml.source);
	/**
	 * Converts the HTML entities "&", "<", ">", '"', and "'" in `string` to their
	 * characters.
	 */

	function unescape$1(value) {
	  return value && regexHasEscapedHtml.test(value) ? value.replace(regexEscapedHtml, function (character) {
	    return htmlEscapes[character];
	  }) : value;
	}

	function _extends$3() { _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }

	function ownKeys$m(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$m(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$m(Object(source), true).forEach(function (key) { _defineProperty$q(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$m(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$q(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	var TAG_PLACEHOLDER = {
	  highlightPreTag: '__ais-highlight__',
	  highlightPostTag: '__/ais-highlight__'
	};
	var TAG_REPLACEMENT = {
	  highlightPreTag: '<mark>',
	  highlightPostTag: '</mark>'
	};

	function replaceTagsAndEscape(value) {
	  return escape$1(value).replace(new RegExp(TAG_PLACEHOLDER.highlightPreTag, 'g'), TAG_REPLACEMENT.highlightPreTag).replace(new RegExp(TAG_PLACEHOLDER.highlightPostTag, 'g'), TAG_REPLACEMENT.highlightPostTag);
	}

	function recursiveEscape(input) {
	  if (isPlainObject(input) && typeof input.value !== 'string') {
	    return Object.keys(input).reduce(function (acc, key) {
	      return _objectSpread$m(_objectSpread$m({}, acc), {}, _defineProperty$q({}, key, recursiveEscape(input[key])));
	    }, {});
	  }

	  if (Array.isArray(input)) {
	    return input.map(recursiveEscape);
	  }

	  return _objectSpread$m(_objectSpread$m({}, input), {}, {
	    value: replaceTagsAndEscape(input.value)
	  });
	}

	function escapeHits(hits) {
	  if (hits.__escaped === undefined) {
	    // We don't override the value on hit because it will mutate the raw results
	    // instead we make a shallow copy and we assign the escaped values on it.
	    hits = hits.map(function (_ref) {
	      var hit = _extends$3({}, _ref);

	      if (hit._highlightResult) {
	        hit._highlightResult = recursiveEscape(hit._highlightResult);
	      }

	      if (hit._snippetResult) {
	        hit._snippetResult = recursiveEscape(hit._snippetResult);
	      }

	      return hit;
	    });
	    hits.__escaped = true;
	  }

	  return hits;
	}

	function concatHighlightedParts(parts) {
	  var highlightPreTag = TAG_REPLACEMENT.highlightPreTag,
	      highlightPostTag = TAG_REPLACEMENT.highlightPostTag;
	  return parts.map(function (part) {
	    return part.isHighlighted ? highlightPreTag + part.value + highlightPostTag : part.value;
	  }).join('');
	}

	function getHighlightedParts(highlightedValue) {
	  var highlightPostTag = TAG_REPLACEMENT.highlightPostTag,
	      highlightPreTag = TAG_REPLACEMENT.highlightPreTag;
	  var splitByPreTag = highlightedValue.split(highlightPreTag);
	  var firstValue = splitByPreTag.shift();
	  var elements = !firstValue ? [] : [{
	    value: firstValue,
	    isHighlighted: false
	  }];
	  splitByPreTag.forEach(function (split) {
	    var splitByPostTag = split.split(highlightPostTag);
	    elements.push({
	      value: splitByPostTag[0],
	      isHighlighted: true
	    });

	    if (splitByPostTag[1] !== '') {
	      elements.push({
	        value: splitByPostTag[1],
	        isHighlighted: false
	      });
	    }
	  });
	  return elements;
	}

	var hasAlphanumeric = new RegExp(/\w/i);
	function getHighlightFromSiblings(parts, i) {
	  var _parts, _parts2;

	  var current = parts[i];
	  var isNextHighlighted = ((_parts = parts[i + 1]) === null || _parts === void 0 ? void 0 : _parts.isHighlighted) || true;
	  var isPreviousHighlighted = ((_parts2 = parts[i - 1]) === null || _parts2 === void 0 ? void 0 : _parts2.isHighlighted) || true;

	  if (!hasAlphanumeric.test(unescape$1(current.value)) && isPreviousHighlighted === isNextHighlighted) {
	    return isPreviousHighlighted;
	  }

	  return current.isHighlighted;
	}

	function ownKeys$l(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$l(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$l(Object(source), true).forEach(function (key) { _defineProperty$p(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$l(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$p(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	function reverseHighlightedParts(parts) {
	  if (!parts.some(function (part) {
	    return part.isHighlighted;
	  })) {
	    return parts.map(function (part) {
	      return _objectSpread$l(_objectSpread$l({}, part), {}, {
	        isHighlighted: false
	      });
	    });
	  }

	  return parts.map(function (part, i) {
	    return _objectSpread$l(_objectSpread$l({}, part), {}, {
	      isHighlighted: !getHighlightFromSiblings(parts, i)
	    });
	  });
	}

	// We aren't using the native `Array.prototype.findIndex` because the refactor away from Lodash is not
	// published as a major version.
	// Relying on the `findIndex` polyfill on user-land, which before was only required for niche use-cases,
	// was decided as too risky.
	// @MAJOR Replace with the native `Array.prototype.findIndex` method
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
	function findIndex(array, comparator) {
	  if (!Array.isArray(array)) {
	    return -1;
	  }

	  for (var i = 0; i < array.length; i++) {
	    if (comparator(array[i])) {
	      return i;
	    }
	  }

	  return -1;
	}

	function ownKeys$k(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$k(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$k(Object(source), true).forEach(function (key) { _defineProperty$o(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$k(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$o(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _objectWithoutProperties$6(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$6(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

	function _objectWithoutPropertiesLoose$6(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

	var mergeWithRest = function mergeWithRest(left, right) {
	  right.facets;
	      right.disjunctiveFacets;
	      right.facetsRefinements;
	      right.facetsExcludes;
	      right.disjunctiveFacetsRefinements;
	      right.numericRefinements;
	      right.tagRefinements;
	      right.hierarchicalFacets;
	      right.hierarchicalFacetsRefinements;
	      right.ruleContexts;
	      var rest = _objectWithoutProperties$6(right, ["facets", "disjunctiveFacets", "facetsRefinements", "facetsExcludes", "disjunctiveFacetsRefinements", "numericRefinements", "tagRefinements", "hierarchicalFacets", "hierarchicalFacetsRefinements", "ruleContexts"]);

	  return left.setQueryParameters(rest);
	}; // Merge facets


	var mergeFacets = function mergeFacets(left, right) {
	  return right.facets.reduce(function (_, name) {
	    return _.addFacet(name);
	  }, left);
	};

	var mergeDisjunctiveFacets = function mergeDisjunctiveFacets(left, right) {
	  return right.disjunctiveFacets.reduce(function (_, name) {
	    return _.addDisjunctiveFacet(name);
	  }, left);
	};

	var mergeHierarchicalFacets = function mergeHierarchicalFacets(left, right) {
	  return left.setQueryParameters({
	    hierarchicalFacets: right.hierarchicalFacets.reduce(function (facets, facet) {
	      var index = findIndex(facets, function (_) {
	        return _.name === facet.name;
	      });

	      if (index === -1) {
	        return facets.concat(facet);
	      }

	      var nextFacets = facets.slice();
	      nextFacets.splice(index, 1, facet);
	      return nextFacets;
	    }, left.hierarchicalFacets)
	  });
	}; // Merge facet refinements


	var mergeTagRefinements = function mergeTagRefinements(left, right) {
	  return right.tagRefinements.reduce(function (_, value) {
	    return _.addTagRefinement(value);
	  }, left);
	};

	var mergeFacetRefinements = function mergeFacetRefinements(left, right) {
	  return left.setQueryParameters({
	    facetsRefinements: _objectSpread$k(_objectSpread$k({}, left.facetsRefinements), right.facetsRefinements)
	  });
	};

	var mergeFacetsExcludes = function mergeFacetsExcludes(left, right) {
	  return left.setQueryParameters({
	    facetsExcludes: _objectSpread$k(_objectSpread$k({}, left.facetsExcludes), right.facetsExcludes)
	  });
	};

	var mergeDisjunctiveFacetsRefinements = function mergeDisjunctiveFacetsRefinements(left, right) {
	  return left.setQueryParameters({
	    disjunctiveFacetsRefinements: _objectSpread$k(_objectSpread$k({}, left.disjunctiveFacetsRefinements), right.disjunctiveFacetsRefinements)
	  });
	};

	var mergeNumericRefinements = function mergeNumericRefinements(left, right) {
	  return left.setQueryParameters({
	    numericRefinements: _objectSpread$k(_objectSpread$k({}, left.numericRefinements), right.numericRefinements)
	  });
	};

	var mergeHierarchicalFacetsRefinements = function mergeHierarchicalFacetsRefinements(left, right) {
	  return left.setQueryParameters({
	    hierarchicalFacetsRefinements: _objectSpread$k(_objectSpread$k({}, left.hierarchicalFacetsRefinements), right.hierarchicalFacetsRefinements)
	  });
	};

	var mergeRuleContexts = function mergeRuleContexts(left, right) {
	  var ruleContexts = uniq([].concat(left.ruleContexts).concat(right.ruleContexts).filter(Boolean));

	  if (ruleContexts.length > 0) {
	    return left.setQueryParameters({
	      ruleContexts: ruleContexts
	    });
	  }

	  return left;
	};

	var merge$1 = function merge() {
	  for (var _len = arguments.length, parameters = new Array(_len), _key = 0; _key < _len; _key++) {
	    parameters[_key] = arguments[_key];
	  }

	  return parameters.reduce(function (left, right) {
	    var hierarchicalFacetsRefinementsMerged = mergeHierarchicalFacetsRefinements(left, right);
	    var hierarchicalFacetsMerged = mergeHierarchicalFacets(hierarchicalFacetsRefinementsMerged, right);
	    var tagRefinementsMerged = mergeTagRefinements(hierarchicalFacetsMerged, right);
	    var numericRefinementsMerged = mergeNumericRefinements(tagRefinementsMerged, right);
	    var disjunctiveFacetsRefinementsMerged = mergeDisjunctiveFacetsRefinements(numericRefinementsMerged, right);
	    var facetsExcludesMerged = mergeFacetsExcludes(disjunctiveFacetsRefinementsMerged, right);
	    var facetRefinementsMerged = mergeFacetRefinements(facetsExcludesMerged, right);
	    var disjunctiveFacetsMerged = mergeDisjunctiveFacets(facetRefinementsMerged, right);
	    var ruleContextsMerged = mergeRuleContexts(disjunctiveFacetsMerged, right);
	    var facetsMerged = mergeFacets(ruleContextsMerged, right);
	    return mergeWithRest(facetsMerged, right);
	  });
	};

	var mergeSearchParameters = merge$1;

	var resolveSearchParameters = function resolveSearchParameters(current) {
	  var parent = current.getParent();
	  var states = [current.getHelper().state];

	  while (parent !== null) {
	    states = [parent.getHelper().state].concat(states);
	    parent = parent.getParent();
	  }

	  return states;
	};

	var resolveSearchParameters$1 = resolveSearchParameters;

	var createDocumentationLink = function createDocumentationLink(_ref) {
	  var name = _ref.name,
	      _ref$connector = _ref.connector,
	      connector = _ref$connector === void 0 ? false : _ref$connector;
	  return ['https://www.algolia.com/doc/api-reference/widgets/', name, '/js/', connector ? '#connector' : ''].join('');
	};
	var createDocumentationMessageGenerator = function createDocumentationMessageGenerator() {
	  for (var _len = arguments.length, widgets = new Array(_len), _key = 0; _key < _len; _key++) {
	    widgets[_key] = arguments[_key];
	  }

	  var links = widgets.map(function (widget) {
	    return createDocumentationLink(widget);
	  }).join(', ');
	  return function (message) {
	    return [message, "See documentation: ".concat(links)].filter(Boolean).join('\n\n');
	  };
	};

	function ownKeys$j(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$j(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$j(Object(source), true).forEach(function (key) { _defineProperty$n(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$j(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$n(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function addAbsolutePosition(hits, page, hitsPerPage) {
	  return hits.map(function (hit, idx) {
	    return _objectSpread$j(_objectSpread$j({}, hit), {}, {
	      __position: hitsPerPage * page + idx + 1
	    });
	  });
	}

	function ownKeys$i(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$i(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$i(Object(source), true).forEach(function (key) { _defineProperty$m(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$i(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$m(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function addQueryID(hits, queryID) {
	  if (!queryID) {
	    return hits;
	  }

	  return hits.map(function (hit) {
	    return _objectSpread$i(_objectSpread$i({}, hit), {}, {
	      __queryID: queryID
	    });
	  });
	}

	function serializePayload(payload) {
	  return btoa(encodeURIComponent(JSON.stringify(payload)));
	}
	function deserializePayload(serialized) {
	  return JSON.parse(decodeURIComponent(atob(serialized)));
	}

	function _typeof$4(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$4 = function _typeof(obj) { return typeof obj; }; } else { _typeof$4 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$4(obj); }

	function chunk(arr) {
	  var chunkSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
	  var chunks = [];

	  for (var i = 0; i < Math.ceil(arr.length / chunkSize); i++) {
	    chunks.push(arr.slice(i * chunkSize, (i + 1) * chunkSize));
	  }

	  return chunks;
	}

	var buildPayloads = function buildPayloads(_ref) {
	  var index = _ref.index,
	      widgetType = _ref.widgetType;
	      _ref.methodName;
	      var args = _ref.args;

	  // when there's only one argument, that means it's custom
	  if (args.length === 1 && _typeof$4(args[0]) === 'object') {
	    return [args[0]];
	  }

	  var eventType = args[0];
	  var hits = args[1];
	  var eventName = args[2];

	  if (!hits) {
	    {
	      return [];
	    }
	  }

	  if ((eventType === 'click' || eventType === 'conversion') && !eventName) {
	    {
	      return [];
	    }
	  }

	  var hitsArray = Array.isArray(hits) ? removeEscapedFromHits(hits) : [hits];

	  if (hitsArray.length === 0) {
	    return [];
	  }

	  var queryID = hitsArray[0].__queryID;
	  var hitsChunks = chunk(hitsArray);
	  var objectIDsByChunk = hitsChunks.map(function (batch) {
	    return batch.map(function (hit) {
	      return hit.objectID;
	    });
	  });
	  var positionsByChunk = hitsChunks.map(function (batch) {
	    return batch.map(function (hit) {
	      return hit.__position;
	    });
	  });

	  if (eventType === 'view') {
	    return hitsChunks.map(function (batch, i) {
	      return {
	        insightsMethod: 'viewedObjectIDs',
	        widgetType: widgetType,
	        eventType: eventType,
	        payload: {
	          eventName: eventName || 'Hits Viewed',
	          index: index,
	          objectIDs: objectIDsByChunk[i]
	        },
	        hits: batch
	      };
	    });
	  } else if (eventType === 'click') {
	    return hitsChunks.map(function (batch, i) {
	      return {
	        insightsMethod: 'clickedObjectIDsAfterSearch',
	        widgetType: widgetType,
	        eventType: eventType,
	        payload: {
	          eventName: eventName,
	          index: index,
	          queryID: queryID,
	          objectIDs: objectIDsByChunk[i],
	          positions: positionsByChunk[i]
	        },
	        hits: batch
	      };
	    });
	  } else if (eventType === 'conversion') {
	    return hitsChunks.map(function (batch, i) {
	      return {
	        insightsMethod: 'convertedObjectIDsAfterSearch',
	        widgetType: widgetType,
	        eventType: eventType,
	        payload: {
	          eventName: eventName,
	          index: index,
	          queryID: queryID,
	          objectIDs: objectIDsByChunk[i]
	        },
	        hits: batch
	      };
	    });
	  } else {
	    return [];
	  }
	};

	function removeEscapedFromHits(hits) {
	  // remove `hits.__escaped` without mutating
	  return hits.slice();
	}

	function createSendEventForHits(_ref2) {
	  var instantSearchInstance = _ref2.instantSearchInstance,
	      index = _ref2.index,
	      widgetType = _ref2.widgetType;

	  var sendEventForHits = function sendEventForHits() {
	    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    var payloads = buildPayloads({
	      widgetType: widgetType,
	      index: index,
	      methodName: 'sendEvent',
	      args: args
	    });
	    payloads.forEach(function (payload) {
	      return instantSearchInstance.sendEventToInsights(payload);
	    });
	  };

	  return sendEventForHits;
	}
	function createBindEventForHits(_ref3) {
	  var index = _ref3.index,
	      widgetType = _ref3.widgetType;

	  var bindEventForHits = function bindEventForHits() {
	    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      args[_key2] = arguments[_key2];
	    }

	    var payloads = buildPayloads({
	      widgetType: widgetType,
	      index: index,
	      methodName: 'bindEvent',
	      args: args
	    });
	    return payloads.length ? "data-insights-event=".concat(serializePayload(payloads)) : '';
	  };

	  return bindEventForHits;
	}

	// eslint-disable-next-line no-restricted-globals

	/**
	 * Runs code on browser enviromnents safely.
	 */
	function safelyRunOnBrowser(callback) {
	  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
	    fallback: function fallback() {
	      return undefined;
	    }
	  },
	      fallback = _ref.fallback;

	  // eslint-disable-next-line no-restricted-globals
	  if (typeof window === 'undefined') {
	    return fallback();
	  } // eslint-disable-next-line no-restricted-globals


	  return callback({
	    window: window
	  });
	}

	function ownKeys$h(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$h(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$h(Object(source), true).forEach(function (key) { _defineProperty$l(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$h(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$l(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _toConsumableArray$1(arr) { return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread$1(); }

	function _nonIterableSpread$1() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

	function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

	function _iterableToArray$1(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

	function _arrayWithoutHoles$1(arr) { if (Array.isArray(arr)) return _arrayLikeToArray$1(arr); }

	function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

	function _objectWithoutProperties$5(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$5(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

	function _objectWithoutPropertiesLoose$5(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
	var withUsage$a = createDocumentationMessageGenerator({
	  name: 'index-widget'
	});
	function isIndexWidget(widget) {
	  return widget.$$type === 'ais.index';
	}
	/**
	 * This is the same content as helper._change / setState, but allowing for extra
	 * UiState to be synchronized.
	 * see: https://github.com/algolia/algoliasearch-helper-js/blob/6b835ffd07742f2d6b314022cce6848f5cfecd4a/src/algoliasearch.helper.js#L1311-L1324
	 */

	function privateHelperSetState(helper, _ref) {
	  var state = _ref.state,
	      isPageReset = _ref.isPageReset,
	      _uiState = _ref._uiState;

	  if (state !== helper.state) {
	    helper.state = state;
	    helper.emit('change', {
	      state: helper.state,
	      results: helper.lastResults,
	      isPageReset: isPageReset,
	      _uiState: _uiState
	    });
	  }
	}

	function getLocalWidgetsUiState(widgets, widgetStateOptions) {
	  var initialUiState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	  return widgets.reduce(function (uiState, widget) {
	    if (isIndexWidget(widget)) {
	      return uiState;
	    }

	    if (!widget.getWidgetUiState && !widget.getWidgetState) {
	      return uiState;
	    }

	    if (widget.getWidgetUiState) {
	      return widget.getWidgetUiState(uiState, widgetStateOptions);
	    }

	    return widget.getWidgetState(uiState, widgetStateOptions);
	  }, initialUiState);
	}

	function getLocalWidgetsSearchParameters(widgets, widgetSearchParametersOptions) {
	  var initialSearchParameters = widgetSearchParametersOptions.initialSearchParameters,
	      rest = _objectWithoutProperties$5(widgetSearchParametersOptions, ["initialSearchParameters"]);

	  return widgets.filter(function (widget) {
	    return !isIndexWidget(widget);
	  }).reduce(function (state, widget) {
	    if (!widget.getWidgetSearchParameters) {
	      return state;
	    }

	    return widget.getWidgetSearchParameters(state, rest);
	  }, initialSearchParameters);
	}

	function resetPageFromWidgets(widgets) {
	  var indexWidgets = widgets.filter(isIndexWidget);

	  if (indexWidgets.length === 0) {
	    return;
	  }

	  indexWidgets.forEach(function (widget) {
	    var widgetHelper = widget.getHelper();
	    privateHelperSetState(widgetHelper, {
	      state: widgetHelper.state.resetPage(),
	      isPageReset: true
	    });
	    resetPageFromWidgets(widget.getWidgets());
	  });
	}

	function resolveScopedResultsFromWidgets(widgets) {
	  var indexWidgets = widgets.filter(isIndexWidget);
	  return indexWidgets.reduce(function (scopedResults, current) {
	    return scopedResults.concat.apply(scopedResults, [{
	      indexId: current.getIndexId(),
	      results: current.getResults(),
	      helper: current.getHelper()
	    }].concat(_toConsumableArray$1(resolveScopedResultsFromWidgets(current.getWidgets()))));
	  }, []);
	}

	var index = function index(widgetParams) {
	  if (widgetParams === undefined || widgetParams.indexName === undefined) {
	    throw new Error(withUsage$a('The `indexName` option is required.'));
	  }

	  var indexName = widgetParams.indexName,
	      _widgetParams$indexId = widgetParams.indexId,
	      indexId = _widgetParams$indexId === void 0 ? indexName : _widgetParams$indexId;
	  var localWidgets = [];
	  var localUiState = {};
	  var localInstantSearchInstance = null;
	  var localParent = null;
	  var helper = null;
	  var derivedHelper = null;
	  return {
	    $$type: 'ais.index',
	    $$widgetType: 'ais.index',
	    getIndexName: function getIndexName() {
	      return indexName;
	    },
	    getIndexId: function getIndexId() {
	      return indexId;
	    },
	    getHelper: function getHelper() {
	      return helper;
	    },
	    getResults: function getResults() {
	      return derivedHelper && derivedHelper.lastResults;
	    },
	    getScopedResults: function getScopedResults() {
	      var widgetParent = this.getParent(); // If the widget is the root, we consider itself as the only sibling.

	      var widgetSiblings = widgetParent ? widgetParent.getWidgets() : [this];
	      return resolveScopedResultsFromWidgets(widgetSiblings);
	    },
	    getParent: function getParent() {
	      return localParent;
	    },
	    createURL: function createURL(nextState) {
	      return localInstantSearchInstance._createURL(_defineProperty$l({}, indexId, getLocalWidgetsUiState(localWidgets, {
	        searchParameters: nextState,
	        helper: helper
	      })));
	    },
	    getWidgets: function getWidgets() {
	      return localWidgets;
	    },
	    addWidgets: function addWidgets(widgets) {
	      var _this = this;

	      if (!Array.isArray(widgets)) {
	        throw new Error(withUsage$a('The `addWidgets` method expects an array of widgets.'));
	      }

	      if (widgets.some(function (widget) {
	        return typeof widget.init !== 'function' && typeof widget.render !== 'function';
	      })) {
	        throw new Error(withUsage$a('The widget definition expects a `render` and/or an `init` method.'));
	      }

	      localWidgets = localWidgets.concat(widgets);

	      if (localInstantSearchInstance && Boolean(widgets.length)) {
	        privateHelperSetState(helper, {
	          state: getLocalWidgetsSearchParameters(localWidgets, {
	            uiState: localUiState,
	            initialSearchParameters: helper.state
	          }),
	          _uiState: localUiState
	        }); // We compute the render state before calling `init` in a separate loop
	        // to construct the whole render state object that is then passed to
	        // `init`.

	        widgets.forEach(function (widget) {
	          if (widget.getRenderState) {
	            var renderState = widget.getRenderState(localInstantSearchInstance.renderState[_this.getIndexId()] || {}, {
	              uiState: localInstantSearchInstance._initialUiState,
	              helper: _this.getHelper(),
	              parent: _this,
	              instantSearchInstance: localInstantSearchInstance,
	              state: helper.state,
	              renderState: localInstantSearchInstance.renderState,
	              templatesConfig: localInstantSearchInstance.templatesConfig,
	              createURL: _this.createURL,
	              scopedResults: [],
	              searchMetadata: {
	                isSearchStalled: localInstantSearchInstance._isSearchStalled
	              }
	            });
	            storeRenderState({
	              renderState: renderState,
	              instantSearchInstance: localInstantSearchInstance,
	              parent: _this
	            });
	          }
	        });
	        widgets.forEach(function (widget) {
	          if (widget.init) {
	            widget.init({
	              helper: helper,
	              parent: _this,
	              uiState: localInstantSearchInstance._initialUiState,
	              instantSearchInstance: localInstantSearchInstance,
	              state: helper.state,
	              renderState: localInstantSearchInstance.renderState,
	              templatesConfig: localInstantSearchInstance.templatesConfig,
	              createURL: _this.createURL,
	              scopedResults: [],
	              searchMetadata: {
	                isSearchStalled: localInstantSearchInstance._isSearchStalled
	              }
	            });
	          }
	        });
	        localInstantSearchInstance.scheduleSearch();
	      }

	      return this;
	    },
	    removeWidgets: function removeWidgets(widgets) {
	      var _this2 = this;

	      if (!Array.isArray(widgets)) {
	        throw new Error(withUsage$a('The `removeWidgets` method expects an array of widgets.'));
	      }

	      if (widgets.some(function (widget) {
	        return typeof widget.dispose !== 'function';
	      })) {
	        throw new Error(withUsage$a('The widget definition expects a `dispose` method.'));
	      }

	      localWidgets = localWidgets.filter(function (widget) {
	        return widgets.indexOf(widget) === -1;
	      });

	      if (localInstantSearchInstance && Boolean(widgets.length)) {
	        var nextState = widgets.reduce(function (state, widget) {
	          // the `dispose` method exists at this point we already assert it
	          var next = widget.dispose({
	            helper: helper,
	            state: state,
	            parent: _this2
	          });
	          return next || state;
	        }, helper.state);
	        localUiState = getLocalWidgetsUiState(localWidgets, {
	          searchParameters: nextState,
	          helper: helper
	        });
	        helper.setState(getLocalWidgetsSearchParameters(localWidgets, {
	          uiState: localUiState,
	          initialSearchParameters: nextState
	        }));

	        if (localWidgets.length) {
	          localInstantSearchInstance.scheduleSearch();
	        }
	      }

	      return this;
	    },
	    init: function init(_ref2) {
	      var _this3 = this,
	          _instantSearchInstanc;

	      var instantSearchInstance = _ref2.instantSearchInstance,
	          parent = _ref2.parent,
	          uiState = _ref2.uiState;

	      if (helper !== null) {
	        // helper is already initialized, therefore we do not need to set up
	        // any listeners
	        return;
	      }

	      localInstantSearchInstance = instantSearchInstance;
	      localParent = parent;
	      localUiState = uiState[indexId] || {}; // The `mainHelper` is already defined at this point. The instance is created
	      // inside InstantSearch at the `start` method, which occurs before the `init`
	      // step.

	      var mainHelper = instantSearchInstance.mainHelper;
	      var parameters = getLocalWidgetsSearchParameters(localWidgets, {
	        uiState: localUiState,
	        initialSearchParameters: new algoliasearchHelper_1.SearchParameters({
	          index: indexName
	        })
	      }); // This Helper is only used for state management we do not care about the
	      // `searchClient`. Only the "main" Helper created at the `InstantSearch`
	      // level is aware of the client.

	      helper = algoliasearchHelper_1({}, parameters.index, parameters); // We forward the call to `search` to the "main" instance of the Helper
	      // which is responsible for managing the queries (it's the only one that is
	      // aware of the `searchClient`).

	      helper.search = function () {
	        if (instantSearchInstance.onStateChange) {
	          instantSearchInstance.onStateChange({
	            uiState: instantSearchInstance.mainIndex.getWidgetUiState({}),
	            setUiState: instantSearchInstance.setUiState.bind(instantSearchInstance)
	          }); // We don't trigger a search when controlled because it becomes the
	          // responsibility of `setUiState`.

	          return mainHelper;
	        }

	        return mainHelper.search();
	      };

	      helper.searchWithoutTriggeringOnStateChange = function () {
	        return mainHelper.search();
	      }; // We use the same pattern for the `searchForFacetValues`.


	      helper.searchForFacetValues = function (facetName, facetValue, maxFacetHits, userState) {
	        var state = helper.state.setQueryParameters(userState);
	        return mainHelper.searchForFacetValues(facetName, facetValue, maxFacetHits, state);
	      };

	      derivedHelper = mainHelper.derive(function () {
	        return mergeSearchParameters.apply(void 0, _toConsumableArray$1(resolveSearchParameters$1(_this3)));
	      });
	      var indexInitialResults = (_instantSearchInstanc = instantSearchInstance._initialResults) === null || _instantSearchInstanc === void 0 ? void 0 : _instantSearchInstanc[this.getIndexId()];

	      if (indexInitialResults) {
	        // We restore the shape of the results provided to the instance to respect
	        // the helper's structure.
	        var results = new algoliasearchHelper_1.SearchResults(new algoliasearchHelper_1.SearchParameters(indexInitialResults.state), indexInitialResults.results);
	        derivedHelper.lastResults = results;
	        helper.lastResults = results;
	      } // Subscribe to the Helper state changes for the page before widgets
	      // are initialized. This behavior mimics the original one of the Helper.
	      // It makes sense to replicate it at the `init` step. We have another
	      // listener on `change` below, once `init` is done.


	      helper.on('change', function (_ref3) {
	        var isPageReset = _ref3.isPageReset;

	        if (isPageReset) {
	          resetPageFromWidgets(localWidgets);
	        }
	      });
	      derivedHelper.on('search', function () {
	        // The index does not manage the "staleness" of the search. This is the
	        // responsibility of the main instance. It does not make sense to manage
	        // it at the index level because it's either: all of them or none of them
	        // that are stalled. The queries are performed into a single network request.
	        instantSearchInstance.scheduleStalledRender();
	      });
	      derivedHelper.on('result', function (_ref4) {
	        var results = _ref4.results;
	        // The index does not render the results it schedules a new render
	        // to let all the other indices emit their own results. It allows us to
	        // run the render process in one pass.
	        instantSearchInstance.scheduleRender(); // the derived helper is the one which actually searches, but the helper
	        // which is exposed e.g. via instance.helper, doesn't search, and thus
	        // does not have access to lastResults, which it used to in pre-federated
	        // search behavior.

	        helper.lastResults = results;
	      }); // We compute the render state before calling `init` in a separate loop
	      // to construct the whole render state object that is then passed to
	      // `init`.

	      localWidgets.forEach(function (widget) {
	        if (widget.getRenderState) {
	          var renderState = widget.getRenderState(instantSearchInstance.renderState[_this3.getIndexId()] || {}, {
	            uiState: uiState,
	            helper: helper,
	            parent: _this3,
	            instantSearchInstance: instantSearchInstance,
	            state: helper.state,
	            renderState: instantSearchInstance.renderState,
	            templatesConfig: instantSearchInstance.templatesConfig,
	            createURL: _this3.createURL,
	            scopedResults: [],
	            searchMetadata: {
	              isSearchStalled: instantSearchInstance._isSearchStalled
	            }
	          });
	          storeRenderState({
	            renderState: renderState,
	            instantSearchInstance: instantSearchInstance,
	            parent: _this3
	          });
	        }
	      });
	      localWidgets.forEach(function (widget) {

	        if (widget.init) {
	          widget.init({
	            uiState: uiState,
	            helper: helper,
	            parent: _this3,
	            instantSearchInstance: instantSearchInstance,
	            state: helper.state,
	            renderState: instantSearchInstance.renderState,
	            templatesConfig: instantSearchInstance.templatesConfig,
	            createURL: _this3.createURL,
	            scopedResults: [],
	            searchMetadata: {
	              isSearchStalled: instantSearchInstance._isSearchStalled
	            }
	          });
	        }
	      }); // Subscribe to the Helper state changes for the `uiState` once widgets
	      // are initialized. Until the first render, state changes are part of the
	      // configuration step. This is mainly for backward compatibility with custom
	      // widgets. When the subscription happens before the `init` step, the (static)
	      // configuration of the widget is pushed in the URL. That's what we want to avoid.
	      // https://github.com/algolia/instantsearch.js/pull/994/commits/4a672ae3fd78809e213de0368549ef12e9dc9454

	      helper.on('change', function (event) {
	        var state = event.state;
	        var _uiState = event._uiState;
	        localUiState = getLocalWidgetsUiState(localWidgets, {
	          searchParameters: state,
	          helper: helper
	        }, _uiState || {}); // We don't trigger an internal change when controlled because it
	        // becomes the responsibility of `setUiState`.

	        if (!instantSearchInstance.onStateChange) {
	          instantSearchInstance.onInternalStateChange();
	        }
	      });

	      if (indexInitialResults) {
	        // If there are initial results, we're not notified of the next results
	        // because we don't trigger an initial search. We therefore need to directly
	        // schedule a render that will render the results injected on the helper.
	        instantSearchInstance.scheduleRender();
	      }
	    },
	    render: function render(_ref5) {
	      var _this4 = this;

	      var instantSearchInstance = _ref5.instantSearchInstance;

	      if (!this.getResults()) {
	        return;
	      }

	      localWidgets.forEach(function (widget) {
	        if (widget.getRenderState) {
	          var renderState = widget.getRenderState(instantSearchInstance.renderState[_this4.getIndexId()] || {}, {
	            helper: _this4.getHelper(),
	            parent: _this4,
	            instantSearchInstance: instantSearchInstance,
	            results: _this4.getResults(),
	            scopedResults: _this4.getScopedResults(),
	            state: _this4.getResults()._state,
	            renderState: instantSearchInstance.renderState,
	            templatesConfig: instantSearchInstance.templatesConfig,
	            createURL: _this4.createURL,
	            searchMetadata: {
	              isSearchStalled: instantSearchInstance._isSearchStalled
	            }
	          });
	          storeRenderState({
	            renderState: renderState,
	            instantSearchInstance: instantSearchInstance,
	            parent: _this4
	          });
	        }
	      });
	      localWidgets.forEach(function (widget) {
	        // At this point, all the variables used below are set. Both `helper`
	        // and `derivedHelper` have been created at the `init` step. The attribute
	        // `lastResults` might be `null` though. It's possible that a stalled render
	        // happens before the result e.g with a dynamically added index the request might
	        // be delayed. The render is triggered for the complete tree but some parts do
	        // not have results yet.
	        if (widget.render) {
	          widget.render({
	            helper: helper,
	            parent: _this4,
	            instantSearchInstance: instantSearchInstance,
	            results: _this4.getResults(),
	            scopedResults: _this4.getScopedResults(),
	            state: _this4.getResults()._state,
	            renderState: instantSearchInstance.renderState,
	            templatesConfig: instantSearchInstance.templatesConfig,
	            createURL: _this4.createURL,
	            searchMetadata: {
	              isSearchStalled: instantSearchInstance._isSearchStalled
	            }
	          });
	        }
	      });
	    },
	    dispose: function dispose() {
	      var _this5 = this;

	      localWidgets.forEach(function (widget) {
	        if (widget.dispose) {
	          // The dispose function is always called once the instance is started
	          // (it's an effect of `removeWidgets`). The index is initialized and
	          // the Helper is available. We don't care about the return value of
	          // `dispose` because the index is removed. We can't call `removeWidgets`
	          // because we want to keep the widgets on the instance, to allow idempotent
	          // operations on `add` & `remove`.
	          widget.dispose({
	            helper: helper,
	            state: helper.state,
	            parent: _this5
	          });
	        }
	      });
	      localInstantSearchInstance = null;
	      localParent = null;
	      helper.removeAllListeners();
	      helper = null;
	      derivedHelper.detach();
	      derivedHelper = null;
	    },
	    getWidgetUiState: function getWidgetUiState(uiState) {
	      return localWidgets.filter(isIndexWidget).reduce(function (previousUiState, innerIndex) {
	        return innerIndex.getWidgetUiState(previousUiState);
	      }, _objectSpread$h(_objectSpread$h({}, uiState), {}, _defineProperty$l({}, this.getIndexId(), localUiState)));
	    },
	    getWidgetState: function getWidgetState(uiState) {
	      return this.getWidgetUiState(uiState);
	    },
	    getWidgetSearchParameters: function getWidgetSearchParameters(searchParameters, _ref6) {
	      var uiState = _ref6.uiState;
	      return getLocalWidgetsSearchParameters(localWidgets, {
	        uiState: uiState,
	        initialSearchParameters: searchParameters
	      });
	    },
	    refreshUiState: function refreshUiState() {
	      localUiState = getLocalWidgetsUiState(localWidgets, {
	        searchParameters: this.getHelper().state,
	        helper: this.getHelper()
	      }, localUiState);
	    }
	  };
	};

	var index$1 = index;

	function storeRenderState(_ref7) {
	  var renderState = _ref7.renderState,
	      instantSearchInstance = _ref7.instantSearchInstance,
	      parent = _ref7.parent;
	  var parentIndexName = parent ? parent.getIndexId() : instantSearchInstance.mainIndex.getIndexId();
	  instantSearchInstance.renderState = _objectSpread$h(_objectSpread$h({}, instantSearchInstance.renderState), {}, _defineProperty$l({}, parentIndexName, _objectSpread$h(_objectSpread$h({}, instantSearchInstance.renderState[parentIndexName]), renderState)));
	}

	var version = '4.40.3';

	var NAMESPACE = 'ais';
	var component = function component(componentName) {
	  return function () {
	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        descendantName = _ref.descendantName,
	        modifierName = _ref.modifierName;

	    var descendent = descendantName ? "-".concat(descendantName) : '';
	    var modifier = modifierName ? "--".concat(modifierName) : '';
	    return "".concat(NAMESPACE, "-").concat(componentName).concat(descendent).concat(modifier);
	  };
	};

	var suit$7 = component('Highlight');
	function highlight(_ref) {
	  var attribute = _ref.attribute,
	      _ref$highlightedTagNa = _ref.highlightedTagName,
	      highlightedTagName = _ref$highlightedTagNa === void 0 ? 'mark' : _ref$highlightedTagNa,
	      hit = _ref.hit,
	      _ref$cssClasses = _ref.cssClasses,
	      cssClasses = _ref$cssClasses === void 0 ? {} : _ref$cssClasses;
	  var highlightAttributeResult = getPropertyByPath(hit._highlightResult, attribute); // @MAJOR fallback to attribute value if highlight is not found

	  var _ref2 = highlightAttributeResult || {},
	      _ref2$value = _ref2.value,
	      attributeValue = _ref2$value === void 0 ? '' : _ref2$value; // cx is not used, since it would be bundled as a dependency for Vue & Angular


	  var className = suit$7({
	    descendantName: 'highlighted'
	  }) + (cssClasses.highlighted ? " ".concat(cssClasses.highlighted) : '');
	  return attributeValue.replace(new RegExp(TAG_REPLACEMENT.highlightPreTag, 'g'), "<".concat(highlightedTagName, " class=\"").concat(className, "\">")).replace(new RegExp(TAG_REPLACEMENT.highlightPostTag, 'g'), "</".concat(highlightedTagName, ">"));
	}

	var suit$6 = component('ReverseHighlight');
	function reverseHighlight(_ref) {
	  var attribute = _ref.attribute,
	      _ref$highlightedTagNa = _ref.highlightedTagName,
	      highlightedTagName = _ref$highlightedTagNa === void 0 ? 'mark' : _ref$highlightedTagNa,
	      hit = _ref.hit,
	      _ref$cssClasses = _ref.cssClasses,
	      cssClasses = _ref$cssClasses === void 0 ? {} : _ref$cssClasses;
	  var highlightAttributeResult = getPropertyByPath(hit._highlightResult, attribute); // @MAJOR fallback to attribute value if highlight is not found

	  var _ref2 = highlightAttributeResult || {},
	      _ref2$value = _ref2.value,
	      attributeValue = _ref2$value === void 0 ? '' : _ref2$value; // cx is not used, since it would be bundled as a dependency for Vue & Angular


	  var className = suit$6({
	    descendantName: 'highlighted'
	  }) + (cssClasses.highlighted ? " ".concat(cssClasses.highlighted) : '');
	  var reverseHighlightedValue = concatHighlightedParts(reverseHighlightedParts(getHighlightedParts(attributeValue)));
	  return reverseHighlightedValue.replace(new RegExp(TAG_REPLACEMENT.highlightPreTag, 'g'), "<".concat(highlightedTagName, " class=\"").concat(className, "\">")).replace(new RegExp(TAG_REPLACEMENT.highlightPostTag, 'g'), "</".concat(highlightedTagName, ">"));
	}

	var suit$5 = component('Snippet');
	function snippet(_ref) {
	  var attribute = _ref.attribute,
	      _ref$highlightedTagNa = _ref.highlightedTagName,
	      highlightedTagName = _ref$highlightedTagNa === void 0 ? 'mark' : _ref$highlightedTagNa,
	      hit = _ref.hit,
	      _ref$cssClasses = _ref.cssClasses,
	      cssClasses = _ref$cssClasses === void 0 ? {} : _ref$cssClasses;
	  var snippetAttributeResult = getPropertyByPath(hit._snippetResult, attribute); // @MAJOR fallback to attribute value if snippet is not found

	  var _ref2 = snippetAttributeResult || {},
	      _ref2$value = _ref2.value,
	      attributeValue = _ref2$value === void 0 ? '' : _ref2$value; // cx is not used, since it would be bundled as a dependency for Vue & Angular


	  var className = suit$5({
	    descendantName: 'highlighted'
	  }) + (cssClasses.highlighted ? " ".concat(cssClasses.highlighted) : '');
	  return attributeValue.replace(new RegExp(TAG_REPLACEMENT.highlightPreTag, 'g'), "<".concat(highlightedTagName, " class=\"").concat(className, "\">")).replace(new RegExp(TAG_REPLACEMENT.highlightPostTag, 'g'), "</".concat(highlightedTagName, ">"));
	}

	var suit$4 = component('ReverseSnippet');
	function reverseSnippet(_ref) {
	  var attribute = _ref.attribute,
	      _ref$highlightedTagNa = _ref.highlightedTagName,
	      highlightedTagName = _ref$highlightedTagNa === void 0 ? 'mark' : _ref$highlightedTagNa,
	      hit = _ref.hit,
	      _ref$cssClasses = _ref.cssClasses,
	      cssClasses = _ref$cssClasses === void 0 ? {} : _ref$cssClasses;
	  var snippetAttributeResult = getPropertyByPath(hit._snippetResult, attribute); // @MAJOR fallback to attribute value if snippet is not found

	  var _ref2 = snippetAttributeResult || {},
	      _ref2$value = _ref2.value,
	      attributeValue = _ref2$value === void 0 ? '' : _ref2$value; // cx is not used, since it would be bundled as a dependency for Vue & Angular


	  var className = suit$4({
	    descendantName: 'highlighted'
	  }) + (cssClasses.highlighted ? " ".concat(cssClasses.highlighted) : '');
	  var reverseHighlightedValue = concatHighlightedParts(reverseHighlightedParts(getHighlightedParts(attributeValue)));
	  return reverseHighlightedValue.replace(new RegExp(TAG_REPLACEMENT.highlightPreTag, 'g'), "<".concat(highlightedTagName, " class=\"").concat(className, "\">")).replace(new RegExp(TAG_REPLACEMENT.highlightPostTag, 'g'), "</".concat(highlightedTagName, ">"));
	}

	function _typeof$3(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$3 = function _typeof(obj) { return typeof obj; }; } else { _typeof$3 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$3(obj); }
	function readDataAttributes(domElement) {
	  var method = domElement.getAttribute('data-insights-method');
	  var serializedPayload = domElement.getAttribute('data-insights-payload');

	  if (typeof serializedPayload !== 'string') {
	    throw new Error('The insights helper expects `data-insights-payload` to be a base64-encoded JSON string.');
	  }

	  try {
	    var payload = deserializePayload(serializedPayload);
	    return {
	      method: method,
	      payload: payload
	    };
	  } catch (error) {
	    throw new Error('The insights helper was unable to parse `data-insights-payload`.');
	  }
	}
	function hasDataAttributes(domElement) {
	  return domElement.hasAttribute('data-insights-method');
	}
	function writeDataAttributes(_ref) {
	  var method = _ref.method,
	      payload = _ref.payload;

	  if (_typeof$3(payload) !== 'object') {
	    throw new Error("The insights helper expects the payload to be an object.");
	  }

	  var serializedPayload;

	  try {
	    serializedPayload = serializePayload(payload);
	  } catch (error) {
	    throw new Error("Could not JSON serialize the payload object.");
	  }

	  return "data-insights-method=\"".concat(method, "\" data-insights-payload=\"").concat(serializedPayload, "\"");
	}
	/**
	 * @deprecated This function will be still supported in 4.x releases, but not further. It is replaced by the `insights` middleware. For more information, visit https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-through-and-conversions/how-to/send-click-and-conversion-events-with-instantsearch/js/
	 */

	function insights(method, payload) {
	  return writeDataAttributes({
	    method: method,
	    payload: payload
	  });
	}

	var ANONYMOUS_TOKEN_COOKIE_KEY = '_ALGOLIA';

	function getCookie(name) {
	  var prefix = "".concat(name, "=");
	  var cookies = document.cookie.split(';');

	  for (var i = 0; i < cookies.length; i++) {
	    var cookie = cookies[i];

	    while (cookie.charAt(0) === ' ') {
	      cookie = cookie.substring(1);
	    }

	    if (cookie.indexOf(prefix) === 0) {
	      return cookie.substring(prefix.length, cookie.length);
	    }
	  }

	  return undefined;
	}

	function getInsightsAnonymousUserTokenInternal() {
	  return getCookie(ANONYMOUS_TOKEN_COOKIE_KEY);
	}
	/**
	 * @deprecated This function will be still supported in 4.x releases, but not further. It is replaced by the `insights` middleware. For more information, visit https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-through-and-conversions/how-to/send-click-and-conversion-events-with-instantsearch/js/
	 */

	function getInsightsAnonymousUserToken() {
	  return getInsightsAnonymousUserTokenInternal();
	}

	function ownKeys$g(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$g(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$g(Object(source), true).forEach(function (key) { _defineProperty$k(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$g(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$k(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	function hoganHelpers(_ref) {
	  var numberLocale = _ref.numberLocale;
	  return {
	    formatNumber: function formatNumber(value, render) {
	      return Number(render(value)).toLocaleString(numberLocale);
	    },
	    highlight: function highlight$1(options, render) {
	      try {
	        var highlightOptions = JSON.parse(options);
	        return render(highlight(_objectSpread$g(_objectSpread$g({}, highlightOptions), {}, {
	          hit: this
	        })));
	      } catch (error) {
	        throw new Error("\nThe highlight helper expects a JSON object of the format:\n{ \"attribute\": \"name\", \"highlightedTagName\": \"mark\" }");
	      }
	    },
	    reverseHighlight: function reverseHighlight$1(options, render) {
	      try {
	        var reverseHighlightOptions = JSON.parse(options);
	        return render(reverseHighlight(_objectSpread$g(_objectSpread$g({}, reverseHighlightOptions), {}, {
	          hit: this
	        })));
	      } catch (error) {
	        throw new Error("\n  The reverseHighlight helper expects a JSON object of the format:\n  { \"attribute\": \"name\", \"highlightedTagName\": \"mark\" }");
	      }
	    },
	    snippet: function snippet$1(options, render) {
	      try {
	        var snippetOptions = JSON.parse(options);
	        return render(snippet(_objectSpread$g(_objectSpread$g({}, snippetOptions), {}, {
	          hit: this
	        })));
	      } catch (error) {
	        throw new Error("\nThe snippet helper expects a JSON object of the format:\n{ \"attribute\": \"name\", \"highlightedTagName\": \"mark\" }");
	      }
	    },
	    reverseSnippet: function reverseSnippet$1(options, render) {
	      try {
	        var reverseSnippetOptions = JSON.parse(options);
	        return render(reverseSnippet(_objectSpread$g(_objectSpread$g({}, reverseSnippetOptions), {}, {
	          hit: this
	        })));
	      } catch (error) {
	        throw new Error("\n  The reverseSnippet helper expects a JSON object of the format:\n  { \"attribute\": \"name\", \"highlightedTagName\": \"mark\" }");
	      }
	    },
	    insights: function insights$1(options, render) {
	      try {
	        var _JSON$parse = JSON.parse(options),
	            method = _JSON$parse.method,
	            payload = _JSON$parse.payload;

	        return render(insights(method, _objectSpread$g({
	          objectIDs: [this.objectID]
	        }, payload)));
	      } catch (error) {
	        throw new Error("\nThe insights helper expects a JSON object of the format:\n{ \"method\": \"method-name\", \"payload\": { \"eventName\": \"name of the event\" } }");
	      }
	    }
	  };
	}

	function ownKeys$f(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$f(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$f(Object(source), true).forEach(function (key) { _defineProperty$j(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$f(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$j(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _objectWithoutProperties$4(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$4(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

	function _objectWithoutPropertiesLoose$4(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

	function getIndexStateWithoutConfigure$1(uiState) {
	  uiState.configure;
	      var trackedUiState = _objectWithoutProperties$4(uiState, ["configure"]);

	  return trackedUiState;
	} // technically a URL could contain any key, since users provide it,
	// which is why the input to this function is UiState, not something
	// which excludes "configure" as this function does.


	function simpleStateMapping() {
	  return {
	    stateToRoute: function stateToRoute(uiState) {
	      return Object.keys(uiState).reduce(function (state, indexId) {
	        return _objectSpread$f(_objectSpread$f({}, state), {}, _defineProperty$j({}, indexId, getIndexStateWithoutConfigure$1(uiState[indexId])));
	      }, {});
	    },
	    routeToState: function routeToState() {
	      var routeState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      return Object.keys(routeState).reduce(function (state, indexId) {
	        return _objectSpread$f(_objectSpread$f({}, state), {}, _defineProperty$j({}, indexId, getIndexStateWithoutConfigure$1(routeState[indexId])));
	      }, {});
	    }
	  };
	}

	var replace = String.prototype.replace;
	var percentTwenties = /%20/g;

	var Format = {
	    RFC1738: 'RFC1738',
	    RFC3986: 'RFC3986'
	};

	var formats$3 = {
	    'default': Format.RFC3986,
	    formatters: {
	        RFC1738: function (value) {
	            return replace.call(value, percentTwenties, '+');
	        },
	        RFC3986: function (value) {
	            return String(value);
	        }
	    },
	    RFC1738: Format.RFC1738,
	    RFC3986: Format.RFC3986
	};

	var formats$2 = formats$3;

	var has$2 = Object.prototype.hasOwnProperty;
	var isArray$2 = Array.isArray;

	var hexTable = (function () {
	    var array = [];
	    for (var i = 0; i < 256; ++i) {
	        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
	    }

	    return array;
	}());

	var compactQueue = function compactQueue(queue) {
	    while (queue.length > 1) {
	        var item = queue.pop();
	        var obj = item.obj[item.prop];

	        if (isArray$2(obj)) {
	            var compacted = [];

	            for (var j = 0; j < obj.length; ++j) {
	                if (typeof obj[j] !== 'undefined') {
	                    compacted.push(obj[j]);
	                }
	            }

	            item.obj[item.prop] = compacted;
	        }
	    }
	};

	var arrayToObject = function arrayToObject(source, options) {
	    var obj = options && options.plainObjects ? Object.create(null) : {};
	    for (var i = 0; i < source.length; ++i) {
	        if (typeof source[i] !== 'undefined') {
	            obj[i] = source[i];
	        }
	    }

	    return obj;
	};

	var merge = function merge(target, source, options) {
	    /* eslint no-param-reassign: 0 */
	    if (!source) {
	        return target;
	    }

	    if (typeof source !== 'object') {
	        if (isArray$2(target)) {
	            target.push(source);
	        } else if (target && typeof target === 'object') {
	            if ((options && (options.plainObjects || options.allowPrototypes)) || !has$2.call(Object.prototype, source)) {
	                target[source] = true;
	            }
	        } else {
	            return [target, source];
	        }

	        return target;
	    }

	    if (!target || typeof target !== 'object') {
	        return [target].concat(source);
	    }

	    var mergeTarget = target;
	    if (isArray$2(target) && !isArray$2(source)) {
	        mergeTarget = arrayToObject(target, options);
	    }

	    if (isArray$2(target) && isArray$2(source)) {
	        source.forEach(function (item, i) {
	            if (has$2.call(target, i)) {
	                var targetItem = target[i];
	                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
	                    target[i] = merge(targetItem, item, options);
	                } else {
	                    target.push(item);
	                }
	            } else {
	                target[i] = item;
	            }
	        });
	        return target;
	    }

	    return Object.keys(source).reduce(function (acc, key) {
	        var value = source[key];

	        if (has$2.call(acc, key)) {
	            acc[key] = merge(acc[key], value, options);
	        } else {
	            acc[key] = value;
	        }
	        return acc;
	    }, mergeTarget);
	};

	var assign = function assignSingleSource(target, source) {
	    return Object.keys(source).reduce(function (acc, key) {
	        acc[key] = source[key];
	        return acc;
	    }, target);
	};

	var decode = function (str, decoder, charset) {
	    var strWithoutPlus = str.replace(/\+/g, ' ');
	    if (charset === 'iso-8859-1') {
	        // unescape never throws, no try...catch needed:
	        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
	    }
	    // utf-8
	    try {
	        return decodeURIComponent(strWithoutPlus);
	    } catch (e) {
	        return strWithoutPlus;
	    }
	};

	var encode = function encode(str, defaultEncoder, charset, kind, format) {
	    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
	    // It has been adapted here for stricter adherence to RFC 3986
	    if (str.length === 0) {
	        return str;
	    }

	    var string = str;
	    if (typeof str === 'symbol') {
	        string = Symbol.prototype.toString.call(str);
	    } else if (typeof str !== 'string') {
	        string = String(str);
	    }

	    if (charset === 'iso-8859-1') {
	        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
	            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
	        });
	    }

	    var out = '';
	    for (var i = 0; i < string.length; ++i) {
	        var c = string.charCodeAt(i);

	        if (
	            c === 0x2D // -
	            || c === 0x2E // .
	            || c === 0x5F // _
	            || c === 0x7E // ~
	            || (c >= 0x30 && c <= 0x39) // 0-9
	            || (c >= 0x41 && c <= 0x5A) // a-z
	            || (c >= 0x61 && c <= 0x7A) // A-Z
	            || (format === formats$2.RFC1738 && (c === 0x28 || c === 0x29)) // ( )
	        ) {
	            out += string.charAt(i);
	            continue;
	        }

	        if (c < 0x80) {
	            out = out + hexTable[c];
	            continue;
	        }

	        if (c < 0x800) {
	            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
	            continue;
	        }

	        if (c < 0xD800 || c >= 0xE000) {
	            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
	            continue;
	        }

	        i += 1;
	        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
	        /* eslint operator-linebreak: [2, "before"] */
	        out += hexTable[0xF0 | (c >> 18)]
	            + hexTable[0x80 | ((c >> 12) & 0x3F)]
	            + hexTable[0x80 | ((c >> 6) & 0x3F)]
	            + hexTable[0x80 | (c & 0x3F)];
	    }

	    return out;
	};

	var compact = function compact(value) {
	    var queue = [{ obj: { o: value }, prop: 'o' }];
	    var refs = [];

	    for (var i = 0; i < queue.length; ++i) {
	        var item = queue[i];
	        var obj = item.obj[item.prop];

	        var keys = Object.keys(obj);
	        for (var j = 0; j < keys.length; ++j) {
	            var key = keys[j];
	            var val = obj[key];
	            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
	                queue.push({ obj: obj, prop: key });
	                refs.push(val);
	            }
	        }
	    }

	    compactQueue(queue);

	    return value;
	};

	var isRegExp = function isRegExp(obj) {
	    return Object.prototype.toString.call(obj) === '[object RegExp]';
	};

	var isBuffer = function isBuffer(obj) {
	    if (!obj || typeof obj !== 'object') {
	        return false;
	    }

	    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
	};

	var combine = function combine(a, b) {
	    return [].concat(a, b);
	};

	var maybeMap = function maybeMap(val, fn) {
	    if (isArray$2(val)) {
	        var mapped = [];
	        for (var i = 0; i < val.length; i += 1) {
	            mapped.push(fn(val[i]));
	        }
	        return mapped;
	    }
	    return fn(val);
	};

	var utils$2 = {
	    arrayToObject: arrayToObject,
	    assign: assign,
	    combine: combine,
	    compact: compact,
	    decode: decode,
	    encode: encode,
	    isBuffer: isBuffer,
	    isRegExp: isRegExp,
	    maybeMap: maybeMap,
	    merge: merge
	};

	var utils$1 = utils$2;
	var formats$1 = formats$3;
	var has$1 = Object.prototype.hasOwnProperty;

	var arrayPrefixGenerators = {
	    brackets: function brackets(prefix) {
	        return prefix + '[]';
	    },
	    comma: 'comma',
	    indices: function indices(prefix, key) {
	        return prefix + '[' + key + ']';
	    },
	    repeat: function repeat(prefix) {
	        return prefix;
	    }
	};

	var isArray$1 = Array.isArray;
	var split = String.prototype.split;
	var push = Array.prototype.push;
	var pushToArray = function (arr, valueOrArray) {
	    push.apply(arr, isArray$1(valueOrArray) ? valueOrArray : [valueOrArray]);
	};

	var toISO = Date.prototype.toISOString;

	var defaultFormat = formats$1['default'];
	var defaults$1 = {
	    addQueryPrefix: false,
	    allowDots: false,
	    charset: 'utf-8',
	    charsetSentinel: false,
	    delimiter: '&',
	    encode: true,
	    encoder: utils$1.encode,
	    encodeValuesOnly: false,
	    format: defaultFormat,
	    formatter: formats$1.formatters[defaultFormat],
	    // deprecated
	    indices: false,
	    serializeDate: function serializeDate(date) {
	        return toISO.call(date);
	    },
	    skipNulls: false,
	    strictNullHandling: false
	};

	var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
	    return typeof v === 'string'
	        || typeof v === 'number'
	        || typeof v === 'boolean'
	        || typeof v === 'symbol'
	        || typeof v === 'bigint';
	};

	var stringify$1 = function stringify(
	    object,
	    prefix,
	    generateArrayPrefix,
	    strictNullHandling,
	    skipNulls,
	    encoder,
	    filter,
	    sort,
	    allowDots,
	    serializeDate,
	    format,
	    formatter,
	    encodeValuesOnly,
	    charset
	) {
	    var obj = object;
	    if (typeof filter === 'function') {
	        obj = filter(prefix, obj);
	    } else if (obj instanceof Date) {
	        obj = serializeDate(obj);
	    } else if (generateArrayPrefix === 'comma' && isArray$1(obj)) {
	        obj = utils$1.maybeMap(obj, function (value) {
	            if (value instanceof Date) {
	                return serializeDate(value);
	            }
	            return value;
	        });
	    }

	    if (obj === null) {
	        if (strictNullHandling) {
	            return encoder && !encodeValuesOnly ? encoder(prefix, defaults$1.encoder, charset, 'key', format) : prefix;
	        }

	        obj = '';
	    }

	    if (isNonNullishPrimitive(obj) || utils$1.isBuffer(obj)) {
	        if (encoder) {
	            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults$1.encoder, charset, 'key', format);
	            if (generateArrayPrefix === 'comma' && encodeValuesOnly) {
	                var valuesArray = split.call(String(obj), ',');
	                var valuesJoined = '';
	                for (var i = 0; i < valuesArray.length; ++i) {
	                    valuesJoined += (i === 0 ? '' : ',') + formatter(encoder(valuesArray[i], defaults$1.encoder, charset, 'value', format));
	                }
	                return [formatter(keyValue) + '=' + valuesJoined];
	            }
	            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults$1.encoder, charset, 'value', format))];
	        }
	        return [formatter(prefix) + '=' + formatter(String(obj))];
	    }

	    var values = [];

	    if (typeof obj === 'undefined') {
	        return values;
	    }

	    var objKeys;
	    if (generateArrayPrefix === 'comma' && isArray$1(obj)) {
	        // we need to join elements in
	        objKeys = [{ value: obj.length > 0 ? obj.join(',') || null : void undefined }];
	    } else if (isArray$1(filter)) {
	        objKeys = filter;
	    } else {
	        var keys = Object.keys(obj);
	        objKeys = sort ? keys.sort(sort) : keys;
	    }

	    for (var j = 0; j < objKeys.length; ++j) {
	        var key = objKeys[j];
	        var value = typeof key === 'object' && typeof key.value !== 'undefined' ? key.value : obj[key];

	        if (skipNulls && value === null) {
	            continue;
	        }

	        var keyPrefix = isArray$1(obj)
	            ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(prefix, key) : prefix
	            : prefix + (allowDots ? '.' + key : '[' + key + ']');

	        pushToArray(values, stringify(
	            value,
	            keyPrefix,
	            generateArrayPrefix,
	            strictNullHandling,
	            skipNulls,
	            encoder,
	            filter,
	            sort,
	            allowDots,
	            serializeDate,
	            format,
	            formatter,
	            encodeValuesOnly,
	            charset
	        ));
	    }

	    return values;
	};

	var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
	    if (!opts) {
	        return defaults$1;
	    }

	    if (opts.encoder !== null && typeof opts.encoder !== 'undefined' && typeof opts.encoder !== 'function') {
	        throw new TypeError('Encoder has to be a function.');
	    }

	    var charset = opts.charset || defaults$1.charset;
	    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
	        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
	    }

	    var format = formats$1['default'];
	    if (typeof opts.format !== 'undefined') {
	        if (!has$1.call(formats$1.formatters, opts.format)) {
	            throw new TypeError('Unknown format option provided.');
	        }
	        format = opts.format;
	    }
	    var formatter = formats$1.formatters[format];

	    var filter = defaults$1.filter;
	    if (typeof opts.filter === 'function' || isArray$1(opts.filter)) {
	        filter = opts.filter;
	    }

	    return {
	        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults$1.addQueryPrefix,
	        allowDots: typeof opts.allowDots === 'undefined' ? defaults$1.allowDots : !!opts.allowDots,
	        charset: charset,
	        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults$1.charsetSentinel,
	        delimiter: typeof opts.delimiter === 'undefined' ? defaults$1.delimiter : opts.delimiter,
	        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults$1.encode,
	        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults$1.encoder,
	        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults$1.encodeValuesOnly,
	        filter: filter,
	        format: format,
	        formatter: formatter,
	        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults$1.serializeDate,
	        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults$1.skipNulls,
	        sort: typeof opts.sort === 'function' ? opts.sort : null,
	        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults$1.strictNullHandling
	    };
	};

	var stringify_1 = function (object, opts) {
	    var obj = object;
	    var options = normalizeStringifyOptions(opts);

	    var objKeys;
	    var filter;

	    if (typeof options.filter === 'function') {
	        filter = options.filter;
	        obj = filter('', obj);
	    } else if (isArray$1(options.filter)) {
	        filter = options.filter;
	        objKeys = filter;
	    }

	    var keys = [];

	    if (typeof obj !== 'object' || obj === null) {
	        return '';
	    }

	    var arrayFormat;
	    if (opts && opts.arrayFormat in arrayPrefixGenerators) {
	        arrayFormat = opts.arrayFormat;
	    } else if (opts && 'indices' in opts) {
	        arrayFormat = opts.indices ? 'indices' : 'repeat';
	    } else {
	        arrayFormat = 'indices';
	    }

	    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

	    if (!objKeys) {
	        objKeys = Object.keys(obj);
	    }

	    if (options.sort) {
	        objKeys.sort(options.sort);
	    }

	    for (var i = 0; i < objKeys.length; ++i) {
	        var key = objKeys[i];

	        if (options.skipNulls && obj[key] === null) {
	            continue;
	        }
	        pushToArray(keys, stringify$1(
	            obj[key],
	            key,
	            generateArrayPrefix,
	            options.strictNullHandling,
	            options.skipNulls,
	            options.encode ? options.encoder : null,
	            options.filter,
	            options.sort,
	            options.allowDots,
	            options.serializeDate,
	            options.format,
	            options.formatter,
	            options.encodeValuesOnly,
	            options.charset
	        ));
	    }

	    var joined = keys.join(options.delimiter);
	    var prefix = options.addQueryPrefix === true ? '?' : '';

	    if (options.charsetSentinel) {
	        if (options.charset === 'iso-8859-1') {
	            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
	            prefix += 'utf8=%26%2310003%3B&';
	        } else {
	            // encodeURIComponent('✓')
	            prefix += 'utf8=%E2%9C%93&';
	        }
	    }

	    return joined.length > 0 ? prefix + joined : '';
	};

	var utils = utils$2;

	var has = Object.prototype.hasOwnProperty;
	var isArray = Array.isArray;

	var defaults = {
	    allowDots: false,
	    allowPrototypes: false,
	    arrayLimit: 20,
	    charset: 'utf-8',
	    charsetSentinel: false,
	    comma: false,
	    decoder: utils.decode,
	    delimiter: '&',
	    depth: 5,
	    ignoreQueryPrefix: false,
	    interpretNumericEntities: false,
	    parameterLimit: 1000,
	    parseArrays: true,
	    plainObjects: false,
	    strictNullHandling: false
	};

	var interpretNumericEntities = function (str) {
	    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
	        return String.fromCharCode(parseInt(numberStr, 10));
	    });
	};

	var parseArrayValue = function (val, options) {
	    if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
	        return val.split(',');
	    }

	    return val;
	};

	// This is what browsers will submit when the ✓ character occurs in an
	// application/x-www-form-urlencoded body and the encoding of the page containing
	// the form is iso-8859-1, or when the submitted form has an accept-charset
	// attribute of iso-8859-1. Presumably also with other charsets that do not contain
	// the ✓ character, such as us-ascii.
	var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

	// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
	var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

	var parseValues = function parseQueryStringValues(str, options) {
	    var obj = {};
	    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
	    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
	    var parts = cleanStr.split(options.delimiter, limit);
	    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
	    var i;

	    var charset = options.charset;
	    if (options.charsetSentinel) {
	        for (i = 0; i < parts.length; ++i) {
	            if (parts[i].indexOf('utf8=') === 0) {
	                if (parts[i] === charsetSentinel) {
	                    charset = 'utf-8';
	                } else if (parts[i] === isoSentinel) {
	                    charset = 'iso-8859-1';
	                }
	                skipIndex = i;
	                i = parts.length; // The eslint settings do not allow break;
	            }
	        }
	    }

	    for (i = 0; i < parts.length; ++i) {
	        if (i === skipIndex) {
	            continue;
	        }
	        var part = parts[i];

	        var bracketEqualsPos = part.indexOf(']=');
	        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

	        var key, val;
	        if (pos === -1) {
	            key = options.decoder(part, defaults.decoder, charset, 'key');
	            val = options.strictNullHandling ? null : '';
	        } else {
	            key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');
	            val = utils.maybeMap(
	                parseArrayValue(part.slice(pos + 1), options),
	                function (encodedVal) {
	                    return options.decoder(encodedVal, defaults.decoder, charset, 'value');
	                }
	            );
	        }

	        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
	            val = interpretNumericEntities(val);
	        }

	        if (part.indexOf('[]=') > -1) {
	            val = isArray(val) ? [val] : val;
	        }

	        if (has.call(obj, key)) {
	            obj[key] = utils.combine(obj[key], val);
	        } else {
	            obj[key] = val;
	        }
	    }

	    return obj;
	};

	var parseObject = function (chain, val, options, valuesParsed) {
	    var leaf = valuesParsed ? val : parseArrayValue(val, options);

	    for (var i = chain.length - 1; i >= 0; --i) {
	        var obj;
	        var root = chain[i];

	        if (root === '[]' && options.parseArrays) {
	            obj = [].concat(leaf);
	        } else {
	            obj = options.plainObjects ? Object.create(null) : {};
	            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
	            var index = parseInt(cleanRoot, 10);
	            if (!options.parseArrays && cleanRoot === '') {
	                obj = { 0: leaf };
	            } else if (
	                !isNaN(index)
	                && root !== cleanRoot
	                && String(index) === cleanRoot
	                && index >= 0
	                && (options.parseArrays && index <= options.arrayLimit)
	            ) {
	                obj = [];
	                obj[index] = leaf;
	            } else if (cleanRoot !== '__proto__') {
	                obj[cleanRoot] = leaf;
	            }
	        }

	        leaf = obj;
	    }

	    return leaf;
	};

	var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
	    if (!givenKey) {
	        return;
	    }

	    // Transform dot notation to bracket notation
	    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

	    // The regex chunks

	    var brackets = /(\[[^[\]]*])/;
	    var child = /(\[[^[\]]*])/g;

	    // Get the parent

	    var segment = options.depth > 0 && brackets.exec(key);
	    var parent = segment ? key.slice(0, segment.index) : key;

	    // Stash the parent if it exists

	    var keys = [];
	    if (parent) {
	        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
	        if (!options.plainObjects && has.call(Object.prototype, parent)) {
	            if (!options.allowPrototypes) {
	                return;
	            }
	        }

	        keys.push(parent);
	    }

	    // Loop through children appending to the array until we hit depth

	    var i = 0;
	    while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
	        i += 1;
	        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
	            if (!options.allowPrototypes) {
	                return;
	            }
	        }
	        keys.push(segment[1]);
	    }

	    // If there's a remainder, just add whatever is left

	    if (segment) {
	        keys.push('[' + key.slice(segment.index) + ']');
	    }

	    return parseObject(keys, val, options, valuesParsed);
	};

	var normalizeParseOptions = function normalizeParseOptions(opts) {
	    if (!opts) {
	        return defaults;
	    }

	    if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
	        throw new TypeError('Decoder has to be a function.');
	    }

	    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
	        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
	    }
	    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

	    return {
	        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
	        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
	        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
	        charset: charset,
	        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
	        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
	        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
	        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
	        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
	        depth: (typeof opts.depth === 'number' || opts.depth === false) ? +opts.depth : defaults.depth,
	        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
	        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
	        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
	        parseArrays: opts.parseArrays !== false,
	        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
	        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
	    };
	};

	var parse$1 = function (str, opts) {
	    var options = normalizeParseOptions(opts);

	    if (str === '' || str === null || typeof str === 'undefined') {
	        return options.plainObjects ? Object.create(null) : {};
	    }

	    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
	    var obj = options.plainObjects ? Object.create(null) : {};

	    // Iterate over the keys and setup the new object

	    var keys = Object.keys(tempObj);
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
	        obj = utils.merge(obj, newObj, options);
	    }

	    return utils.compact(obj);
	};

	var stringify = stringify_1;
	var parse = parse$1;
	var formats = formats$3;

	var lib = {
	    formats: formats,
	    parse: parse,
	    stringify: stringify
	};

	function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$3(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$3(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$3(Constructor.prototype, protoProps); if (staticProps) _defineProperties$3(Constructor, staticProps); return Constructor; }

	function _defineProperty$i(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var setWindowTitle = function setWindowTitle(title) {
	  if (title) {
	    // This function is only executed on browsers so we can disable this check.
	    // eslint-disable-next-line no-restricted-globals
	    window.document.title = title;
	  }
	};

	var BrowserHistory = /*#__PURE__*/function () {
	  /**
	   * Initializes a new storage provider that syncs the search state to the URL
	   * using web APIs (`window.location.pushState` and `onpopstate` event).
	   */
	  function BrowserHistory(_ref) {
	    var _this = this;

	    var windowTitle = _ref.windowTitle,
	        _ref$writeDelay = _ref.writeDelay,
	        writeDelay = _ref$writeDelay === void 0 ? 400 : _ref$writeDelay,
	        createURL = _ref.createURL,
	        parseURL = _ref.parseURL,
	        getLocation = _ref.getLocation;

	    _classCallCheck$3(this, BrowserHistory);

	    _defineProperty$i(this, "windowTitle", void 0);

	    _defineProperty$i(this, "writeDelay", void 0);

	    _defineProperty$i(this, "_createURL", void 0);

	    _defineProperty$i(this, "parseURL", void 0);

	    _defineProperty$i(this, "getLocation", void 0);

	    _defineProperty$i(this, "writeTimer", void 0);

	    _defineProperty$i(this, "shouldPushState", true);

	    _defineProperty$i(this, "isDisposed", false);

	    _defineProperty$i(this, "latestAcknowledgedHistory", 0);

	    this.windowTitle = windowTitle;
	    this.writeTimer = undefined;
	    this.writeDelay = writeDelay;
	    this._createURL = createURL;
	    this.parseURL = parseURL;
	    this.getLocation = getLocation;
	    safelyRunOnBrowser(function (_ref2) {
	      var window = _ref2.window;

	      var title = _this.windowTitle && _this.windowTitle(_this.read());

	      setWindowTitle(title);
	      _this.latestAcknowledgedHistory = window.history.length;
	    });
	  }
	  /**
	   * Reads the URL and returns a syncable UI search state.
	   */


	  _createClass$3(BrowserHistory, [{
	    key: "read",
	    value: function read() {
	      return this.parseURL({
	        qsModule: lib,
	        location: this.getLocation()
	      });
	    }
	    /**
	     * Pushes a search state into the URL.
	     */

	  }, {
	    key: "write",
	    value: function write(routeState) {
	      var _this2 = this;

	      safelyRunOnBrowser(function (_ref3) {
	        var window = _ref3.window;

	        var url = _this2.createURL(routeState);

	        var title = _this2.windowTitle && _this2.windowTitle(routeState);

	        if (_this2.writeTimer) {
	          clearTimeout(_this2.writeTimer);
	        }

	        _this2.writeTimer = setTimeout(function () {
	          setWindowTitle(title); // We do want to `pushState` if:
	          // - the router is not disposed, IS.js needs to update the URL
	          // OR
	          // - the last write was from InstantSearch.js
	          // (unlike a SPA, where it would have last written)

	          var lastPushWasByISAfterDispose = !_this2.isDisposed || _this2.latestAcknowledgedHistory === window.history.length;

	          if (_this2.shouldPushState && lastPushWasByISAfterDispose) {
	            window.history.pushState(routeState, title || '', url);
	            _this2.latestAcknowledgedHistory = window.history.length;
	          }

	          _this2.shouldPushState = true;
	          _this2.writeTimer = undefined;
	        }, _this2.writeDelay);
	      });
	    }
	    /**
	     * Sets a callback on the `onpopstate` event of the history API of the current page.
	     * It enables the URL sync to keep track of the changes.
	     */

	  }, {
	    key: "onUpdate",
	    value: function onUpdate(callback) {
	      var _this3 = this;

	      this._onPopState = function (event) {
	        if (_this3.writeTimer) {
	          clearTimeout(_this3.writeTimer);
	          _this3.writeTimer = undefined;
	        }

	        _this3.shouldPushState = false;
	        var routeState = event.state; // At initial load, the state is read from the URL without update.
	        // Therefore the state object is not available.
	        // In this case, we fallback and read the URL.

	        if (!routeState) {
	          callback(_this3.read());
	        } else {
	          callback(routeState);
	        }
	      };

	      safelyRunOnBrowser(function (_ref4) {
	        var window = _ref4.window;
	        window.addEventListener('popstate', _this3._onPopState);
	      });
	    }
	    /**
	     * Creates a complete URL from a given syncable UI state.
	     *
	     * It always generates the full URL, not a relative one.
	     * This allows to handle cases like using a <base href>.
	     * See: https://github.com/algolia/instantsearch.js/issues/790
	     */

	  }, {
	    key: "createURL",
	    value: function createURL(routeState) {
	      return this._createURL({
	        qsModule: lib,
	        routeState: routeState,
	        location: this.getLocation()
	      });
	    }
	    /**
	     * Removes the event listener and cleans up the URL.
	     */

	  }, {
	    key: "dispose",
	    value: function dispose() {
	      var _this4 = this;

	      this.isDisposed = true;
	      safelyRunOnBrowser(function (_ref5) {
	        var window = _ref5.window;

	        if (_this4._onPopState) {
	          window.removeEventListener('popstate', _this4._onPopState);
	        }
	      });

	      if (this.writeTimer) {
	        clearTimeout(this.writeTimer);
	      }

	      this.write({});
	    }
	  }]);

	  return BrowserHistory;
	}();

	function historyRouter() {
	  var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	      _ref6$createURL = _ref6.createURL,
	      createURL = _ref6$createURL === void 0 ? function (_ref7) {
	    var qsModule = _ref7.qsModule,
	        routeState = _ref7.routeState,
	        location = _ref7.location;
	    var protocol = location.protocol,
	        hostname = location.hostname,
	        _location$port = location.port,
	        port = _location$port === void 0 ? '' : _location$port,
	        pathname = location.pathname,
	        hash = location.hash;
	    var queryString = qsModule.stringify(routeState);
	    var portWithPrefix = port === '' ? '' : ":".concat(port); // IE <= 11 has no proper `location.origin` so we cannot rely on it.

	    // IE <= 11 has no proper `location.origin` so we cannot rely on it.
	    if (!queryString) {
	      return "".concat(protocol, "//").concat(hostname).concat(portWithPrefix).concat(pathname).concat(hash);
	    }

	    return "".concat(protocol, "//").concat(hostname).concat(portWithPrefix).concat(pathname, "?").concat(queryString).concat(hash);
	  } : _ref6$createURL,
	      _ref6$parseURL = _ref6.parseURL,
	      parseURL = _ref6$parseURL === void 0 ? function (_ref8) {
	    var qsModule = _ref8.qsModule,
	        location = _ref8.location;
	    // `qs` by default converts arrays with more than 20 items to an object.
	    // We want to avoid this because the data structure manipulated can therefore vary.
	    // Setting the limit to `100` seems a good number because the engine's default is 100
	    // (it can go up to 1000 but it is very unlikely to select more than 100 items in the UI).
	    //
	    // Using an `arrayLimit` of `n` allows `n + 1` items.
	    //
	    // See:
	    //   - https://github.com/ljharb/qs#parsing-arrays
	    //   - https://www.algolia.com/doc/api-reference/api-parameters/maxValuesPerFacet/
	    return qsModule.parse(location.search.slice(1), {
	      arrayLimit: 99
	    });
	  } : _ref6$parseURL,
	      _ref6$writeDelay = _ref6.writeDelay,
	      writeDelay = _ref6$writeDelay === void 0 ? 400 : _ref6$writeDelay,
	      windowTitle = _ref6.windowTitle,
	      _ref6$getLocation = _ref6.getLocation,
	      getLocation = _ref6$getLocation === void 0 ? function () {
	    return safelyRunOnBrowser(function (_ref9) {
	      var window = _ref9.window;
	      return window.location;
	    }, {
	      fallback: function fallback() {
	        throw new Error('You need to provide `getLocation` to the `history` router in environments where `window` does not exist.');
	      }
	    });
	  } : _ref6$getLocation;

	  return new BrowserHistory({
	    createURL: createURL,
	    parseURL: parseURL,
	    writeDelay: writeDelay,
	    windowTitle: windowTitle,
	    getLocation: getLocation
	  });
	}

	function ownKeys$e(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$e(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$e(Object(source), true).forEach(function (key) { _defineProperty$h(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$e(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$h(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	var createRouterMiddleware = function createRouterMiddleware() {
	  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  var _props$router = props.router,
	      router = _props$router === void 0 ? historyRouter() : _props$router,
	      _props$stateMapping = props.stateMapping,
	      stateMapping = _props$stateMapping === void 0 ? simpleStateMapping() : _props$stateMapping;
	  return function (_ref) {
	    var instantSearchInstance = _ref.instantSearchInstance;

	    function topLevelCreateURL(nextState) {
	      var uiState = Object.keys(nextState).reduce(function (acc, indexId) {
	        return _objectSpread$e(_objectSpread$e({}, acc), {}, _defineProperty$h({}, indexId, nextState[indexId]));
	      }, instantSearchInstance.mainIndex.getWidgetUiState({}));
	      var route = stateMapping.stateToRoute(uiState);
	      return router.createURL(route);
	    } // casting to UiState here to keep createURL unaware of custom UiState
	    // (as long as it's an object, it's ok)


	    instantSearchInstance._createURL = topLevelCreateURL;
	    var lastRouteState = undefined;
	    var initialUiState = instantSearchInstance._initialUiState;
	    return {
	      onStateChange: function onStateChange(_ref2) {
	        var uiState = _ref2.uiState;
	        var routeState = stateMapping.stateToRoute(uiState);

	        if (lastRouteState === undefined || !isEqual(lastRouteState, routeState)) {
	          router.write(routeState);
	          lastRouteState = routeState;
	        }
	      },
	      subscribe: function subscribe() {
	        instantSearchInstance._initialUiState = _objectSpread$e(_objectSpread$e({}, initialUiState), stateMapping.routeToState(router.read()));
	        router.onUpdate(function (route) {
	          instantSearchInstance.setUiState(stateMapping.routeToState(route));
	        });
	      },
	      unsubscribe: function unsubscribe() {
	        router.dispose();
	      }
	    };
	  };
	};

	function extractPayload(widgets, instantSearchInstance, payload) {
	  var parent = instantSearchInstance.mainIndex;
	  var initOptions = {
	    instantSearchInstance: instantSearchInstance,
	    parent: parent,
	    scopedResults: [],
	    state: parent.getHelper().state,
	    helper: parent.getHelper(),
	    createURL: parent.createURL,
	    uiState: instantSearchInstance._initialUiState,
	    renderState: instantSearchInstance.renderState,
	    templatesConfig: instantSearchInstance.templatesConfig,
	    searchMetadata: {
	      isSearchStalled: instantSearchInstance._isSearchStalled
	    }
	  };
	  widgets.forEach(function (widget) {
	    var widgetParams = {};

	    if (widget.getWidgetRenderState) {
	      var renderState = widget.getWidgetRenderState(initOptions);

	      if (renderState && renderState.widgetParams) {
	        // casting, as we just earlier checked widgetParams exists, and thus an object
	        widgetParams = renderState.widgetParams;
	      }
	    } // since we destructure in all widgets, the parameters with defaults are set to "undefined"


	    var params = Object.keys(widgetParams).filter(function (key) {
	      return widgetParams[key] !== undefined;
	    });
	    payload.widgets.push({
	      type: widget.$$type,
	      widgetType: widget.$$widgetType,
	      params: params
	    });

	    if (widget.$$type === 'ais.index') {
	      extractPayload(widget.getWidgets(), instantSearchInstance, payload);
	    }
	  });
	}

	function isMetadataEnabled() {
	  return safelyRunOnBrowser(function (_ref) {
	    var _window$navigator, _window$navigator$use;

	    var window = _ref.window;
	    return ((_window$navigator = window.navigator) === null || _window$navigator === void 0 ? void 0 : (_window$navigator$use = _window$navigator.userAgent) === null || _window$navigator$use === void 0 ? void 0 : _window$navigator$use.indexOf('Algolia Crawler')) > -1;
	  }, {
	    fallback: function fallback() {
	      return false;
	    }
	  });
	}
	/**
	 * Exposes the metadata of mounted widgets in a custom
	 * `<meta name="instantsearch:widgets" />` tag. The metadata per widget is:
	 * - applied parameters
	 * - widget name
	 * - connector name
	 */

	function createMetadataMiddleware() {
	  return function (_ref2) {
	    var instantSearchInstance = _ref2.instantSearchInstance;
	    var payload = {
	      widgets: []
	    };
	    var payloadContainer = document.createElement('meta');
	    var refNode = document.querySelector('head');
	    payloadContainer.name = 'instantsearch:widgets';
	    return {
	      onStateChange: function onStateChange() {},
	      subscribe: function subscribe() {
	        // using setTimeout here to delay extraction until widgets have been added in a tick (e.g. Vue)
	        setTimeout(function () {
	          var client = instantSearchInstance.client;
	          payload.ua = client.transporter && client.transporter.userAgent ? client.transporter.userAgent.value : client._ua;
	          extractPayload(instantSearchInstance.mainIndex.getWidgets(), instantSearchInstance, payload);
	          payloadContainer.content = JSON.stringify(payload);
	          refNode.appendChild(payloadContainer);
	        }, 0);
	      },
	      unsubscribe: function unsubscribe() {
	        payloadContainer.remove();
	      }
	    };
	  };
	}

	function _typeof$2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$2 = function _typeof(obj) { return typeof obj; }; } else { _typeof$2 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$2(obj); }

	function ownKeys$d(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$d(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$d(Object(source), true).forEach(function (key) { _defineProperty$g(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$d(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$2(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$2(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$2(Constructor.prototype, protoProps); if (staticProps) _defineProperties$2(Constructor, staticProps); return Constructor; }

	function _inherits$2(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$2(subClass, superClass); }

	function _setPrototypeOf$2(o, p) { _setPrototypeOf$2 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$2(o, p); }

	function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = _getPrototypeOf$2(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf$2(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn$2(this, result); }; }

	function _possibleConstructorReturn$2(self, call) { if (call && (_typeof$2(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized$2(self); }

	function _assertThisInitialized$2(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

	function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

	function _getPrototypeOf$2(o) { _getPrototypeOf$2 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$2(o); }

	function _defineProperty$g(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	var withUsage$9 = createDocumentationMessageGenerator({
	  name: 'instantsearch'
	});

	function defaultCreateURL() {
	  return '#';
	}
	/**
	 * Global options for an InstantSearch instance.
	 */


	/**
	 * The actual implementation of the InstantSearch. This is
	 * created using the `instantsearch` factory function.
	 * It emits the 'render' event every time a search is done
	 */
	var InstantSearch = /*#__PURE__*/function (_EventEmitter) {
	  _inherits$2(InstantSearch, _EventEmitter);

	  var _super = _createSuper$2(InstantSearch);

	  function InstantSearch(options) {
	    var _this;

	    _classCallCheck$2(this, InstantSearch);

	    _this = _super.call(this);

	    _defineProperty$g(_assertThisInitialized$2(_this), "client", void 0);

	    _defineProperty$g(_assertThisInitialized$2(_this), "indexName", void 0);

	    _defineProperty$g(_assertThisInitialized$2(_this), "insightsClient", void 0);

	    _defineProperty$g(_assertThisInitialized$2(_this), "onStateChange", null);

	    _defineProperty$g(_assertThisInitialized$2(_this), "helper", void 0);

	    _defineProperty$g(_assertThisInitialized$2(_this), "mainHelper", void 0);

	    _defineProperty$g(_assertThisInitialized$2(_this), "mainIndex", void 0);

	    _defineProperty$g(_assertThisInitialized$2(_this), "started", void 0);

	    _defineProperty$g(_assertThisInitialized$2(_this), "templatesConfig", void 0);

	    _defineProperty$g(_assertThisInitialized$2(_this), "renderState", {});

	    _defineProperty$g(_assertThisInitialized$2(_this), "_stalledSearchDelay", void 0);

	    _defineProperty$g(_assertThisInitialized$2(_this), "_searchStalledTimer", void 0);

	    _defineProperty$g(_assertThisInitialized$2(_this), "_isSearchStalled", void 0);

	    _defineProperty$g(_assertThisInitialized$2(_this), "_initialUiState", void 0);

	    _defineProperty$g(_assertThisInitialized$2(_this), "_initialResults", void 0);

	    _defineProperty$g(_assertThisInitialized$2(_this), "_createURL", void 0);

	    _defineProperty$g(_assertThisInitialized$2(_this), "_searchFunction", void 0);

	    _defineProperty$g(_assertThisInitialized$2(_this), "_mainHelperSearch", void 0);

	    _defineProperty$g(_assertThisInitialized$2(_this), "middleware", []);

	    _defineProperty$g(_assertThisInitialized$2(_this), "sendEventToInsights", void 0);

	    _defineProperty$g(_assertThisInitialized$2(_this), "scheduleSearch", defer$1(function () {
	      if (_this.started) {
	        _this.mainHelper.search();
	      }
	    }));

	    _defineProperty$g(_assertThisInitialized$2(_this), "scheduleRender", defer$1(function () {
	      if (!_this.mainHelper.hasPendingRequests()) {
	        clearTimeout(_this._searchStalledTimer);
	        _this._searchStalledTimer = null;
	        _this._isSearchStalled = false;
	      }

	      _this.mainIndex.render({
	        instantSearchInstance: _assertThisInitialized$2(_this)
	      });

	      _this.emit('render');
	    }));

	    _defineProperty$g(_assertThisInitialized$2(_this), "onInternalStateChange", defer$1(function () {
	      var nextUiState = _this.mainIndex.getWidgetUiState({});

	      _this.middleware.forEach(function (_ref) {
	        var instance = _ref.instance;
	        instance.onStateChange({
	          uiState: nextUiState
	        });
	      });
	    }));

	    var _options$indexName = options.indexName,
	        indexName = _options$indexName === void 0 ? null : _options$indexName,
	        numberLocale = options.numberLocale,
	        _options$initialUiSta = options.initialUiState,
	        initialUiState = _options$initialUiSta === void 0 ? {} : _options$initialUiSta,
	        _options$routing = options.routing,
	        routing = _options$routing === void 0 ? null : _options$routing,
	        searchFunction = options.searchFunction,
	        _options$stalledSearc = options.stalledSearchDelay,
	        stalledSearchDelay = _options$stalledSearc === void 0 ? 200 : _options$stalledSearc,
	        _options$searchClient = options.searchClient,
	        searchClient = _options$searchClient === void 0 ? null : _options$searchClient,
	        _options$insightsClie = options.insightsClient,
	        insightsClient = _options$insightsClie === void 0 ? null : _options$insightsClie,
	        _options$onStateChang = options.onStateChange,
	        onStateChange = _options$onStateChang === void 0 ? null : _options$onStateChang;

	    if (indexName === null) {
	      throw new Error(withUsage$9('The `indexName` option is required.'));
	    }

	    if (searchClient === null) {
	      throw new Error(withUsage$9('The `searchClient` option is required.'));
	    }

	    if (typeof searchClient.search !== 'function') {
	      throw new Error("The `searchClient` must implement a `search` method.\n\nSee: https://www.algolia.com/doc/guides/building-search-ui/going-further/backend-search/in-depth/backend-instantsearch/js/");
	    }

	    if (typeof searchClient.addAlgoliaAgent === 'function') {
	      searchClient.addAlgoliaAgent("instantsearch.js (".concat(version, ")"));
	    }

	    if (insightsClient && typeof insightsClient !== 'function') {
	      throw new Error(withUsage$9('The `insightsClient` option should be a function.'));
	    }
	    _this.client = searchClient;
	    _this.insightsClient = insightsClient;
	    _this.indexName = indexName;
	    _this.helper = null;
	    _this.mainHelper = null;
	    _this.mainIndex = index$1({
	      indexName: indexName
	    });
	    _this.onStateChange = onStateChange;
	    _this.started = false;
	    _this.templatesConfig = {
	      helpers: hoganHelpers({
	        numberLocale: numberLocale
	      }),
	      compileOptions: {}
	    };
	    _this._stalledSearchDelay = stalledSearchDelay;
	    _this._searchStalledTimer = null;
	    _this._isSearchStalled = false;
	    _this._createURL = defaultCreateURL;
	    _this._initialUiState = initialUiState;
	    _this._initialResults = null;

	    if (searchFunction) {
	      _this._searchFunction = searchFunction;
	    }

	    _this.sendEventToInsights = noop;

	    if (routing) {
	      var routerOptions = typeof routing === 'boolean' ? undefined : routing;

	      _this.use(createRouterMiddleware(routerOptions));
	    }

	    if (isMetadataEnabled()) {
	      _this.use(createMetadataMiddleware());
	    }

	    return _this;
	  }
	  /**
	   * Hooks a middleware into the InstantSearch lifecycle.
	   */


	  _createClass$2(InstantSearch, [{
	    key: "use",
	    value: function use() {
	      var _this2 = this;

	      for (var _len = arguments.length, middleware = new Array(_len), _key = 0; _key < _len; _key++) {
	        middleware[_key] = arguments[_key];
	      }

	      var newMiddlewareList = middleware.map(function (fn) {
	        var newMiddleware = _objectSpread$d({
	          subscribe: noop,
	          unsubscribe: noop,
	          onStateChange: noop
	        }, fn({
	          instantSearchInstance: _this2
	        }));

	        _this2.middleware.push({
	          creator: fn,
	          instance: newMiddleware
	        });

	        return newMiddleware;
	      }); // If the instance has already started, we directly subscribe the
	      // middleware so they're notified of changes.

	      if (this.started) {
	        newMiddlewareList.forEach(function (m) {
	          m.subscribe();
	        });
	      }

	      return this;
	    }
	    /**
	     * Removes a middleware from the InstantSearch lifecycle.
	     */

	  }, {
	    key: "unuse",
	    value: function unuse() {
	      for (var _len2 = arguments.length, middlewareToUnuse = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        middlewareToUnuse[_key2] = arguments[_key2];
	      }

	      this.middleware.filter(function (m) {
	        return middlewareToUnuse.includes(m.creator);
	      }).forEach(function (m) {
	        return m.instance.unsubscribe();
	      });
	      this.middleware = this.middleware.filter(function (m) {
	        return !middlewareToUnuse.includes(m.creator);
	      });
	      return this;
	    } // @major we shipped with EXPERIMENTAL_use, but have changed that to just `use` now

	  }, {
	    key: "EXPERIMENTAL_use",
	    value: function EXPERIMENTAL_use() {
	      return this.use.apply(this, arguments);
	    }
	    /**
	     * Adds a widget to the search instance.
	     * A widget can be added either before or after InstantSearch has started.
	     * @param widget The widget to add to InstantSearch.
	     *
	     * @deprecated This method will still be supported in 4.x releases, but not further. It is replaced by `addWidgets([widget])`.
	     */

	  }, {
	    key: "addWidget",
	    value: function addWidget(widget) {
	      return this.addWidgets([widget]);
	    }
	    /**
	     * Adds multiple widgets to the search instance.
	     * Widgets can be added either before or after InstantSearch has started.
	     * @param widgets The array of widgets to add to InstantSearch.
	     */

	  }, {
	    key: "addWidgets",
	    value: function addWidgets(widgets) {
	      if (!Array.isArray(widgets)) {
	        throw new Error(withUsage$9('The `addWidgets` method expects an array of widgets. Please use `addWidget`.'));
	      }

	      if (widgets.some(function (widget) {
	        return typeof widget.init !== 'function' && typeof widget.render !== 'function';
	      })) {
	        throw new Error(withUsage$9('The widget definition expects a `render` and/or an `init` method.'));
	      }

	      this.mainIndex.addWidgets(widgets);
	      return this;
	    }
	    /**
	     * Removes a widget from the search instance.
	     * @deprecated This method will still be supported in 4.x releases, but not further. It is replaced by `removeWidgets([widget])`
	     * @param widget The widget instance to remove from InstantSearch.
	     *
	     * The widget must implement a `dispose()` method to clear its state.
	     */

	  }, {
	    key: "removeWidget",
	    value: function removeWidget(widget) {
	      return this.removeWidgets([widget]);
	    }
	    /**
	     * Removes multiple widgets from the search instance.
	     * @param widgets Array of widgets instances to remove from InstantSearch.
	     *
	     * The widgets must implement a `dispose()` method to clear their states.
	     */

	  }, {
	    key: "removeWidgets",
	    value: function removeWidgets(widgets) {
	      if (!Array.isArray(widgets)) {
	        throw new Error(withUsage$9('The `removeWidgets` method expects an array of widgets. Please use `removeWidget`.'));
	      }

	      if (widgets.some(function (widget) {
	        return typeof widget.dispose !== 'function';
	      })) {
	        throw new Error(withUsage$9('The widget definition expects a `dispose` method.'));
	      }

	      this.mainIndex.removeWidgets(widgets);
	      return this;
	    }
	    /**
	     * Ends the initialization of InstantSearch.js and triggers the
	     * first search. This method should be called after all widgets have been added
	     * to the instance of InstantSearch.js. InstantSearch.js also supports adding and removing
	     * widgets after the start as an **EXPERIMENTAL** feature.
	     */

	  }, {
	    key: "start",
	    value: function start() {
	      var _this3 = this;

	      if (this.started) {
	        throw new Error(withUsage$9('The `start` method has already been called once.'));
	      } // This Helper is used for the queries, we don't care about its state. The
	      // states are managed at the `index` level. We use this Helper to create
	      // DerivedHelper scoped into the `index` widgets.
	      // In Vue InstantSearch' hydrate, a main helper gets set before start, so
	      // we need to respect this helper as a way to keep all listeners correct.


	      var mainHelper = this.mainHelper || algoliasearchHelper_1(this.client, this.indexName);

	      mainHelper.search = function () {
	        // This solution allows us to keep the exact same API for the users but
	        // under the hood, we have a different implementation. It should be
	        // completely transparent for the rest of the codebase. Only this module
	        // is impacted.
	        return mainHelper.searchOnlyWithDerivedHelpers();
	      };

	      if (this._searchFunction) {
	        // this client isn't used to actually search, but required for the helper
	        // to not throw errors
	        var fakeClient = {
	          search: function search() {
	            return new Promise(noop);
	          }
	        };
	        this._mainHelperSearch = mainHelper.search.bind(mainHelper);

	        mainHelper.search = function () {
	          var mainIndexHelper = _this3.mainIndex.getHelper();

	          var searchFunctionHelper = algoliasearchHelper_1(fakeClient, mainIndexHelper.state.index, mainIndexHelper.state);
	          searchFunctionHelper.once('search', function (_ref2) {
	            var state = _ref2.state;
	            mainIndexHelper.overrideStateWithoutTriggeringChangeEvent(state);

	            _this3._mainHelperSearch();
	          }); // Forward state changes from `searchFunctionHelper` to `mainIndexHelper`

	          searchFunctionHelper.on('change', function (_ref3) {
	            var state = _ref3.state;
	            mainIndexHelper.setState(state);
	          });

	          _this3._searchFunction(searchFunctionHelper);

	          return mainHelper;
	        };
	      } // Only the "main" Helper emits the `error` event vs the one for `search`
	      // and `results` that are also emitted on the derived one.


	      mainHelper.on('error', function (_ref4) {
	        var error = _ref4.error;
	        // If an error is emitted, it is re-thrown by events. In previous versions
	        // we emitted {error}, which is thrown as:
	        // "Uncaught, unspecified \"error\" event. ([object Object])"
	        // To avoid breaking changes, we make the error available in both
	        // `error` and `error.error`
	        // @MAJOR emit only error
	        error.error = error;

	        _this3.emit('error', error);
	      });
	      this.mainHelper = mainHelper;
	      this.middleware.forEach(function (_ref5) {
	        var instance = _ref5.instance;
	        instance.subscribe();
	      });
	      this.mainIndex.init({
	        instantSearchInstance: this,
	        parent: null,
	        uiState: this._initialUiState
	      });

	      if (this._initialResults) {
	        var originalScheduleSearch = this.scheduleSearch; // We don't schedule a first search when initial results are provided
	        // because we already have the results to render. This skips the initial
	        // network request on the browser on `start`.

	        this.scheduleSearch = defer$1(noop); // We also skip the initial network request when widgets are dynamically
	        // added in the first tick (that's the case in all the framework-based flavors).
	        // When we add a widget to `index`, it calls `scheduleSearch`. We can rely
	        // on our `defer` util to restore the original `scheduleSearch` value once
	        // widgets are added to hook back to the regular lifecycle.

	        defer$1(function () {
	          _this3.scheduleSearch = originalScheduleSearch;
	        })();
	      } else {
	        this.scheduleSearch();
	      } // Keep the previous reference for legacy purpose, some pattern use
	      // the direct Helper access `search.helper` (e.g multi-index).


	      this.helper = this.mainIndex.getHelper(); // track we started the search if we add more widgets,
	      // to init them directly after add

	      this.started = true;
	    }
	    /**
	     * Removes all widgets without triggering a search afterwards. This is an **EXPERIMENTAL** feature,
	     * if you find an issue with it, please
	     * [open an issue](https://github.com/algolia/instantsearch.js/issues/new?title=Problem%20with%20dispose).
	     * @return {undefined} This method does not return anything
	     */

	  }, {
	    key: "dispose",
	    value: function dispose() {
	      this.scheduleSearch.cancel();
	      this.scheduleRender.cancel();
	      clearTimeout(this._searchStalledTimer);
	      this.removeWidgets(this.mainIndex.getWidgets());
	      this.mainIndex.dispose(); // You can not start an instance two times, therefore a disposed instance
	      // needs to set started as false otherwise this can not be restarted at a
	      // later point.

	      this.started = false; // The helper needs to be reset to perform the next search from a fresh state.
	      // If not reset, it would use the state stored before calling `dispose()`.

	      this.removeAllListeners();
	      this.mainHelper.removeAllListeners();
	      this.mainHelper = null;
	      this.helper = null;
	      this.middleware.forEach(function (_ref6) {
	        var instance = _ref6.instance;
	        instance.unsubscribe();
	      });
	    }
	  }, {
	    key: "scheduleStalledRender",
	    value: function scheduleStalledRender() {
	      var _this4 = this;

	      if (!this._searchStalledTimer) {
	        this._searchStalledTimer = setTimeout(function () {
	          _this4._isSearchStalled = true;

	          _this4.scheduleRender();
	        }, this._stalledSearchDelay);
	      }
	    }
	  }, {
	    key: "setUiState",
	    value: function setUiState(uiState) {
	      if (!this.mainHelper) {
	        throw new Error(withUsage$9('The `start` method needs to be called before `setUiState`.'));
	      } // We refresh the index UI state to update the local UI state that the
	      // main index passes to the function form of `setUiState`.


	      this.mainIndex.refreshUiState();
	      var nextUiState = typeof uiState === 'function' ? uiState(this.mainIndex.getWidgetUiState({})) : uiState;

	      var setIndexHelperState = function setIndexHelperState(indexWidget) {
	        var nextIndexUiState = nextUiState[indexWidget.getIndexId()] || {};

	        indexWidget.getHelper().setState(indexWidget.getWidgetSearchParameters(indexWidget.getHelper().state, {
	          uiState: nextIndexUiState
	        }));
	        indexWidget.getWidgets().filter(isIndexWidget).forEach(setIndexHelperState);
	      };

	      setIndexHelperState(this.mainIndex);
	      this.scheduleSearch();
	      this.onInternalStateChange();
	    }
	  }, {
	    key: "getUiState",
	    value: function getUiState() {
	      if (this.started) {
	        // We refresh the index UI state to make sure changes from `refine` are taken in account
	        this.mainIndex.refreshUiState();
	      }

	      return this.mainIndex.getWidgetUiState({});
	    }
	  }, {
	    key: "createURL",
	    value: function createURL() {
	      var nextState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	      if (!this.started) {
	        throw new Error(withUsage$9('The `start` method needs to be called before `createURL`.'));
	      }

	      return this._createURL(nextState);
	    }
	  }, {
	    key: "refresh",
	    value: function refresh() {
	      if (!this.mainHelper) {
	        throw new Error(withUsage$9('The `start` method needs to be called before `refresh`.'));
	      }

	      this.mainHelper.clearCache().search();
	    }
	  }]);

	  return InstantSearch;
	}(events);

	var InstantSearch$1 = InstantSearch;

	function _objectWithoutProperties$3(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$3(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

	function _objectWithoutPropertiesLoose$3(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

	function getStateWithoutPage$1(state) {
	  var _ref = state || {};
	      _ref.page;
	      var rest = _objectWithoutProperties$3(_ref, ["page"]);

	  return rest;
	}

	var KEY = 'ais.infiniteHits';
	function createInfiniteHitsSessionStorageCache() {
	  return {
	    read: function read(_ref2) {
	      var state = _ref2.state;
	      var sessionStorage = safelyRunOnBrowser(function (_ref3) {
	        var window = _ref3.window;
	        return window.sessionStorage;
	      });

	      if (!sessionStorage) {
	        return null;
	      }

	      try {
	        var cache = JSON.parse( // @ts-expect-error JSON.parse() requires a string, but it actually accepts null, too.
	        sessionStorage.getItem(KEY));
	        return cache && isEqual(cache.state, getStateWithoutPage$1(state)) ? cache.hits : null;
	      } catch (error) {
	        if (error instanceof SyntaxError) {
	          try {
	            sessionStorage.removeItem(KEY);
	          } catch (err) {// do nothing
	          }
	        }

	        return null;
	      }
	    },
	    write: function write(_ref4) {
	      var state = _ref4.state,
	          hits = _ref4.hits;
	      var sessionStorage = safelyRunOnBrowser(function (_ref5) {
	        var window = _ref5.window;
	        return window.sessionStorage;
	      });

	      if (!sessionStorage) {
	        return;
	      }

	      try {
	        sessionStorage.setItem(KEY, JSON.stringify({
	          state: getStateWithoutPage$1(state),
	          hits: hits
	        }));
	      } catch (error) {// do nothing
	      }
	    }
	  };
	}

	/**
	 * InstantSearch is the main component of InstantSearch.js. This object
	 * manages the widget and lets you add new ones.
	 *
	 * Two parameters are required to get you started with InstantSearch.js:
	 *  - `indexName`: the main index that you will use for your new search UI
	 *  - `searchClient`: the search client to plug to InstantSearch.js
	 *
	 * The [search client provided by Algolia](algolia.com/doc/api-client/getting-started/what-is-the-api-client/javascript/)
	 * needs an `appId` and an `apiKey`. Those parameters can be found in your
	 * [Algolia dashboard](https://www.algolia.com/api-keys).
	 *
	 * If you want to get up and running quickly with InstantSearch.js, have a
	 * look at the [getting started](https://www.algolia.com/doc/guides/building-search-ui/getting-started/js/).
	 */
	var instantsearch = function instantsearch(options) {
	  return new InstantSearch$1(options);
	};

	instantsearch.version = version;
	instantsearch.createInfiniteHitsSessionStorageCache = deprecate(createInfiniteHitsSessionStorageCache, "import { createInfiniteHitsSessionStorageCache } from 'instantsearch.js/es/helpers'");
	instantsearch.highlight = deprecate(highlight, "import { highlight } from 'instantsearch.js/es/helpers'");
	instantsearch.reverseHighlight = deprecate(reverseHighlight, "import { reverseHighlight } from 'instantsearch.js/es/helpers'");
	instantsearch.snippet = deprecate(snippet, "import { snippet } from 'instantsearch.js/es/helpers'");
	instantsearch.reverseSnippet = deprecate(reverseSnippet, "import { reverseSnippet } from 'instantsearch.js/es/helpers'");
	instantsearch.insights = insights;
	instantsearch.getInsightsAnonymousUserToken = getInsightsAnonymousUserToken;
	Object.defineProperty(instantsearch, 'widgets', {
	  get: function get() {
	    throw new ReferenceError("\"instantsearch.widgets\" are not available from the ES build.\n\nTo import the widgets:\n\nimport { searchBox } from 'instantsearch.js/es/widgets'");
	  }
	});
	Object.defineProperty(instantsearch, 'connectors', {
	  get: function get() {
	    throw new ReferenceError("\"instantsearch.connectors\" are not available from the ES build.\n\nTo import the connectors:\n\nimport { connectSearchBox } from 'instantsearch.js/es/connectors'");
	  }
	});
	var instantsearch$1 = instantsearch;

	function _defineProperty$f(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _objectWithoutProperties$2(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$2(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

	function _objectWithoutPropertiesLoose$2(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

	function getIndexStateWithoutConfigure(uiState) {
	  uiState.configure;
	      var trackedUiState = _objectWithoutProperties$2(uiState, ["configure"]);

	  return trackedUiState;
	}

	function singleIndexStateMapping(indexName) {
	  return {
	    stateToRoute: function stateToRoute(uiState) {
	      return getIndexStateWithoutConfigure(uiState[indexName] || {});
	    },
	    routeToState: function routeToState() {
	      var routeState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      return _defineProperty$f({}, indexName, getIndexStateWithoutConfigure(routeState));
	    }
	  };
	}

	var n,l,u,t,o,r,e={},c=[],s=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function a(n,l){for(var u in l)n[u]=l[u];return n}function h(n){var l=n.parentNode;l&&l.removeChild(n);}function v(l,u,i){var t,o,r,f={};for(r in u)"key"==r?t=u[r]:"ref"==r?o=u[r]:f[r]=u[r];if(arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):i),"function"==typeof l&&null!=l.defaultProps)for(r in l.defaultProps)void 0===f[r]&&(f[r]=l.defaultProps[r]);return y(l,f,t,o,null)}function y(n,i,t,o,r){var f={type:n,props:i,key:t,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==r?++u:r};return null==r&&null!=l.vnode&&l.vnode(f),f}function p(){return {current:null}}function d(n){return n.children}function _(n,l){this.props=n,this.context=l;}function k(n,l){if(null==l)return n.__?k(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?k(n):null}function b(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return b(n)}}function m(n){(!n.__d&&(n.__d=!0)&&t.push(n)&&!g.__r++||r!==l.debounceRendering)&&((r=l.debounceRendering)||o)(g);}function g(){for(var n;g.__r=t.length;)n=t.sort(function(n,l){return n.__v.__b-l.__v.__b}),t=[],n.some(function(n){var l,u,i,t,o,r;n.__d&&(o=(t=(l=n).__v).__e,(r=l.__P)&&(u=[],(i=a({},t)).__v=t.__v+1,j(r,t,i,l.__n,void 0!==r.ownerSVGElement,null!=t.__h?[o]:null,u,null==o?k(t):o,t.__h),z(u,t),t.__e!=o&&b(t)));});}function w(n,l,u,i,t,o,r,f,s,a){var h,v,p,_,b,m,g,w=i&&i.__k||c,A=w.length;for(u.__k=[],h=0;h<l.length;h++)if(null!=(_=u.__k[h]=null==(_=l[h])||"boolean"==typeof _?null:"string"==typeof _||"number"==typeof _||"bigint"==typeof _?y(null,_,null,null,_):Array.isArray(_)?y(d,{children:_},null,null,null):_.__b>0?y(_.type,_.props,_.key,null,_.__v):_)){if(_.__=u,_.__b=u.__b+1,null===(p=w[h])||p&&_.key==p.key&&_.type===p.type)w[h]=void 0;else for(v=0;v<A;v++){if((p=w[v])&&_.key==p.key&&_.type===p.type){w[v]=void 0;break}p=null;}j(n,_,p=p||e,t,o,r,f,s,a),b=_.__e,(v=_.ref)&&p.ref!=v&&(g||(g=[]),p.ref&&g.push(p.ref,null,_),g.push(v,_.__c||b,_)),null!=b?(null==m&&(m=b),"function"==typeof _.type&&_.__k===p.__k?_.__d=s=x(_,s,n):s=P(n,_,p,w,b,s),"function"==typeof u.type&&(u.__d=s)):s&&p.__e==s&&s.parentNode!=n&&(s=k(p));}for(u.__e=m,h=A;h--;)null!=w[h]&&("function"==typeof u.type&&null!=w[h].__e&&w[h].__e==u.__d&&(u.__d=k(i,h+1)),N(w[h],w[h]));if(g)for(h=0;h<g.length;h++)M(g[h],g[++h],g[++h]);}function x(n,l,u){for(var i,t=n.__k,o=0;t&&o<t.length;o++)(i=t[o])&&(i.__=n,l="function"==typeof i.type?x(i,l,u):P(u,i,i,t,i.__e,l));return l}function P(n,l,u,i,t,o){var r,f,e;if(void 0!==l.__d)r=l.__d,l.__d=void 0;else if(null==u||t!=o||null==t.parentNode)n:if(null==o||o.parentNode!==n)n.appendChild(t),r=null;else {for(f=o,e=0;(f=f.nextSibling)&&e<i.length;e+=2)if(f==t)break n;n.insertBefore(t,o),r=o;}return void 0!==r?r:t.nextSibling}function C(n,l,u,i,t){var o;for(o in u)"children"===o||"key"===o||o in l||H(n,o,null,u[o],i);for(o in l)t&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||H(n,o,l[o],u[o],i);}function $(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]=null==u?"":"number"!=typeof u||s.test(l)?u:u+"px";}function H(n,l,u,i,t){var o;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else {if("string"==typeof i&&(n.style.cssText=i=""),i)for(l in i)u&&l in u||$(n.style,l,"");if(u)for(l in u)i&&u[l]===i[l]||$(n.style,l,u[l]);}else if("o"===l[0]&&"n"===l[1])o=l!==(l=l.replace(/Capture$/,"")),l=l.toLowerCase()in n?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+o]=u,u?i||n.addEventListener(l,o?T:I,o):n.removeEventListener(l,o?T:I,o);else if("dangerouslySetInnerHTML"!==l){if(t)l=l.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if("href"!==l&&"list"!==l&&"form"!==l&&"tabIndex"!==l&&"download"!==l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null!=u&&(!1!==u||"a"===l[0]&&"r"===l[1])?n.setAttribute(l,u):n.removeAttribute(l));}}function I(n){this.l[n.type+!1](l.event?l.event(n):n);}function T(n){this.l[n.type+!0](l.event?l.event(n):n);}function j(n,u,i,t,o,r,f,e,c){var s,h,v,y,p,k,b,m,g,x,A,P=u.type;if(void 0!==u.constructor)return null;null!=i.__h&&(c=i.__h,e=u.__e=i.__e,u.__h=null,r=[e]),(s=l.__b)&&s(u);try{n:if("function"==typeof P){if(m=u.props,g=(s=P.contextType)&&t[s.__c],x=s?g?g.props.value:s.__:t,i.__c?b=(h=u.__c=i.__c).__=h.__E:("prototype"in P&&P.prototype.render?u.__c=h=new P(m,x):(u.__c=h=new _(m,x),h.constructor=P,h.render=O),g&&g.sub(h),h.props=m,h.state||(h.state={}),h.context=x,h.__n=t,v=h.__d=!0,h.__h=[]),null==h.__s&&(h.__s=h.state),null!=P.getDerivedStateFromProps&&(h.__s==h.state&&(h.__s=a({},h.__s)),a(h.__s,P.getDerivedStateFromProps(m,h.__s))),y=h.props,p=h.state,v)null==P.getDerivedStateFromProps&&null!=h.componentWillMount&&h.componentWillMount(),null!=h.componentDidMount&&h.__h.push(h.componentDidMount);else {if(null==P.getDerivedStateFromProps&&m!==y&&null!=h.componentWillReceiveProps&&h.componentWillReceiveProps(m,x),!h.__e&&null!=h.shouldComponentUpdate&&!1===h.shouldComponentUpdate(m,h.__s,x)||u.__v===i.__v){h.props=m,h.state=h.__s,u.__v!==i.__v&&(h.__d=!1),h.__v=u,u.__e=i.__e,u.__k=i.__k,u.__k.forEach(function(n){n&&(n.__=u);}),h.__h.length&&f.push(h);break n}null!=h.componentWillUpdate&&h.componentWillUpdate(m,h.__s,x),null!=h.componentDidUpdate&&h.__h.push(function(){h.componentDidUpdate(y,p,k);});}h.context=x,h.props=m,h.state=h.__s,(s=l.__r)&&s(u),h.__d=!1,h.__v=u,h.__P=n,s=h.render(h.props,h.state,h.context),h.state=h.__s,null!=h.getChildContext&&(t=a(a({},t),h.getChildContext())),v||null==h.getSnapshotBeforeUpdate||(k=h.getSnapshotBeforeUpdate(y,p)),A=null!=s&&s.type===d&&null==s.key?s.props.children:s,w(n,Array.isArray(A)?A:[A],u,i,t,o,r,f,e,c),h.base=u.__e,u.__h=null,h.__h.length&&f.push(h),b&&(h.__E=h.__=null),h.__e=!1;}else null==r&&u.__v===i.__v?(u.__k=i.__k,u.__e=i.__e):u.__e=L(i.__e,u,i,t,o,r,f,c);(s=l.diffed)&&s(u);}catch(n){u.__v=null,(c||null!=r)&&(u.__e=e,u.__h=!!c,r[r.indexOf(e)]=null),l.__e(n,u,i);}}function z(n,u){l.__c&&l.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u);});}catch(n){l.__e(n,u.__v);}});}function L(l,u,i,t,o,r,f,c){var s,a,v,y=i.props,p=u.props,d=u.type,_=0;if("svg"===d&&(o=!0),null!=r)for(;_<r.length;_++)if((s=r[_])&&"setAttribute"in s==!!d&&(d?s.localName===d:3===s.nodeType)){l=s,r[_]=null;break}if(null==l){if(null===d)return document.createTextNode(p);l=o?document.createElementNS("http://www.w3.org/2000/svg",d):document.createElement(d,p.is&&p),r=null,c=!1;}if(null===d)y===p||c&&l.data===p||(l.data=p);else {if(r=r&&n.call(l.childNodes),a=(y=i.props||e).dangerouslySetInnerHTML,v=p.dangerouslySetInnerHTML,!c){if(null!=r)for(y={},_=0;_<l.attributes.length;_++)y[l.attributes[_].name]=l.attributes[_].value;(v||a)&&(v&&(a&&v.__html==a.__html||v.__html===l.innerHTML)||(l.innerHTML=v&&v.__html||""));}if(C(l,p,y,o,c),v)u.__k=[];else if(_=u.props.children,w(l,Array.isArray(_)?_:[_],u,i,t,o&&"foreignObject"!==d,r,f,r?r[0]:i.__k&&k(i,0),c),null!=r)for(_=r.length;_--;)null!=r[_]&&h(r[_]);c||("value"in p&&void 0!==(_=p.value)&&(_!==l.value||"progress"===d&&!_||"option"===d&&_!==y.value)&&H(l,"value",_,y.value,!1),"checked"in p&&void 0!==(_=p.checked)&&_!==l.checked&&H(l,"checked",_,y.checked,!1));}return l}function M(n,u,i){try{"function"==typeof n?n(u):n.current=u;}catch(n){l.__e(n,i);}}function N(n,u,i){var t,o;if(l.unmount&&l.unmount(n),(t=n.ref)&&(t.current&&t.current!==n.__e||M(t,null,u)),null!=(t=n.__c)){if(t.componentWillUnmount)try{t.componentWillUnmount();}catch(n){l.__e(n,u);}t.base=t.__P=null;}if(t=n.__k)for(o=0;o<t.length;o++)t[o]&&N(t[o],u,"function"!=typeof n.type);i||null==n.__e||h(n.__e),n.__e=n.__d=void 0;}function O(n,l,u){return this.constructor(n,u)}function S(u,i,t){var o,r,f;l.__&&l.__(u,i),r=(o="function"==typeof t)?null:t&&t.__k||i.__k,f=[],j(i,u=(!o&&t||i).__k=v(d,null,[u]),r||e,e,void 0!==i.ownerSVGElement,!o&&t?[t]:r?null:i.firstChild?n.call(i.childNodes):null,f,!o&&t?t:r?r.__e:i.firstChild,o),z(f,u);}n=c.slice,l={__e:function(n,l){for(var u,i,t;l=l.__;)if((u=l.__c)&&!u.__)try{if((i=u.constructor)&&null!=i.getDerivedStateFromError&&(u.setState(i.getDerivedStateFromError(n)),t=u.__d),null!=u.componentDidCatch&&(u.componentDidCatch(n),t=u.__d),t)return u.__E=u}catch(l){n=l;}throw n}},u=0,_.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=a({},this.state),"function"==typeof n&&(n=n(a({},u),this.props)),n&&a(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),m(this));},_.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),m(this));},_.prototype.render=d,t=[],o="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,g.__r=0;

	var classnames = {exports: {}};

	/*!
	  Copyright (c) 2018 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/

	(function (module) {
	/* global define */

	(function () {

		var hasOwn = {}.hasOwnProperty;

		function classNames() {
			var classes = [];

			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;

				var argType = typeof arg;

				if (argType === 'string' || argType === 'number') {
					classes.push(arg);
				} else if (Array.isArray(arg)) {
					if (arg.length) {
						var inner = classNames.apply(null, arg);
						if (inner) {
							classes.push(inner);
						}
					}
				} else if (argType === 'object') {
					if (arg.toString === Object.prototype.toString) {
						for (var key in arg) {
							if (hasOwn.call(arg, key) && arg[key]) {
								classes.push(key);
							}
						}
					} else {
						classes.push(arg.toString());
					}
				}
			}

			return classes.join(' ');
		}

		if (module.exports) {
			classNames.default = classNames;
			module.exports = classNames;
		} else {
			window.classNames = classNames;
		}
	}());
	}(classnames));

	var cx = classnames.exports;

	function _typeof$1(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }

	function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }

	function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); if (staticProps) _defineProperties$1(Constructor, staticProps); return Constructor; }

	function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$1(subClass, superClass); }

	function _setPrototypeOf$1(o, p) { _setPrototypeOf$1 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$1(o, p); }

	function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf$1(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf$1(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn$1(this, result); }; }

	function _possibleConstructorReturn$1(self, call) { if (call && (_typeof$1(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized$1(self); }

	function _assertThisInitialized$1(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

	function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

	function _getPrototypeOf$1(o) { _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$1(o); }

	function _defineProperty$e(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	var defaultProps$1 = {
	  data: {},
	  rootTagName: 'div',
	  useCustomCompileOptions: {},
	  templates: {},
	  templatesConfig: {}
	};

	// @TODO: Template should be a generic and receive TData to pass to Templates (to avoid TTemplateData to be set as `any`)
	var Template = /*#__PURE__*/function (_Component) {
	  _inherits$1(Template, _Component);

	  var _super = _createSuper$1(Template);

	  function Template() {
	    _classCallCheck$1(this, Template);

	    return _super.apply(this, arguments);
	  }

	  _createClass$1(Template, [{
	    key: "shouldComponentUpdate",
	    value: function shouldComponentUpdate(nextProps) {
	      return !isEqual(this.props.data, nextProps.data) || this.props.templateKey !== nextProps.templateKey || !isEqual(this.props.rootProps, nextProps.rootProps);
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var RootTagName = this.props.rootTagName;
	      var useCustomCompileOptions = this.props.useCustomCompileOptions[this.props.templateKey];
	      var compileOptions = useCustomCompileOptions ? this.props.templatesConfig.compileOptions : {};
	      var content = renderTemplate({
	        templates: this.props.templates,
	        templateKey: this.props.templateKey,
	        compileOptions: compileOptions,
	        helpers: this.props.templatesConfig.helpers,
	        data: this.props.data,
	        bindEvent: this.props.bindEvent
	      });

	      if (content === null) {
	        // Adds a noscript to the DOM but virtual DOM is null
	        // See http://facebook.github.io/react/docs/component-specs.html#render
	        return null;
	      }

	      return v(RootTagName, _extends$2({}, this.props.rootProps, {
	        dangerouslySetInnerHTML: {
	          __html: content
	        }
	      }));
	    }
	  }]);

	  return Template;
	}(_);

	_defineProperty$e(Template, "defaultProps", defaultProps$1);

	var Template$1 = Template;

	function ownKeys$c(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$c(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$c(Object(source), true).forEach(function (key) { _defineProperty$d(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$c(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$d(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	/**
	 * Refine the given search parameters.
	 */

	var withUsage$8 = createDocumentationMessageGenerator({
	  name: 'configure',
	  connector: true
	});

	function getInitialSearchParameters(state, widgetParams) {
	  // We leverage the helper internals to remove the `widgetParams` from
	  // the state. The function `setQueryParameters` omits the values that
	  // are `undefined` on the next state.
	  return state.setQueryParameters(Object.keys(widgetParams.searchParameters).reduce(function (acc, key) {
	    return _objectSpread$c(_objectSpread$c({}, acc), {}, _defineProperty$d({}, key, undefined));
	  }, {}));
	}

	var connectConfigure = function connectConfigure() {
	  var renderFn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;
	  var unmountFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
	  return function (widgetParams) {
	    if (!widgetParams || !isPlainObject(widgetParams.searchParameters)) {
	      throw new Error(withUsage$8('The `searchParameters` option expects an object.'));
	    }

	    var connectorState = {};

	    function refine(helper) {
	      return function (searchParameters) {
	        // Merge new `searchParameters` with the ones set from other widgets
	        var actualState = getInitialSearchParameters(helper.state, widgetParams);
	        var nextSearchParameters = mergeSearchParameters(actualState, new algoliasearchHelper_1.SearchParameters(searchParameters)); // Update original `widgetParams.searchParameters` to the new refined one

	        widgetParams.searchParameters = searchParameters; // Trigger a search with the resolved search parameters

	        helper.setState(nextSearchParameters).search();
	      };
	    }

	    return {
	      $$type: 'ais.configure',
	      init: function init(initOptions) {
	        var instantSearchInstance = initOptions.instantSearchInstance;
	        renderFn(_objectSpread$c(_objectSpread$c({}, this.getWidgetRenderState(initOptions)), {}, {
	          instantSearchInstance: instantSearchInstance
	        }), true);
	      },
	      render: function render(renderOptions) {
	        var instantSearchInstance = renderOptions.instantSearchInstance;
	        renderFn(_objectSpread$c(_objectSpread$c({}, this.getWidgetRenderState(renderOptions)), {}, {
	          instantSearchInstance: instantSearchInstance
	        }), false);
	      },
	      dispose: function dispose(_ref) {
	        var state = _ref.state;
	        unmountFn();
	        return getInitialSearchParameters(state, widgetParams);
	      },
	      getRenderState: function getRenderState(renderState, renderOptions) {
	        var _renderState$configur;

	        var widgetRenderState = this.getWidgetRenderState(renderOptions);
	        return _objectSpread$c(_objectSpread$c({}, renderState), {}, {
	          configure: _objectSpread$c(_objectSpread$c({}, widgetRenderState), {}, {
	            widgetParams: _objectSpread$c(_objectSpread$c({}, widgetRenderState.widgetParams), {}, {
	              searchParameters: mergeSearchParameters(new algoliasearchHelper_1.SearchParameters((_renderState$configur = renderState.configure) === null || _renderState$configur === void 0 ? void 0 : _renderState$configur.widgetParams.searchParameters), new algoliasearchHelper_1.SearchParameters(widgetRenderState.widgetParams.searchParameters)).getQueryParams()
	            })
	          })
	        });
	      },
	      getWidgetRenderState: function getWidgetRenderState(_ref2) {
	        var helper = _ref2.helper;

	        if (!connectorState.refine) {
	          connectorState.refine = refine(helper);
	        }

	        return {
	          refine: connectorState.refine,
	          widgetParams: widgetParams
	        };
	      },
	      getWidgetSearchParameters: function getWidgetSearchParameters(state, _ref3) {
	        var uiState = _ref3.uiState;
	        return mergeSearchParameters(state, new algoliasearchHelper_1.SearchParameters(_objectSpread$c(_objectSpread$c({}, uiState.configure), widgetParams.searchParameters)));
	      },
	      getWidgetUiState: function getWidgetUiState(uiState) {
	        return _objectSpread$c(_objectSpread$c({}, uiState), {}, {
	          configure: _objectSpread$c(_objectSpread$c({}, uiState.configure), widgetParams.searchParameters)
	        });
	      }
	    };
	  };
	};

	var connectConfigure$1 = connectConfigure;

	function ownKeys$b(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$b(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$b(Object(source), true).forEach(function (key) { _defineProperty$c(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$b(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$c(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	/**
	 * A list of [search parameters](https://www.algolia.com/doc/api-reference/search-api-parameters/)
	 * to enable when the widget mounts.
	 */

	var configure = function configure(widgetParams) {
	  // This is a renderless widget that falls back to the connector's
	  // noop render and unmount functions.
	  var makeWidget = connectConfigure$1(noop);
	  return _objectSpread$b(_objectSpread$b({}, makeWidget({
	    searchParameters: widgetParams
	  })), {}, {
	    $$widgetType: 'ais.configure'
	  });
	};

	var configure$1 = configure;

	function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

	function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

	function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

	function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

	function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

	function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

	function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

	function _defineProperty$b(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	var defaultProps = {
	  query: '',
	  showSubmit: true,
	  showReset: true,
	  showLoadingIndicator: true,
	  autofocus: false,
	  searchAsYouType: true,
	  isSearchStalled: false,
	  disabled: false,
	  onChange: noop,
	  onSubmit: noop,
	  onReset: noop,
	  refine: noop
	};

	var SearchBox = /*#__PURE__*/function (_Component) {
	  _inherits(SearchBox, _Component);

	  var _super = _createSuper(SearchBox);

	  function SearchBox() {
	    var _this;

	    _classCallCheck(this, SearchBox);

	    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    _this = _super.call.apply(_super, [this].concat(args));

	    _defineProperty$b(_assertThisInitialized(_this), "state", {
	      query: _this.props.query,
	      focused: false
	    });

	    _defineProperty$b(_assertThisInitialized(_this), "input", p());

	    _defineProperty$b(_assertThisInitialized(_this), "onInput", function (event) {
	      var _this$props = _this.props,
	          searchAsYouType = _this$props.searchAsYouType,
	          refine = _this$props.refine,
	          onChange = _this$props.onChange;
	      var query = event.target.value;

	      if (searchAsYouType) {
	        refine(query);
	      }

	      _this.setState({
	        query: query
	      });

	      onChange(event);
	    });

	    _defineProperty$b(_assertThisInitialized(_this), "onSubmit", function (event) {
	      var _this$props2 = _this.props,
	          searchAsYouType = _this$props2.searchAsYouType,
	          refine = _this$props2.refine,
	          onSubmit = _this$props2.onSubmit;
	      event.preventDefault();
	      event.stopPropagation();

	      if (_this.input.current) {
	        _this.input.current.blur();
	      }

	      if (!searchAsYouType) {
	        refine(_this.state.query);
	      }

	      onSubmit(event);
	      return false;
	    });

	    _defineProperty$b(_assertThisInitialized(_this), "onReset", function (event) {
	      var _this$props3 = _this.props,
	          refine = _this$props3.refine,
	          onReset = _this$props3.onReset;
	      var query = '';

	      if (_this.input.current) {
	        _this.input.current.focus();
	      }

	      refine(query);

	      _this.setState({
	        query: query
	      });

	      onReset(event);
	    });

	    _defineProperty$b(_assertThisInitialized(_this), "onBlur", function () {
	      _this.setState({
	        focused: false
	      });
	    });

	    _defineProperty$b(_assertThisInitialized(_this), "onFocus", function () {
	      _this.setState({
	        focused: true
	      });
	    });

	    return _this;
	  }

	  _createClass(SearchBox, [{
	    key: "resetInput",
	    value:
	    /**
	     * This public method is used in the RefinementList SFFV search box
	     * to reset the input state when an item is selected.
	     *
	     * @see RefinementList#componentWillReceiveProps
	     * @return {undefined}
	     */
	    function resetInput() {
	      this.setState({
	        query: ''
	      });
	    }
	  }, {
	    key: "componentWillReceiveProps",
	    value: function componentWillReceiveProps(nextProps) {
	      /**
	       * when the user is typing, we don't want to replace the query typed
	       * by the user (state.query) with the query exposed by the connector (props.query)
	       * see: https://github.com/algolia/instantsearch.js/issues/4141
	       */
	      if (!this.state.focused && nextProps.query !== this.state.query) {
	        this.setState({
	          query: nextProps.query
	        });
	      }
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var _this$props4 = this.props,
	          cssClasses = _this$props4.cssClasses,
	          placeholder = _this$props4.placeholder,
	          autofocus = _this$props4.autofocus,
	          showSubmit = _this$props4.showSubmit,
	          showReset = _this$props4.showReset,
	          showLoadingIndicator = _this$props4.showLoadingIndicator,
	          templates = _this$props4.templates,
	          isSearchStalled = _this$props4.isSearchStalled;
	      return v("div", {
	        className: cssClasses.root
	      }, v("form", {
	        action: "",
	        role: "search",
	        className: cssClasses.form,
	        noValidate: true,
	        onSubmit: this.onSubmit,
	        onReset: this.onReset
	      }, v("input", {
	        ref: this.input,
	        value: this.state.query,
	        disabled: this.props.disabled,
	        className: cssClasses.input,
	        type: "search",
	        placeholder: placeholder,
	        autoFocus: autofocus,
	        autoComplete: "off",
	        autoCorrect: "off",
	        autoCapitalize: "off" // @ts-expect-error `spellCheck` attribute is missing in preact JSX types
	        ,
	        spellCheck: "false",
	        maxLength: 512,
	        onInput: this.onInput,
	        onBlur: this.onBlur,
	        onFocus: this.onFocus
	      }), v(Template$1, {
	        templateKey: "submit",
	        rootTagName: "button",
	        rootProps: {
	          className: cssClasses.submit,
	          type: 'submit',
	          title: 'Submit the search query.',
	          hidden: !showSubmit
	        },
	        templates: templates,
	        data: {
	          cssClasses: cssClasses
	        }
	      }), v(Template$1, {
	        templateKey: "reset",
	        rootTagName: "button",
	        rootProps: {
	          className: cssClasses.reset,
	          type: 'reset',
	          title: 'Clear the search query.',
	          hidden: !(showReset && this.state.query.trim() && !isSearchStalled)
	        },
	        templates: templates,
	        data: {
	          cssClasses: cssClasses
	        }
	      }), showLoadingIndicator && v(Template$1, {
	        templateKey: "loadingIndicator",
	        rootTagName: "span",
	        rootProps: {
	          className: cssClasses.loadingIndicator,
	          hidden: !isSearchStalled
	        },
	        templates: templates,
	        data: {
	          cssClasses: cssClasses
	        }
	      })));
	    }
	  }]);

	  return SearchBox;
	}(_);

	_defineProperty$b(SearchBox, "defaultProps", defaultProps);

	var SearchBox$1 = SearchBox;

	function ownKeys$a(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$a(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$a(Object(source), true).forEach(function (key) { _defineProperty$a(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$a(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$a(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var getSelectedHits = function getSelectedHits(hits, selectedObjectIDs) {
	  return selectedObjectIDs.map(function (objectID) {
	    var hit = find(hits, function (h) {
	      return h.objectID === objectID;
	    });

	    if (typeof hit === 'undefined') {
	      throw new Error("Could not find objectID \"".concat(objectID, "\" passed to `clickedObjectIDsAfterSearch` in the returned hits. This is necessary to infer the absolute position and the query ID."));
	    }

	    return hit;
	  });
	};

	var getQueryID = function getQueryID(selectedHits) {
	  var queryIDs = uniq(selectedHits.map(function (hit) {
	    return hit.__queryID;
	  }));

	  if (queryIDs.length > 1) {
	    throw new Error('Insights currently allows a single `queryID`. The `objectIDs` provided map to multiple `queryID`s.');
	  }

	  var queryID = queryIDs[0];

	  if (typeof queryID !== 'string') {
	    throw new Error("Could not infer `queryID`. Ensure InstantSearch `clickAnalytics: true` was added with the Configure widget.\n\nSee: https://alg.li/lNiZZ7");
	  }

	  return queryID;
	};

	var getPositions = function getPositions(selectedHits) {
	  return selectedHits.map(function (hit) {
	    return hit.__position;
	  });
	};

	var inferPayload = function inferPayload(_ref) {
	  var method = _ref.method,
	      results = _ref.results,
	      hits = _ref.hits,
	      objectIDs = _ref.objectIDs;
	  var index = results.index;
	  var selectedHits = getSelectedHits(hits, objectIDs);
	  var queryID = getQueryID(selectedHits);

	  switch (method) {
	    case 'clickedObjectIDsAfterSearch':
	      {
	        var positions = getPositions(selectedHits);
	        return {
	          index: index,
	          queryID: queryID,
	          objectIDs: objectIDs,
	          positions: positions
	        };
	      }

	    case 'convertedObjectIDsAfterSearch':
	      return {
	        index: index,
	        queryID: queryID,
	        objectIDs: objectIDs
	      };

	    default:
	      throw new Error("Unsupported method passed to insights: \"".concat(method, "\"."));
	  }
	};

	var wrapInsightsClient = function wrapInsightsClient(aa, results, hits) {
	  return function (method) {
	    for (var _len = arguments.length, payloads = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      payloads[_key - 1] = arguments[_key];
	    }

	    var payload = payloads[0];

	    if (!aa) {
	      var withInstantSearchUsage = createDocumentationMessageGenerator({
	        name: 'instantsearch'
	      });
	      throw new Error(withInstantSearchUsage('The `insightsClient` option has not been provided to `instantsearch`.'));
	    }

	    if (!Array.isArray(payload.objectIDs)) {
	      throw new TypeError('Expected `objectIDs` to be an array.');
	    }

	    var inferredPayload = inferPayload({
	      method: method,
	      results: results,
	      hits: hits,
	      objectIDs: payload.objectIDs
	    });
	    aa(method, _objectSpread$a(_objectSpread$a({}, inferredPayload), payload));
	  };
	};
	/**
	 * @deprecated This function will be still supported in 4.x releases, but not further. It is replaced by the `insights` middleware. For more information, visit https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-through-and-conversions/how-to/send-click-and-conversion-events-with-instantsearch/js/
	 * It passes `insights` to `HitsWithInsightsListener` and `InfiniteHitsWithInsightsListener`.
	 */


	function withInsights(connector) {
	  return function (renderFn, unmountFn) {
	    return connector(function (renderOptions, isFirstRender) {
	      var results = renderOptions.results,
	          hits = renderOptions.hits,
	          instantSearchInstance = renderOptions.instantSearchInstance;

	      if (results && hits && instantSearchInstance) {
	        var insights = wrapInsightsClient(instantSearchInstance.insightsClient, results, hits);
	        return renderFn(_objectSpread$a(_objectSpread$a({}, renderOptions), {}, {
	          insights: insights
	        }), isFirstRender);
	      }

	      return renderFn(renderOptions, isFirstRender);
	    }, unmountFn);
	  };
	}

	/** @jsx h */

	var findInsightsTarget = function findInsightsTarget(startElement, endElement, validator) {
	  var element = startElement;

	  while (element && !validator(element)) {
	    if (element === endElement) {
	      return null;
	    }

	    element = element.parentElement;
	  }

	  return element;
	};

	var parseInsightsEvent = function parseInsightsEvent(element) {
	  var serializedPayload = element.getAttribute('data-insights-event');

	  if (typeof serializedPayload !== 'string') {
	    throw new Error('The insights middleware expects `data-insights-event` to be a base64-encoded JSON string.');
	  }

	  try {
	    return deserializePayload(serializedPayload);
	  } catch (error) {
	    throw new Error('The insights middleware was unable to parse `data-insights-event`.');
	  }
	};

	var insightsListener = function insightsListener(BaseComponent) {
	  function WithInsightsListener(props) {
	    var handleClick = function handleClick(event) {
	      if (props.sendEvent) {
	        // new way with insights middleware
	        var targetWithEvent = findInsightsTarget(event.target, event.currentTarget, function (element) {
	          return element.hasAttribute('data-insights-event');
	        });

	        if (targetWithEvent) {
	          var payload = parseInsightsEvent(targetWithEvent);
	          payload.forEach(function (single) {
	            return props.sendEvent(single);
	          });
	        }
	      } // old way, e.g. instantsearch.insights("clickedObjectIDsAfterSearch", { .. })


	      var insightsTarget = findInsightsTarget(event.target, event.currentTarget, function (element) {
	        return hasDataAttributes(element);
	      });

	      if (insightsTarget) {
	        var _readDataAttributes = readDataAttributes(insightsTarget),
	            method = _readDataAttributes.method,
	            _payload = _readDataAttributes.payload;

	        props.insights(method, _payload);
	      }
	    };

	    return v("div", {
	      onClick: handleClick
	    }, v(BaseComponent, props));
	  }

	  return WithInsightsListener;
	};

	var withInsightsListener = insightsListener;

	function ownKeys$9(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$9(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$9(Object(source), true).forEach(function (key) { _defineProperty$9(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$9(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$9(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }

	var InfiniteHits = function InfiniteHits(_ref) {
	  var results = _ref.results,
	      hits = _ref.hits,
	      bindEvent = _ref.bindEvent,
	      hasShowPrevious = _ref.hasShowPrevious,
	      showPrevious = _ref.showPrevious,
	      showMore = _ref.showMore,
	      isFirstPage = _ref.isFirstPage,
	      isLastPage = _ref.isLastPage,
	      cssClasses = _ref.cssClasses,
	      templateProps = _ref.templateProps;

	  if (results.hits.length === 0) {
	    return v(Template$1, _extends$1({}, templateProps, {
	      templateKey: "empty",
	      rootProps: {
	        className: cx(cssClasses.root, cssClasses.emptyRoot)
	      },
	      data: results
	    }));
	  }

	  return v("div", {
	    className: cssClasses.root
	  }, hasShowPrevious && v(Template$1, _extends$1({}, templateProps, {
	    templateKey: "showPreviousText",
	    rootTagName: "button",
	    rootProps: {
	      className: cx(cssClasses.loadPrevious, _defineProperty$9({}, cssClasses.disabledLoadPrevious, isFirstPage)),
	      disabled: isFirstPage,
	      onClick: showPrevious
	    }
	  })), v("ol", {
	    className: cssClasses.list
	  }, hits.map(function (hit, position) {
	    return v(Template$1, _extends$1({}, templateProps, {
	      templateKey: "item",
	      rootTagName: "li",
	      rootProps: {
	        className: cssClasses.item
	      },
	      key: hit.objectID,
	      data: _objectSpread$9(_objectSpread$9({}, hit), {}, {
	        __hitIndex: position
	      }),
	      bindEvent: bindEvent
	    }));
	  })), v(Template$1, _extends$1({}, templateProps, {
	    templateKey: "showMoreText",
	    rootTagName: "button",
	    rootProps: {
	      className: cx(cssClasses.loadMore, _defineProperty$9({}, cssClasses.disabledLoadMore, isLastPage)),
	      disabled: isLastPage,
	      onClick: showMore
	    }
	  })));
	};

	var InfiniteHits$1 = InfiniteHits;

	function ownKeys$8(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$8(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$8(Object(source), true).forEach(function (key) { _defineProperty$8(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$8(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$8(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

	function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

	function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

	function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

	function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

	function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

	function _objectWithoutProperties$1(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$1(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

	function _objectWithoutPropertiesLoose$1(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
	var withUsage$7 = createDocumentationMessageGenerator({
	  name: 'infinite-hits',
	  connector: true
	});

	function getStateWithoutPage(state) {
	  var _ref = state || {};
	      _ref.page;
	      var rest = _objectWithoutProperties$1(_ref, ["page"]);

	  return rest;
	}

	function getInMemoryCache() {
	  var cachedHits = null;
	  var cachedState = null;
	  return {
	    read: function read(_ref2) {
	      var state = _ref2.state;
	      return isEqual(cachedState, getStateWithoutPage(state)) ? cachedHits : null;
	    },
	    write: function write(_ref3) {
	      var state = _ref3.state,
	          hits = _ref3.hits;
	      cachedState = getStateWithoutPage(state);
	      cachedHits = hits;
	    }
	  };
	}

	function extractHitsFromCachedHits(cachedHits) {
	  return Object.keys(cachedHits).map(Number).sort(function (a, b) {
	    return a - b;
	  }).reduce(function (acc, page) {
	    return acc.concat(cachedHits[page]);
	  }, []);
	}

	var connectInfiniteHits = function connectInfiniteHits(renderFn) {
	  var unmountFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
	  checkRendering(renderFn, withUsage$7()); // @TODO: this should be a generic, but a Connector can not yet be generic itself

	  return function (widgetParams) {
	    var _ref4 = widgetParams || {},
	        _ref4$escapeHTML = _ref4.escapeHTML,
	        escapeHTML = _ref4$escapeHTML === void 0 ? true : _ref4$escapeHTML,
	        _ref4$transformItems = _ref4.transformItems,
	        transformItems = _ref4$transformItems === void 0 ? function (items) {
	      return items;
	    } : _ref4$transformItems,
	        _ref4$cache = _ref4.cache,
	        cache = _ref4$cache === void 0 ? getInMemoryCache() : _ref4$cache;

	    var showPrevious;
	    var showMore;
	    var sendEvent;
	    var bindEvent;

	    var getFirstReceivedPage = function getFirstReceivedPage(state, cachedHits) {
	      var _state$page = state.page,
	          page = _state$page === void 0 ? 0 : _state$page;
	      var pages = Object.keys(cachedHits).map(Number);

	      if (pages.length === 0) {
	        return page;
	      } else {
	        return Math.min.apply(Math, [page].concat(_toConsumableArray(pages)));
	      }
	    };

	    var getLastReceivedPage = function getLastReceivedPage(state, cachedHits) {
	      var _state$page2 = state.page,
	          page = _state$page2 === void 0 ? 0 : _state$page2;
	      var pages = Object.keys(cachedHits).map(Number);

	      if (pages.length === 0) {
	        return page;
	      } else {
	        return Math.max.apply(Math, [page].concat(_toConsumableArray(pages)));
	      }
	    };

	    var getShowPrevious = function getShowPrevious(helper) {
	      return function () {
	        // Using the helper's `overrideStateWithoutTriggeringChangeEvent` method
	        // avoid updating the browser URL when the user displays the previous page.
	        helper.overrideStateWithoutTriggeringChangeEvent(_objectSpread$8(_objectSpread$8({}, helper.state), {}, {
	          page: getFirstReceivedPage(helper.state, cache.read({
	            state: helper.state
	          }) || {}) - 1
	        })).searchWithoutTriggeringOnStateChange();
	      };
	    };

	    var getShowMore = function getShowMore(helper) {
	      return function () {
	        helper.setPage(getLastReceivedPage(helper.state, cache.read({
	          state: helper.state
	        }) || {}) + 1).search();
	      };
	    };

	    return {
	      $$type: 'ais.infiniteHits',
	      init: function init(initOptions) {
	        renderFn(_objectSpread$8(_objectSpread$8({}, this.getWidgetRenderState(initOptions)), {}, {
	          instantSearchInstance: initOptions.instantSearchInstance
	        }), true);
	      },
	      render: function render(renderOptions) {
	        var instantSearchInstance = renderOptions.instantSearchInstance;
	        var widgetRenderState = this.getWidgetRenderState(renderOptions);
	        renderFn(_objectSpread$8(_objectSpread$8({}, widgetRenderState), {}, {
	          instantSearchInstance: instantSearchInstance
	        }), false);
	        sendEvent('view', widgetRenderState.currentPageHits);
	      },
	      getRenderState: function getRenderState(renderState, renderOptions) {
	        return _objectSpread$8(_objectSpread$8({}, renderState), {}, {
	          infiniteHits: this.getWidgetRenderState(renderOptions)
	        });
	      },
	      getWidgetRenderState: function getWidgetRenderState(_ref5) {
	        var results = _ref5.results,
	            helper = _ref5.helper,
	            state = _ref5.state,
	            instantSearchInstance = _ref5.instantSearchInstance;
	        var isFirstPage;
	        var currentPageHits = [];
	        var cachedHits = cache.read({
	          state: state
	        }) || {};

	        if (!results) {
	          showPrevious = getShowPrevious(helper);
	          showMore = getShowMore(helper);
	          sendEvent = createSendEventForHits({
	            instantSearchInstance: instantSearchInstance,
	            index: helper.getIndex(),
	            widgetType: this.$$type
	          });
	          bindEvent = createBindEventForHits({
	            index: helper.getIndex(),
	            widgetType: this.$$type
	          });
	          isFirstPage = state.page === undefined || getFirstReceivedPage(state, cachedHits) === 0;
	        } else {
	          var _state$page3 = state.page,
	              _page = _state$page3 === void 0 ? 0 : _state$page3;

	          if (escapeHTML && results.hits.length > 0) {
	            results.hits = escapeHits(results.hits);
	          }

	          var hitsWithAbsolutePosition = addAbsolutePosition(results.hits, results.page, results.hitsPerPage);
	          var hitsWithAbsolutePositionAndQueryID = addQueryID(hitsWithAbsolutePosition, results.queryID);
	          var transformedHits = transformItems(hitsWithAbsolutePositionAndQueryID, {
	            results: results
	          });

	          if (cachedHits[_page] === undefined && !results.__isArtificial) {
	            cachedHits[_page] = transformedHits;
	            cache.write({
	              state: state,
	              hits: cachedHits
	            });
	          }

	          currentPageHits = transformedHits;
	          isFirstPage = getFirstReceivedPage(state, cachedHits) === 0;
	        }

	        var hits = extractHitsFromCachedHits(cachedHits);
	        var isLastPage = results ? results.nbPages <= getLastReceivedPage(state, cachedHits) + 1 : true;
	        return {
	          hits: hits,
	          currentPageHits: currentPageHits,
	          sendEvent: sendEvent,
	          bindEvent: bindEvent,
	          results: results,
	          showPrevious: showPrevious,
	          showMore: showMore,
	          isFirstPage: isFirstPage,
	          isLastPage: isLastPage,
	          widgetParams: widgetParams
	        };
	      },
	      dispose: function dispose(_ref6) {
	        var state = _ref6.state;
	        unmountFn();
	        var stateWithoutPage = state.setQueryParameter('page', undefined);

	        if (!escapeHTML) {
	          return stateWithoutPage;
	        }

	        return stateWithoutPage.setQueryParameters(Object.keys(TAG_PLACEHOLDER).reduce(function (acc, key) {
	          return _objectSpread$8(_objectSpread$8({}, acc), {}, _defineProperty$8({}, key, undefined));
	        }, {}));
	      },
	      getWidgetUiState: function getWidgetUiState(uiState, _ref7) {
	        var searchParameters = _ref7.searchParameters;
	        var page = searchParameters.page || 0;

	        if (!page) {
	          // return without adding `page` to uiState
	          // because we don't want `page=1` in the URL
	          return uiState;
	        }

	        return _objectSpread$8(_objectSpread$8({}, uiState), {}, {
	          // The page in the UI state is incremented by one
	          // to expose the user value (not `0`).
	          page: page + 1
	        });
	      },
	      getWidgetSearchParameters: function getWidgetSearchParameters(searchParameters, _ref8) {
	        var uiState = _ref8.uiState;
	        var widgetSearchParameters = searchParameters;

	        if (escapeHTML) {
	          widgetSearchParameters = searchParameters.setQueryParameters(TAG_PLACEHOLDER);
	        } // The page in the search parameters is decremented by one
	        // to get to the actual parameter value from the UI state.


	        var page = uiState.page ? uiState.page - 1 : 0;
	        return widgetSearchParameters.setQueryParameter('page', page);
	      }
	    };
	  };
	};

	var connectInfiniteHits$1 = connectInfiniteHits;

	var defaultTemplates$2 = {
	  empty: 'No results',
	  showPreviousText: 'Show previous results',
	  showMoreText: 'Show more results',
	  item: function item(data) {
	    return JSON.stringify(data, null, 2);
	  }
	};
	var defaultTemplates$3 = defaultTemplates$2;

	function ownKeys$7(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$7(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$7(Object(source), true).forEach(function (key) { _defineProperty$7(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$7(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$7(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	var withUsage$6 = createDocumentationMessageGenerator({
	  name: 'infinite-hits'
	});
	var suit$3 = component('InfiniteHits');
	var InfiniteHitsWithInsightsListener = withInsightsListener(InfiniteHits$1);

	var renderer$3 = function renderer(_ref) {
	  var containerNode = _ref.containerNode,
	      cssClasses = _ref.cssClasses,
	      renderState = _ref.renderState,
	      templates = _ref.templates,
	      hasShowPrevious = _ref.showPrevious;
	  return function (_ref2, isFirstRendering) {
	    var hits = _ref2.hits,
	        results = _ref2.results,
	        showMore = _ref2.showMore,
	        showPrevious = _ref2.showPrevious,
	        isFirstPage = _ref2.isFirstPage,
	        isLastPage = _ref2.isLastPage,
	        instantSearchInstance = _ref2.instantSearchInstance,
	        insights = _ref2.insights,
	        bindEvent = _ref2.bindEvent;

	    if (isFirstRendering) {
	      renderState.templateProps = prepareTemplateProps({
	        defaultTemplates: defaultTemplates$3,
	        templatesConfig: instantSearchInstance.templatesConfig,
	        templates: templates
	      });
	      return;
	    }

	    S(v(InfiniteHitsWithInsightsListener, {
	      cssClasses: cssClasses,
	      hits: hits,
	      results: results,
	      hasShowPrevious: hasShowPrevious,
	      showPrevious: showPrevious,
	      showMore: showMore,
	      templateProps: renderState.templateProps,
	      isFirstPage: isFirstPage,
	      isLastPage: isLastPage,
	      insights: insights,
	      sendEvent: function sendEvent(event) {
	        instantSearchInstance.sendEventToInsights(event);
	      },
	      bindEvent: bindEvent
	    }), containerNode);
	  };
	};

	var infiniteHits = function infiniteHits(widgetParams) {
	  var _ref3 = widgetParams || {},
	      container = _ref3.container,
	      escapeHTML = _ref3.escapeHTML,
	      transformItems = _ref3.transformItems,
	      _ref3$templates = _ref3.templates,
	      templates = _ref3$templates === void 0 ? {} : _ref3$templates,
	      _ref3$cssClasses = _ref3.cssClasses,
	      userCssClasses = _ref3$cssClasses === void 0 ? {} : _ref3$cssClasses,
	      showPrevious = _ref3.showPrevious,
	      cache = _ref3.cache;

	  if (!container) {
	    throw new Error(withUsage$6('The `container` option is required.'));
	  }

	  var containerNode = getContainerNode(container);
	  var cssClasses = {
	    root: cx(suit$3(), userCssClasses.root),
	    emptyRoot: cx(suit$3({
	      modifierName: 'empty'
	    }), userCssClasses.emptyRoot),
	    item: cx(suit$3({
	      descendantName: 'item'
	    }), userCssClasses.item),
	    list: cx(suit$3({
	      descendantName: 'list'
	    }), userCssClasses.list),
	    loadPrevious: cx(suit$3({
	      descendantName: 'loadPrevious'
	    }), userCssClasses.loadPrevious),
	    disabledLoadPrevious: cx(suit$3({
	      descendantName: 'loadPrevious',
	      modifierName: 'disabled'
	    }), userCssClasses.disabledLoadPrevious),
	    loadMore: cx(suit$3({
	      descendantName: 'loadMore'
	    }), userCssClasses.loadMore),
	    disabledLoadMore: cx(suit$3({
	      descendantName: 'loadMore',
	      modifierName: 'disabled'
	    }), userCssClasses.disabledLoadMore)
	  };
	  var specializedRenderer = renderer$3({
	    containerNode: containerNode,
	    cssClasses: cssClasses,
	    templates: templates,
	    showPrevious: showPrevious,
	    renderState: {}
	  });
	  var makeWidget = withInsights(connectInfiniteHits$1)(specializedRenderer, function () {
	    return S(null, containerNode);
	  });
	  return _objectSpread$7(_objectSpread$7({}, makeWidget({
	    escapeHTML: escapeHTML,
	    transformItems: transformItems,
	    showPrevious: showPrevious,
	    cache: cache
	  })), {}, {
	    $$widgetType: 'ais.infiniteHits'
	  });
	};

	var infiniteHits$1 = infiniteHits;

	/** @jsx h */

	var _ref2 = v("path", {
	  fill: "#5468FF",
	  d: "M78.99.94h16.6a2.97 2.97 0 012.96 2.96v16.6a2.97 2.97 0 01-2.97 2.96h-16.6a2.97 2.97 0 01-2.96-2.96V3.9A2.96 2.96 0 0179 .94"
	});

	var _ref3 = v("path", {
	  fill: "#FFF",
	  d: "M89.63 5.97v-.78a.98.98 0 00-.98-.97h-2.28a.98.98 0 00-.97.97V6c0 .09.08.15.17.13a7.13 7.13 0 013.9-.02c.08.02.16-.04.16-.13m-6.25 1L83 6.6a.98.98 0 00-1.38 0l-.46.46a.97.97 0 000 1.38l.38.39c.06.06.15.04.2-.02a7.49 7.49 0 011.63-1.62c.07-.04.08-.14.02-.2m4.16 2.45v3.34c0 .1.1.17.2.12l2.97-1.54c.06-.03.08-.12.05-.18a3.7 3.7 0 00-3.08-1.87c-.07 0-.14.06-.14.13m0 8.05a4.49 4.49 0 110-8.98 4.49 4.49 0 010 8.98m0-10.85a6.37 6.37 0 100 12.74 6.37 6.37 0 000-12.74"
	});

	var PoweredBy = function PoweredBy(_ref) {
	  var url = _ref.url,
	      theme = _ref.theme,
	      cssClasses = _ref.cssClasses;
	  return v("div", {
	    className: cssClasses.root
	  }, v("a", {
	    href: url,
	    target: "_blank",
	    className: cssClasses.link,
	    "aria-label": "Search by Algolia",
	    rel: "noopener noreferrer"
	  }, v("svg", {
	    height: "1.2em",
	    className: cssClasses.logo,
	    viewBox: "0 0 168 24" // This style is necessary as long as it's not included in InstantSearch.css.
	    // For now, InstantSearch.css sets a maximum width of 70px.
	    ,
	    style: {
	      width: 'auto'
	    }
	  }, v("path", {
	    fill: theme === 'dark' ? '#FFF' : '#5D6494',
	    d: "M6.97 6.68V8.3a4.47 4.47 0 00-2.42-.67 2.2 2.2 0 00-1.38.4c-.34.26-.5.6-.5 1.02 0 .43.16.77.49 1.03.33.25.83.53 1.51.83a7.04 7.04 0 011.9 1.08c.34.24.58.54.73.89.15.34.23.74.23 1.18 0 .95-.33 1.7-1 2.24a4 4 0 01-2.6.81 5.71 5.71 0 01-2.94-.68v-1.71c.84.63 1.81.94 2.92.94.58 0 1.05-.14 1.39-.4.34-.28.5-.65.5-1.13 0-.29-.1-.55-.3-.8a2.2 2.2 0 00-.65-.53 23.03 23.03 0 00-1.64-.78 13.67 13.67 0 01-1.11-.64c-.12-.1-.28-.22-.46-.4a1.72 1.72 0 01-.39-.5 4.46 4.46 0 01-.22-.6c-.07-.23-.1-.48-.1-.75 0-.91.33-1.63 1-2.17a4 4 0 012.57-.8c.97 0 1.8.18 2.47.52zm7.47 5.7v-.3a2.26 2.26 0 00-.5-1.44c-.3-.35-.74-.53-1.32-.53-.53 0-.99.2-1.37.58a2.9 2.9 0 00-.72 1.68h3.91zm1 2.79v1.4c-.6.34-1.38.51-2.36.51a4.02 4.02 0 01-3-1.13 4.04 4.04 0 01-1.11-2.97c0-1.3.34-2.32 1.02-3.06a3.38 3.38 0 012.6-1.1c1.03 0 1.85.32 2.46.96.6.64.9 1.57.9 2.78 0 .33-.03.68-.09 1.04h-5.31c.1.7.4 1.24.89 1.61.49.38 1.1.56 1.85.56.86 0 1.58-.2 2.15-.6zm6.61-1.78h-1.21c-.6 0-1.05.12-1.35.36-.3.23-.46.53-.46.89 0 .37.12.66.36.88.23.2.57.32 1.02.32.5 0 .9-.15 1.2-.43.3-.28.44-.65.44-1.1v-.92zm-4.07-2.55V9.33a4.96 4.96 0 012.5-.55c2.1 0 3.17 1.03 3.17 3.08V17H22.1v-.96c-.42.68-1.15 1.02-2.19 1.02-.76 0-1.38-.22-1.84-.66-.46-.44-.7-1-.7-1.68 0-.78.3-1.38.88-1.81.59-.43 1.4-.65 2.46-.65h1.34v-.46c0-.55-.13-.97-.4-1.25-.26-.29-.7-.43-1.32-.43-.86 0-1.65.24-2.35.72zm9.34-1.93v1.42c.39-1 1.1-1.5 2.12-1.5.15 0 .31.02.5.05v1.53c-.23-.1-.48-.14-.76-.14-.54 0-.99.24-1.34.71a2.8 2.8 0 00-.52 1.71V17h-1.57V8.91h1.57zm5 4.09a3 3 0 00.76 2.01c.47.53 1.14.8 2 .8.64 0 1.24-.18 1.8-.53v1.4c-.53.32-1.2.48-2 .48a3.98 3.98 0 01-4.17-4.18c0-1.16.38-2.15 1.14-2.98a4 4 0 013.1-1.23c.7 0 1.34.15 1.92.44v1.44a3.24 3.24 0 00-1.77-.5A2.65 2.65 0 0032.33 13zm7.92-7.28v4.58c.46-1 1.3-1.5 2.5-1.5.8 0 1.42.24 1.9.73.48.5.72 1.17.72 2.05V17H43.8v-5.1c0-.56-.14-.99-.43-1.29-.28-.3-.65-.45-1.1-.45-.54 0-1 .2-1.42.6-.4.4-.61 1.02-.61 1.85V17h-1.56V5.72h1.56zM55.2 15.74c.6 0 1.1-.25 1.5-.76.4-.5.6-1.16.6-1.95 0-.92-.2-1.62-.6-2.12-.4-.5-.92-.74-1.55-.74-.56 0-1.05.22-1.5.67-.44.45-.66 1.13-.66 2.06 0 .96.22 1.67.64 2.14.43.47.95.7 1.57.7zM53 5.72v4.42a2.74 2.74 0 012.43-1.34c1.03 0 1.86.38 2.51 1.15.65.76.97 1.78.97 3.05 0 1.13-.3 2.1-.92 2.9-.62.81-1.47 1.21-2.54 1.21s-1.9-.45-2.46-1.34V17h-1.58V5.72H53zm9.9 11.1l-3.22-7.9h1.74l1 2.62 1.26 3.42c.1-.32.48-1.46 1.15-3.42l.91-2.63h1.66l-2.92 7.87c-.78 2.07-1.96 3.1-3.56 3.1-.28 0-.53-.02-.73-.07v-1.34c.17.04.35.06.54.06 1.03 0 1.76-.57 2.17-1.7z"
	  }), _ref2, _ref3, v("path", {
	    fill: theme === 'dark' ? '#FFF' : '#5468FF',
	    d: "M120.92 18.8c-4.38.02-4.38-3.54-4.38-4.1V1.36l2.67-.42v13.25c0 .32 0 2.36 1.71 2.37v2.24zm-10.84-2.18c.82 0 1.43-.04 1.85-.12v-2.72a5.48 5.48 0 00-1.57-.2c-.3 0-.6.02-.9.07-.3.04-.57.12-.81.24-.24.11-.44.28-.58.49a.93.93 0 00-.22.65c0 .63.22 1 .61 1.23.4.24.94.36 1.62.36zm-.23-9.7c.88 0 1.62.11 2.23.33.6.22 1.09.53 1.44.92.36.4.61.92.76 1.48.16.56.23 1.17.23 1.85v6.87a21.69 21.69 0 01-4.68.5c-.69 0-1.32-.07-1.9-.2a4 4 0 01-1.46-.63 3.3 3.3 0 01-.96-1.13 4.3 4.3 0 01-.34-1.8 3.13 3.13 0 011.43-2.63c.45-.3.95-.5 1.54-.62a8.8 8.8 0 013.79.05v-.44c0-.3-.04-.6-.11-.87a1.78 1.78 0 00-1.1-1.22 3.2 3.2 0 00-1.15-.2 9.75 9.75 0 00-2.95.46l-.33-2.19a11.43 11.43 0 013.56-.53zm52.84 9.63c.82 0 1.43-.05 1.85-.13V13.7a5.42 5.42 0 00-1.57-.2c-.3 0-.6.02-.9.07-.3.04-.57.12-.81.24-.24.12-.44.28-.58.5a.93.93 0 00-.22.65c0 .63.22.99.61 1.23.4.24.94.36 1.62.36zm-.23-9.7c.88 0 1.63.11 2.23.33.6.22 1.1.53 1.45.92.35.39.6.92.76 1.48.15.56.23 1.18.23 1.85v6.88c-.41.08-1.03.19-1.87.31-.83.12-1.77.18-2.81.18-.7 0-1.33-.06-1.9-.2a4 4 0 01-1.47-.63c-.4-.3-.72-.67-.95-1.13a4.3 4.3 0 01-.34-1.8c0-.66.13-1.08.38-1.53.26-.45.61-.82 1.05-1.1.44-.3.95-.5 1.53-.62a8.8 8.8 0 013.8.05v-.43c0-.31-.04-.6-.12-.88-.07-.28-.2-.52-.38-.73a1.78 1.78 0 00-.73-.5c-.3-.1-.68-.2-1.14-.2a9.85 9.85 0 00-2.95.47l-.32-2.19a11.63 11.63 0 013.55-.53zm-8.03-1.27a1.62 1.62 0 000-3.24 1.62 1.62 0 100 3.24zm1.35 13.22h-2.7V7.27l2.7-.42V18.8zm-4.72 0c-4.38.02-4.38-3.54-4.38-4.1l-.01-13.34 2.67-.42v13.25c0 .32 0 2.36 1.72 2.37v2.24zm-8.7-5.9a4.7 4.7 0 00-.74-2.79 2.4 2.4 0 00-2.07-1 2.4 2.4 0 00-2.06 1 4.7 4.7 0 00-.74 2.8c0 1.16.25 1.94.74 2.62a2.4 2.4 0 002.07 1.02c.88 0 1.57-.34 2.07-1.02a4.2 4.2 0 00.73-2.63zm2.74 0a6.46 6.46 0 01-1.52 4.23c-.49.53-1.07.94-1.76 1.22-.68.29-1.73.45-2.26.45a6.6 6.6 0 01-2.25-.45 5.1 5.1 0 01-2.88-3.13 7.3 7.3 0 01-.01-4.84 5.13 5.13 0 012.9-3.1 5.67 5.67 0 012.22-.42c.81 0 1.56.14 2.24.42.69.29 1.28.69 1.75 1.22.49.52.87 1.15 1.14 1.89a7 7 0 01.43 2.5zm-20.14 0c0 1.11.25 2.36.74 2.88.5.52 1.13.78 1.91.78a4.07 4.07 0 002.12-.6V9.33c-.19-.04-.99-.2-1.76-.23a2.67 2.67 0 00-2.23 1 4.73 4.73 0 00-.78 2.8zm7.44 5.27c0 1.82-.46 3.16-1.4 4-.94.85-2.37 1.27-4.3 1.27-.7 0-2.17-.13-3.34-.4l.43-2.11c.98.2 2.27.26 2.95.26 1.08 0 1.84-.22 2.3-.66.46-.43.68-1.08.68-1.94v-.44a5.2 5.2 0 01-2.54.6 5.6 5.6 0 01-2.01-.36 4.2 4.2 0 01-2.58-2.71 9.88 9.88 0 01.02-5.35 4.92 4.92 0 012.93-2.96 6.6 6.6 0 012.43-.46 19.64 19.64 0 014.43.66v10.6z"
	  }))));
	};

	var PoweredBy$1 = PoweredBy;

	function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$6(Object(source), true).forEach(function (key) { _defineProperty$6(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$6(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$6(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	var withUsage$5 = createDocumentationMessageGenerator({
	  name: 'powered-by',
	  connector: true
	});

	/**
	 * **PoweredBy** connector provides the logic to build a custom widget that will displays
	 * the logo to redirect to Algolia.
	 */
	var connectPoweredBy = function connectPoweredBy(renderFn) {
	  var unmountFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
	  checkRendering(renderFn, withUsage$5());
	  var defaultUrl = 'https://www.algolia.com/?' + 'utm_source=instantsearch.js&' + 'utm_medium=website&' + "utm_content=".concat(safelyRunOnBrowser(function (_ref) {
	    var _window$location;

	    var window = _ref.window;
	    return ((_window$location = window.location) === null || _window$location === void 0 ? void 0 : _window$location.hostname) || '';
	  }, {
	    fallback: function fallback() {
	      return '';
	    }
	  }), "&") + 'utm_campaign=poweredby';
	  return function (widgetParams) {
	    var _ref2 = widgetParams || {},
	        _ref2$url = _ref2.url,
	        url = _ref2$url === void 0 ? defaultUrl : _ref2$url;

	    return {
	      $$type: 'ais.poweredBy',
	      init: function init(initOptions) {
	        var instantSearchInstance = initOptions.instantSearchInstance;
	        renderFn(_objectSpread$6(_objectSpread$6({}, this.getWidgetRenderState(initOptions)), {}, {
	          instantSearchInstance: instantSearchInstance
	        }), true);
	      },
	      render: function render(renderOptions) {
	        var instantSearchInstance = renderOptions.instantSearchInstance;
	        renderFn(_objectSpread$6(_objectSpread$6({}, this.getWidgetRenderState(renderOptions)), {}, {
	          instantSearchInstance: instantSearchInstance
	        }), false);
	      },
	      getRenderState: function getRenderState(renderState, renderOptions) {
	        return _objectSpread$6(_objectSpread$6({}, renderState), {}, {
	          poweredBy: this.getWidgetRenderState(renderOptions)
	        });
	      },
	      getWidgetRenderState: function getWidgetRenderState() {
	        return {
	          url: url,
	          widgetParams: widgetParams
	        };
	      },
	      dispose: function dispose() {
	        unmountFn();
	      }
	    };
	  };
	};

	var connectPoweredBy$1 = connectPoweredBy;

	function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$5(Object(source), true).forEach(function (key) { _defineProperty$5(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$5(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	var suit$2 = component('PoweredBy');
	var withUsage$4 = createDocumentationMessageGenerator({
	  name: 'powered-by'
	});

	var renderer$2 = function renderer(_ref) {
	  var containerNode = _ref.containerNode,
	      cssClasses = _ref.cssClasses;
	  return function (_ref2, isFirstRendering) {
	    var url = _ref2.url,
	        widgetParams = _ref2.widgetParams;

	    if (isFirstRendering) {
	      var _widgetParams$theme = widgetParams.theme,
	          theme = _widgetParams$theme === void 0 ? 'light' : _widgetParams$theme;
	      S(v(PoweredBy$1, {
	        cssClasses: cssClasses,
	        url: url,
	        theme: theme
	      }), containerNode);
	      return;
	    }
	  };
	};

	var poweredBy = function poweredBy(widgetParams) {
	  var _ref3 = widgetParams || {},
	      container = _ref3.container,
	      _ref3$cssClasses = _ref3.cssClasses,
	      userCssClasses = _ref3$cssClasses === void 0 ? {} : _ref3$cssClasses,
	      _ref3$theme = _ref3.theme,
	      theme = _ref3$theme === void 0 ? 'light' : _ref3$theme;

	  if (!container) {
	    throw new Error(withUsage$4('The `container` option is required.'));
	  }

	  var containerNode = getContainerNode(container);
	  var cssClasses = {
	    root: cx(suit$2(), suit$2({
	      modifierName: theme === 'dark' ? 'dark' : 'light'
	    }), userCssClasses.root),
	    link: cx(suit$2({
	      descendantName: 'link'
	    }), userCssClasses.link),
	    logo: cx(suit$2({
	      descendantName: 'logo'
	    }), userCssClasses.logo)
	  };
	  var specializedRenderer = renderer$2({
	    containerNode: containerNode,
	    cssClasses: cssClasses
	  });
	  var makeWidget = connectPoweredBy$1(specializedRenderer, function () {
	    return S(null, containerNode);
	  });
	  return _objectSpread$5(_objectSpread$5({}, makeWidget({
	    theme: theme
	  })), {}, {
	    $$widgetType: 'ais.poweredBy'
	  });
	};

	var poweredBy$1 = poweredBy;

	var defaultTemplate = {
	  reset: "\n<svg class=\"{{cssClasses.resetIcon}}\" viewBox=\"0 0 20 20\" width=\"10\" height=\"10\">\n  <path d=\"M8.114 10L.944 2.83 0 1.885 1.886 0l.943.943L10 8.113l7.17-7.17.944-.943L20 1.886l-.943.943-7.17 7.17 7.17 7.17.943.944L18.114 20l-.943-.943-7.17-7.17-7.17 7.17-.944.943L0 18.114l.943-.943L8.113 10z\"></path>\n</svg>\n  ",
	  submit: "\n<svg class=\"{{cssClasses.submitIcon}}\" width=\"10\" height=\"10\" viewBox=\"0 0 40 40\">\n  <path d=\"M26.804 29.01c-2.832 2.34-6.465 3.746-10.426 3.746C7.333 32.756 0 25.424 0 16.378 0 7.333 7.333 0 16.378 0c9.046 0 16.378 7.333 16.378 16.378 0 3.96-1.406 7.594-3.746 10.426l10.534 10.534c.607.607.61 1.59-.004 2.202-.61.61-1.597.61-2.202.004L26.804 29.01zm-10.426.627c7.323 0 13.26-5.936 13.26-13.26 0-7.32-5.937-13.257-13.26-13.257C9.056 3.12 3.12 9.056 3.12 16.378c0 7.323 5.936 13.26 13.258 13.26z\"></path>\n</svg>\n  ",
	  loadingIndicator: "\n<svg class=\"{{cssClasses.loadingIcon}}\" width=\"16\" height=\"16\" viewBox=\"0 0 38 38\" stroke=\"#444\">\n  <g fill=\"none\" fillRule=\"evenodd\">\n    <g transform=\"translate(1 1)\" strokeWidth=\"2\">\n      <circle strokeOpacity=\".5\" cx=\"18\" cy=\"18\" r=\"18\" />\n      <path d=\"M36 18c0-9.94-8.06-18-18-18\">\n        <animateTransform\n          attributeName=\"transform\"\n          type=\"rotate\"\n          from=\"0 18 18\"\n          to=\"360 18 18\"\n          dur=\"1s\"\n          repeatCount=\"indefinite\"\n        />\n      </path>\n    </g>\n  </g>\n</svg>\n  "
	};
	var defaultTemplates$1 = defaultTemplate;

	function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(Object(source), true).forEach(function (key) { _defineProperty$4(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$4(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	var withUsage$3 = createDocumentationMessageGenerator({
	  name: 'search-box',
	  connector: true
	});

	var defaultQueryHook = function defaultQueryHook(query, hook) {
	  return hook(query);
	};
	/**
	 * **SearchBox** connector provides the logic to build a widget that will let the user search for a query.
	 *
	 * The connector provides to the rendering: `refine()` to set the query. The behaviour of this function
	 * may be impacted by the `queryHook` widget parameter.
	 */


	var connectSearchBox = function connectSearchBox(renderFn) {
	  var unmountFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
	  checkRendering(renderFn, withUsage$3());
	  return function (widgetParams) {
	    var _ref = widgetParams || {},
	        _ref$queryHook = _ref.queryHook,
	        queryHook = _ref$queryHook === void 0 ? defaultQueryHook : _ref$queryHook;

	    var _refine;

	    var _clear;

	    return {
	      $$type: 'ais.searchBox',
	      init: function init(initOptions) {
	        var instantSearchInstance = initOptions.instantSearchInstance;
	        renderFn(_objectSpread$4(_objectSpread$4({}, this.getWidgetRenderState(initOptions)), {}, {
	          instantSearchInstance: instantSearchInstance
	        }), true);
	      },
	      render: function render(renderOptions) {
	        var instantSearchInstance = renderOptions.instantSearchInstance;
	        renderFn(_objectSpread$4(_objectSpread$4({}, this.getWidgetRenderState(renderOptions)), {}, {
	          instantSearchInstance: instantSearchInstance
	        }), false);
	      },
	      dispose: function dispose(_ref2) {
	        var state = _ref2.state;
	        unmountFn();
	        return state.setQueryParameter('query', undefined);
	      },
	      getRenderState: function getRenderState(renderState, renderOptions) {
	        return _objectSpread$4(_objectSpread$4({}, renderState), {}, {
	          searchBox: this.getWidgetRenderState(renderOptions)
	        });
	      },
	      getWidgetRenderState: function getWidgetRenderState(_ref3) {
	        var helper = _ref3.helper,
	            searchMetadata = _ref3.searchMetadata,
	            state = _ref3.state;

	        if (!_refine) {
	          _refine = function _refine(query) {
	            queryHook(query, function (q) {
	              return helper.setQuery(q).search();
	            });
	          };

	          _clear = function _clear() {
	            helper.setQuery('').search();
	          };
	        }

	        return {
	          query: state.query || '',
	          refine: _refine,
	          clear: _clear,
	          widgetParams: widgetParams,
	          isSearchStalled: searchMetadata.isSearchStalled
	        };
	      },
	      getWidgetUiState: function getWidgetUiState(uiState, _ref4) {
	        var searchParameters = _ref4.searchParameters;
	        var query = searchParameters.query || '';

	        if (query === '' || uiState && uiState.query === query) {
	          return uiState;
	        }

	        return _objectSpread$4(_objectSpread$4({}, uiState), {}, {
	          query: query
	        });
	      },
	      getWidgetSearchParameters: function getWidgetSearchParameters(searchParameters, _ref5) {
	        var uiState = _ref5.uiState;
	        return searchParameters.setQueryParameter('query', uiState.query || '');
	      }
	    };
	  };
	};

	var connectSearchBox$1 = connectSearchBox;

	function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { _defineProperty$3(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$3(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	var withUsage$2 = createDocumentationMessageGenerator({
	  name: 'search-box'
	});
	var suit$1 = component('SearchBox');

	var renderer$1 = function renderer(_ref) {
	  var containerNode = _ref.containerNode,
	      cssClasses = _ref.cssClasses,
	      placeholder = _ref.placeholder,
	      templates = _ref.templates,
	      autofocus = _ref.autofocus,
	      searchAsYouType = _ref.searchAsYouType,
	      showReset = _ref.showReset,
	      showSubmit = _ref.showSubmit,
	      showLoadingIndicator = _ref.showLoadingIndicator;
	  return function (_ref2) {
	    var refine = _ref2.refine,
	        query = _ref2.query,
	        isSearchStalled = _ref2.isSearchStalled;
	    S(v(SearchBox$1, {
	      query: query,
	      placeholder: placeholder,
	      autofocus: autofocus,
	      refine: refine,
	      searchAsYouType: searchAsYouType,
	      templates: templates,
	      showSubmit: showSubmit,
	      showReset: showReset,
	      showLoadingIndicator: showLoadingIndicator,
	      isSearchStalled: isSearchStalled,
	      cssClasses: cssClasses
	    }), containerNode);
	  };
	};
	/**
	 * The searchbox widget is used to let the user set a text based query.
	 *
	 * This is usually the  main entry point to start the search in an instantsearch context. For that
	 * reason is usually placed on top, and not hidden so that the user can start searching right
	 * away.
	 *
	 */


	var searchBox = function searchBox(widgetParams) {
	  var _ref3 = widgetParams || {},
	      container = _ref3.container,
	      _ref3$placeholder = _ref3.placeholder,
	      placeholder = _ref3$placeholder === void 0 ? '' : _ref3$placeholder,
	      _ref3$cssClasses = _ref3.cssClasses,
	      userCssClasses = _ref3$cssClasses === void 0 ? {} : _ref3$cssClasses,
	      _ref3$autofocus = _ref3.autofocus,
	      autofocus = _ref3$autofocus === void 0 ? false : _ref3$autofocus,
	      _ref3$searchAsYouType = _ref3.searchAsYouType,
	      searchAsYouType = _ref3$searchAsYouType === void 0 ? true : _ref3$searchAsYouType,
	      _ref3$showReset = _ref3.showReset,
	      showReset = _ref3$showReset === void 0 ? true : _ref3$showReset,
	      _ref3$showSubmit = _ref3.showSubmit,
	      showSubmit = _ref3$showSubmit === void 0 ? true : _ref3$showSubmit,
	      _ref3$showLoadingIndi = _ref3.showLoadingIndicator,
	      showLoadingIndicator = _ref3$showLoadingIndi === void 0 ? true : _ref3$showLoadingIndi,
	      queryHook = _ref3.queryHook,
	      _ref3$templates = _ref3.templates,
	      userTemplates = _ref3$templates === void 0 ? {} : _ref3$templates;

	  if (!container) {
	    throw new Error(withUsage$2('The `container` option is required.'));
	  }

	  var containerNode = getContainerNode(container);
	  var cssClasses = {
	    root: cx(suit$1(), userCssClasses.root),
	    form: cx(suit$1({
	      descendantName: 'form'
	    }), userCssClasses.form),
	    input: cx(suit$1({
	      descendantName: 'input'
	    }), userCssClasses.input),
	    submit: cx(suit$1({
	      descendantName: 'submit'
	    }), userCssClasses.submit),
	    submitIcon: cx(suit$1({
	      descendantName: 'submitIcon'
	    }), userCssClasses.submitIcon),
	    reset: cx(suit$1({
	      descendantName: 'reset'
	    }), userCssClasses.reset),
	    resetIcon: cx(suit$1({
	      descendantName: 'resetIcon'
	    }), userCssClasses.resetIcon),
	    loadingIndicator: cx(suit$1({
	      descendantName: 'loadingIndicator'
	    }), userCssClasses.loadingIndicator),
	    loadingIcon: cx(suit$1({
	      descendantName: 'loadingIcon'
	    }), userCssClasses.loadingIcon)
	  };

	  var templates = _objectSpread$3(_objectSpread$3({}, defaultTemplates$1), userTemplates);

	  var specializedRenderer = renderer$1({
	    containerNode: containerNode,
	    cssClasses: cssClasses,
	    placeholder: placeholder,
	    templates: templates,
	    autofocus: autofocus,
	    searchAsYouType: searchAsYouType,
	    showReset: showReset,
	    showSubmit: showSubmit,
	    showLoadingIndicator: showLoadingIndicator
	  });
	  var makeWidget = connectSearchBox$1(specializedRenderer, function () {
	    return S(null, containerNode);
	  });
	  return _objectSpread$3(_objectSpread$3({}, makeWidget({
	    queryHook: queryHook
	  })), {}, {
	    $$widgetType: 'ais.searchBox'
	  });
	};

	var searchBox$1 = searchBox;

	function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

	function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty$2(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

	function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

	var Stats = function Stats(_ref) {
	  var nbHits = _ref.nbHits,
	      nbSortedHits = _ref.nbSortedHits,
	      cssClasses = _ref.cssClasses,
	      templateProps = _ref.templateProps,
	      rest = _objectWithoutProperties(_ref, ["nbHits", "nbSortedHits", "cssClasses", "templateProps"]);

	  return v("div", {
	    className: cx(cssClasses.root)
	  }, v(Template$1, _extends({}, templateProps, {
	    templateKey: "text",
	    rootTagName: "span",
	    rootProps: {
	      className: cssClasses.text
	    },
	    data: _objectSpread$2({
	      hasManySortedResults: nbSortedHits && nbSortedHits > 1,
	      hasNoSortedResults: nbSortedHits === 0,
	      hasOneSortedResults: nbSortedHits === 1,
	      hasManyResults: nbHits > 1,
	      hasNoResults: nbHits === 0,
	      hasOneResult: nbHits === 1,
	      nbHits: nbHits,
	      nbSortedHits: nbSortedHits,
	      cssClasses: cssClasses
	    }, rest)
	  })));
	};

	var Stats$1 = Stats;

	function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	var withUsage$1 = createDocumentationMessageGenerator({
	  name: 'stats',
	  connector: true
	});
	/**
	 * **Stats** connector provides the logic to build a custom widget that will displays
	 * search statistics (hits number and processing time).
	 */

	var connectStats = function connectStats(renderFn) {
	  var unmountFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
	  checkRendering(renderFn, withUsage$1());
	  return function (widgetParams) {
	    return {
	      $$type: 'ais.stats',
	      init: function init(initOptions) {
	        var instantSearchInstance = initOptions.instantSearchInstance;
	        renderFn(_objectSpread$1(_objectSpread$1({}, this.getWidgetRenderState(initOptions)), {}, {
	          instantSearchInstance: instantSearchInstance
	        }), true);
	      },
	      render: function render(renderOptions) {
	        var instantSearchInstance = renderOptions.instantSearchInstance;
	        renderFn(_objectSpread$1(_objectSpread$1({}, this.getWidgetRenderState(renderOptions)), {}, {
	          instantSearchInstance: instantSearchInstance
	        }), false);
	      },
	      dispose: function dispose() {
	        unmountFn();
	      },
	      getRenderState: function getRenderState(renderState, renderOptions) {
	        return _objectSpread$1(_objectSpread$1({}, renderState), {}, {
	          stats: this.getWidgetRenderState(renderOptions)
	        });
	      },
	      getWidgetRenderState: function getWidgetRenderState(_ref) {
	        var results = _ref.results,
	            state = _ref.state;

	        if (!results) {
	          return {
	            hitsPerPage: state.hitsPerPage,
	            nbHits: 0,
	            nbSortedHits: undefined,
	            areHitsSorted: false,
	            nbPages: 0,
	            page: state.page || 0,
	            processingTimeMS: -1,
	            query: state.query || '',
	            widgetParams: widgetParams
	          };
	        }

	        return {
	          hitsPerPage: results.hitsPerPage,
	          nbHits: results.nbHits,
	          nbSortedHits: results.nbSortedHits,
	          areHitsSorted: typeof results.appliedRelevancyStrictness !== 'undefined' && results.appliedRelevancyStrictness > 0 && results.nbSortedHits !== results.nbHits,
	          nbPages: results.nbPages,
	          page: results.page,
	          processingTimeMS: results.processingTimeMS,
	          query: results.query,
	          widgetParams: widgetParams
	        };
	      }
	    };
	  };
	};

	var connectStats$1 = connectStats;

	function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	var withUsage = createDocumentationMessageGenerator({
	  name: 'stats'
	});
	var suit = component('Stats');
	var defaultTemplates = {
	  text: "\n    {{#areHitsSorted}}\n      {{#hasNoSortedResults}}No relevant results{{/hasNoSortedResults}}\n      {{#hasOneSortedResults}}1 relevant result{{/hasOneSortedResults}}\n      {{#hasManySortedResults}}{{#helpers.formatNumber}}{{nbSortedHits}}{{/helpers.formatNumber}} relevant results{{/hasManySortedResults}}\n      sorted out of {{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}}\n    {{/areHitsSorted}}\n    {{^areHitsSorted}}\n      {{#hasNoResults}}No results{{/hasNoResults}}\n      {{#hasOneResult}}1 result{{/hasOneResult}}\n      {{#hasManyResults}}{{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}} results{{/hasManyResults}}\n    {{/areHitsSorted}}\n    found in {{processingTimeMS}}ms"
	};

	var renderer = function renderer(_ref) {
	  var renderState = _ref.renderState,
	      cssClasses = _ref.cssClasses,
	      containerNode = _ref.containerNode,
	      templates = _ref.templates;
	  return function (_ref2, isFirstRendering) {
	    var hitsPerPage = _ref2.hitsPerPage,
	        nbHits = _ref2.nbHits,
	        nbSortedHits = _ref2.nbSortedHits,
	        areHitsSorted = _ref2.areHitsSorted,
	        nbPages = _ref2.nbPages,
	        page = _ref2.page,
	        processingTimeMS = _ref2.processingTimeMS,
	        query = _ref2.query,
	        instantSearchInstance = _ref2.instantSearchInstance;

	    if (isFirstRendering) {
	      renderState.templateProps = prepareTemplateProps({
	        defaultTemplates: defaultTemplates,
	        templatesConfig: instantSearchInstance.templatesConfig,
	        templates: templates
	      });
	      return;
	    }

	    S(v(Stats$1, {
	      cssClasses: cssClasses,
	      hitsPerPage: hitsPerPage,
	      nbHits: nbHits,
	      nbSortedHits: nbSortedHits,
	      areHitsSorted: areHitsSorted,
	      nbPages: nbPages,
	      page: page,
	      processingTimeMS: processingTimeMS,
	      query: query,
	      templateProps: renderState.templateProps
	    }), containerNode);
	  };
	};
	/**
	 * The `stats` widget is used to display useful insights about the current results.
	 *
	 * By default, it will display the **number of hits** and the time taken to compute the
	 * results inside the engine.
	 */


	var stats = function stats(widgetParams) {
	  var _ref3 = widgetParams || {},
	      container = _ref3.container,
	      _ref3$cssClasses = _ref3.cssClasses,
	      userCssClasses = _ref3$cssClasses === void 0 ? {} : _ref3$cssClasses,
	      _ref3$templates = _ref3.templates,
	      templates = _ref3$templates === void 0 ? {} : _ref3$templates;

	  if (!container) {
	    throw new Error(withUsage('The `container` option is required.'));
	  }

	  var containerNode = getContainerNode(container);
	  var cssClasses = {
	    root: cx(suit(), userCssClasses.root),
	    text: cx(suit({
	      descendantName: 'text'
	    }), userCssClasses.text)
	  };
	  var specializedRenderer = renderer({
	    containerNode: containerNode,
	    cssClasses: cssClasses,
	    templates: templates,
	    renderState: {}
	  });
	  var makeWidget = connectStats$1(specializedRenderer, function () {
	    return S(null, containerNode);
	  });
	  return _objectSpread(_objectSpread({}, makeWidget({})), {}, {
	    $$widgetType: 'ais.stats'
	  });
	};

	var stats$1 = stats;

	var algoliasearch_umd = {exports: {}};

	/*! algoliasearch.umd.js | 4.13.0 | © Algolia, inc. | https://github.com/algolia/algoliasearch-client-javascript */

	(function (module, exports) {
	!function(t,e){module.exports=e();}(commonjsGlobal,(function(){function t(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function e(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n);}return r}function r(r){for(var n=1;n<arguments.length;n++){var a=null!=arguments[n]?arguments[n]:{};n%2?e(Object(a),!0).forEach((function(e){t(r,e,a[e]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(a)):e(Object(a)).forEach((function(t){Object.defineProperty(r,t,Object.getOwnPropertyDescriptor(a,t));}));}return r}function n(t,e){if(null==t)return {};var r,n,a=function(t,e){if(null==t)return {};var r,n,a={},o=Object.keys(t);for(n=0;n<o.length;n++)r=o[n],e.indexOf(r)>=0||(a[r]=t[r]);return a}(t,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(n=0;n<o.length;n++)r=o[n],e.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(t,r)&&(a[r]=t[r]);}return a}function a(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var r=[],n=!0,a=!1,o=void 0;try{for(var i,u=t[Symbol.iterator]();!(n=(i=u.next()).done)&&(r.push(i.value),!e||r.length!==e);n=!0);}catch(t){a=!0,o=t;}finally{try{n||null==u.return||u.return();}finally{if(a)throw o}}return r}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function o(t){return function(t){if(Array.isArray(t)){for(var e=0,r=new Array(t.length);e<t.length;e++)r[e]=t[e];return r}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function i(t){var e,r="algoliasearch-client-js-".concat(t.key),n=function(){return void 0===e&&(e=t.localStorage||window.localStorage),e},o=function(){return JSON.parse(n().getItem(r)||"{}")};return {get:function(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{miss:function(){return Promise.resolve()}};return Promise.resolve().then((function(){var r=JSON.stringify(t),n=o()[r];return Promise.all([n||e(),void 0!==n])})).then((function(t){var e=a(t,2),n=e[0],o=e[1];return Promise.all([n,o||r.miss(n)])})).then((function(t){return a(t,1)[0]}))},set:function(t,e){return Promise.resolve().then((function(){var a=o();return a[JSON.stringify(t)]=e,n().setItem(r,JSON.stringify(a)),e}))},delete:function(t){return Promise.resolve().then((function(){var e=o();delete e[JSON.stringify(t)],n().setItem(r,JSON.stringify(e));}))},clear:function(){return Promise.resolve().then((function(){n().removeItem(r);}))}}}function u(t){var e=o(t.caches),r=e.shift();return void 0===r?{get:function(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{miss:function(){return Promise.resolve()}},n=e();return n.then((function(t){return Promise.all([t,r.miss(t)])})).then((function(t){return a(t,1)[0]}))},set:function(t,e){return Promise.resolve(e)},delete:function(t){return Promise.resolve()},clear:function(){return Promise.resolve()}}:{get:function(t,n){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{miss:function(){return Promise.resolve()}};return r.get(t,n,a).catch((function(){return u({caches:e}).get(t,n,a)}))},set:function(t,n){return r.set(t,n).catch((function(){return u({caches:e}).set(t,n)}))},delete:function(t){return r.delete(t).catch((function(){return u({caches:e}).delete(t)}))},clear:function(){return r.clear().catch((function(){return u({caches:e}).clear()}))}}}function s(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{serializable:!0},e={};return {get:function(r,n){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{miss:function(){return Promise.resolve()}},o=JSON.stringify(r);if(o in e)return Promise.resolve(t.serializable?JSON.parse(e[o]):e[o]);var i=n(),u=a&&a.miss||function(){return Promise.resolve()};return i.then((function(t){return u(t)})).then((function(){return i}))},set:function(r,n){return e[JSON.stringify(r)]=t.serializable?JSON.stringify(n):n,Promise.resolve(n)},delete:function(t){return delete e[JSON.stringify(t)],Promise.resolve()},clear:function(){return e={},Promise.resolve()}}}function c(t,e,r){var n={"x-algolia-api-key":r,"x-algolia-application-id":e};return {headers:function(){return t===m.WithinHeaders?n:{}},queryParameters:function(){return t===m.WithinQueryParameters?n:{}}}}function f(t){var e=0;return t((function r(){return e++,new Promise((function(n){setTimeout((function(){n(t(r));}),Math.min(100*e,1e3));}))}))}function d(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(t,e){return Promise.resolve()};return Object.assign(t,{wait:function(r){return d(t.then((function(t){return Promise.all([e(t,r),t])})).then((function(t){return t[1]})))}})}function l(t){for(var e=t.length-1;e>0;e--){var r=Math.floor(Math.random()*(e+1)),n=t[e];t[e]=t[r],t[r]=n;}return t}function p(t,e){return e?(Object.keys(e).forEach((function(r){t[r]=e[r](t);})),t):t}function h(t){for(var e=arguments.length,r=new Array(e>1?e-1:0),n=1;n<e;n++)r[n-1]=arguments[n];var a=0;return t.replace(/%s/g,(function(){return encodeURIComponent(r[a++])}))}var m={WithinQueryParameters:0,WithinHeaders:1};function y(t,e){var r=t||{},n=r.data||{};return Object.keys(r).forEach((function(t){-1===["timeout","headers","queryParameters","data","cacheable"].indexOf(t)&&(n[t]=r[t]);})),{data:Object.entries(n).length>0?n:void 0,timeout:r.timeout||e,headers:r.headers||{},queryParameters:r.queryParameters||{},cacheable:r.cacheable}}var g={Read:1,Write:2,Any:3},v=1,b=2,P=3;function w(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:v;return r(r({},t),{},{status:e,lastUpdate:Date.now()})}function O(t){return "string"==typeof t?{protocol:"https",url:t,accept:g.Any}:{protocol:t.protocol||"https",url:t.url,accept:t.accept||g.Any}}var I="DELETE",x="GET",j="POST",D="PUT";function q(t,e){return Promise.all(e.map((function(e){return t.get(e,(function(){return Promise.resolve(w(e))}))}))).then((function(t){var r=t.filter((function(t){return function(t){return t.status===v||Date.now()-t.lastUpdate>12e4}(t)})),n=t.filter((function(t){return function(t){return t.status===P&&Date.now()-t.lastUpdate<=12e4}(t)})),a=[].concat(o(r),o(n));return {getTimeout:function(t,e){return (0===n.length&&0===t?1:n.length+3+t)*e},statelessHosts:a.length>0?a.map((function(t){return O(t)})):e}}))}function S(t,e,n,a){var i=[],u=function(t,e){if(t.method===x||void 0===t.data&&void 0===e.data)return;var n=Array.isArray(t.data)?t.data:r(r({},t.data),e.data);return JSON.stringify(n)}(n,a),s=function(t,e){var n=r(r({},t.headers),e.headers),a={};return Object.keys(n).forEach((function(t){var e=n[t];a[t.toLowerCase()]=e;})),a}(t,a),c=n.method,f=n.method!==x?{}:r(r({},n.data),a.data),d=r(r(r({"x-algolia-agent":t.userAgent.value},t.queryParameters),f),a.queryParameters),l=0,p=function e(r,o){var f=r.pop();if(void 0===f)throw {name:"RetryError",message:"Unreachable hosts - your application id may be incorrect. If the error persists, contact support@algolia.com.",transporterStackTrace:R(i)};var p={data:u,headers:s,method:c,url:N(f,n.path,d),connectTimeout:o(l,t.timeouts.connect),responseTimeout:o(l,a.timeout)},h=function(t){var e={request:p,response:t,host:f,triesLeft:r.length};return i.push(e),e},m={onSuccess:function(t){return function(t){try{return JSON.parse(t.content)}catch(e){throw function(t,e){return {name:"DeserializationError",message:t,response:e}}(e.message,t)}}(t)},onRetry:function(n){var a=h(n);return n.isTimedOut&&l++,Promise.all([t.logger.info("Retryable failure",A(a)),t.hostsCache.set(f,w(f,n.isTimedOut?P:b))]).then((function(){return e(r,o)}))},onFail:function(t){throw h(t),function(t,e){var r=t.content,n=t.status,a=r;try{a=JSON.parse(r).message;}catch(t){}return function(t,e,r){return {name:"ApiError",message:t,status:e,transporterStackTrace:r}}(a,n,e)}(t,R(i))}};return t.requester.send(p).then((function(t){return function(t,e){return function(t){var e=t.status;return t.isTimedOut||function(t){var e=t.isTimedOut,r=t.status;return !e&&0==~~r}(t)||2!=~~(e/100)&&4!=~~(e/100)}(t)?e.onRetry(t):2==~~(t.status/100)?e.onSuccess(t):e.onFail(t)}(t,m)}))};return q(t.hostsCache,e).then((function(t){return p(o(t.statelessHosts).reverse(),t.getTimeout)}))}function k(t){var e=t.hostsCache,r=t.logger,n=t.requester,o=t.requestsCache,i=t.responsesCache,u=t.timeouts,s=t.userAgent,c=t.hosts,f=t.queryParameters,d={hostsCache:e,logger:r,requester:n,requestsCache:o,responsesCache:i,timeouts:u,userAgent:s,headers:t.headers,queryParameters:f,hosts:c.map((function(t){return O(t)})),read:function(t,e){var r=y(e,d.timeouts.read),n=function(){return S(d,d.hosts.filter((function(t){return 0!=(t.accept&g.Read)})),t,r)};if(!0!==(void 0!==r.cacheable?r.cacheable:t.cacheable))return n();var o={request:t,mappedRequestOptions:r,transporter:{queryParameters:d.queryParameters,headers:d.headers}};return d.responsesCache.get(o,(function(){return d.requestsCache.get(o,(function(){return d.requestsCache.set(o,n()).then((function(t){return Promise.all([d.requestsCache.delete(o),t])}),(function(t){return Promise.all([d.requestsCache.delete(o),Promise.reject(t)])})).then((function(t){var e=a(t,2);e[0];return e[1]}))}))}),{miss:function(t){return d.responsesCache.set(o,t)}})},write:function(t,e){return S(d,d.hosts.filter((function(t){return 0!=(t.accept&g.Write)})),t,y(e,d.timeouts.write))}};return d}function T(t){var e={value:"Algolia for JavaScript (".concat(t,")"),add:function(t){var r="; ".concat(t.segment).concat(void 0!==t.version?" (".concat(t.version,")"):"");return -1===e.value.indexOf(r)&&(e.value="".concat(e.value).concat(r)),e}};return e}function N(t,e,r){var n=E(r),a="".concat(t.protocol,"://").concat(t.url,"/").concat("/"===e.charAt(0)?e.substr(1):e);return n.length&&(a+="?".concat(n)),a}function E(t){return Object.keys(t).map((function(e){return h("%s=%s",e,(r=t[e],"[object Object]"===Object.prototype.toString.call(r)||"[object Array]"===Object.prototype.toString.call(r)?JSON.stringify(t[e]):t[e]));var r;})).join("&")}function R(t){return t.map((function(t){return A(t)}))}function A(t){var e=t.request.headers["x-algolia-api-key"]?{"x-algolia-api-key":"*****"}:{};return r(r({},t),{},{request:r(r({},t.request),{},{headers:r(r({},t.request.headers),e)})})}var C=function(t){return function(e,r){return t.transporter.write({method:j,path:"2/abtests",data:e},r)}},U=function(t){return function(e,r){return t.transporter.write({method:I,path:h("2/abtests/%s",e)},r)}},z=function(t){return function(e,r){return t.transporter.read({method:x,path:h("2/abtests/%s",e)},r)}},J=function(t){return function(e){return t.transporter.read({method:x,path:"2/abtests"},e)}},F=function(t){return function(e,r){return t.transporter.write({method:j,path:h("2/abtests/%s/stop",e)},r)}},H=function(t){return function(e){return t.transporter.read({method:x,path:"1/strategies/personalization"},e)}},M=function(t){return function(e,r){return t.transporter.write({method:j,path:"1/strategies/personalization",data:e},r)}};function K(t){return function e(r){return t.request(r).then((function(n){if(void 0!==t.batch&&t.batch(n.hits),!t.shouldStop(n))return n.cursor?e({cursor:n.cursor}):e({page:(r.page||0)+1})}))}({})}var W=function(t){return function(e,a){var o=a||{},i=o.queryParameters,u=n(o,["queryParameters"]),s=r({acl:e},void 0!==i?{queryParameters:i}:{});return d(t.transporter.write({method:j,path:"1/keys",data:s},u),(function(e,r){return f((function(n){return tt(t)(e.key,r).catch((function(t){if(404!==t.status)throw t;return n()}))}))}))}},B=function(t){return function(e,r,n){var a=y(n);return a.queryParameters["X-Algolia-User-ID"]=e,t.transporter.write({method:j,path:"1/clusters/mapping",data:{cluster:r}},a)}},Q=function(t){return function(e,r,n){return t.transporter.write({method:j,path:"1/clusters/mapping/batch",data:{users:e,cluster:r}},n)}},G=function(t){return function(e,r){return d(t.transporter.write({method:j,path:h("/1/dictionaries/%s/batch",e),data:{clearExistingDictionaryEntries:!0,requests:{action:"addEntry",body:[]}}},r),(function(e,r){return jt(t)(e.taskID,r)}))}},L=function(t){return function(e,r,n){return d(t.transporter.write({method:j,path:h("1/indexes/%s/operation",e),data:{operation:"copy",destination:r}},n),(function(r,n){return ut(t)(e,{methods:{waitTask:de}}).waitTask(r.taskID,n)}))}},V=function(t){return function(e,n,a){return L(t)(e,n,r(r({},a),{},{scope:[pe.Rules]}))}},_=function(t){return function(e,n,a){return L(t)(e,n,r(r({},a),{},{scope:[pe.Settings]}))}},X=function(t){return function(e,n,a){return L(t)(e,n,r(r({},a),{},{scope:[pe.Synonyms]}))}},Y=function(t){return function(e,r){return e.method===x?t.transporter.read(e,r):t.transporter.write(e,r)}},Z=function(t){return function(e,r){return d(t.transporter.write({method:I,path:h("1/keys/%s",e)},r),(function(r,n){return f((function(r){return tt(t)(e,n).then(r).catch((function(t){if(404!==t.status)throw t}))}))}))}},$=function(t){return function(e,r,n){var a=r.map((function(t){return {action:"deleteEntry",body:{objectID:t}}}));return d(t.transporter.write({method:j,path:h("/1/dictionaries/%s/batch",e),data:{clearExistingDictionaryEntries:!1,requests:a}},n),(function(e,r){return jt(t)(e.taskID,r)}))}},tt=function(t){return function(e,r){return t.transporter.read({method:x,path:h("1/keys/%s",e)},r)}},et=function(t){return function(e,r){return t.transporter.read({method:x,path:h("1/task/%s",e.toString())},r)}},rt=function(t){return function(e){return t.transporter.read({method:x,path:"/1/dictionaries/*/settings"},e)}},nt=function(t){return function(e){return t.transporter.read({method:x,path:"1/logs"},e)}},at=function(t){return function(e){return t.transporter.read({method:x,path:"1/clusters/mapping/top"},e)}},ot=function(t){return function(e,r){return t.transporter.read({method:x,path:h("1/clusters/mapping/%s",e)},r)}},it=function(t){return function(e){var r=e||{},a=r.retrieveMappings,o=n(r,["retrieveMappings"]);return !0===a&&(o.getClusters=!0),t.transporter.read({method:x,path:"1/clusters/mapping/pending"},o)}},ut=function(t){return function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n={transporter:t.transporter,appId:t.appId,indexName:e};return p(n,r.methods)}},st=function(t){return function(e){return t.transporter.read({method:x,path:"1/keys"},e)}},ct=function(t){return function(e){return t.transporter.read({method:x,path:"1/clusters"},e)}},ft=function(t){return function(e){return t.transporter.read({method:x,path:"1/indexes"},e)}},dt=function(t){return function(e){return t.transporter.read({method:x,path:"1/clusters/mapping"},e)}},lt=function(t){return function(e,r,n){return d(t.transporter.write({method:j,path:h("1/indexes/%s/operation",e),data:{operation:"move",destination:r}},n),(function(r,n){return ut(t)(e,{methods:{waitTask:de}}).waitTask(r.taskID,n)}))}},pt=function(t){return function(e,r){return d(t.transporter.write({method:j,path:"1/indexes/*/batch",data:{requests:e}},r),(function(e,r){return Promise.all(Object.keys(e.taskID).map((function(n){return ut(t)(n,{methods:{waitTask:de}}).waitTask(e.taskID[n],r)})))}))}},ht=function(t){return function(e,r){return t.transporter.read({method:j,path:"1/indexes/*/objects",data:{requests:e}},r)}},mt=function(t){return function(e,n){var a=e.map((function(t){return r(r({},t),{},{params:E(t.params||{})})}));return t.transporter.read({method:j,path:"1/indexes/*/queries",data:{requests:a},cacheable:!0},n)}},yt=function(t){return function(e,a){return Promise.all(e.map((function(e){var o=e.params,i=o.facetName,u=o.facetQuery,s=n(o,["facetName","facetQuery"]);return ut(t)(e.indexName,{methods:{searchForFacetValues:ue}}).searchForFacetValues(i,u,r(r({},a),s))})))}},gt=function(t){return function(e,r){var n=y(r);return n.queryParameters["X-Algolia-User-ID"]=e,t.transporter.write({method:I,path:"1/clusters/mapping"},n)}},vt=function(t){return function(e,r,n){var a=r.map((function(t){return {action:"addEntry",body:t}}));return d(t.transporter.write({method:j,path:h("/1/dictionaries/%s/batch",e),data:{clearExistingDictionaryEntries:!0,requests:a}},n),(function(e,r){return jt(t)(e.taskID,r)}))}},bt=function(t){return function(e,r){return d(t.transporter.write({method:j,path:h("1/keys/%s/restore",e)},r),(function(r,n){return f((function(r){return tt(t)(e,n).catch((function(t){if(404!==t.status)throw t;return r()}))}))}))}},Pt=function(t){return function(e,r,n){var a=r.map((function(t){return {action:"addEntry",body:t}}));return d(t.transporter.write({method:j,path:h("/1/dictionaries/%s/batch",e),data:{clearExistingDictionaryEntries:!1,requests:a}},n),(function(e,r){return jt(t)(e.taskID,r)}))}},wt=function(t){return function(e,r,n){return t.transporter.read({method:j,path:h("/1/dictionaries/%s/search",e),data:{query:r},cacheable:!0},n)}},Ot=function(t){return function(e,r){return t.transporter.read({method:j,path:"1/clusters/mapping/search",data:{query:e}},r)}},It=function(t){return function(e,r){return d(t.transporter.write({method:D,path:"/1/dictionaries/*/settings",data:e},r),(function(e,r){return jt(t)(e.taskID,r)}))}},xt=function(t){return function(e,r){var a=Object.assign({},r),o=r||{},i=o.queryParameters,u=n(o,["queryParameters"]),s=i?{queryParameters:i}:{},c=["acl","indexes","referers","restrictSources","queryParameters","description","maxQueriesPerIPPerHour","maxHitsPerQuery"];return d(t.transporter.write({method:D,path:h("1/keys/%s",e),data:s},u),(function(r,n){return f((function(r){return tt(t)(e,n).then((function(t){return function(t){return Object.keys(a).filter((function(t){return -1!==c.indexOf(t)})).every((function(e){return t[e]===a[e]}))}(t)?Promise.resolve():r()}))}))}))}},jt=function(t){return function(e,r){return f((function(n){return et(t)(e,r).then((function(t){return "published"!==t.status?n():void 0}))}))}},Dt=function(t){return function(e,r){return d(t.transporter.write({method:j,path:h("1/indexes/%s/batch",t.indexName),data:{requests:e}},r),(function(e,r){return de(t)(e.taskID,r)}))}},qt=function(t){return function(e){return K(r(r({shouldStop:function(t){return void 0===t.cursor}},e),{},{request:function(r){return t.transporter.read({method:j,path:h("1/indexes/%s/browse",t.indexName),data:r},e)}}))}},St=function(t){return function(e){var n=r({hitsPerPage:1e3},e);return K(r(r({shouldStop:function(t){return t.hits.length<n.hitsPerPage}},n),{},{request:function(e){return se(t)("",r(r({},n),e)).then((function(t){return r(r({},t),{},{hits:t.hits.map((function(t){return delete t._highlightResult,t}))})}))}}))}},kt=function(t){return function(e){var n=r({hitsPerPage:1e3},e);return K(r(r({shouldStop:function(t){return t.hits.length<n.hitsPerPage}},n),{},{request:function(e){return ce(t)("",r(r({},n),e)).then((function(t){return r(r({},t),{},{hits:t.hits.map((function(t){return delete t._highlightResult,t}))})}))}}))}},Tt=function(t){return function(e,r,a){var o=a||{},i=o.batchSize,u=n(o,["batchSize"]),s={taskIDs:[],objectIDs:[]};return d(function n(){var a,o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,c=[];for(a=o;a<e.length&&(c.push(e[a]),c.length!==(i||1e3));a++);return 0===c.length?Promise.resolve(s):Dt(t)(c.map((function(t){return {action:r,body:t}})),u).then((function(t){return s.objectIDs=s.objectIDs.concat(t.objectIDs),s.taskIDs.push(t.taskID),a++,n(a)}))}(),(function(e,r){return Promise.all(e.taskIDs.map((function(e){return de(t)(e,r)})))}))}},Nt=function(t){return function(e){return d(t.transporter.write({method:j,path:h("1/indexes/%s/clear",t.indexName)},e),(function(e,r){return de(t)(e.taskID,r)}))}},Et=function(t){return function(e){var r=e||{},a=r.forwardToReplicas,o=y(n(r,["forwardToReplicas"]));return a&&(o.queryParameters.forwardToReplicas=1),d(t.transporter.write({method:j,path:h("1/indexes/%s/rules/clear",t.indexName)},o),(function(e,r){return de(t)(e.taskID,r)}))}},Rt=function(t){return function(e){var r=e||{},a=r.forwardToReplicas,o=y(n(r,["forwardToReplicas"]));return a&&(o.queryParameters.forwardToReplicas=1),d(t.transporter.write({method:j,path:h("1/indexes/%s/synonyms/clear",t.indexName)},o),(function(e,r){return de(t)(e.taskID,r)}))}},At=function(t){return function(e,r){return d(t.transporter.write({method:j,path:h("1/indexes/%s/deleteByQuery",t.indexName),data:e},r),(function(e,r){return de(t)(e.taskID,r)}))}},Ct=function(t){return function(e){return d(t.transporter.write({method:I,path:h("1/indexes/%s",t.indexName)},e),(function(e,r){return de(t)(e.taskID,r)}))}},Ut=function(t){return function(e,r){return d(zt(t)([e],r).then((function(t){return {taskID:t.taskIDs[0]}})),(function(e,r){return de(t)(e.taskID,r)}))}},zt=function(t){return function(e,r){var n=e.map((function(t){return {objectID:t}}));return Tt(t)(n,le.DeleteObject,r)}},Jt=function(t){return function(e,r){var a=r||{},o=a.forwardToReplicas,i=y(n(a,["forwardToReplicas"]));return o&&(i.queryParameters.forwardToReplicas=1),d(t.transporter.write({method:I,path:h("1/indexes/%s/rules/%s",t.indexName,e)},i),(function(e,r){return de(t)(e.taskID,r)}))}},Ft=function(t){return function(e,r){var a=r||{},o=a.forwardToReplicas,i=y(n(a,["forwardToReplicas"]));return o&&(i.queryParameters.forwardToReplicas=1),d(t.transporter.write({method:I,path:h("1/indexes/%s/synonyms/%s",t.indexName,e)},i),(function(e,r){return de(t)(e.taskID,r)}))}},Ht=function(t){return function(e){return Lt(t)(e).then((function(){return !0})).catch((function(t){if(404!==t.status)throw t;return !1}))}},Mt=function(t){return function(e,r,n){return t.transporter.read({method:j,path:h("1/answers/%s/prediction",t.indexName),data:{query:e,queryLanguages:r},cacheable:!0},n)}},Kt=function(t){return function(e,o){var i=o||{},u=i.query,s=i.paginate,c=n(i,["query","paginate"]),f=0;return function n(){return ie(t)(u||"",r(r({},c),{},{page:f})).then((function(t){for(var r=0,o=Object.entries(t.hits);r<o.length;r++){var i=a(o[r],2),u=i[0],c=i[1];if(e(c))return {object:c,position:parseInt(u,10),page:f}}if(f++,!1===s||f>=t.nbPages)throw {name:"ObjectNotFoundError",message:"Object not found."};return n()}))}()}},Wt=function(t){return function(e,r){return t.transporter.read({method:x,path:h("1/indexes/%s/%s",t.indexName,e)},r)}},Bt=function(){return function(t,e){for(var r=0,n=Object.entries(t.hits);r<n.length;r++){var o=a(n[r],2),i=o[0];if(o[1].objectID===e)return parseInt(i,10)}return -1}},Qt=function(t){return function(e,a){var o=a||{},i=o.attributesToRetrieve,u=n(o,["attributesToRetrieve"]),s=e.map((function(e){return r({indexName:t.indexName,objectID:e},i?{attributesToRetrieve:i}:{})}));return t.transporter.read({method:j,path:"1/indexes/*/objects",data:{requests:s}},u)}},Gt=function(t){return function(e,r){return t.transporter.read({method:x,path:h("1/indexes/%s/rules/%s",t.indexName,e)},r)}},Lt=function(t){return function(e){return t.transporter.read({method:x,path:h("1/indexes/%s/settings",t.indexName),data:{getVersion:2}},e)}},Vt=function(t){return function(e,r){return t.transporter.read({method:x,path:h("1/indexes/%s/synonyms/%s",t.indexName,e)},r)}},_t=function(t){return function(e,r){return d(Xt(t)([e],r).then((function(t){return {objectID:t.objectIDs[0],taskID:t.taskIDs[0]}})),(function(e,r){return de(t)(e.taskID,r)}))}},Xt=function(t){return function(e,r){var a=r||{},o=a.createIfNotExists,i=n(a,["createIfNotExists"]),u=o?le.PartialUpdateObject:le.PartialUpdateObjectNoCreate;return Tt(t)(e,u,i)}},Yt=function(t){return function(e,i){var u=i||{},s=u.safe,c=u.autoGenerateObjectIDIfNotExist,f=u.batchSize,l=n(u,["safe","autoGenerateObjectIDIfNotExist","batchSize"]),p=function(e,r,n,a){return d(t.transporter.write({method:j,path:h("1/indexes/%s/operation",e),data:{operation:n,destination:r}},a),(function(e,r){return de(t)(e.taskID,r)}))},m=Math.random().toString(36).substring(7),y="".concat(t.indexName,"_tmp_").concat(m),g=ee({appId:t.appId,transporter:t.transporter,indexName:y}),v=[],b=p(t.indexName,y,"copy",r(r({},l),{},{scope:["settings","synonyms","rules"]}));return v.push(b),d((s?b.wait(l):b).then((function(){var t=g(e,r(r({},l),{},{autoGenerateObjectIDIfNotExist:c,batchSize:f}));return v.push(t),s?t.wait(l):t})).then((function(){var e=p(y,t.indexName,"move",l);return v.push(e),s?e.wait(l):e})).then((function(){return Promise.all(v)})).then((function(t){var e=a(t,3),r=e[0],n=e[1],i=e[2];return {objectIDs:n.objectIDs,taskIDs:[r.taskID].concat(o(n.taskIDs),[i.taskID])}})),(function(t,e){return Promise.all(v.map((function(t){return t.wait(e)})))}))}},Zt=function(t){return function(e,n){return ne(t)(e,r(r({},n),{},{clearExistingRules:!0}))}},$t=function(t){return function(e,n){return oe(t)(e,r(r({},n),{},{clearExistingSynonyms:!0}))}},te=function(t){return function(e,r){return d(ee(t)([e],r).then((function(t){return {objectID:t.objectIDs[0],taskID:t.taskIDs[0]}})),(function(e,r){return de(t)(e.taskID,r)}))}},ee=function(t){return function(e,r){var a=r||{},o=a.autoGenerateObjectIDIfNotExist,i=n(a,["autoGenerateObjectIDIfNotExist"]),u=o?le.AddObject:le.UpdateObject;if(u===le.UpdateObject){var s=!0,c=!1,f=void 0;try{for(var l,p=e[Symbol.iterator]();!(s=(l=p.next()).done);s=!0){if(void 0===l.value.objectID)return d(Promise.reject({name:"MissingObjectIDError",message:"All objects must have an unique objectID (like a primary key) to be valid. Algolia is also able to generate objectIDs automatically but *it's not recommended*. To do it, use the `{'autoGenerateObjectIDIfNotExist': true}` option."}))}}catch(t){c=!0,f=t;}finally{try{s||null==p.return||p.return();}finally{if(c)throw f}}}return Tt(t)(e,u,i)}},re=function(t){return function(e,r){return ne(t)([e],r)}},ne=function(t){return function(e,r){var a=r||{},o=a.forwardToReplicas,i=a.clearExistingRules,u=y(n(a,["forwardToReplicas","clearExistingRules"]));return o&&(u.queryParameters.forwardToReplicas=1),i&&(u.queryParameters.clearExistingRules=1),d(t.transporter.write({method:j,path:h("1/indexes/%s/rules/batch",t.indexName),data:e},u),(function(e,r){return de(t)(e.taskID,r)}))}},ae=function(t){return function(e,r){return oe(t)([e],r)}},oe=function(t){return function(e,r){var a=r||{},o=a.forwardToReplicas,i=a.clearExistingSynonyms,u=a.replaceExistingSynonyms,s=y(n(a,["forwardToReplicas","clearExistingSynonyms","replaceExistingSynonyms"]));return o&&(s.queryParameters.forwardToReplicas=1),(u||i)&&(s.queryParameters.replaceExistingSynonyms=1),d(t.transporter.write({method:j,path:h("1/indexes/%s/synonyms/batch",t.indexName),data:e},s),(function(e,r){return de(t)(e.taskID,r)}))}},ie=function(t){return function(e,r){return t.transporter.read({method:j,path:h("1/indexes/%s/query",t.indexName),data:{query:e},cacheable:!0},r)}},ue=function(t){return function(e,r,n){return t.transporter.read({method:j,path:h("1/indexes/%s/facets/%s/query",t.indexName,e),data:{facetQuery:r},cacheable:!0},n)}},se=function(t){return function(e,r){return t.transporter.read({method:j,path:h("1/indexes/%s/rules/search",t.indexName),data:{query:e}},r)}},ce=function(t){return function(e,r){return t.transporter.read({method:j,path:h("1/indexes/%s/synonyms/search",t.indexName),data:{query:e}},r)}},fe=function(t){return function(e,r){var a=r||{},o=a.forwardToReplicas,i=y(n(a,["forwardToReplicas"]));return o&&(i.queryParameters.forwardToReplicas=1),d(t.transporter.write({method:D,path:h("1/indexes/%s/settings",t.indexName),data:e},i),(function(e,r){return de(t)(e.taskID,r)}))}},de=function(t){return function(e,r){return f((function(n){return function(t){return function(e,r){return t.transporter.read({method:x,path:h("1/indexes/%s/task/%s",t.indexName,e.toString())},r)}}(t)(e,r).then((function(t){return "published"!==t.status?n():void 0}))}))}},le={AddObject:"addObject",UpdateObject:"updateObject",PartialUpdateObject:"partialUpdateObject",PartialUpdateObjectNoCreate:"partialUpdateObjectNoCreate",DeleteObject:"deleteObject",DeleteIndex:"delete",ClearIndex:"clear"},pe={Settings:"settings",Synonyms:"synonyms",Rules:"rules"},he=1,me=2,ye=3;function ge(t,e,n){var a,o={appId:t,apiKey:e,timeouts:{connect:1,read:2,write:30},requester:{send:function(t){return new Promise((function(e){var r=new XMLHttpRequest;r.open(t.method,t.url,!0),Object.keys(t.headers).forEach((function(e){return r.setRequestHeader(e,t.headers[e])}));var n,a=function(t,n){return setTimeout((function(){r.abort(),e({status:0,content:n,isTimedOut:!0});}),1e3*t)},o=a(t.connectTimeout,"Connection timeout");r.onreadystatechange=function(){r.readyState>r.OPENED&&void 0===n&&(clearTimeout(o),n=a(t.responseTimeout,"Socket timeout"));},r.onerror=function(){0===r.status&&(clearTimeout(o),clearTimeout(n),e({content:r.responseText||"Network request failed",status:r.status,isTimedOut:!1}));},r.onload=function(){clearTimeout(o),clearTimeout(n),e({content:r.responseText,status:r.status,isTimedOut:!1});},r.send(t.data);}))}},logger:(a=ye,{debug:function(t,e){return he>=a&&console.debug(t,e),Promise.resolve()},info:function(t,e){return me>=a&&console.info(t,e),Promise.resolve()},error:function(t,e){return console.error(t,e),Promise.resolve()}}),responsesCache:s(),requestsCache:s({serializable:!1}),hostsCache:u({caches:[i({key:"".concat("4.13.0","-").concat(t)}),s()]}),userAgent:T("4.13.0").add({segment:"Browser"})},f=r(r({},o),n),d=function(){return function(t){return function(t){var e=t.region||"us",n=c(m.WithinHeaders,t.appId,t.apiKey),a=k(r(r({hosts:[{url:"personalization.".concat(e,".algolia.com")}]},t),{},{headers:r(r(r({},n.headers()),{"content-type":"application/json"}),t.headers),queryParameters:r(r({},n.queryParameters()),t.queryParameters)}));return p({appId:t.appId,transporter:a},t.methods)}(r(r(r({},o),t),{},{methods:{getPersonalizationStrategy:H,setPersonalizationStrategy:M}}))}};return function(t){var e=t.appId,n=c(void 0!==t.authMode?t.authMode:m.WithinHeaders,e,t.apiKey),a=k(r(r({hosts:[{url:"".concat(e,"-dsn.algolia.net"),accept:g.Read},{url:"".concat(e,".algolia.net"),accept:g.Write}].concat(l([{url:"".concat(e,"-1.algolianet.com")},{url:"".concat(e,"-2.algolianet.com")},{url:"".concat(e,"-3.algolianet.com")}]))},t),{},{headers:r(r(r({},n.headers()),{"content-type":"application/x-www-form-urlencoded"}),t.headers),queryParameters:r(r({},n.queryParameters()),t.queryParameters)}));return p({transporter:a,appId:e,addAlgoliaAgent:function(t,e){a.userAgent.add({segment:t,version:e});},clearCache:function(){return Promise.all([a.requestsCache.clear(),a.responsesCache.clear()]).then((function(){}))}},t.methods)}(r(r({},f),{},{methods:{search:mt,searchForFacetValues:yt,multipleBatch:pt,multipleGetObjects:ht,multipleQueries:mt,copyIndex:L,copySettings:_,copySynonyms:X,copyRules:V,moveIndex:lt,listIndices:ft,getLogs:nt,listClusters:ct,multipleSearchForFacetValues:yt,getApiKey:tt,addApiKey:W,listApiKeys:st,updateApiKey:xt,deleteApiKey:Z,restoreApiKey:bt,assignUserID:B,assignUserIDs:Q,getUserID:ot,searchUserIDs:Ot,listUserIDs:dt,getTopUserIDs:at,removeUserID:gt,hasPendingMappings:it,clearDictionaryEntries:G,deleteDictionaryEntries:$,getDictionarySettings:rt,getAppTask:et,replaceDictionaryEntries:vt,saveDictionaryEntries:Pt,searchDictionaryEntries:wt,setDictionarySettings:It,waitAppTask:jt,customRequest:Y,initIndex:function(t){return function(e){return ut(t)(e,{methods:{batch:Dt,delete:Ct,findAnswers:Mt,getObject:Wt,getObjects:Qt,saveObject:te,saveObjects:ee,search:ie,searchForFacetValues:ue,waitTask:de,setSettings:fe,getSettings:Lt,partialUpdateObject:_t,partialUpdateObjects:Xt,deleteObject:Ut,deleteObjects:zt,deleteBy:At,clearObjects:Nt,browseObjects:qt,getObjectPosition:Bt,findObject:Kt,exists:Ht,saveSynonym:ae,saveSynonyms:oe,getSynonym:Vt,searchSynonyms:ce,browseSynonyms:kt,deleteSynonym:Ft,clearSynonyms:Rt,replaceAllObjects:Yt,replaceAllSynonyms:$t,searchRules:se,getRule:Gt,deleteRule:Jt,saveRule:re,saveRules:ne,replaceAllRules:Zt,browseRules:St,clearRules:Et}})}},initAnalytics:function(){return function(t){return function(t){var e=t.region||"us",n=c(m.WithinHeaders,t.appId,t.apiKey),a=k(r(r({hosts:[{url:"analytics.".concat(e,".algolia.com")}]},t),{},{headers:r(r(r({},n.headers()),{"content-type":"application/json"}),t.headers),queryParameters:r(r({},n.queryParameters()),t.queryParameters)}));return p({appId:t.appId,transporter:a},t.methods)}(r(r(r({},o),t),{},{methods:{addABTest:C,getABTest:z,getABTests:J,stopABTest:F,deleteABTest:U}}))}},initPersonalization:d,initRecommendation:function(){return function(t){return f.logger.info("The `initRecommendation` method is deprecated. Use `initPersonalization` instead."),d()(t)}}}}))}return ge.version="4.13.0",ge}));
	}(algoliasearch_umd));

	var algoliasearch = algoliasearch_umd.exports;

	document.addEventListener('DOMContentLoaded', function () {
	  var search = instantsearch$1({
	    indexName: 'gitlab',
	    searchClient: algoliasearch('3PNCFOU757', '89b85ffae982a7f1adeeed4a90bb0ab1'),
	    routing: {
	      stateMapping: singleIndexStateMapping('gitlab')
	    },
	    searchFunction: function searchFunction(helper) {
	      if (helper.state.query === '') {
	        return;
	      }

	      helper.search();
	    }
	  });
	  search.addWidgets([searchBox$1({
	    container: '#searchbox',
	    placeholder: 'Search GitLab Documentation',
	    showReset: true,
	    showLoadingIndicator: true
	  }), poweredBy$1({
	    container: '#powered-by'
	  }), infiniteHits$1({
	    container: '#hits',
	    templates: {
	      item: document.getElementById('hit-template').innerHTML,
	      empty: 'We didn\'t find any results for the search <em>"{{query}}"</em>'
	    },
	    escapeHits: true,
	    showMoreLabel: 'Load more results...'
	  }), stats$1({
	    container: '#stats'
	  }), configure$1({
	    // Number of results shown in the search dropdown
	    hitsPerPage: 10,
	    facetFilters: ["version:14.10"]
	  })]);
	  search.start();
	});

})();
