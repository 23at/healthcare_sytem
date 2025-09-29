// global.d.ts
// global.d.ts
declare module "*.css";

declare namespace NodeJS {
  interface Global {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
  }
}
