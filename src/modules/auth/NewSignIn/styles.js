import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';

import Colors from '~/config/Colors';

export const Container = styled.KeyboardAvoidingView`
  flex: 1;
  font-family: 'Calibri';
`;

export const Gradient = styled(LinearGradient)`
  flex: 1;
  justify-content: space-evenly;
`;

export const Content = styled.View`
  flex: 1;
`;

export const HeaderText = styled.Text`
  color: #fff;
  font-size: 30px;
`;

export const Logo = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: 50%;
`;

export const Header = styled.View.attrs(props => ({
  open: props.open,
}))`
  display: ${props => (props.open === 0 ? 'none' : 'flex')};
  align-items: center;
  justify-content: space-around;
  margin-top: 0;
  height: 200px;
`;

export const Form = styled.View`
  display: flex;

  padding: 0 40px;
  margin-top: 20px;
`;

export const Input = styled.TextInput.attrs({
  placeholderTextColor: '#49238e',
})`
  padding: 5px 10px;
  font-size: 16px;
  color: ${Colors.inputText};

  border-radius: 5px;
  justify-content: center;
  background: ${Colors.white};

  height: 50px;
`;

export const Password = styled.View`
  flex-direction: row;
  border-radius: 5px;
  height: 50px;
  justify-content: space-between;
  align-items: center;
  background: ${Colors.white};
  margin: 20px 0 0 0;
  padding-right: 15px;
`;

export const PasswordInput = styled.TextInput.attrs({
  placeholderTextColor: '#49238e',
})`
  padding: 5px 10px;
  width: 90%;
  font-size: 16px;
  color: ${Colors.inputText};

  border-radius: 5px;
  height: 50px;
  justify-content: center;
  background: ${Colors.white};
`;

export const FooterBox = styled.View`
  flex: 1;
  justify-content: space-evenly;
  align-items: center;
`;

export const Button = styled.TouchableOpacity.attrs({
  activeOpacity: 0.9,
})`
  height: 40px;
  width: 130px;

  border-radius: 20px;
`;

export const ButtonGradient = styled(LinearGradient).attrs(props => ({
  disabled: props.disabled,
}))`
  flex: 1;
  border-radius: 20px;

  opacity: ${props => (props.disabled ? 0.8 : 1)};

  align-items: center;
  justify-content: center;
`;

export const ButtonText = styled.Text`
  color: ${Colors.mainColor};
  align-self: center;
  font-weight: bold;
  font-size: 24px;
`;

export const ForgotText = styled.Text`
  font-size: 15px;
  color: ${Colors.white};
`;
