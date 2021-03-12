import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

import Icon2 from 'react-native-vector-icons/FontAwesome';

import CaretIcon from 'react-native-vector-icons/FontAwesome';

export const Container = styled.View`
  background: #ffffff;
  flex: 1;
  display: flex;
  position: relative;

  font-family: 'Open Sans';

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

  position: relative;

  align-items: center;

  border-bottom-left-radius: 10;
  border-bottom-right-radius: 10;

  padding: 10px 20px 0 20px;
  elevation: 24;
`;

export const IconArea = styled.View``;

export const FIcon = styled(Icon)`
  color: #fff;
`;

export const TopText = styled.Text`
  text-align: center;

  color: #fff;
  font-size: 22px;
  margin-left: 23%;
`;

export const Content = styled.SafeAreaView`
  display: flex;
  align-items: center;
  justify-content: space-between;

  flex: 1;
  max-width: 90%;

  position: relative;
`;

export const HeaderBox = styled.View`
  margin-top: 5%;
  margin-bottom: 10px;
`;

export const Value = styled.Text`
  font-size: 40px;
  font-weight: bold;

  color: #051d37;
`;

export const Span = styled.Text`
  font-size: 16px;
  align-self: center;

  color: #414141;
`;

export const ZeroBox = styled.View`
  display: flex;
  align-items: center;
  width: 100%;
  flex: 1;
`;

export const ZeroImage = styled.Image`
  height: ${props => (props.imgType === 'empty' ? '100px' : '150px')};
`;

export const TextBox = styled.View`
  margin-top: 30px;
  width: 280px;
  margin-bottom: 25px;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
`;

export const Text = styled.Text`
  align-self: center;

  font-size: 18px;
  text-align: center;
  max-width: 250px;
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

export const HeaderRow = styled.View`
  flex-direction: row;
  width: 100%;
`;

export const TextRow = styled.Text`
  font-size: 18px;

  color: #051d37;

  font-weight: bold;
`;

export const Box = styled.View`
  display: flex;
  flex: 1;
  justify-content: space-between;

  padding-bottom: 20px;
`;

export const List = styled.FlatList`
  display: flex;
  max-height: 60%;
`;

export const EmptyList = styled.View`
  align-items: center;
  height: 60%;

  padding-top: 30px;
`;

export const EmptyInfo = styled.View``;

export const EmptyText = styled.Text`
  margin-top: 10px;

  font-size: 18px;
  max-width: 150px;

  text-align: center;

  color: #414141;
`;

export const AccountBox = styled.View`
  display: flex;
  flex-direction: row;
  border-bottom-width: ${props => (props.open ? '0px' : '1px')};
  border-bottom-color: ${props => (props.open ? '#7159c1' : '#dbdada')};

  align-items: center;
`;

export const AccountItem = styled.View.attrs(props => ({
  open: props.open,
}))``;

export const AccountText = styled.Text.attrs(props => ({
  positive: props.positive,
  value: props.value,
}))`
  font-size: 16px;
  overflow: hidden;
  max-height: 18px;

  margin: 15px 0;

  color: #414141;
`;

export const AccountMovement = styled.Text.attrs(props => ({
  value: props.value,
}))`
  font-size: 16px;
  overflow: hidden;
  max-height: 18px;

  margin: 15px 0;

  color: ${props => (props.value ? '#226AA1' : '#9B1414')};
`;

export const JobBox = styled.View`
  display: flex;
  flex-direction: row;

  padding-bottom: 15px;

  border-bottom-width: 1px;
  border-bottom-color: #dbdada;

  align-items: flex-start;
`;

export const JobInfo = styled.View``;

export const JobDate = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const JobTitle = styled.Text`
  color: #707070;
  font-weight: bold;
  font-size: 16px;
`;

export const JobText = styled.Text`
  color: #707070;
  font-size: 14px;
  margin-right: 5px;
`;

export const ButtonsBox = styled.View`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

export const BottomButton = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;

  align-items: center;
`;

export const BottomText = styled.Text`
  margin-left: 5px;
  font-size: 16px;
  color: #051d37;
`;

export const IconTest = styled(Icon2)``;

export const CarouselBox = styled(LinearGradient)`
  flex: 1;
  margin-bottom: 10px;

  display: flex;

  align-items: center;
  justify-content: center;
`;

export const CarouselItem = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const HWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const Caret = styled(CaretIcon)`
  margin-left: 5px;
`;
