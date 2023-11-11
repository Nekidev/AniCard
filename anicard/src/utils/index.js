export function adjustBrightness(hexColor, brightness) {
    const red = parseInt(hexColor.slice(1, 3), 16);
    const green = parseInt(hexColor.slice(3, 5), 16);
    const blue = parseInt(hexColor.slice(5, 7), 16);

    const adjustedRed = Math.max(0, Math.min(255, red + brightness));
    const adjustedGreen = Math.max(0, Math.min(255, green + brightness));
    const adjustedBlue = Math.max(0, Math.min(255, blue + brightness));

    const adjustedHexColor = `#${adjustedRed
        .toString(16)
        .padStart(2, "0")}${adjustedGreen
        .toString(16)
        .padStart(2, "0")}${adjustedBlue.toString(16).padStart(2, "0")}`;

    return adjustedHexColor;
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function getMiddleShade(color) {
    // Parse the color string to get RGB values
    const hex = color.slice(1); // Remove the '#' from the color string
    const num = parseInt(hex, 16);

    // Extract RGB values
    const red = (num >> 16) & 255;
    const green = (num >> 8) & 255;
    const blue = num & 255;

    // Calculate middle shades for each color channel
    const middleRed = Math.round((red + 255) / 2);
    const middleGreen = Math.round((green + 255) / 2);
    const middleBlue = Math.round((blue + 255) / 2);

    // Convert back to hex and return the result
    const middleHex = `#${((middleRed << 16) | (middleGreen << 8) | middleBlue)
        .toString(16)
        .padStart(6, "0")}`;

    return middleHex;
}

export function rgbToHex(rgb) {
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    return (
        "#" +
        componentToHex(rgb[0]) +
        componentToHex(rgb[1]) +
        componentToHex(rgb[2])
    );
}

export function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
}

export const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
        ? l === r
            ? (g - b) / s
            : l === g
            ? 2 + (b - r) / s
            : 4 + (r - g) / s
        : 0;
    return [
        60 * h < 0 ? 60 * h + 360 : 60 * h,
        100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
        (100 * (2 * l - s)) / 2,
    ];
};

export function hexToHsl(hex) {
    const rgb = hexToRgb(hex);
    return rgbToHsl(rgb.r, rgb.g, rgb.b);
}