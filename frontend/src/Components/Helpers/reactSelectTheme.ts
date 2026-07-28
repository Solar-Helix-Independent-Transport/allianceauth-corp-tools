import { StylesConfig } from "react-select";

// Themes react-select to match Bootstrap 5's own .form-select (closed
// control) and .dropdown-menu (open menu/options), using Bootstrap's CSS
// custom properties rather than fixed colors. Since those variables are
// re-pointed by Bootstrap itself under [data-bs-theme="dark"], this tracks
// the app's light/dark theme automatically instead of needing its own
// dark-mode handling.
export const bootstrapSelectStyles: StylesConfig<unknown, boolean> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "var(--bs-body-bg)",
    borderColor: state.isFocused ? "var(--bs-primary)" : "var(--bs-border-color)",
    borderRadius: "var(--bs-border-radius)",
    boxShadow: state.isFocused
      ? "0 0 0 var(--bs-focus-ring-width) var(--bs-focus-ring-color)"
      : "none",
    "&:hover": {
      borderColor: state.isFocused ? "var(--bs-primary)" : "var(--bs-border-color)",
    },
  }),
  input: (base) => ({
    ...base,
    color: "var(--bs-body-color)",
  }),
  singleValue: (base, state) => ({
    ...base,
    color: state.isDisabled ? "var(--bs-secondary-color)" : "var(--bs-body-color)",
  }),
  placeholder: (base) => ({
    ...base,
    color: "var(--bs-secondary-color)",
  }),
  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: "var(--bs-border-color)",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "var(--bs-secondary-color)",
    "&:hover": {
      color: "var(--bs-body-color)",
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: "var(--bs-secondary-color)",
    "&:hover": {
      color: "var(--bs-body-color)",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--bs-dropdown-bg, var(--bs-body-bg))",
    border: "var(--bs-border-width) solid var(--bs-dropdown-border-color, var(--bs-border-color))",
    zIndex: 9999,
  }),
  menuList: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "var(--bs-dropdown-link-active-bg, var(--bs-primary))"
      : state.isFocused
        ? "var(--bs-dropdown-link-hover-bg, var(--bs-tertiary-bg))"
        : "transparent",
    color: state.isSelected
      ? "var(--bs-dropdown-link-active-color, #fff)"
      : "var(--bs-dropdown-link-hover-color, var(--bs-body-color))",
    cursor: "pointer",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "var(--bs-secondary-bg)",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "var(--bs-body-color)",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "var(--bs-secondary-color)",
    "&:hover": {
      backgroundColor: "var(--bs-danger)",
      color: "#fff",
    },
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: "var(--bs-secondary-color)",
  }),
  loadingMessage: (base) => ({
    ...base,
    color: "var(--bs-secondary-color)",
  }),
};
