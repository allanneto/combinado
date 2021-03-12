import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';

export const Container = styled.View`
  background: #6627c5;
  flex: 1;
  position: relative;
`;

export const Gradient = styled(LinearGradient)`
  flex: 1;
`;

export const ImageBox = styled.View`
  flex: 1;
  align-items: center;
  position: relative;
`;

export const BackgroundImage = styled.ImageBackground`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

export const HeaderText = styled.Text`
  /* font-family: 'Calibri'; */
  font-size: 30px;
  color: #ffffff;
  align-self: center;
`;

export const LocalizationButton = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})`
  background: #ffffff;
  height: 40px;

  border-radius: 20px;

  justify-content: center;
  align-items: center;
  margin: 25px 50px 15px 50px;
`;

export const LocalizationText = styled.Text`
  font-size: 16px;
  color: #717171;
`;

export const Content = styled.View`
  flex: 1;
  justify-content: space-around;
  align-items: center;
  padding: 0 40px 40px 40px;
`;

export const Item = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})`
  flex-direction: row;
  justify-content: space-around;
  align-self: center;
  width: 100%;
`;

export const ItemTextA = styled.View`
  align-items: flex-end;
  justify-content: center;
`;

export const ItemTextB = styled.View`
  align-items: flex-start;
  justify-content: center;
`;

export const ImageItem = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: 160px;
  height: 160px;
`;

export const ImageItemB = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: 160px;
  height: 160px;
`;

export const Text = styled.Text`
  /* font-family: 'Gotham'; */
  font-size: 20px;
  color: #25aaed;
  font-weight: bold;
`;
