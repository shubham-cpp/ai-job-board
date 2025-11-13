import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPrefix(name: string) {
  let p = ''
  name.split(' ').forEach((v, i) => {
    if (i < 2) {
      p += v[0]
    }
  })
  return p
}
