/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** '1' solo per i test: attiva Google Analytics anche fuori dal dominio definitivo. */
  readonly VITE_ANALYTICS_TEST?: string
}
