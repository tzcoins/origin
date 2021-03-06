import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Switch, Route } from 'react-router-dom'
import { fbt } from 'fbt-runtime'

import QueryError from 'components/QueryError'
import DocumentTitle from 'components/DocumentTitle'
import LoadingSpinner from 'components/LoadingSpinner'
import Redirect from 'components/Redirect'
import Error404 from 'components/Error404'

import query from 'queries/Listing'
import ListingDetail from './ListingDetail'
import EditListing from './Edit'
import Onboard from '../onboard/Onboard'
import ConfirmPurchase from './ConfirmPuchase'
import ShippingDetails from './ShippingDetails'
import PaymentMethods from './PaymentMethods'

import Store from 'utils/store'

const sessionStore = Store('sessionStorage')

const error404 = (
  <Error404>
    <h1 className="d-md-block">
      <fbt desc="listing.listing-not-found">Listing not found</fbt>
    </h1>
  </Error404>
)

const Listing = props => {
  const listingId = props.match.params.listingID

  const [redirect, setRedirect] = useState()
  const [quantity, setQuantity] = useState(
    sessionStore.get(`${listingId}-quantity`, '1')
  )
  const [shippingAddress, setShippingAddress] = useState(
    sessionStore.get(`${listingId}-shipping`, null)
  )
  const [bookingRange, setBookingRange] = useState(
    sessionStore.get(`${listingId}-booking-range`, null)
  )
  const [paymentMethod, setPaymentMethod] = useState(
    sessionStore.get(`${listingId}-payment-method`, null)
  )

  const variables = { listingId }

  const { networkStatus, error, data, refetch } = useQuery(query, {
    variables,
    errorPolicy: 'all'
  })

  if (redirect) {
    return <Redirect to={redirect} push />
  }

  if (networkStatus <= 2) {
    return <LoadingSpinner />
  } else if (error) {
    if (String(error).match(/no such listing/i)) {
      return error404
    }
    return <QueryError error={error} query={query} vars={variables} />
  } else if (!data || !data.marketplace) {
    return <div className="container">No marketplace contract?</div>
  }

  const listing = data.marketplace.listing
  if (!listing) {
    return error404
  } else if (!listing.valid) {
    return (
      <Error404>
        <h1 className="d-md-block">
          <fbt desc="listing.listingInvalid">Listing Invalid</fbt>
        </h1>
      </Error404>
    )
  }

  const wrappedRefetch = async redirect => {
    await refetch()
    setRedirect(redirect)
  }

  return (
    <>
      <DocumentTitle
        pageTitle={
          <fbt desc="listing.title">
            Listing <fbt:param name="id">{listingId}</fbt:param>
          </fbt>
        }
      />
      <Switch>
        <Route
          path="/listing/:listingID/onboard"
          render={() => <Onboard listing={listing} quantity={quantity} />}
        />
        <Route
          path="/listing/:listingID/edit"
          render={() => (
            <EditListing listing={listing} refetch={wrappedRefetch} />
          )}
        />
        <Route
          path="/listing/:listingID/payment"
          render={() => (
            <PaymentMethods
              listing={listing}
              quantity={quantity}
              bookingRange={bookingRange}
              paymentMethod={paymentMethod}
              setPaymentMethod={paymentMethod => {
                sessionStore.set(`${listingId}-payment-method`, paymentMethod)
                setPaymentMethod(paymentMethod)
              }}
              next={`/listing/${listing.id}/${
                listing.requiresShipping ? 'shipping' : 'confirm'
              }`}
            />
          )}
        />
        <Route
          path="/listing/:listingID/shipping"
          render={() => (
            <ShippingDetails
              listing={listing}
              updateShippingAddress={shippingAddress => {
                sessionStore.set(`${listingId}-shipping`, shippingAddress)
                setShippingAddress(shippingAddress)
              }}
              next={`/listing/${listingId}/confirm`}
              paymentMethod={paymentMethod}
            />
          )}
        />
        <Route
          path="/listing/:listingID/confirm"
          render={() => (
            <ConfirmPurchase
              listing={listing}
              refetch={wrappedRefetch}
              quantity={quantity}
              shippingAddress={shippingAddress}
              bookingRange={bookingRange}
              paymentMethod={paymentMethod}
            />
          )}
        />
        <Route
          render={() => (
            <ListingDetail
              listing={listing}
              refetch={wrappedRefetch}
              quantity={quantity}
              updateQuantity={quantity => {
                sessionStore.set(`${listingId}-quantity`, quantity)
                setQuantity(quantity)
              }}
              updateBookingRange={bookingRange => {
                sessionStore.set(`${listingId}-booking-range`, bookingRange)
                setBookingRange(bookingRange)
              }}
              shippingAddress={shippingAddress}
            />
          )}
        />
      </Switch>
    </>
  )
}

export default Listing
