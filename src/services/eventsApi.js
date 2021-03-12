import {Auth, API} from 'aws-amplify';
import moment from 'moment';
import isAfter from 'date-fns/isAfter';

import {userModel} from '~/config/models';
import Colors from '~/config/Colors';

export function getEventType(tip) {
  const tipo = userModel.tipos.find(ele => ele.key === tip);
  if (tipo) {
    return tipo.text;
  }
  return tip;
}

export function getSkillName(tip) {
  const tipo = userModel.skl.find(ele => ele.key === tip);
  if (tipo) {
    return tipo.text;
  }
  return tip;
}

const eventStatus = {
  EVENTO_CURSO: 'Em curso',
  EVENTO_ATIVO: 'Publicado',
  EVENTO_TERMINADO: 'Terminado',
  EVENTO_NOVO: 'Novo',
  EVENTO_PUBLICAR: 'A publicar',
  EVENTO_INVALIDO: 'Data inválida',
  EVENTO_ENCERRADO: 'Encerrado',
  EVENTO_CANCELADO: 'Cancelado',
};

export function getEventStatus(event) {
  const sta = event.sta;
  const agora = moment().format();
  const fim = moment(event.fim).format();
  const ini = moment(event.ini).format();
  const past = fim < agora;
  const present = ini < agora && fim > agora;

  if (sta === 2) {
    return eventStatus.EVENTO_ENCERRADO;
  }
  if (sta === 3) {
    return eventStatus.EVENTO_CANCELADO;
  }

  const fields = [
    event.tit || false,
    event.cel || false,
    event.loc || false,
    event.ini || false,
    event.fim || false,
    event.tsk && event.tsk.length > 0,
  ];
  const ready = fields.every(ele => ele);

  if (past) {
    if (sta === 0) {
      return eventStatus.EVENTO_INVALIDO;
    }
    return eventStatus.EVENTO_TERMINADO;
  }
  if (present) {
    if (sta === 0) {
      return eventStatus.EVENTO_INVALIDO;
    }
    return eventStatus.EVENTO_CURSO;
  }
  if (ready) {
    return [eventStatus.EVENTO_PUBLICAR, eventStatus.EVENTO_ATIVO][sta];
  }
  return eventStatus.EVENTO_NOVO;
}

export function eventInvalid(event) {
  const sta = getEventStatus(event);
  return sta === eventStatus.EVENTO_INVALIDO;
}

export function getEventStyle(event) {
  const sta = event.sta;
  const agora = moment();
  const fim = moment(event.fim);
  const ini = moment(event.ini);
  const past = fim < agora;
  const present = ini < agora && fim > agora;
  if (sta === 3) {
    // cancelado
    return {
      fontSize: 14,
      fontWeight: 'bold',
      color: Colors.lightColor,
    };
  }
  if (past) {
    if (sta === 0) {
      // Invalido
      return {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.errorBackground,
      };
    }
    // Terminado
    return {
      fontSize: 14,
      fontWeight: 'bold',
      color: Colors.lightColor,
    };
  }
  if (present) {
    // Inválido
    if (sta === 0) {
      return {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.errorBackground,
      };
    }
    // Ativo
    return {
      fontSize: 14,
      fontWeight: 'bold',
      fontStyle: 'italic',
      color: Colors.mainColor,
    };
  }
  if (sta === 0) {
    // novo
    return {
      fontSize: 14,
      fontWeight: 'bold',
      fontStyle: 'italic',
      color: Colors.greenish,
    };
  } else {
    // Publicado
    return {
      fontSize: 14,
      fontWeight: 'bold',
      color: Colors.bluish,
    };
  }
}

export function isEventRO(evnt) {
  return evnt.sta !== 0;
}

export function isEventBlocked(evnt) {
  const sta = getEventStatus(evnt);
  return (
    sta === eventStatus.EVENTO_CURSO ||
    sta === eventStatus.EVENTO_TERMINADO ||
    sta === eventStatus.EVENTO_CANCELADO ||
    sta === eventStatus.EVENTO_ENCERRADO
  );
}

export function canActivate(event) {
  const today = new Date();
  const ini = new Date(event.ini);
  const fim = new Date(event.fim);
  const past = isAfter(today, fim);
  const present = isAfter(today, ini) && !isAfter(today, fim);
  if (present || past) {
    return false;
  }
  const fields = [
    event.tit || false,
    event.cel || false,
    event.loc || false,
    event.ini || false,
    event.fim || false,
    event.tsk && event.tsk.length > 0,
  ];
  return event.sta === 0 && fields.every(ele => ele);
}

export function eventCanDelete(evnt) {
  if (!evnt.tsk || evnt.tsk.length === 0) {
    return true;
  }
  return false;
}

export function eventCanChat(event) {
  const agora = moment().format();
  const ini = moment(event.ini).format();
  return ini > agora;
}

export function getEventColor(evnt) {
  // Cancelado
  if (evnt.can === 1) {
    return '#9E9E9E';
  }
  // Não publicado
  if (evnt.sta === 0) {
    return '#43A047';
  }
  const agora = moment().unix();
  const d1 = moment(evnt.ini).unix();
  const d2 = moment(evnt.fim).unix();
  // Em andamento
  if (d1 <= agora && d2 >= agora) {
    return '#F4511E';
  }
  // Concluido
  if (d2 < agora) {
    return Colors.black;
  }
  // Publicado
  return '#1E88E5';
}

export function listEvents(query) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('event', `/events/${query}`, cfg);
  });
}

export function getEvent(email, dat) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('event', `/event/${email}/${dat}`, cfg);
  });
}

export function insertEvent(data) {
  return Auth.currentSession().then(session => {
    const cfg = {
      body: data,
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.post('event', '/event', cfg);
  });
}

export function updateEvent(data) {
  return Auth.currentSession().then(session => {
    const cfg = {
      body: data,
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.put('event', '/event', cfg);
  });
}

export function deleteEvent(email, dat) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.del('event', `/event/${email}/${dat}`, cfg);
  });
}

export function closeEvent(data) {
  return Auth.currentSession().then(session => {
    const cfg = {
      body: data,
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.post('event', '/event-close', cfg);
  });
}

export function qrMailEvent(data) {
  return Auth.currentSession().then(session => {
    const cfg = {
      body: data,
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.post('event', '/event-qrmail', cfg);
  });
}

export function listSkills() {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('skill', '/skills', cfg);
  });
}

export function eventGroupAval(data) {
  return Auth.currentSession().then(session => {
    const cfg = {
      body: data,
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.put('event', '/event-group-aval', cfg);
  });
}

export function activateEvent(data) {
  return Auth.currentSession().then(session => {
    const cfg = {
      body: data,
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.post('event', '/event-activate', cfg);
  });
}

export function cancelEvent(data) {
  return Auth.currentSession().then(session => {
    const cfg = {
      body: data,
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.post('event', '/event-cancel', cfg);
  });
}
