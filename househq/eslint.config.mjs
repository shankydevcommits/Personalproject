import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: ["private-content/**", "design-reference/**", ".next/**"],
  },
];

export default eslintConfig;
