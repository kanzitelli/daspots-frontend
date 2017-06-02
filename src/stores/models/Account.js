// @flow

import { observable, computed } from 'mobx';
import { persist } from 'mobx-persist';

class Account {
  @persist @observable first_name = 'first_name'
  @persist @observable last_name  = 'last_name'
  @persist @observable avatar     = ''
  @persist @observable bio        = ''
  @persist @observable email      = 'email@example.com'
  @persist @observable password   = 'password' // of course, you should not store password as a plain text :)
}

export default Account;
