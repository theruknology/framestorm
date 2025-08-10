import React, { useState } from 'react'
import { ParticlesBG } from '@/components/ui/ParticlesBG'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DiamondLoader } from '@/components/ui/DiamondLoader'

import { ChevronRight, ChevronLeft, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Slide {
  id: number
  title: string
  question: string
  description?: string
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Create Your Marketing Story",
    question: "Tell us about your business",
    description: "We'll help you create engaging content that resonates with your audience"
  },
  {
    id: 2,
    title: "Your Target Audience",
    question: "Who are your ideal customers?",
    description: "Help us understand who we're creating content for"
  },
  {
    id: 3,
    title: "What Makes You Special",
    question: "What's your unique value proposition?",
    description: "Let's highlight what sets you apart"
  },
  {
    id: 4,
    title: "Goals & Vision",
    question: "What are your marketing goals?",
    description: "We'll tailor your content strategy accordingly"
  }
]

const ChatMode = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [input, setInput] = useState('')
  const [showLoader, setShowLoader] = useState(false)

  const handleNext = () => {
    if (input.trim()) {
      setAnswers(prev => ({ ...prev, [currentSlide]: input }))
      setInput('')
      // If last slide, show loader
      if (currentSlide === slides.length - 1) {
        setShowLoader(true)
      } else {
        setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1))
      }
    }
  }

  const handleBack = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0))
    setInput(answers[currentSlide - 1] || '')
  }

  const isLoader = showLoader

  return (
    <div
      className="flex-1 h-full flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: 'url(/wallpaper.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100vw',
      }}
    >
      {/* Dark overlay to decrease exposure */}
      <div style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(10, 10, 20, 0.5)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />
      <div className="max-w-4xl w-full mx-auto px-4 relative z-10" style={{backdropFilter: 'blur(0px)'}}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {isLoader ? (
              <DiamondLoader />
            ) : (
              <>
                <div className="text-center space-y-8 py-8">
                  {currentSlide === 0 && (
                    <img src="/logo.png" alt="Logo" className="mx-auto mb-10 w-56 h-56 object-contain" />
                  )}
                  <motion.h2 
                    className="text-5xl font-extrabold tracking-tight gradient-text"
                  >
                    {slides[currentSlide].title}
                  </motion.h2>
                  <motion.p 
                    className="text-3xl question-text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {slides[currentSlide].question}
                  </motion.p>
                </div>

                <div className="flex items-end gap-2 w-full max-w-2xl mx-auto py-2">
                  <motion.div
                    initial={{ borderRadius: '2rem', height: 48 }}
                    animate={{ borderRadius: '2rem', height: 48 }}
                    whileFocus={{
                      height: 200,
                      borderRadius: '2.5rem',
                      boxShadow: '0 4px 32px 0 rgba(80,80,120,0.18)',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 20,
                    }}
                    className="transition-all duration-300 overflow-hidden flex-1"
                    tabIndex={-1}
                  >
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your answer here..."
                      className="h-full min-h-0 bg-background/20 backdrop-blur text-lg rounded-2xl transition-all duration-300 focus:bg-background/40 focus:rounded-3xl"
                      onFocus={e => {
                        e.target.parentElement?.dispatchEvent(new FocusEvent('focus', { bubbles: true }))
                      }}
                      onBlur={e => {
                        e.target.parentElement?.dispatchEvent(new FocusEvent('blur', { bubbles: true }))
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
                          e.preventDefault()
                          handleNext()
                        }
                      }}
                      rows={1}
                    />
                  </motion.div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleNext}
                    disabled={!input.trim()}
                    className="mb-2"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={currentSlide === 0}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>

                  <div className="flex gap-1">
                    {slides.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 w-8 rounded-full transition-colors ${
                          index === currentSlide
                            ? 'bg-primary'
                            : index < currentSlide
                            ? 'bg-primary/30'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    onClick={handleNext}
                    disabled={!input.trim() || currentSlide === slides.length - 1}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ChatMode
