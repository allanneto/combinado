import {createStackNavigator} from 'react-navigation-stack';

import PersonScreen from '~/modules/settings/PersonScreen';
import PersonName from '~/modules/settings/Person/PersonName';
import PersonGender from '~/modules/settings/Person/PersonGender';
import PersonBirth from '~/modules/settings/Person/PersonBirth';
import PersonLocal from '~/modules/settings/Person/PersonLocal';
import PersonCell from '~/modules/settings/Person/PersonCell';
import PersonCPF from '~/modules/settings/Person/PersonCPF';
import PersonCNPJ from '~/modules/settings/Person/PersonCNPJ';
import PersonInsc from '~/modules/settings/Person/PersonInsc';
import PersonBanco from '~/modules/settings/Person/PersonBanco';
import PersonAgencia from '~/modules/settings/Person/PersonAgencia';
import PersonConta from '~/modules/settings/Person/PersonConta';
import PersonTipoConta from '~/modules/settings/Person/PersonTipoConta';
import PersonCard from '~/modules/settings/Person/PersonCard';
import PersonComplemento from '~/modules/settings/Person/PersonComplemento';
import PersonNum from '~/modules/settings/Person/PersonNum';
import PersonCep from '~/modules/settings/Person/PersonCep';
import PersonAccCPF from '~/modules/settings/Person/PersonAccCPF';
import PersonAccCNPJ from '~/modules/settings/Person/PersonAccCNPJ';

const PersonScreenNavigator = createStackNavigator({
  Profile: {
    screen: PersonScreen,
  },
  PersonName: {
    screen: PersonName,
  },
  PersonGender: {
    screen: PersonGender,
  },
  PersonBirth: {
    screen: PersonBirth,
  },
  PersonLocal: {
    screen: PersonLocal,
  },
  PersonComplemento: {
    screen: PersonComplemento,
  },
  PersonNum: {
    screen: PersonNum,
  },
  PersonCell: {
    screen: PersonCell,
  },
  PersonCep: {
    screen: PersonCep,
  },
  PersonCPF: {
    screen: PersonCPF,
  },
  PersonCNPJ: {
    screen: PersonCNPJ,
  },
  PersonAccCPF: {
    screen: PersonAccCPF,
  },
  PersonAccCNPJ: {
    screen: PersonAccCNPJ,
  },
  PersonInsc: {
    screen: PersonInsc,
  },
  PersonBanco: {
    screen: PersonBanco,
  },
  PersonAgencia: {
    screen: PersonAgencia,
  },
  PersonConta: {
    screen: PersonConta,
  },
  PersonTipoConta: {
    screen: PersonTipoConta,
  },
  PersonCard: {
    screen: PersonCard,
  },
});

export default PersonScreenNavigator;
