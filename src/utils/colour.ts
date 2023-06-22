type rgbColour = {r: number, g: number, b: number};

function hexToRGB(hex: string): rgbColour {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16)
  };
}

function componentToHex(component: number): string {
  const hex = component.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

function rgbToHex(rgb: rgbColour): string {
  return '#' + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b);
}

export function lighten(hex: string, amount: number): string {
  const rgb = hexToRGB(hex);

  rgb.r = Math.round((rgb.r * (1 - amount)) + (255 * amount));
  rgb.g = Math.round((rgb.g * (1 - amount)) + (255 * amount));
  rgb.b = Math.round((rgb.b * (1 - amount)) + (255 * amount));

  return rgbToHex(rgb);
}

export function darken(hex: string, amount: number): string {
  const rgb = hexToRGB(hex);

  rgb.r = Math.round(rgb.r * (1 - amount));
  rgb.g = Math.round(rgb.g * (1 - amount));
  rgb.b = Math.round(rgb.b * (1 - amount));

  return rgbToHex(rgb);
}
