import { motion, AnimatePresence } from 'framer-motion'

interface LoadingStatusBarProps {
  isVisible: boolean
  message?: string
}

export default function LoadingStatusBar({ isVisible, message = 'Loading people data...' }: LoadingStatusBarProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-1/2 left-0 right-0 flex justify-center z-[55]"
        >
          <div className="bg-gradient-to-br from-game-primary to-game-primary-dark rounded-game px-6 py-4 shadow-2xl border-3 border-white min-w-[300px] max-w-md">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 border-3 border-white rounded-full flex items-center justify-center">
                  <motion.div
                    className="w-4 h-4 bg-white rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-display text-lg font-bold text-white uppercase tracking-wide mb-1">
                  {message}
                </p>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-white to-cyan-200 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      repeatType: 'reverse',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

