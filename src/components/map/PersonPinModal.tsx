import { motion, AnimatePresence } from 'framer-motion'
import { useMemo, useRef, useEffect } from 'react'

interface PersonPinModalProps {
  person: any
  onClose: () => void
}

// Helper function to get field value safely
const getFieldValue = (person: any, ...fieldNames: string[]): string | null => {
  for (const fieldName of fieldNames) {
    const value = person[fieldName]
    if (value !== null && value !== undefined && value !== '' && value !== 'N' && value !== 0 && value !== false) {
      return String(value)
    }
  }
  return null
}

// Helper function to format boolean/indicator values
const formatBoolean = (value: any): string | null => {
  if (value === 'Y' || value === 'Yes' || value === true || value === 1 || value === '1') return 'Yes'
  if (value === 'N' || value === 'No' || value === false || value === 0 || value === '0') return 'No'
  return null
}

// Helper function to format gender
const formatGender = (value: any): string => {
  if (value === 'M' || value === 'Male') return 'Male'
  if (value === 'F' || value === 'Female') return 'Female'
  return String(value) || 'Not available'
}

// Helper function to get all interest fields
const getInterests = (person: any): string[] => {
  const interests: string[] = []
  
  // Define all possible interest fields from the actual L2 API data
  const interestFields = [
    // Active/Sports
    'Active_Snow_Skiing', 'Active_Tennis', 'Active_Motorcycle', 'Active_Nascar',
    'Sports_Baseball', 'Sports_Basketball', 'Sports_Football', 'Sports_Hockey',
    'Sports_Soccer', 'Sports_TV_Sports', 'Sports_Leisure', 'Sports_Grouping',
    'Sports_Auto_Motorcycle_Racing', 'Outdoor_Sports_Lover', 'Outdoor_Grouping',
    'Hunting_Shooting', 'Hunter', 'Golf_Enthusiast', 'Scuba_Diving',
    'Camping_Hiking', 'Boating_Sailing',
    
    // Apparel
    'Apparel_Mens', 'Apparel_Mens_Big_Tall', 'Apparel_Womens', 'Apparel_Womens_Plus_Size',
    'Apparel_Childrens', 'Apparel_Infant_Toddlers', 'Apparel_Young_Mens', 'Apparel_Young_Womens',
    'Apparel_Petite',
    
    // Arts & Collectibles
    'Arts_And_Antiques', 'Arts_Art', 'Arts_Int', 'Collectibles_Antiques',
    'Collectibles_Arts', 'Collectibles_Coins', 'Collectibles_General',
    'Collectibles_Sports_Memorabilia', 'Collectibles_Stamps', 'Collector_Avid',
    
    // Books & Reading
    'Book_Buyer', 'Book_Reader', 'Books_Magazines', 'Books_Music_Audio',
    'Books_Music_Books', 'Reading_General', 'Reading_Mags', 'Reading_Audio_Books',
    'Reading_Sci_Fi',
    
    // Automotive
    'Auto_Work', 'Automotive_Buff', 'Autoparts_Accessories',
    
    // Children
    'Childrens_Babycare', 'Childrens_Back_To_School', 'Childrens_General',
    'Childrens_Learning_Toys',
    
    // Computers & Electronics
    'Computer_Owner', 'Computer_Home_Office', 'Electronics_Computers',
    'Electronics_Movies_Int', 'Consumer_Electronics', 'High_Tech_Leader',
    
    // Cooking & Food
    'Cooking_Enthusiast', 'Cooking_General', 'Food_Wines', 'Foods_Natural',
    'Collect_Special_Foods_Buyer',
    
    // Crafts & Hobbies
    'Craft_Int', 'Crafts_Hobbies_Buyer', 'Gardening', 'Gardening_Farming_Buyer',
    'Sewing_Knitting_Needlework', 'Woodwork', 'House_Plants',
    
    // Health & Beauty
    'Cosmetics_Beauty', 'Health_And_Beauty', 'Dieting_Weightloss',
    'Exercise_Aerobic', 'Exercise_Enthusiast', 'Exercise_Health_Grouping',
    'Exercise_Running_Jogging', 'Exercise_Walking', 'Health_Medical',
    
    // Home & Garden
    'Home_And_Garden', 'Home_Decor_Enthusiast', 'Home_Furnishings_Decor',
    'Home_Improvement', 'Home_Improvement_Grouping', 'Home_Living',
    'High_End_Appliances',
    
    // Investments
    'Investments', 'Investments_Personal', 'Invest_Active', 'Invest_Stock_Securities',
    'Investments_Est_Re_Properties_Owned', 'Investments_Foreign',
    'Investments_Realestate', 'Investing_Finance_Grouping',
    
    // Music
    'Music_Avid_Listener', 'Music_Collector', 'Music_Home_Stereo',
    'Music_Player_Device', 'Musical_Instruments',
    
    // Pets
    'Pets_Cats', 'Pets_Dogs', 'Pets_Multi',
    
    // Photography
    'Photography_Int', 'Photography_Video_Equip',
    
    // Travel
    'Travel_Cruises', 'Travel_Domestic', 'Travel_Int', 'Travel_Intl',
    'Travel_Grouping', 'Luggage_Buyer',
    
    // Other
    'DVD_Videos', 'Games_Board_Puzzles', 'Games_PC_Games', 'Games_Video',
    'Gaming_Casino', 'Gaming_Int', 'Jewelry_Buyer', 'Movie_Collector',
    'Music_Collector', 'Science_Space', 'Theater_Performing_Arts',
  ]

  interestFields.forEach(field => {
    const value = person[field]
    if (value === 'Yes' || value === 'Y' || value === true || value === 1) {
      const interestName = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      interests.push(interestName)
    }
  })

  return interests
}

export default function PersonPinModal({ person, onClose }: PersonPinModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Prevent scroll propagation to map
  useEffect(() => {
    const modalElement = modalRef.current
    if (!modalElement) return

    const preventPropagation = (e: Event) => {
      e.stopPropagation()
    }

    modalElement.addEventListener('touchstart', preventPropagation, { passive: true })
    modalElement.addEventListener('touchmove', preventPropagation, { passive: true })

    return () => {
      modalElement.removeEventListener('touchstart', preventPropagation)
      modalElement.removeEventListener('touchmove', preventPropagation)
    }
  }, [])

  // Extract key information using correct field names
  const firstName = getFieldValue(person, 'FirstName', 'Voters_FirstName') || ''
  const lastName = getFieldValue(person, 'LastName', 'Voters_LastName') || ''
  const name = `${firstName} ${lastName}`.trim() || 'Unknown'
  const age = getFieldValue(person, 'Inferred_Age', 'Voters_Age', 'Age') || 'Not available'
  const gender = formatGender(getFieldValue(person, 'Gender', 'Voters_Gender'))
  
  // Address - using correct field names
  const addressLine = getFieldValue(person, 'Address_AddressLine', 'Residence_Addresses_AddressLine1') || 'Not available'
  const city = getFieldValue(person, 'Address_City', 'Residence_Addresses_City') || ''
  const state = getFieldValue(person, 'Address_State', 'Residence_Addresses_State') || ''
  const zip = getFieldValue(person, 'Address_Zip', 'Residence_Addresses_Zip') || ''
  
  // Financial
  const income = getFieldValue(person, 'Estimated_Income_Code', 'Estimated_Income', 'Income') || 'Not available'
  const netWorth = getFieldValue(person, 'Household_Net_Worth') || null
  
  // Professional
  const businessOwner = formatBoolean(getFieldValue(person, 'Business_Owner'))
  const homeowner = getFieldValue(person, 'Homeowner_Probability_Model')
  const homeownerStatus = homeowner && homeowner.toLowerCase().includes('home owner') ? 'Yes' : (homeowner || null)
  
  // Additional fields
  const occupation = getFieldValue(person, 'Occupation_Group', 'Occupation_of_Person', 'Occupation') || null
  const education = getFieldValue(person, 'Education_of_Person', 'Education_Level', 'Education') || null
  const maritalStatus = getFieldValue(person, 'Marital_Status', 'Voters_MaritalStatus') || null
  const phone = getFieldValue(person, 'Landline_Phone_Number', 'Residence_Addresses_Phone', 'Phone') || null
  const cellPhone = getFieldValue(person, 'Cell_Phone', 'Residence_Addresses_CellPhone', 'Mobile') || null
  
  // Home information
  const homeValue = getFieldValue(person, 'Home_Est_Current_Value_Code', 'Home_Est_Current_Value') || null
  const homePurchasePrice = getFieldValue(person, 'Home_Purchase_Price_Code', 'Home_Purchase_Price') || null
  const homeYearBuilt = getFieldValue(person, 'Home_Year_Built') || null
  
  // Credit cards
  const hasCreditCard = formatBoolean(getFieldValue(person, 'Presence_Of_CC', 'Presence_Of_Bankcard'))
  const hasPremiumCC = formatBoolean(getFieldValue(person, 'Presence_Of_Premium_CC', 'Presence_Of_Gold_Plat_CC'))
  const americanExpress = formatBoolean(getFieldValue(person, 'American_Express_CC', 'American_Express_Gold_Plat'))
  const visaPremium = formatBoolean(getFieldValue(person, 'Visa_Gold_Premium'))
  
  // Interests
  const interests = useMemo(() => getInterests(person), [person])

  return (
    <AnimatePresence>
      <motion.div
        ref={modalRef}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[20px] shadow-2xl z-50 max-h-[70vh] overflow-y-auto"
        style={{ 
          borderTopLeftRadius: '20px', 
          borderTopRightRadius: '20px',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain'
        }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="flex justify-between items-start mb-4 sticky top-0 bg-white pt-2 pb-2 z-10">
            <div>
              <h2 className="font-display text-2xl text-gray-900">👤 {name}</h2>
              <p className="text-sm text-purple-600 font-semibold mt-1">Potential Customer</p>
              {(age !== 'Not available' || gender !== 'Not available') && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  {age !== 'Not available' && <span>Age: {age}</span>}
                  {age !== 'Not available' && gender !== 'Not available' && <span>•</span>}
                  {gender !== 'Not available' && <span>{gender}</span>}
                </div>
              )}
            </div>
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
                {addressLine}
                {city && `, ${city}`}
                {state && `, ${state}`}
                {zip && ` ${zip}`}
              </div>
            </div>

            {/* Contact Information */}
            {(phone || cellPhone) && (
              <div>
                <div className="font-body text-sm font-semibold text-gray-500 mb-2">📞 Contact Information</div>
                <div className="space-y-2">
                  {phone && (
                    <div className="font-body text-sm text-gray-900">Phone: {phone}</div>
                  )}
                  {cellPhone && (
                    <div className="font-body text-sm text-gray-900">Cell: {cellPhone}</div>
                  )}
                </div>
              </div>
            )}

            {/* Demographics */}
            <div>
              <div className="font-body text-sm font-semibold text-gray-500 mb-2">📊 Demographics</div>
              <div className="grid grid-cols-2 gap-3">
                {income !== 'Not available' && (
                  <div>
                    <div className="font-body text-xs font-semibold text-gray-500 mb-1">💰 Income</div>
                    <div className="font-body text-sm text-gray-900">{income}</div>
                  </div>
                )}
                {netWorth && (
                  <div>
                    <div className="font-body text-xs font-semibold text-gray-500 mb-1">💎 Net Worth</div>
                    <div className="font-body text-sm text-gray-900">{netWorth}</div>
                  </div>
                )}
                {age !== 'Not available' && (
                  <div>
                    <div className="font-body text-xs font-semibold text-gray-500 mb-1">🎂 Age</div>
                    <div className="font-body text-sm text-gray-900">{age}</div>
                  </div>
                )}
                {gender !== 'Not available' && (
                  <div>
                    <div className="font-body text-xs font-semibold text-gray-500 mb-1">👤 Gender</div>
                    <div className="font-body text-sm text-gray-900">{gender}</div>
                  </div>
                )}
                {maritalStatus && (
                  <div>
                    <div className="font-body text-xs font-semibold text-gray-500 mb-1">💍 Marital Status</div>
                    <div className="font-body text-sm text-gray-900">{maritalStatus}</div>
                  </div>
                )}
                {education && (
                  <div>
                    <div className="font-body text-xs font-semibold text-gray-500 mb-1">🎓 Education</div>
                    <div className="font-body text-sm text-gray-900">{education}</div>
                  </div>
                )}
                {occupation && (
                  <div>
                    <div className="font-body text-xs font-semibold text-gray-500 mb-1">💼 Occupation</div>
                    <div className="font-body text-sm text-gray-900">{occupation}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Professional */}
            {(businessOwner || homeownerStatus) && (
              <div>
                <div className="font-body text-sm font-semibold text-gray-500 mb-2">💼 Professional</div>
                <div className="grid grid-cols-2 gap-3">
                  {businessOwner && (
                    <div>
                      <div className="font-body text-xs font-semibold text-gray-500 mb-1">🏢 Business Owner</div>
                      <div className="font-body text-sm text-gray-900">{businessOwner}</div>
                    </div>
                  )}
                  {homeownerStatus && (
                    <div>
                      <div className="font-body text-xs font-semibold text-gray-500 mb-1">🏠 Homeowner</div>
                      <div className="font-body text-sm text-gray-900">{homeownerStatus}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Home Information */}
            {(homeValue || homePurchasePrice || homeYearBuilt) && (
              <div>
                <div className="font-body text-sm font-semibold text-gray-500 mb-2">🏡 Home Information</div>
                <div className="grid grid-cols-2 gap-3">
                  {homeValue && (
                    <div>
                      <div className="font-body text-xs font-semibold text-gray-500 mb-1">💰 Home Value</div>
                      <div className="font-body text-sm text-gray-900">{homeValue}</div>
                    </div>
                  )}
                  {homePurchasePrice && (
                    <div>
                      <div className="font-body text-xs font-semibold text-gray-500 mb-1">💵 Purchase Price</div>
                      <div className="font-body text-sm text-gray-900">{homePurchasePrice}</div>
                    </div>
                  )}
                  {homeYearBuilt && (
                    <div>
                      <div className="font-body text-xs font-semibold text-gray-500 mb-1">📅 Year Built</div>
                      <div className="font-body text-sm text-gray-900">{homeYearBuilt}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Credit Cards */}
            {(hasCreditCard || hasPremiumCC || americanExpress || visaPremium) && (
              <div>
                <div className="font-body text-sm font-semibold text-gray-500 mb-2">💳 Credit Cards</div>
                <div className="grid grid-cols-2 gap-3">
                  {hasCreditCard && (
                    <div>
                      <div className="font-body text-xs font-semibold text-gray-500 mb-1">💳 Has Credit Card</div>
                      <div className="font-body text-sm text-gray-900">{hasCreditCard}</div>
                    </div>
                  )}
                  {hasPremiumCC && (
                    <div>
                      <div className="font-body text-xs font-semibold text-gray-500 mb-1">⭐ Premium Card</div>
                      <div className="font-body text-sm text-gray-900">{hasPremiumCC}</div>
                    </div>
                  )}
                  {americanExpress && (
                    <div>
                      <div className="font-body text-xs font-semibold text-gray-500 mb-1">💎 American Express</div>
                      <div className="font-body text-sm text-gray-900">{americanExpress}</div>
                    </div>
                  )}
                  {visaPremium && (
                    <div>
                      <div className="font-body text-xs font-semibold text-gray-500 mb-1">💳 Visa Premium</div>
                      <div className="font-body text-sm text-gray-900">{visaPremium}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Interests */}
            {interests.length > 0 && (
              <div>
                <div className="font-body text-sm font-semibold text-gray-500 mb-2">🎯 Interests</div>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              className="btn-game-primary w-full mt-6 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500"
              onClick={() => {
                // TODO: Add to selection
                onClose()
              }}
            >
              View Details ✓
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
