import { motion } from 'framer-motion'

interface AchievementBadgeProps {
  achievement: string
}

const achievementIcons: Record<string, string> = {
  'Business Finder!': '🎯',
  'Explorer!': '🗺️',
  'First Gift Sent!': '🎁',
  'Campaign Master!': '🏆',
}

export default function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const icon = achievementIcons[achievement] || '⭐'

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15,
      }}
      className="relative"
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-game-accent-orange to-game-accent-yellow flex items-center justify-center shadow-game-orange">
        <span className="text-4xl">{icon}</span>
      </div>
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-gradient-to-br from-game-accent-orange to-game-accent-yellow opacity-50 blur-sm"
      />
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <span className="font-display text-xs text-gray-700">{achievement}</span>
      </div>
    </motion.div>
  )
}

