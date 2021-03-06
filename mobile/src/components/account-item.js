'use strict'

import React from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native'
import { connect } from 'react-redux'
import get from 'lodash.get'

import { truncate, truncateAddress } from 'utils'
import Avatar from 'components/avatar'
import ListStyles from 'styles/list'

const IMAGES_PATH = '../../assets/images/'

const AccountItem = ({ item, navigation, settings, wallet }) => {
  // Truncate the account name to something that looks reasonable, the upper
  // bound was set from an iPhone X
  const truncateLength = Dimensions.get('window').width < 375 ? 15 : 20

  const networkName = get(settings.network, 'name', null)
  const identity = get(wallet.identities, `${networkName}.${item.address}`, {})
  const name = get(identity, 'fullName')
  const avatarUrl = get(identity, 'avatarUrl')

  return (
    <TouchableHighlight
      onPress={() =>
        navigation.navigate('Account', {
          account: {
            ...item
          }
        })
      }
    >
      <View style={styles.listItem}>
        <View style={styles.listItemTextContainer}>
          <View style={{ ...styles.listItemIconContainer, marginRight: 10 }}>
            <Avatar source={avatarUrl} />
          </View>
          {name ? (
            <Text style={styles.name}>{truncate(name, truncateLength)}</Text>
          ) : (
            <Text style={styles.name}>{truncateAddress(item.address)}</Text>
          )}
        </View>
        {
          <View style={styles.listItemIconContainer}>
            {get(wallet, 'activeAccount.address') === item.address && (
              <Image
                source={require(`${IMAGES_PATH}selected.png`)}
                style={styles.listSelectedItem}
              />
            )}
            <Image source={require(`${IMAGES_PATH}arrow-right.png`)} />
          </View>
        }
      </View>
    </TouchableHighlight>
  )
}

const mapStateToProps = ({ settings, wallet }) => {
  return { settings, wallet }
}

export default connect(mapStateToProps)(AccountItem)

const styles = StyleSheet.create({
  ...ListStyles,
  name: {
    fontFamily: 'Lato',
    fontSize: 17,
    marginHorizontal: 5
  }
})
