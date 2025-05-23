// System Security Level
export const GetSecurityColors = (secLevel: number) => {
  if (secLevel >= 0.9) {
    return "#2c74e0";
  } else if (secLevel >= 0.8) {
    return "#3999e9";
  } else if (secLevel >= 0.7) {
    return "#4dccf6";
  } else if (secLevel >= 0.6) {
    return "#60d9a3";
  } else if (secLevel >= 0.5) {
    return "#71e554";
  } else if (secLevel >= 0.4) {
    return "#f3fd82";
  } else if (secLevel >= 0.3) {
    return "#da6c07";
  } else if (secLevel >= 0.2) {
    return "#cc440f";
  } else if (secLevel >= 0.1) {
    return "#ba1117";
  } else if (secLevel > 0.0) {
    return "#732020";
  } else if (secLevel <= 0.0) {
    return "#8c3263";
  }
  return "transparent";
};
