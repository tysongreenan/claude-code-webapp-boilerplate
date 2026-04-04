"use client"

import { useEffect } from "react"

export function HashScrollHandler() {
  useEffect(() => {
    const handle = () => {
      const hash = window.location.hash
      if (hash) {
        const el = document.getElementById(hash.slice(1))
        if (el) {
          window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' })
        }
      }
    }

    if (window.location.hash) setTimeout(handle, 100)
    window.addEventListener('hashchange', handle)
    return () => window.removeEventListener('hashchange', handle)
  }, [])

  return null
}
