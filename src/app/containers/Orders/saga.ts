import path from 'path/api';
import i18next from 'i18next';
import empty from 'is-empty';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { setConditions } from 'utils/common';
import { request } from 'utils/request';
import { selectUser } from '../Users/selectors';
import {
  selectContractCode,
  selectData,
  selectOrder,
  selectOrders,
  selectPagination,
  selectParams,
} from './selectors';
import { actions, defaultState } from './slice';

export function* getOrders() {
  const pagination = yield select(selectPagination);
  const requestURL =
    path.orders.orders +
    `?page=${pagination.current}&page_size=${pagination.pageSize}`;
  const options = { method: 'get' };


  const res = yield call(request, requestURL, options);
  debugger
  if ('errors' in res) {

    yield put(actions.setError(res.errors[0].message));
  } else {

    yield put(actions.ordersLoaded(res.data));


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

export function* getRegions() {

  const requestURL = path.computes.regions;
  const options = { method: 'get' };


  const res = yield call(request, requestURL, options);

  if ('errors' in res) {
    yield put(actions.setError(null));
  } else {
    debugger
    yield put(actions.regionsGetted(res.data));
  }
}

export function* updateOrder() {

  const data = yield select(selectData);
  const order = yield select(selectOrder);
  const requestURL = `${path.orders.order}/${data.orderId}`;
  const options = { method: 'put', body: JSON.stringify(data.newInfo) };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.orderUpdated({ ...order, ...res }));
    yield put(actions.setNotice(i18next.t('Message.UPDATE_ORDER_SUCCESS')));
  }
}

export function* approveOrder() {

  const data = yield select(selectData);
  const order = yield select(selectOrder);
  const orders = yield select(selectOrders);
  const requestURL = `${path.orders.order}/${data.orderId}`;
  const options = { method: 'put', body: JSON.stringify(data.newInfo) };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.orderApproved({ ...order, ...res }));
    yield put(actions.setNotice(i18next.t('Message.APPROVE_SUCCESS')));
    const newOrders = [...orders];
    newOrders[data.approve] = res;
    yield put(actions.ordersLoaded(newOrders));
  }
}

export function* deployOrder() {

  const data = yield select(selectData);
  const orders = yield select(selectOrders);
  const requestURL = `${path.computes.computes}`;
  const options = {
    method: 'post',
    body: JSON.stringify({
      order_id: data.data.order_id,
      availability_zone: data.data.zone,
    }),
  };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.setNotice(i18next.t('Message.DEPLOY_SUCCESS')));
    const order = { ...data.order };
    order.status = 'DEPLOYED';
    const newOrders = [...orders];
    newOrders[data.deploy] = order;
    yield put(actions.ordersLoaded(newOrders));
  }
}

export function* getOs() {

  const requestURL = path.orders.os;
  const options = { method: 'get' };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.osLoaded(res.data));
  }
}

export function* getInstance() {

  const requestURL = path.orders.instance;
  const options = { method: 'get' };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    const defaultInstance = res.data
      .filter(item => item.type !== 'OS')
      .map(item => {
        const { id, name } = item;
        return { id, name, unit: item.unit.name, quantity: 0 };
      });
    yield put(actions.instanceLoaded(defaultInstance));
  }
}

export function* getService() {

  const requestURL = path.orders.service;
  const options = { method: 'get' };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    const defaultService = res.data.map(item => {
      const { id, name } = item;
      return { id, name, unit: item.unit.name, quantity: 0 };
    });
    yield put(actions.serviceLoaded(defaultService));
  }
}

export function* createOrder() {

  const data = yield select(selectData);
  if (empty(data)) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }
  const requestURL = path.orders.orders;
  const options = { method: 'post', body: JSON.stringify(data) };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.orderCreated(res));
    yield put(actions.setNotice(i18next.t('Message.CREATE_ORDER_SUCCESS')));
  }
}

export function* extendOrder() {

  const data = yield select(selectData);
  if (empty(data)) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }
  const requestURL = path.orders.orders;
  const options = { method: 'post', body: JSON.stringify(data) };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.orderCreated(res));
    yield put(actions.setNotice(i18next.t('Message.EXTEND_SUCCESS')));
  }
}

export function* getOrder() {

  const data = yield select(selectData);
  if (!data) {
    return;
  }
  const requestURL = `${path.orders.order}/${data.orderId}`;
  const options = { method: 'get' };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.orderGetted(res));
  }
}

export function* queryContract() {

  const code = yield select(selectContractCode);
  const user = yield select(selectUser);

  if (!code) {
    yield put(actions.setError(null));
    return;
  }
  const requestURL = `${path.orders.orders}?condition=customer_id__eq__${user.id},contract_code__eq__${code}`;
  const options = { method: 'get' };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    if (res.data?.length > 0) {
      yield put(actions.contractLoaded({ current: res.data[0] }));
    } else {
      yield put(actions.setError(i18next.t('Message.CONTRACT_NOT_EXISTS')));
    }
  }
}
export function* loadPackages() {

  const requestURL = `${path.products.packages}`;
  const options = { method: 'get' };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.packagesLoaded(res.data.slice(1)));
  }
}
export function* loadProductsLanding() {

  const requestURL = `${path.products.products}`;
  const options = { method: 'get' };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.productsLandingLoaded(res.data));
  }
}
export function* queryOrders() {
  debugger
  const pagination = yield select(selectPagination);
  const params = yield select(selectParams);
  const condition = setConditions({ ...params });
  const requestURL = `${path.orders.orders}?condition=${condition}&page=${pagination.current}&page_size=${pagination.pageSize}`;
  const options = { method: 'get' };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.ordersQueried(res.data));
    if (res.data.length === 0)
      yield put(actions.setError(i18next.t('Message.RETURN_ZERO_DATA')));

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

export function* loadZones() {

  const data = yield select(selectData);
  const requestURL = path.computes.zones.replace(':regionId', data.regionId);
  const options = { method: 'get' };

  if (!data) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.zonesLoaded(res));
  }
}

export function* getVmCfg() {

  const data = yield select(selectData);
  const requestURL = path.orders.vmCfg
    .replace(':orderID', data.order_id)
    .replace(':orderIDX', data.order_idx);
  const options = { method: 'get' };

  if (!data) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.vmCfgGetted(res));
  }
}

export function* deleteOrder() {

  const data = yield select(selectData);
  const requestURL = `${path.orders.order}/${data.orderId}`;
  const options = { method: 'delete' };
  const orders = yield select(selectOrders);
  if (!data) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }
  const res = yield call(request, requestURL, options);
  // const res = yield call(requestStatus, requestURL, options);
  if (!res) {
    yield put(actions.setNotice(i18next.t('Message.DELETE_ORDER_FAIL')));
  } else if (typeof res === 'boolean') {
    let newOrders = [...orders];
    yield put(actions.setNotice(i18next.t('Message.DELETE_ORDER_SUCCESS')));
    newOrders.splice(data.delete, 1);
    yield put(actions.setOrders(newOrders));
    yield put(actions.setData(defaultState.data));
  } else if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* ordersSaga() {

  yield takeLatest(actions.loadOrders.type, getOrders);
  yield takeLatest(actions.loadContract.type, queryContract);
  yield takeLatest(actions.loadInstance.type, getInstance);
  yield takeLatest(actions.loadService.type, getService);
  yield takeLatest(actions.loadOs.type, getOs);
  yield takeLatest(actions.createOrder.type, createOrder);
  yield takeLatest(actions.updateOrder.type, updateOrder);
  yield takeLatest(actions.getOrder.type, getOrder);
  yield takeLatest(actions.deployOrder.type, deployOrder);
  yield takeLatest(actions.approveOrder.type, approveOrder);
  yield takeLatest(actions.extendOrder.type, extendOrder);
  yield takeLatest(actions.getRegions.type, getRegions);
  yield takeLatest(actions.loadPackages.type, loadPackages);
  yield takeLatest(actions.loadProductsLanding.type, loadProductsLanding);
  yield takeLatest(actions.queryOrders.type, queryOrders);
  yield takeLatest(actions.loadZones.type, loadZones);
  yield takeLatest(actions.getVmCfg.type, getVmCfg);
  yield takeLatest(actions.deleteOrder.type, deleteOrder);
}
