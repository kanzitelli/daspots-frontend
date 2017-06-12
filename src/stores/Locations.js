// @flow

import { observable, action, computed, runInAction } from 'mobx';

import Config from '../../config';
import stores from '../stores';

type CreateLocation = {
  name      : string,
  address   : string,
  quote     : string,
  longitude : number,
  latitude  : number,
  keywords  : [],
  place_id  : string,
}

type PlaceQuery = {
  placeid: string,
}

type PlacesQuery = {
  query      : string,
  language?  : string,
  location?  : string,
  radius?    : number,
  minprice?  : number,
  maxprice?  : number,
  opennow?   : boolean,
  type?      : string,
  pagetoken? : string
}

type PlacesAutoCompleteQuery = {
  input         : string,
  offset?       : number,
  location?     : string,
  language?     : string,
  radius?       : number,
  types?        : string,
  components?   : [],
  strictbounds? : boolean,
}

type SearchGoogleQ = {
  query : {
    type   : string,
    search : (PlaceQuery | PlacesQuery | PlacesAutoCompleteQuery)
  }
}

class Store {
  @observable all = [];
  @observable isFetching = false;
  @observable isUploadingImage = false;

  @observable googlePlacesForSearch = [];
  @observable isFetchingForSearch = false;

  // TODO: полный бред, надо будет переделать эту логику -> stores.Account.app
  
  getAll = () => {
    return stores.Account.app.service('locations').find({ query: { $sort: { createdAt: -1 } } })
            .then(response => {
              this.all = response.data;

              return response.data;
            });
  }

  createLocation = (location: CreateLocation) => {
    return stores.Account.app.service('locations').create(location);
  }

  uploadImageForLocation = (uri: string) => {
    const that = this;
    that.isUploadingImage = true;

    return new Promise((resolve, reject) => {

      stores.Account.app.service('uploads').create({ uri })
            .then((result) => { that.isUploadingImage = false; resolve(result); })
            .catch(error => { that.isUploadingImage = false; reject(error); })

    });
  }

  searchGooglePlace = (placeid: string) => {
    const q: SearchGoogleQ = {
      query : {
        type   : 'place',
        search : {
          placeid
        }
      }
    }

    this.isFetchingForSearch = true;
    return stores.Account.app.service('google-places').find(q)
            .then(res => {
              this.isFetchingForSearch = false;
              return res;
            });
  }

  searchGooglePlaces = (query_text: string) => {
    const q: SearchGoogleQ = {
      query : {
        type   : 'places',
        search : {
          query: query_text
        }
      }
    }

    if (stores.Account.latitude && stores.Account.longitude) {
      q['query']['search']['location'] = `${stores.Account.latitude},${stores.Account.longitude}`;
      q['query']['search']['radius'] = 10000;
    }

    this.isFetchingForSearch = true;
    stores.Account.app.service('google-places').find(q)
      .then(results => {
        runInAction('got some google results', () => {
          console.log(results);
          this.googlePlacesForSearch = results || [];
          this.isFetchingForSearch = false;
        })
      })
      .catch(error => alert(alert))
  }

  searchGooglePlacesAutoComplete = (query_text: string) => {
    const q: SearchGoogleQ = {
      query : {
        type   : 'placesAutoComplete',
        search : {
          input: query_text
        }
      }
    }

    if (stores.Account.latitude && stores.Account.longitude) {
      q['query']['search']['location'] = `${stores.Account.latitude},${stores.Account.longitude}`;
      // q['query']['search']['radius'] = 10000;
    }

    this.isFetchingForSearch = true;
    stores.Account.app.service('google-places').find(q)
      .then(results => {
        runInAction('got some google results', () => {
          console.log(results);
          this.googlePlacesForSearch = results || [];
          this.isFetchingForSearch = false;
        })
      })
      .catch(error => alert(alert))
  }
}

export default new Store();
