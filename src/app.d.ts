// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Database } from 'sqlite3';

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      db: Database;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
