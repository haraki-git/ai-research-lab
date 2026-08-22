'use client'

import { useLayoutEffect } from 'react'

export default function HtmlLangSync({ locale }: { locale: string }) {
  useLayoutEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return null
}