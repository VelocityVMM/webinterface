import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor() { }

  VInfo(message: string, prefix?: string) {
    if(prefix) {
      console.log(`[${prefix}] ${message}`)
    } else {
      console.log(`[*] ${message}`)
    }
  }

  VErr(message: string, prefix?: string) {
    if(prefix) {
      console.warn(`[${prefix}] ${message}`)
    } else {
      console.warn(`[WARN] ${message}`)
    }
  }

  VWarn(message: string, prefix?: string) {
    if(prefix) {
      console.error(`[${prefix}] ${message}`)
    } else {
      console.error(`[ERR] ${message}`)
    }
  }
}
