/** NestCalc dark shop-floor theme for Clerk prebuilt components. */
export const nestcalcClerkAppearance = {
  variables: {
    colorPrimary: "#fbbf24",
    colorBackground: "#09090b",
    colorText: "#fafafa",
    colorInputBackground: "#1f2937",
    colorInputText: "#f3f4f6",
    colorNeutral: "#4b5563",
    borderRadius: "0.5rem",
  },
  elements: {
    formFieldInput: {
      backgroundColor: "#1f2937",
      borderColor: "#4b5563",
      color: "#f3f4f6",
      "&:focus": {
        borderColor: "#fbbf24",
        boxShadow: "0 0 0 1px #fbbf24",
      },
    },
  },
};