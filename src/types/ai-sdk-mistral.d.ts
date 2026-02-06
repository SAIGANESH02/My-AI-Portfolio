// Fallback type declaration for environments where the TS language service
// temporarily fails to resolve pnpm-linked packages.
//
// Runtime still requires the actual `@ai-sdk/mistral` package to be installed.
declare module '@ai-sdk/mistral' {
  // Keep this intentionally loose to avoid coupling to internal types.
  export const mistral: any;
}

