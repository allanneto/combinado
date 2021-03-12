import axios from 'axios';
import {API_GOOGLE} from '~/config/googleConfig';

export function getAutoComplete(local, lat, lng) {
  const geoApi = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
  const url = `${geoApi}?key=${API_GOOGLE}&input=${local}&location=${lat},${lng}&radius=10000&language=pt_BR`;
  return axios.get(url);
}

export function getPoint(placeId) {
  const geoApi = 'https://maps.googleapis.com/maps/api/geocode/json';
  const url = `${geoApi}?place_id=${placeId}&key=${API_GOOGLE}&language=pt_BR`;
  return axios.get(url).then(response => {
    if (response.data.status === 'OK') {
      const address = response.data.results[0].formatted_address;
      const resp = response.data.results[0].address_components;
      if (!resp) {
        return null;
      }
      const geo = response.data.results[0].geometry.location;
      let country;
      let ar1;
      let ar2;
      let loc;
      let city;
      let region;
      // eslint-disable-next-line no-unused-vars
      for (const item of resp) {
        if (item.types) {
          if (item.types.find(t => t === 'country')) {
            country = item.short_name;
          } else if (
            item.types.find(t => t === 'administrative_area_level_1')
          ) {
            ar1 = item.short_name;
          } else if (
            item.types.find(t => t === 'administrative_area_level_2')
          ) {
            ar2 = item.short_name;
          } else if (item.types.find(t => t === 'locality')) {
            loc = item.short_name;
          }
        }
      }
      if (ar2) {
        city = ar2;
        region = ar1 || '';
      } else {
        city = ar1;
        region = loc || '';
      }
      const local = {
        city: city,
        region: region,
        country: country,
        address: address,
        geo: geo,
      };
      return local;
    } else {
      return null;
    }
  });
}

export function getLocal(lat, lng) {
  const geoApi = 'https://maps.googleapis.com/maps/api/geocode/json';
  const url = `${geoApi}?latlng=${lat},${lng}&key=${API_GOOGLE}&language=pt_BR`;
  return axios.get(url).then(response => {
    if (response.data.status === 'OK') {
      const address = response.data.results[0].formatted_address;
      const resp = response.data.results[0].address_components;
      if (!resp) {
        return null;
      }
      let country;
      let ar1;
      let ar2;
      let loc;
      let city;
      let region;
      // eslint-disable-next-line no-unused-vars
      for (const item of resp) {
        if (item.types) {
          if (item.types.find(t => t === 'country')) {
            country = item.short_name;
          } else if (
            item.types.find(t => t === 'administrative_area_level_1')
          ) {
            ar1 = item.short_name;
          } else if (
            item.types.find(t => t === 'administrative_area_level_2')
          ) {
            ar2 = item.short_name;
          } else if (item.types.find(t => t === 'locality')) {
            loc = item.short_name;
          }
        }
      }
      if (ar2) {
        city = ar2;
        region = ar1 || '';
      } else {
        city = ar1;
        region = loc || '';
      }
      const local = {
        city: city,
        region: region,
        country: country,
        address: address,
      };
      return local;
    } else {
      return null;
    }
  });
}

export function getCoords(addr) {
  const geoApi = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
  const url = geoApi + addr.replace(/ /g, '+') + `&key=${API_GOOGLE}`;
  return axios.get(url).then(response => {
    if (response.data.status === 'OK') {
      return response.data.results[0].geometry.location;
    } else {
      return null;
    }
  });
}

export function getDistance(coord1, coord2) {
  const geoApi = 'https://maps.googleapis.com/maps/api/distancematrix/json?';
  const url =
    geoApi +
    `origins=${coord1.lat},${coord1.lng}&destinations=${coord2.lat},${
      coord2.lng
    }&mode=walking&key=${API_GOOGLE}`;
  return axios.get(url).then(response => {
    if (response.data.status === 'OK') {
      return response.data.rows[0].elements[0].distance;
    } else {
      return null;
    }
  });
}
