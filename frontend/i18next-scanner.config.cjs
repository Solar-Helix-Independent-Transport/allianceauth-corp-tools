const typescriptTransform = require("i18next-scanner-typescript");

module.exports = {
  input: [
    "src/**/*.{js,jsx,ts,tsx}",
    // Use ! to filter out files or directories
    "!src/**/*.spec.{js,jsx,ts,tsx}",
    "!src/i18n/**",
    "!**/node_modules/**",
  ],
  output: "./",
  options: {
    debug: true,
    func: {
      list: ["i18next.t", "i18n.t", "t"],
      extensions: [".js", ".jsx"],
    },
    trans: false,
    lngs: ["en", "de", "es", "it-it", "ko-kr", "fr-fr", "nl-nl", "pl-pl", "ru", "uk", "zh-hans"],
    ns: ["translation"],
    defaultLng: "en",
    defaultNs: "translation",
    defaultValue: function (lng, ns, key) {
      return key;
    },
    resource: {
      loadPath: "i18n/{{lng}}/{{ns}}.json",
      savePath: "i18n/{{lng}}/{{ns}}.json",
      jsonIndent: 2,
      lineEnding: "\n",
    },
    nsSeparator: false, // namespace separator
    keySeparator: false, // key separator
    interpolation: {
      prefix: "{{",
      suffix: "}}",
    },
  },
  transform: typescriptTransform({
    extensions: [".ts", ".tsx"],
    tsOptions: {
      target: "es5",
      module: "esnext",
    },
  }),
};
