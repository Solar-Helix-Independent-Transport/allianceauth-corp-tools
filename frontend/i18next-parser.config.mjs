export default {
  locales: ["en", "fr"],
  output: "locales/$LOCALE.$NAMESPACE.json",
  namespaceSeparator: "::",
  resetDefaultValueLocale: "en",
  defaultValue: (locale, namespace, key) => key,
  input: [
    "char/src/**/*.{js,jsx,ts,tsx}",
    "corp/src/**/*.{js,jsx,ts,tsx}",
    "frontend/src/**/*.{js,jsx,ts,tsx}",
  ],
};
