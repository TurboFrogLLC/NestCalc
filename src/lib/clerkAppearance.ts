/** NestCalc auth card theme: white Clerk card on dark page background. */
export const nestcalcClerkAppearance = {
  variables: {
    colorPrimary: "#fbbf24",
    colorBackground: "#ffffff",
    colorForeground: "#18181b",
    colorMutedForeground: "#52525b",
    colorInput: "#ffffff",
    colorInputForeground: "#18181b",
    colorBorder: "#d4d4d8",
    colorNeutral: "#e4e4e7",
    colorText: "#18181b",
    colorTextSecondary: "#52525b",
    borderRadius: "0.5rem",
  },
  elements: {
    cardBox: {
      backgroundColor: "#ffffff",
      boxShadow: "0 12px 40px rgb(0 0 0 / 0.35)",
    },
    card: {
      backgroundColor: "#ffffff",
      border: "1px solid #d4d4d8",
    },
    headerTitle: {
      color: "#18181b",
    },
    headerSubtitle: {
      color: "#52525b",
    },
    socialButtonsBlockButton: {
      borderColor: "#d4d4d8",
      color: "#18181b",
      "&:hover": {
        backgroundColor: "#f4f4f5",
      },
    },
    dividerLine: {
      backgroundColor: "#e4e4e7",
    },
    dividerText: {
      color: "#71717a",
    },
    formFieldLabel: {
      color: "#3f3f46",
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
    formButtonPrimary: {
      backgroundColor: "#fbbf24",
      color: "#18181b",
      "&:hover": {
        backgroundColor: "#f59e0b",
      },
    },
    footerActionLink: {
      color: "#d97706",
      "&:hover": {
        color: "#b45309",
      },
    },
    footerActionText: {
      color: "#52525b",
    },
    identityPreviewText: {
      color: "#18181b",
    },
    identityPreviewEditButton: {
      color: "#d97706",
    },
  },
};

/** Sign-in only: hide Clerk footer links to public sign-up. */
export const nestcalcSignInAppearance = {
  ...nestcalcClerkAppearance,
  elements: {
    ...nestcalcClerkAppearance.elements,
    footer: { display: "none" },
    footerAction: { display: "none" },
    footerActionLink: { display: "none" },
    footerActionText: { display: "none" },
  },
};

/** Dark popover + profile modal for UserButton on the shop-floor dark UI. */
export const nestcalcUserButtonAppearance = {
  ...nestcalcClerkAppearance,
  variables: {
    ...nestcalcClerkAppearance.variables,
    colorBackground: "#18181b",
    colorForeground: "#fafafa",
    colorMutedForeground: "#a1a1aa",
    colorBorder: "#3f3f46",
    colorNeutral: "#27272a",
    colorText: "#fafafa",
    colorTextSecondary: "#a1a1aa",
  },
  elements: {
    ...nestcalcClerkAppearance.elements,
    userButtonPopoverCard: {
      backgroundColor: "#18181b",
      border: "1px solid #3f3f46",
      boxShadow: "0 12px 40px rgb(0 0 0 / 0.55)",
    },
    userButtonPopoverActions: {
      borderColor: "#3f3f46",
    },
    userButtonPopoverActionButton: {
      color: "#fafafa",
      "&:hover": {
        backgroundColor: "#27272a",
      },
    },
    userButtonPopoverActionButtonText: {
      color: "#fafafa",
    },
    userButtonPopoverActionButtonIcon: {
      color: "#a1a1aa",
    },
    userButtonPopoverFooter: {
      backgroundColor: "#09090b",
      borderTop: "1px solid #3f3f46",
    },
    userPreviewMainIdentifier: {
      color: "#fafafa",
    },
    userPreviewSecondaryIdentifier: {
      color: "#a1a1aa",
    },
    modalContent: {
      backgroundColor: "#18181b",
      border: "1px solid #3f3f46",
    },
    navbar: {
      backgroundColor: "#09090b",
      borderBottom: "1px solid #3f3f46",
    },
    navbarButton: {
      color: "#fafafa",
      "&:hover": {
        backgroundColor: "#27272a",
      },
    },
    profileSectionTitleText: {
      color: "#a1a1aa",
    },
    profileSectionContent: {
      color: "#fafafa",
    },
    menuButton: {
      color: "#fafafa",
      "&:hover": {
        backgroundColor: "#27272a",
      },
    },
    menuList: {
      backgroundColor: "#18181b",
      border: "1px solid #3f3f46",
    },
    menuItem: {
      color: "#fafafa",
      "&:hover": {
        backgroundColor: "#27272a",
      },
    },
    badge: {
      backgroundColor: "#27272a",
      color: "#fafafa",
      border: "1px solid #3f3f46",
    },
  },
};
