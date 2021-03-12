import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

import {TextInputMask} from 'react-native-masked-text';

import {Animated} from 'react-native';

import DatePicker from 'react-native-datepicker';

export const Container = styled.View`
  background: #ffffff;
  flex: 1;
  display: flex;
  width: 100%;

  padding-bottom: 20px;
  align-items: center;
`;

export const Tste = styled(Animated.View)``;

export const Content = styled.SafeAreaView`
  display: flex;
  width: 100%;
  flex: 1;
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

export const FIcon = styled(Icon)`
  color: #fff;
`;

export const TitleBox = styled.Text`
  margin-top: 30px;
  align-self: center;

  text-align: center;

  width: 280px;
`;

export const Title = styled.Text`
  font-size: 20px;
  /*font-family: 'Open Sans';*/

  color: #707070;
`;

export const Phase1 = styled(Animated.View).attrs(props => ({
  phase: props.phase,
}))`
  display: ${props => (props.phase === 1 ? 'flex' : 'none')};
  width: 100%;
`;

export const Phase2 = styled(Animated.View).attrs(props => ({
  phase: props.phase,
}))`
  display: ${props => (props.phase === 2 ? 'flex' : 'none')};
  width: 100%;
`;

export const Phase3 = styled(Animated.View).attrs(props => ({
  phase: props.phase,
}))`
  display: ${props => (props.phase === 3 ? 'flex' : 'none')};
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

  margin: 3px 30px;
`;

export const PhoneInput = styled(TextInputMask).attrs({
  placeholderTextColor: '#808080',
})`
  border-bottom-color: #51328b;
  border-bottom-width: 1px;

  color: #808080;
  padding-left: 0;
  font-size: 15px;

  margin: 8px 30px;
`;

export const DateBox = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0;

  border-bottom-color: #51328b;
  border-bottom-width: 1px;

  margin: 5px 30px;
`;

export const DateInput = styled(DatePicker).attrs({})`
  width: 100%;
`;

export const Select = styled.Picker`
  color: #808080;
  font-size: 15px;

  margin: 0 22px;
`;

export const PhasesBox = styled.View`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
`;

export const PhaseIdentifier = styled.View.attrs(props => ({
  filled: props.filled,
}))`
  border: 2px #f5cc00;
  height: 10px;
  width: 10px;
  background: ${props => (props.filled ? '#f5cc00' : 'transparent')};

  border-radius: 5px;
  margin-right: 5px;
  margin-bottom: 20px;
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
  color: #fff;
  align-self: center;
  font-size: 22px;
  /*font-family: 'Calibri';*/
`;

export const Image2 = styled.Image`
  width: 25px;
  height: 25px;
`;

export const Image = styled.Image`
  width: 40px;
  height: 40px;
`;

export const FooterBox = styled.View`
  align-items: center;
  flex: 1;

  justify-content: flex-end;
  margin-bottom: auto;
`;

export const FooterImage = styled.Image`
  width: 180px;
  height: 120px;
`;

export const ImgBox = styled.View``;
