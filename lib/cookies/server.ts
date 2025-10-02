'use server'
import { cookies as nextCookies } from 'next/headers'

export interface SetCookieOptions {
  name: string
  value: string
  expires?: Date
  maxAge?: number // in seconds
  domain?: string
  path?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'lax' | 'strict' | 'none'
  priority?: 'low' | 'medium' | 'high'
  partitioned?: boolean
}

/**
 * Get a cookie value and parse it to type T.
 * Example: `getServerCookie<User>('user', JSON.parse)`
 */
export async function getServerCookie<T = string>(
  name: string,
  parser?: (raw: string) => T
): Promise<T | undefined> {
  const store = await nextCookies()
  const c = store.get(name)
  if (!c) return undefined
  return parser ? parser(c.value) : (c.value as unknown as T)
}

/** Check if a cookie exists. */
export async function hasServerCookie(name: string): Promise<boolean> {
  const store = await nextCookies()
  return store.has(name)
}

/** Get all cookies, with optional parser per-value. */
export async function getAllServerCookies<T = string>(
  parser?: (raw: string) => T
): Promise<Record<string, T>> {
  const store = await nextCookies()
  const all = store.getAll()
  const result: Record<string, T> = {}
  for (const c of all) {
    result[c.name] = parser ? parser(c.value) : (c.value as unknown as T)
  }
  return result
}

/**
 * Sets a cookie. **Must** be called in a Route Handler or Server Action (not in pure Server Component).
 */
export async function setServerCookie<T = string>(
  opts: SetCookieOptions & { value: T },
  serializer?: (val: T) => string
): Promise<void> {
  const store = await nextCookies()
  const value =
    typeof opts.value === 'string'
      ? (opts.value as string)
      : serializer
      ? serializer(opts.value)
      : JSON.stringify(opts.value)

  store.set(opts.name, value, {
    expires: opts.expires,
    maxAge: opts.maxAge,
    domain: opts.domain,
    path: opts.path,
    secure: opts.secure,
    httpOnly: opts.httpOnly,
    sameSite: opts.sameSite,
    priority: opts.priority,
    partitioned: opts.partitioned
  })
}

/** Deletes a cookie (equivalent to Max-Age = 0). */
export async function deleteServerCookie(name: string): Promise<void> {
  const store = await nextCookies()
  store.delete(name)
}
