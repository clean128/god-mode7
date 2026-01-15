import { motion, AnimatePresence } from 'framer-motion'

interface PersonPinModalProps {
  person: any
  onClose: () => void
}

export default function PersonPinModal({ person, onClose }: PersonPinModalProps) {
  // Extract key information from L2 data
  const name = `${person.Voters_FirstName || ''} ${person.Voters_LastName || ''}`.trim() || 'Unknown'
  const address = person.Residence_Addresses_AddressLine1 || 'Address not available'
  const city = person.Residence_Addresses_City || ''
  const state = person.Residence_Addresses_State || ''
  const zip = person.Residence_Addresses_Zip || ''
  const income = person.Estimated_Income || 'Not available'
  const age = person.Voters_Age || 'Not available'
  const gender = person.Voters_Gender || 'Not available'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[20px] shadow-2xl z-50 max-h-[60vh] overflow-y-auto"
        style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-display text-2xl text-gray-900">👤 {name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {/* Address */}
            <div>
              <div className="font-body text-sm font-semibold text-gray-500 mb-1">📍 Address</div>
              <div className="font-body text-base text-gray-900">
                {address}
                {city && `, ${city}`}
                {state && `, ${state}`}
                {zip && ` ${zip}`}
              </div>
            </div>

            {/* Demographics */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-body text-sm font-semibold text-gray-500 mb-1">💰 Income</div>
                <div className="font-body text-base text-gray-900">{income}</div>
              </div>
              <div>
                <div className="font-body text-sm font-semibold text-gray-500 mb-1">🎂 Age</div>
                <div className="font-body text-base text-gray-900">{age}</div>
              </div>
              <div>
                <div className="font-body text-sm font-semibold text-gray-500 mb-1">👤 Gender</div>
                <div className="font-body text-base text-gray-900">{gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : gender}</div>
              </div>
            </div>

            {/* Action Button */}
            <button
              className="btn-game-primary w-full mt-6"
              onClick={() => {
                // TODO: Add to selection
                onClose()
              }}
            >
              Select Person ✓
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

