import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

export const Container = styled.KeyboardAvoidingView`
  height: 100%;
  background: #ffffff;
  padding: 0;
  justify-content: space-between;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;

  height: 35%;
`;

export const HeaderImage = styled.View`
  position: absolute;
  right: 0;
  top: 0;
`;

export const Image1 = styled.Image`
  padding: 0;
  right: -10px;
  top: 15px;
  position: absolute;
`;

export const Image2 = styled.Image`
  padding: 0;
  right: -10px;
  top: 15px;
`;

export const Image = styled.Image.attrs(props => ({
  open: props.open,
}))`
  display: ${props => (props.open ? 'none' : 'flex')};
`;

export const FIcon = styled(Icon)`
  position: absolute;
  top: 35px;
  left: 15px;
`;

export const Footer = styled.View`
  height: 200px;
`;

export const Background = styled.ImageBackground`
  flex: 1;
  height: 200px;
  bottom: -20px;

  align-items: center;
  justify-content: center;
`;

export const Button = styled.TouchableOpacity.attrs(props => ({
  visible: props.visible,
}))`
  display: ${props => (props.visible ? 'flex' : 'none')};

  height: 50px;
  width: 220px;
  border-radius: 25px;

  top: 20px;
`;

export const ButtonGradient = styled(LinearGradient).attrs(props => ({
  disabled: props.disabled,
}))`
  flex: 1;
  border-radius: 25px;

  opacity: ${props => (props.disabled ? 0.8 : 1)};

  align-items: center;
  justify-content: center;
`;

export const ButtonText = styled.Text`
  color: #fff;
  align-self: center;
  font-size: 18px;
`;

export const ContentBox = styled.View``;

export const Title = styled.Text`
  font-size: 30px;
  color: #1e1d5a;
  align-self: center;
  font-weight: bold;

  margin-bottom: 35px;
`;

export const Input = styled.TextInput.attrs({
  placeholderTextColor: '#808080',
})`
  border-bottom-color: #51328b;
  border-bottom-width: 1px;

  color: #808080;
  font-size: 18px;
  text-align: center;

  margin: 15px 30px;
`;

export const TokenBox = styled.View.attrs(props => ({
  visible: props.visible,
}))`
  display: ${props => (props.visible ? 'flex' : 'none')};
`;

export const PasswordBox = styled.View.attrs(props => ({
  visible: props.visible,
}))`
  display: ${props => (props.visible ? 'flex' : 'none')};
`;
