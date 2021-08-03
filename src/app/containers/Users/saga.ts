import path from 'path/api';
import i18next from 'i18next';
import empty from 'is-empty';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import { MODE_CREATE, MODE_UPDATE } from './constants';
import {
  selectData,
  selectPagination,
  selectParams,
  selectQuery,
  selectUsers,
} from './selectors';
import { actions } from './slice';

export function* queryUser() {
  const query = yield select(selectQuery);
  if (!query) {
    console.log(i18next.t('Message.DATA_INVALID'));
    yield put(actions.setMode(MODE_CREATE));
    return;
  }
  const requestURL = Boolean(Number(query))
    ? `${path.users.user}/${query}`
    : `${path.users.user}?user_name=${query}`;
  const options = { method: 'get' };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    const profile = { ...res.profile };
    delete profile.id;
    const user = { ...res, ...profile };
    delete user.profile;

    yield put(actions.userQueried(user));
  }
}

export function* queryUsers() {
  const data = yield select(selectData);
  const requestURL = `${path.users.users}?condition=${data.path}`;
  const options = { method: 'get' };
  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.usersQueried(res?.data));
  }
}

export function* getUsers() {
  const pagination = yield select(selectPagination);
  const requestURL =
    path.users.users +
    `?page=${pagination.current}&page_size=${pagination.pageSize}`;
  const options = { method: 'get' };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.usersLoaded(res.data));
    yield put(
      actions.setPagination({
        ...pagination,
        total:
          res.next_page &&
            pagination.total < res.next_page * pagination.pageSize
            ? res.next_page * pagination.pageSize
            : pagination.total,
      }),
    );
  }
}

export function* getUser() {
  const query = yield select(selectQuery);
  if (!query) {
    console.log(i18next.t('Message.DATA_INVALID'));
    return;
  }

  const requestURL = `${path.users.user}/${query}`;
  const options = { method: 'get' };
  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    const profile = { ...res.profile };
    delete profile.id;
    const user = { ...res, ...profile };
    delete user.profile;

    yield put(actions.userQueried(user));
  }
}

export function* createUser() {
  const data = yield select(selectData);
  if (empty(data)) {
    console.log(i18next.t('Message.DATA_INVALID'));
    return;
  }
  const requestURL = path.users.users;
  const options = { method: 'post', body: JSON.stringify(data) };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    const { profile, ...userInfo } = res;
    delete profile.id;
    const user = { ...userInfo, ...profile };

    yield put(actions.userCreated(user));
    yield put(actions.setMode(MODE_UPDATE));
    yield put(actions.setNotice(i18next.t('Message.CREATE_USER_SUCCESS')));
  }
}
export function* updateUser() {
  const users = yield select(selectUsers);
  const data = yield select(selectData);
  const requestURL = `${path.users.user}/${data.userId}`;
  const options = { method: 'put', body: JSON.stringify(data.data) };
  if (!data) {
    console.log(i18next.t('Message.DATA_INVALID'));
    return;
  }

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    const profile = { ...res.profile };
    delete profile.id;
    const user = { ...res, ...profile };
    delete user.profile;
    yield put(actions.userLoaded(user));
    yield put(actions.setNotice(i18next.t('Message.UPDATE_USER_SUCCESS')));
    if (users.length > 1) {
      const newUsers = [...users];
      newUsers[data.index] = user;
      yield put(actions.usersLoaded(newUsers));
    }
  }
}
export function* queryUserInTable() {
  const params = yield select(selectParams);

  const requestURL = `${path.users.user}?user_name=${params.user_name}`;
  const options = { method: 'get' };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.usersLoaded([res]));
  }
}
/**
 * Root saga manages watcher lifecycle
 */

export function* usersSaga() {
  yield takeLatest(actions.createUser.type, createUser);
  yield takeLatest(actions.queryUser.type, queryUser);
  yield takeLatest(actions.queryUsers.type, queryUsers);
  yield takeLatest(actions.loadUsers.type, getUsers);
  yield takeLatest(actions.updateUser.type, updateUser);
  yield takeLatest(actions.loadUser.type, getUser);
  yield takeLatest(actions.queryUserInTable.type, queryUserInTable);
}
