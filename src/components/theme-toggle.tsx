'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

function ThemeToggle() {
  const { resolvedTheme: theme, setTheme } = useTheme()
  const isDark = theme === 'dark'
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks-extra/no-direct-set-state-in-use-effect
    setMounted(true)
  }, [])

  if (!mounted)
    return null

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`
        relative flex h-8 w-14 items-center rounded-full transition-colors
        duration-300
            ${isDark ? 'bg-neutral-700' : 'bg-yellow-200'
    }
      `}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div
        style={{ transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        className={cn(
          `
            absolute flex h-7 w-7 items-center justify-center rounded-full
            shadow-md transition-all duration-300 ease-out
          `,
          isDark
            ? 'left-[calc(100%-1.75rem)] bg-neutral-900 text-yellow-400'
            : 'left-1 bg-white text-yellow-700',
        )}
      >
        {isDark ? <Moon size={16} /> : <Sun size={16} />}
      </div>
    </button>
  )
}

export default ThemeToggle
