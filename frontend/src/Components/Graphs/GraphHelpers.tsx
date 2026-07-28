export function abbreviateNumber(value: number) {
  let newValue = `${value}`;
  if (value >= 1000) {
    const suffixes = ["", "k", "m", "b", "t"];
    const suffixNum = Math.floor(("" + value).length / 3.1);
    let shortValue = "";
    let floatVal = value;
    for (let precision = 3; precision >= 2; precision--) {
      floatVal = parseFloat(
        (suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(precision),
      );
      shortValue = `${floatVal}`;
      const dotLessShortValue = (shortValue + "").replace(/[^a-zA-Z 0-9]+/g, "");
      if (dotLessShortValue.length <= 2) {
        break;
      }
    }
    if (floatVal % 1 !== 0) shortValue = floatVal.toFixed(1);
    newValue = shortValue + suffixes[suffixNum];
  }
  return newValue;
}

export function getCSSVariable(codeName: string) {
  return window.getComputedStyle(document.body).getPropertyValue(codeName);
}
