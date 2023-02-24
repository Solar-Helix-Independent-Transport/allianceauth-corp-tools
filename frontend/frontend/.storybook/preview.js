import React from "react";

export const parameters = {
  layout: "centered",
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootswatch@5.2.2/dist/darkly/bootstrap.min.css"
        integrity="sha256-o0HIFCT80mlwmD9WyaZ15WwfdUK5A+gMvVWv8J04lKc="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
        integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
      />
      <Story />
    </>
  ),
];
