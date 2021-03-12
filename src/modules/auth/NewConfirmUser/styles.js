import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

import IconMA from 'react-native-vector-icons/MaterialIcons';
import {Animated} from 'react-native';

export const Container = styled.KeyboardAvoidingView`
  background: #ffffff;
  flex: 1;
  display: flex;
  width: 100%;

  padding-bottom: 20px;
  align-items: center;
  justify-content: space-between;
`;

export const Content = styled.View`
  display: flex;
  width: 100%;

  align-items: center;
`;

export const Header = styled.View`
  height: 12%;
  width: 100%;

  elevation: 24;
`;

export const HeaderGradient = styled(LinearGradient)`
  display: flex;
  flex-direction: row;
  flex: 1;

  align-items: center;
  justify-content: space-between;

  border-bottom-left-radius: 10;
  border-bottom-right-radius: 10;

  padding: 10px 20px 0 20px;
  elevation: 24;
`;

export const HeaderTextERROR = styled.Text`
  color: #fff;
  align-self: center;
  font-size: 22px;
  /*font-family: 'Calibri';*/
`;

export const HeaderText = styled.Text`
  color: #fff;
  align-self: center;
  font-size: 22px;
`;

export const FIcon = styled(Icon)`
  color: #fff;
`;

export const TitleBox = styled.Text`
  align-self: center;

  text-align: center;

  width: 280px;
`;

export const Title = styled.Text`
  font-size: 22px;
  /*font-family: 'Open Sans';*/

  color: #707070;
`;

export const Form = styled(Animated.View)`
  width: 100%;
`;

export const Input = styled.TextInput.attrs({
  placeholderTextColor: '#808080',
})`
  border-bottom-color: #51328b;
  border-bottom-width: 1px;

  color: #808080;
  padding-left: 0;
  font-size: 15px;

  margin: 0 30px;
`;

export const Refresh = styled.TouchableOpacity`
  margin-top: 15px;

  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: center;
`;

export const RefreshIcon = styled(IconMA)`
  margin-right: 5px;
`;

export const Button = styled.TouchableOpacity.attrs(props => ({
  phase: props.phase,
}))`
  display: flex;
  height: 50px;
  width: 220px;

  border-radius: 25px;
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

export const Text = styled.Text`
  color: #301e53;
  align-self: center;
  font-size: 16px;
  /*font-family: 'Calibri';*/
`;

export const Image = styled.Image`
  width: 25px;
  height: 25px;
`;

export const FooterBox = styled.View`
  display: flex;
  align-items: center;
`;

export const FooterImage = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: 130px;
  height: 130px;
`;

export const FooterText = styled.View`
  display: flex;
  align-items: center;
`;

export const BoldText = styled.Text`
  font-size: 22px;
  /*font-family: 'Open Sans';*/

  color: #301e53;
`;

export const ImgBox = styled.View``;
