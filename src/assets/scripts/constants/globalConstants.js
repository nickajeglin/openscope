export const TIME = {
    /**
     * @property ONE_HOUR_IN_SECONDS
     * @type {number}
     * @final
     */
    ONE_HOUR_IN_SECONDS: 3600,
    ONE_HOUR_IN_MINUTES: 60,
    ONE_HOUR_IN_MILLISECONDS: 3600000,
    ONE_MINUTE_IN_SECONDS: 60,
    ONE_MINUTE_IN_MILLISECONDS: 60000,
    ONE_SECOND_IN_MILLISECONDS: 1000
};

/**
 * Regular expressions
 *
 * @property REGEX
 * @type {Object}
 * @final
 */
export const REGEX = {
    COMPASS_DIRECTION: /^[NESW]/,
    SW: /[SW]/,
    LAT_LONG: /^([NESW])(\d+(\.\d+)?)([d °](\d+(\.\d+)?))?([m '](\d+(\.\d+)?))?$/
};