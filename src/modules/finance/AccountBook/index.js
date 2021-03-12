/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  Alert,
  Dimensions,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';

import {NavigationEvents} from 'react-navigation';

import Carousel from 'react-native-snap-carousel';

import {
  parseISO,
  format,
  differenceInCalendarMonths,
  addMonths,
  parse,
} from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import {connect} from 'react-redux';

import * as Styled from './styles';

import {listAccounts, getBalance, mailAccounts} from '~/services/accountsApi';
import {encodeParam} from '~/services/utils';
import {getImageUrl} from '~/services/s3Api';

import moment from 'moment';

const numbro = require('numbro');
let ptbr = require('numbro/dist/languages/pt-BR.min');
numbro.registerLanguage(ptbr, true);
numbro.setLanguage('pt-BR');

const SLIDER_WIDTH = Math.round(Dimensions.get('window').width * 0.8);
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.42);

const formatVal = num => {
  return numbro(parseFloat(num)).format({
    thousandSeparated: true,
    mantissa: 2,
  });
};

class JobCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      user: null,
      waitNotif: false,
      org: props.org || [],
    };
  }

  componentDidMount() {
    getImageUrl(this.props.item.pic).then(image => {
      this.setState({
        loaded: true,
        image,
      });
    });
  }

  render() {
    if (!this.state.loaded) {
      return null;
    }
    return (
      <Styled.JobBox>
        <Styled.JobInfo>
          {this.props.item.dat && (
            <View>
              <Styled.JobTitle>{this.props.item.tsk}</Styled.JobTitle>
              <Styled.JobText>{this.props.item.tit}</Styled.JobText>
            </View>
          )}
          {this.props.item.doc && this.props.item.doc.split('#').length > 3 && (
            <View>
              <Styled.HWrapper>
                <Styled.JobText>Banco</Styled.JobText>
                <Styled.JobText>
                  {this.props.item.doc.split('#')[1]}
                </Styled.JobText>
              </Styled.HWrapper>
              <Styled.HWrapper>
                <Styled.JobText>Agência</Styled.JobText>
                <Styled.JobText>
                  {this.props.item.doc.split('#')[2]}
                </Styled.JobText>
              </Styled.HWrapper>
              <Styled.HWrapper>
                <Styled.JobText>Conta</Styled.JobText>
                <Styled.JobText>
                  {this.props.item.doc.split('#')[3]}
                </Styled.JobText>
              </Styled.HWrapper>
            </View>
          )}

          {this.props.item.ini && this.props.item.fim && (
            <Styled.JobDate>
              <Styled.JobDate>
                <Styled.JobText>Início:</Styled.JobText>
                <Styled.JobText>
                  {this.props.item.ini
                    ? `${moment(this.props.item.ini).format(
                        'DD/MM',
                      )} ás ${moment(this.props.item.ini).format('HH:mm')} -`
                    : ''}
                </Styled.JobText>
              </Styled.JobDate>
              <Styled.JobDate>
                <Styled.JobText>Fim:</Styled.JobText>
                <Styled.JobText>
                  {this.props.item.fim
                    ? `${moment(this.props.item.fim).format(
                        'DD/MM',
                      )} ás ${moment(this.props.item.fim).format('HH:mm')}`
                    : ''}
                </Styled.JobText>
              </Styled.JobDate>
            </Styled.JobDate>
          )}
        </Styled.JobInfo>
      </Styled.JobBox>
    );
  }
}

class AccountBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      page: '',
      data: [],
      listData: [],
      dateCarousel: [],
      currentValue: '0,00',
      error: null,
      user: null,
      refreshing: true,
      activeIndex: null,
      vis: null,
      caretIcon: 'caret-down',
    };
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({user: this.props.auth.user, loading: true}, () => {
      this.makeRemoteRequest();
    });
  }

  changeListData(index) {
    const data = [];

    this.state.data.map(item => {
      if (
        item.filterDate ===
        `${this.state.dateCarousel[index].mes}/${
          this.state.dateCarousel[index].ano
        }`
      ) {
        return data.push(item);
      }
    });

    this.setState({
      listData: data,
    });
  }

  makeRemoteRequest = () => {
    const queryParams = {emp: this.props.auth.user.ema};
    // queryParams.date = '2020-08';
    if (this.state.loading) {
      const {start} = this.state;
      if (start) {
        queryParams.start = start;
      }
      // __DEV__ && console.tron.log(queryParams);
      const query = encodeParam(queryParams);
      getBalance(this.props.auth.user.ema)
        .then(bal => {
          listAccounts(query).then(res => {
            const newItens = [];

            const newData = res.Items.map(item => {
              const newItem = format(parseISO(item.tms), 'MMMM/yyyy', {
                locale: pt,
              });

              const dateItem = format(parseISO(item.tms), 'MM/yyyy', {
                locale: pt,
              });

              const [mes, ano] = dateItem.split('/');

              const duplicate = newItens.find(date => date.date === newItem);

              if (!duplicate) {
                newItens.push({
                  date: newItem,
                  dateTms: parseISO(item.tms),
                  orderDate: Number(`${mes}${ano}`),
                });

                const data = {
                  ...item,
                  filterDate: newItem,
                  orderDate: Number(`${mes}${ano}`),
                };

                return data;
              }

              const data = {...item, filterDate: newItem};

              return data;
            });

            const dateArray = [];

            newItens.map(item => {
              const [mes, ano] = item.date.split('/');

              dateArray.push({
                mes,
                ano,
                date: item.dateTms,
                orderDate: item.orderDate,
              });
            });

            dateArray.sort((a, b) => {
              return a.orderDate - b.orderDate;
            });

            const monthsDiff = differenceInCalendarMonths(
              dateArray[0]?.date,
              new Date(),
            );

            const newDateArray = [];

            for (let i = 0; i <= monthsDiff * -1; i += 1) {
              const [mes, ano] = format(
                addMonths(dateArray[0].date, i),
                'MMMM/yyyy',
                {
                  locale: pt,
                },
              ).split('/');

              const [month, year] = format(
                addMonths(dateArray[0].date, i),
                'MM/yyyy',
              ).split('/');

              newDateArray.push({
                mes,
                ano,
                orderDate: Number(`${month}${year}`),
              });
            }

            this.setState({
              dateCarousel: newDateArray,
            });

            newData.sort((a, b) => {
              return a.orderDate - b.orderDate;
            });

            this.setState({
              data: !start ? newData : [...this.state.data, ...newData],
              last: res.LastEvaluatedKey,
              error: res.error || null,
              loading: false,
              activeIndex: this.state.dateCarousel.length - 1,
              currentValue: formatVal(bal),
              refreshing: false,
            });

            this.carousel.snapToItem(this.state.dateCarousel.length - 1);

            this.changeListData(this.state.dateCarousel.length - 1);
          });
        })
        .catch(error => {
          this.setState({error, loading: false});
        });
    }
  };

  handleRefresh = () => {
    this.setState(
      {
        last: null,
        loading: true,
        refreshing: true,
      },
      () => {
        this.makeRemoteRequest();
      },
    );
  };

  handleLoadMore = () => {
    this.makeRemoteRequest();
  };

  getHour(dta) {
    return moment(dta).format('DD/MM/YYYY HH:mm');
  }

  reorderList() {
    const reversedList = this.state.listData.slice(0).reverse();

    this.setState({
      caretIcon:
        this.state.caretIcon === 'caret-down' ? 'caret-up' : 'caret-down',
      listData: reversedList,
    });
  }

  async sendMail() {
    this.setState({working: true});
    const queryParams = {emp: this.props.auth.user.ema};
    queryParams.date = this.state.listData
      ? this.state.data[0].tms.substr(0, 7)
      : '';
    // queryParams.date = '2020-08';
    const query = encodeParam(queryParams);
    const ret = await mailAccounts(query);
    this.setState({working: false});
    Alert.alert(ret);
  }

  createTwoButtonAlert = () =>
    Alert.alert(
      'Envio de extrato',
      `O extrato de ${this.state.dateCarousel[this.state.activeIndex].mes}/${
        this.state.dateCarousel[this.state.activeIndex].ano
      } será enviado para ${this.props.auth.user.ema}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => console.log('Cancel Pressed'),
        },
        {text: 'OK', onPress: () => this.sendMail()},
      ],
      {cancelable: false},
    );

  _renderItem({item, index}) {
    return (
      <Styled.CarouselItem>
        <Text style={{fontSize: 22}}>
          {item.mes.charAt(0).toUpperCase() + item.mes.slice(1)}
        </Text>
        <Text>{item.ano}</Text>
      </Styled.CarouselItem>
    );
  }

  render() {
    return (
      <Styled.Container>
        <StatusBar backgroundColor="transparent" />
        <Styled.Header>
          <Styled.HeaderGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#2B1A49', '#503289']}>
            <Styled.IconArea>
              <Styled.FIcon
                onPress={() => this.props.navigation.navigate('WorkFocus')}
                name="arrow-left"
                size={30}
              />
            </Styled.IconArea>
            <Styled.TopText>Conta Corrente</Styled.TopText>
          </Styled.HeaderGradient>
        </Styled.Header>

        <NavigationEvents onDidFocus={this.handleRefresh} />

        <Styled.Content>
          <Styled.HeaderBox>
            <Styled.Value>R$ {this.state.currentValue}</Styled.Value>
            <Styled.Span>Saldo atual</Styled.Span>
          </Styled.HeaderBox>

          {this.state.data.length !== 0 && (
            <Styled.Box>
              <Styled.CarouselBox
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#FDFDFF', '#E3E7FC', '#FDFDFF']}>
                <Carousel
                  layout={'default'}
                  ref={ref => (this.carousel = ref)}
                  data={this.state.dateCarousel}
                  sliderWidth={SLIDER_WIDTH}
                  itemWidth={ITEM_WIDTH}
                  renderItem={this._renderItem}
                  onSnapToItem={index => {
                    this.setState({
                      activeIndex: index,
                      vis: null,
                      caretIcon: 'caret-down',
                    });

                    this.changeListData(index);
                  }}
                />
              </Styled.CarouselBox>

              <Styled.HeaderRow>
                <Styled.TextRow style={{width: '50%'}}>
                  Movimento
                </Styled.TextRow>
                <Styled.HWrapper
                  style={{width: '22%', paddingLeft: 10, border: 1}}>
                  <Styled.TextRow>Data</Styled.TextRow>
                  <Styled.Caret
                    onPress={() => this.reorderList()}
                    name={this.state.caretIcon}
                    size={20}
                    color="#051d37"
                  />
                </Styled.HWrapper>
                <Styled.TextRow style={{width: '28%', textAlign: 'right'}}>
                  Valor
                </Styled.TextRow>
              </Styled.HeaderRow>
              {this.state.listData.length !== 0 ? (
                <Styled.List
                  removeClippedSubviews
                  showsVerticalScrollIndicator={false}
                  data={this.state.listData}
                  renderItem={({item, index}) => (
                    <>
                      <TouchableWithoutFeedback
                        onPress={() =>
                          this.setState({
                            vis: this.state.vis === index ? null : index,
                          })
                        }>
                        <Styled.AccountBox
                          open={this.state.vis === index ? true : false}>
                          <Styled.AccountItem style={{width: '50%'}}>
                            <Styled.AccountText>{item.des}</Styled.AccountText>
                          </Styled.AccountItem>
                          <Styled.AccountItem
                            style={{width: '20%', paddingLeft: 10}}>
                            <Styled.AccountText style={{marginLeft: 10}}>
                              {moment(item.tms).format('DD')}
                            </Styled.AccountText>
                          </Styled.AccountItem>
                          <Styled.AccountItem
                            style={{
                              width: '30%',
                              display: 'flex',
                              alignItems: 'flex-end',
                            }}>
                            <Styled.AccountMovement value={item.cr}>
                              {item.cr
                                ? `+${formatVal(item.cr)}`
                                : `-${formatVal(item.db)}`}
                            </Styled.AccountMovement>
                          </Styled.AccountItem>
                        </Styled.AccountBox>
                      </TouchableWithoutFeedback>
                      {this.state.vis === index && <JobCard item={item} />}
                    </>
                  )}
                  keyExtractor={(item, i) => item.tms}
                  onRefresh={this.handleRefresh}
                  refreshing={this.state.refreshing}
                  onEndReached={this.handleLoadMore}
                />
              ) : (
                <Styled.EmptyList>
                  <Styled.ZeroImage
                    imgType="empty"
                    source={require('~/assets/images/empty.png')}
                    resizeMode="contain"
                  />
                  <Styled.EmptyText>
                    Sem movimentos para este mês.
                  </Styled.EmptyText>
                </Styled.EmptyList>
              )}

              <Styled.ButtonsBox>
                <Styled.BottomButton
                  disabled={this.state.working}
                  onPress={() => this.createTwoButtonAlert()}>
                  <Styled.IconTest
                    name="envelope-o"
                    color="#051D37"
                    size={20}
                  />
                  <Styled.BottomText>Enviar por E-Mail</Styled.BottomText>
                </Styled.BottomButton>
                <Styled.BottomButton
                  disabled={this.state.working}
                  onPress={() =>
                    this.props.navigation.navigate('AccountWithdraw')
                  }>
                  <Styled.IconTest name="dollar" color="#051D37" size={20} />
                  <Styled.BottomText>Transferir saldo</Styled.BottomText>
                </Styled.BottomButton>
              </Styled.ButtonsBox>
            </Styled.Box>
          )}

          {this.state.currentValue === '0,00' &&
            this.state.data.length === 0 &&
            this.state.loading === false && (
              <Styled.ZeroBox>
                <Styled.ZeroImage
                  source={require('~/assets/images/Ops.png')}
                  resizeMode="contain"
                />
                <Styled.TextBox>
                  <Styled.Title>Ooops!</Styled.Title>
                  <Styled.Text>
                    Olá {this.props.auth.user.name}, ainda não há movimentos em
                    seu perfil.
                  </Styled.Text>

                  <Styled.Text>
                    Comece publicando uma vaga ou seja um freelancer!
                  </Styled.Text>
                </Styled.TextBox>

                <Styled.Button
                  // disabled={this.state.username ? false : true}
                  onPress={() => this.props.navigation.navigate('WorkFocus')}>
                  <Styled.ButtonGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={['#A2F902', '#D4E000']}>
                    <Styled.ButtonText>Começar</Styled.ButtonText>
                  </Styled.ButtonGradient>
                </Styled.Button>
              </Styled.ZeroBox>
            )}
        </Styled.Content>
      </Styled.Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(AccountBook);
