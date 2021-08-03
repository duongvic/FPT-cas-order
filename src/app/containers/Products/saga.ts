import path from 'path/api';
import i18next from 'i18next';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { setConditions } from 'utils/common';
import { request } from 'utils/request';
import {
  selectData,
  selectPagination,
  selectParams,
  selectProducts,
} from './selectors';
import { actions } from './slice';

export function* loadProducts() {
  const pagination = yield select(selectPagination);
  const requestURL =
    path.products.products +
    `?page=${pagination.current}&page_size=${pagination.pageSize}`;

  const options = { method: 'get' };
  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.productsLoaded(res.data));
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

export function* createProduct() {
  const data = yield select(selectData);
  const requestURL = path.products.products;
  const options = { method: 'post', body: JSON.stringify(data) };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.setNotice(i18next.t('Message.CREATE_PRODUCT_SUCCESS')));
  }
}

export function* deleteProduct() {
  const data = yield select(selectData);
  const products = yield select(selectProducts);
  const requestURL = path.products.product.replace(
    ':productId',
    data.productId,
  );
  const options = { method: 'delete' };

  const res = yield call(request, requestURL, options);
  if (!res) {
    yield put(actions.setError(i18next.t('Message.DELETE_PRODUCT_FAIL')));
  } else if (typeof res === 'boolean') {
    yield put(actions.setNotice(i18next.t('Message.DELETE_PRODUCT_SUCCESS')));
  } else if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  }
  // let newProducts = [...products];
  // newProducts.splice(data.tableIndex, 1);
  // yield put(actions.setProducts(newProducts));
}
export function* queryProducts() {
  const pagination = yield select(selectPagination);
  const params = yield select(selectParams);
  const condition = setConditions({ ...params });
  const requestURL = `${path.products.products}?condition=${condition}&page=${pagination.current}&page_size=${pagination.pageSize}`;
  const options = { method: 'get' };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
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
    yield put(actions.productsQueried(res.data));
  }
}

export function* loadProduct() {
  const data = yield select(selectData);
  const requestURL = path.products.product.replace(
    ':productId',
    data.productId,
  );
  const options = { method: 'get' };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.productLoaded(res));
  }
}

export function* updateProduct() {
  const data = yield select(selectData);
  const requestURL = path.products.product.replace(
    ':productId',
    data.productId,
  );
  const options = { method: 'put', body: JSON.stringify(data.data) };

  const res = yield call(request, requestURL, options);
  if ('error' in res) {
    yield put(actions.setError(res.error.default.type[0]));
  } else {
    yield put(actions.setNotice(i18next.t('Message.UPDATE_PRODUCT_SUCCESS')));
  }
}

export function* productsSaga() {
  yield takeLatest(actions.loadProducts.type, loadProducts);
  yield takeLatest(actions.createProduct.type, createProduct);
  yield takeLatest(actions.queryProducts.type, queryProducts);
  yield takeLatest(actions.deleteProduct.type, deleteProduct);
  yield takeLatest(actions.loadProduct.type, loadProduct);
  yield takeLatest(actions.updateProduct.type, updateProduct);
}
