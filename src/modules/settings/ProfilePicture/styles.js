import styled, {css} from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';

import Icon from 'react-native-vector-icons/AntDesign';

export const Container = styled.SafeAreaView`
  background: #ffffff;
  flex: 1;
  display: flex;
  width: 100%;

  align-items: center;
  justify-content: space-between;
`;

export const Content = styled.View`
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Header = styled.View`
  height: 12%;
  width: 100%;
  display: flex;
  padding-top: 20px;

  align-items: center;
  justify-content: center;
`;

export const FIcon = styled(Icon)`
  position: absolute;
  right: 15px;
  padding-top: 20px;
  color: #2c1b4c;
`;

export const Text = styled.Text`
  font-size: 20px;
  color: #2c1b4c;
`;

export const Avatar = styled.TouchableOpacity`
  margin-bottom: 20px;
  width: 200px;
  height: 200px;
  overflow: hidden;

  border-radius: 105px;

  border: 1.5px solid #2c1b4b;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Form = styled.View`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const MainText = styled.Text`
  font-size: 18px;
  font-family: 'Open Sans';
  color: #707070;
`;

export const Main = styled.Text`
  align-self: center;

  text-align: center;

  width: 290px;
  margin-bottom: 10%;
`;

export const Image = styled.Image.attrs(props => ({
  profile: props.profile,
}))`
  ${props =>
    props.profile
      ? css`
          width: ${props => (props.profile ? '100%' : '30%')};
          height: ${props => (props.profile ? '100%' : '30%')};
        `
      : css`
          width: 30%;
          height: 30%;
        `}
`;

export const Button = styled.TouchableOpacity`
  height: 50px;
  width: 220px;
  border-radius: 25px;
  border: 1.5px solid #2c1b4b;
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
  color: #2b1b4b;
  align-self: center;
  font-size: 18px;
`;

export const Footer = styled.TouchableOpacity`
  margin-top: 8%;

  display: flex;
  align-items: center;
`;

export const FooterImage = styled.Image`
  top: 1px;

  height: 99px;
  width: 500px;
`;

export const FooterText = styled.Text`
  position: absolute;

  bottom: 35%;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;
