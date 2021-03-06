import React from 'react'

import Steps from '../Steps'
import Details from './Details'
import Quantity from '../../Quantity'
import Pricing from '../../Pricing'
import Images from '../../Images'
import Review from './Review'

const GiftCardListing = props => (
  <Steps
    {...props}
    steps={[
      { step: 1, component: Details, require: 'subCategory' },
      { step: 2, component: Quantity, path: 'quantity', require: 'retailer' },
      { step: 3, component: Pricing, path: 'pricing', require: 'quantity' },
      { step: 4, component: Images, path: 'images', require: 'price' },
      { step: 5, component: Review, path: 'review' }
    ]}
  />
)

export default GiftCardListing
