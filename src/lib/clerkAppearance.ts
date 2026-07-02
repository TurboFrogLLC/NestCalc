/** NestCalc auth card theme: white Clerk card on dark page background. */
export const nestcalcClerkAppearance = {
  variables: {
    colorPrimary: "#fbbf24",
    colorBackground: "#ffffff",
    colorForeground: "#18181b",
    colorMutedForeground: "#71717a",
    colorInput: "#ffffff",
    colorInputForeground: "#18181b",
    colorBorder: "#d4d4d8",
    colorNeutral: "#e4e4e7",
    borderRadius: "0.5rem",
  },
  elements: {
    cardBox: {
      backgroundColor: "#ffffff",
      boxShadow: "0 12px 40px rgb(0 0 0 / 0.35)",
    },
    formFieldInput: {
      backgroundColor: "#ffffff",
      borderColor: "#d4d4d8",
      color: "#18181b",
      "&:focus": {
        borderColor: "#fbbf24",
        boxShadow: "0 0 0 1px #fbbf24",
      },
    },
  },
};