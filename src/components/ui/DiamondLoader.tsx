import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// 5x5 diamond loader
const diamondCoords = [
  [2,0],[1,1],[2,1],[3,1],
  [0,2],[1,2],[2,2],[3,2],[4,2],
  [1,3],[2,3],[3,3],
  [2,4]
]

export const DiamondLoader = () => {
  const [litIndex, setLitIndex] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setLitIndex(i => (i + 1) % diamondCoords.length)
    }, 120)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[320px]">
      <div className="relative w-32 h-32">
        {[...Array(5)].map((_, y) => (
          <div key={y} className="absolute left-0 top-0 w-full h-full">
            {[...Array(5)].map((_, x) => {
              const idx = diamondCoords.findIndex(([dx,dy]) => dx===x && dy===y)
              if (idx === -1) return null
              const lit = idx <= litIndex
              return (
                <motion.div
                  key={x}
                  className={`absolute rounded-full`}
                  style={{
                    left: `${x*20+16}px`,
                    top: `${y*20+16}px`,
                    width: 24,
                    height: 24,
                    background: lit ? 'linear-gradient(135deg,#fff 60%,#a855f7 100%)' : 'rgba(168,85,247,0.15)',
                    boxShadow: lit ? '0 0 16px 4px #a855f7aa' : undefined,
                    zIndex: lit ? 2 : 1,
                  }}
                  animate={{
                    scale: lit ? 1.15 : 1,
                    opacity: lit ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.18 }}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="mt-10 text-3xl font-medium text-white">
        Generating <span className="font-extrabold text-primary">viral</span> content...
      </div>
    </div>
  )
}
