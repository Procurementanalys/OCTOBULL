// FIX: Replaced content to fix "Cannot find type definition file for 'vite/client'"
// and to provide types for process.env.API_KEY as per @google/genai guidelines.
declare var process: {
  env: {
    readonly API_KEY: string;
  };
};
