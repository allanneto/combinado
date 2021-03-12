import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, View, Alert, Keyboard } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import TextInputMask from 'react-native-text-input-mask'

import Colors from '~/config/Colors'
import { validCNPJ } from '~/services/validators'
import { bindActionCreators } from 'redux'
import { Creators as authActions } from '~/redux/ducks/auth'
import { updateUser } from '~/services/authApi'

class PersonCNPJ extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      error: null,
      user: null
    }
  }

  componentDidMount () {
    this.setState({ user: this.props.auth.user })
  }

  static navigationOptions = {
    title: 'Alterar CNPJ',
    headerStyle: {
      backgroundColor: Colors.mainColor
    },
    headerTintColor: Colors.white
  }

  changeValue = value => {
    this.setState(prevState => ({
      error: null,
      user: {
        ...prevState.user,
        cnpj: value
      }
    }))
  }

  saveValue = async () => {
    Keyboard.dismiss()
    this.setState({ loading: true })
    if (this.state.user.cnpj) {
      if (!validCNPJ(this.state.user.cnpj)) {
        this.setState({ error: 'CNPJ inválido' })
        this.setState({ loading: false })
        return
      }
    }
    try {
      await updateUser({ cnpj: this.state.user.cnpj })
      this.props.udateCurrentUser({ cnpj: this.state.user.cnpj })
      this.setState({ loading: false, error: null })
      this.props.navigation.goBack()
    } catch (err) {
      this.setState({ error: err.message })
    }
  }

  render () {
    if (this.state.error !== null) {
      Alert.alert('Erro', this.state.error)
    }
    if (this.state.user) {
      return (
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <TextInput
              label='CNPJ'
              value={this.state.user.cnpj}
              style={{ marginBottom: 8, backgroundColor: 'white' }}
              keyboardType='numeric'
              onChangeText={text => this.changeValue(text)}
              render={props => (
                <TextInputMask {...props} mask='[00].[000].[000]/[0000]-[00]' />
              )}
            />
          </View>

          <View style={styles.cmdContainer}>
            <Button
              mode='contained'
              icon='check'
              onPress={() => this.saveValue()}
            >
              Salvar
            </Button>
          </View>
        </View>
      )
    } else {
      return null
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  contentContainer: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 10,
    marginBottom: 10
  },
  cmdContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center'
  }
})

const mapStateToProps = state => {
  return {
    ...state
  }
}
const mapDispatchToProps = dispatch => bindActionCreators(authActions, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonCNPJ)
