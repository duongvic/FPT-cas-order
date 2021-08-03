import path from 'path/api';
import i18next from 'i18next';
import empty from 'is-empty';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import { selectAccount, selectData } from './selectors';
import { actions } from './slice';

export function* signin() {
  const data = yield select(selectData);
  if (empty(data)) {
    console.log(i18next.t('Message.DATA_INVALID'));
    return;
  }
  const requestURL = path.auth.login;
  const options = { method: 'post', body: JSON.stringify(data) };

  const res = yield call(request, requestURL, options);
  if ('errors' in res ) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    if (!data?.otp_token) {
      yield put(actions.setNotice(i18next.t('Message.RECOMMEND_TWO_FACTORS')));
    }
    yield put(actions.accountLoaded(res));
    yield call([localStorage, 'setItem'], 'account', JSON.stringify(res));
  }
}

export function* signup() {
  const data = yield select(selectData);
  if (empty(data)) {
    console.log(i18next.t('Message.DATA_INVALID'));
    return;
  }
  const requestURL = data.user_role ? path.users.users : path.users.register;
  const options = { method: 'post', body: JSON.stringify(data) };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(
      actions.setNotice(
        `Đăng kí thành công, Vui lòng đăng nhập vào Email ${data?.email} để kích hoạt tài khoản`,
      ),
    );
    yield put(actions.signupLoaded(res));
  }
}
export function* forgotPassword() {
  const data = yield select(selectData);
  const requestURL = path.auth.forgot_password;
  const options = { method: 'post', body: JSON.stringify(data) };

  const res = yield call(request, requestURL, options);
  if (!res) {
    yield put(actions.setError(i18next.t('Message.DISABLE_TWO_FACTOR_FAIL')));
  } else if (typeof res === 'boolean') {
    yield put(actions.setCountdown(Date.now() + 60 * 1000));
    yield put(actions.setNotice(i18next.t('Message.FORGOT_PASSWORD_SUCCESS')));
  } else if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  }
}
export function* resetPassword() {
  const data = yield select(selectData);
  const requestURL = path.auth.reset_password;
  const options = { method: 'post', body: JSON.stringify(data) };

  const res = yield call(request, requestURL, options);
  if (!res) {
    yield put(actions.setError(i18next.t('Message.RESET_PASSWORD_FAIL')));
  } else if (typeof res === 'boolean') {
    yield put(actions.passwordReseted());
    yield put(actions.setNotice(i18next.t('Message.RESET_PASSWORD_SUCCESS')));
  } else if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  }
}

export function* checkSignin() {
  let currentAccount = yield call([localStorage, 'getItem'], 'account');
  if (currentAccount) currentAccount = JSON.parse(currentAccount);

  const account = yield select(selectAccount);
  if (!account) yield put(actions.setAccount(currentAccount));
}

export function* logout() {
  let setting = yield call([localStorage, 'getItem'], 'setting');
  if (setting) {
    setting = JSON.parse(setting);
    if (setting.hasOwnProperty('qrCode')) {
      delete setting.qrCode;
      yield call([localStorage, 'setItem'], 'setting', JSON.stringify(setting));
    }
  }

  yield call([localStorage, 'removeItem'], 'account');
  window.location.reload();
}

export function* getQRCode() {
  const requestURL = path.users.create_two_factors;
  const options = { method: 'post' };

  let setting = yield call([localStorage, 'getItem'], 'setting');
  if (setting) setting = JSON.parse(setting);

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    setting = { ...setting, qrCode: res.format_otp_token };
    yield put(
      actions.setNotice(i18next.t('Message.CREATE_TWO_FACTORS_SUCCESS')),
    );
    yield call([localStorage, 'setItem'], 'setting', JSON.stringify(setting));
    yield put(actions.qrCodeLoaded(res.format_otp_token));
  }
}
export function* forgotQRCode() {
  const data = yield select(selectData);
  const requestURL = path.users.forgot_qrcode;
  const options = { method: 'post', body: JSON.stringify(data) };

  const res = yield call(request, requestURL, options);
  if (!res) {
    yield put(actions.setError(i18next.t('Message.DISABLE_TWO_FACTOR_FAIL')));
  } else if (typeof res === 'boolean') {
    yield put(actions.setNotice(i18next.t('Message.RESET_QRCODE_SUCCESS')));
  } else if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  }
}
export function* disableTwoFactor() {
  const data = yield select(selectData);

  const requestURL = path.users.disable_two_factors;
  const options = { method: 'delete', body: JSON.stringify(data) };

  const res = yield call(request, requestURL, options);
  if (!res) {
    yield put(actions.setError(i18next.t('Message.DISABLE_TWO_FACTOR_FAIL')));
  } else if (typeof res === 'boolean') {
    yield put(
      actions.setNotice(i18next.t('Message.DISABLE_TWO_FACTOR_SUCCESS')),
    );
  } else if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  }
}

export function* queryAccount() {
  const data = yield select(selectData);
  const requestURL = `${path.users.user}?user_name=${data.user_name}`;
  const options = { method: 'get' };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    const profile = { ...res.profile };
    delete profile.id;
    const user = { ...res, ...profile };
    delete user.profile;

    yield put(actions.accountQueried(user));
  }
}

export function* refreshToken() {
  let account = yield call([localStorage, 'getItem'], 'account');

  if (account) {
    account = JSON.parse(account);
    account.access_token = account.refresh_token;
    yield call([localStorage, 'setItem'], 'account', JSON.stringify(account));

    const requestURL = path.auth.refresh_token;
    const options = { method: 'put' };

    try {
      const res = yield call(request, requestURL, options);

      if (res) {
        account = { ...account, ...res };
        yield call(
          [localStorage, 'setItem'],
          'account',
          JSON.stringify(account),
        );
      }
    } catch {
      yield call([localStorage, 'removeItem'], 'account');
      window.location.reload();
    }

    // if (typeof res !== 'object' || typeof res === 'string') {
    // account = { ...account, ...res };
    // yield call([localStorage, 'setItem'], 'account', JSON.stringify(account));
    // } else {
    //   account = { ...account, ...res };
    //   yield call([localStorage, 'setItem'], 'account', JSON.stringify(account));
    // }
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* authSaga() {
  yield takeLatest(actions.loadAccount.type, signin);
  yield takeLatest(actions.loadSignup.type, signup);
  yield takeLatest(actions.checkSignin.type, checkSignin);
  yield takeLatest(actions.logout.type, logout);
  yield takeLatest(actions.forgotPassword.type, forgotPassword);
  yield takeLatest(actions.getQRCode.type, getQRCode);
  yield takeLatest(actions.forgotQRCode.type, forgotQRCode);
  yield takeLatest(actions.disableTwoFactor.type, disableTwoFactor);
  yield takeLatest(actions.resetPassword.type, resetPassword);
  yield takeLatest(actions.queryAccount.type, queryAccount);
  yield takeLatest(actions.refreshToken.type, refreshToken);
}
