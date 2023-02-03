declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_TOKEN: string;
    }
  }
}
