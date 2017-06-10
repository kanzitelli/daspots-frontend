// @flow

import { observable, computed } from 'mobx';
import { persist } from 'mobx-persist';

import Avatar from './Avatar';

class Account {
  @persist @observable first_name = 'first_name'
  @persist @observable last_name  = 'last_name'
  @persist @observable bio        = ''
  @persist @observable email      = 'email@example.com'
  @persist @observable password   = 'password'

  @persist('object', Avatar) @observable avatar = new Avatar
}

export default Account;
