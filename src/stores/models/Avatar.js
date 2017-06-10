// @flow

import { observable, computed } from 'mobx';
import { persist } from 'mobx-persist';

class Avatar {
  @persist @observable id   = ''
  @persist @observable uri  = 'https://facebook.github.io/react/img/logo_og.png'
  @persist @observable size = 0
}

export default Avatar;
