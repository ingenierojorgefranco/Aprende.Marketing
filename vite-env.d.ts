
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // aquí puedes añadir más si las usas, por ejemplo:
  // readonly VITE_OTRA_VARIABLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'react-router-dom';
