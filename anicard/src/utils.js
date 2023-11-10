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

export function randomString(length) {
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
        counter += 1;
    }
    return result;
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
