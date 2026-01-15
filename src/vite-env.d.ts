/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPBOX_ACCESS_TOKEN: string
  readonly VITE_L2_API_CUSTOMER: string
  readonly VITE_L2_API_KEY: string
  readonly VITE_L2_APP: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

