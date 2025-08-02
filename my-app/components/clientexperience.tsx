"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Experience = dynamic(() => import('./pages/ExperiencePage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="text-white animate-pulse">Loading Timeline...</div>
    </div>
  )
})

export default function ClientExperience() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <Experience />
    </Suspense>
  )
}
