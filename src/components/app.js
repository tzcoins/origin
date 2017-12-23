import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import { Web3Provider } from 'react-web3';

// Components
import Listings from './listings-grid.js'
import ListingDetail from './listing-detail.js'
import ListingCreate from './listing-create.js'

// CSS
import '../css/pure-min.css' // TODO (stan): Is this even used?
import '../css/lato-web.css'
import '../css/poppins.css'
import '../css/app.css'

const DEMO_SCHEMA_LIST = [
  {type: 'for-sale', name: 'For Sale', 'img': 'for-sale.jpg'},
  {type: 'housing', name: 'Housing', 'img': 'housing.jpg'},
  {type: 'transportation', name: 'Transportation', 'img': 'transportation.jpg'},
  {type: 'tickets', name: 'Tickets', 'img': 'tickets.jpg'},
  {type: 'services', name: 'Services', 'img': 'services.jpg'},
  {type: 'announcements', name: 'Announcements', 'img': 'announcements.jpg'},
]


const NavBar = (props) => {
  return (
    <div className="navbar">
      <Link to="/">
        <img src="/images/origin-logo.png" alt="Origin Logo"/>
      </Link>
      <div className="navbar-create">
        <Link to="/create">Create a Listing</Link>
      </div>
    </div>
  )
}


const HomePage = () => {
  return (
    <div>
      <NavBar />
      <Listings />
    </div>
  )
}

const ListingDetailPage = () => (
  <div>
    <NavBar />
    <ListingDetail />
  </div>
)


const CreateListingPage = () => (
  <div>
    <NavBar />
    <ListingCreate schemaList={DEMO_SCHEMA_LIST} />
  </div>
)


// Handle changing of Metamask account
const onChangeAccount = (nextAddress) => (console.log(nextAddress))

// TODO: (Stan) Handle missing Metamask
// const web3UnavailableScreen = () => (<div>You need web3!</div>)}

// TODO: (Stan) Handle locked Metamask
// const accountUnavailableScreen = () => (<div>Please unlock your wallet!</div>)

// Top level component
const App = () => (
  <Web3Provider onChangeAccount={onChangeAccount}>
    <Router>
      <div>
        <Route exact path="/" component={HomePage}/>
        <Route path="/listing" component={ListingDetailPage}/>
        <Route path="/create" component={CreateListingPage}/>
      </div>
    </Router>
  </Web3Provider>
)
export default App
