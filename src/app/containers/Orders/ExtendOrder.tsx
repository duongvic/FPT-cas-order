import { Button, Card, Col, Form, notification, Row, Space } from 'antd';
import ContractFormBase from 'app/components/ContractFormBase';
import UserFormBase from 'app/components/UserFormBase';
import * as userSelect from 'app/containers/Users/selectors';
import * as users from 'app/containers/Users/slice';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { autoFillToDurationField, fillValuesToForm } from 'utils/common';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { MODE_CREATE, MODE_EDIT, MODE_EXTEND } from '../Users/constants';
import { usersSaga } from '../Users/saga';
import {
  selectContract,
  selectLoading,
  selectNotice,
  selectOrder,
  selectOrderIdx,
  selectProducts,
} from './selectors';
import SetPackage from './SetPackage';
import * as orders from './slice';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

interface Props {
  orderType?: string;
}

export default function ExtendOrder({ orderType }: Props) {
  useInjectReducer({ key: users.sliceKey, reducer: users.reducer });
  useInjectSaga({ key: users.sliceKey, saga: usersSaga });

  const { orderId }: any = useParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const history = useHistory();
  const { t } = useTranslation(['translation', 'constant']);

  const order = useSelector(selectOrder);
  const noticeUser = useSelector(userSelect.selectNotice);
  const errorUser = useSelector(userSelect.selectError);
  const user = useSelector(userSelect.selectUser);
  const contract = useSelector(selectContract);
  const loading = useSelector(selectLoading)?.order;
  const products = useSelector(selectProducts);
  const orderIdx: any =
    useSelector(selectOrderIdx) || localStorage.getItem('orderIdx');
  const noticeOrder = useSelector(selectNotice);

  const onFinish = values => {
    values.id_created_at = values.id_created_at?.format('YYYY-MM-DD');
    values.end_at = values.end_at?.format('YYYY-MM-DD');
    values.start_at = values.start_at?.format('YYYY-MM-DD');

    const {
      remark,
      start_at,
      end_at,
      duration,
      region_id,
      price,
      contract_code,
      service_type,
      order_type,
      sale_care,
      pmt_type,
      sale,
      department,
      user_name,
      email,
      user_type,
      account_type,
      full_name,
      short_name,
      phone_num,
      tax_no,
      id_no,
      id_created_at,
      id_location,
      address,
      birthday,
      ref_name,
      ref_phone,
      ref_email,
      rep_name,
      rep_phone,
      rep_email,
    } = values;
    const user = {
      user_name,
      email,
      user_type,
      account_type,
      full_name,
      short_name,
      phone_num,
      tax_no,
      id_no,
      id_created_at,
      id_location,
      address,
      birthday,
      ref_name,
      ref_phone,
      ref_email,
      rep_name,
      rep_phone,
      rep_email,
    };
    const infoOrder = {
      remark: remark || '',
      duration,
      region_id,
      price,
      service_type,
      order_type,
      sale_care,
      pmt_type,
    };
    const customer = { ...user, id: order?.customer_id };

    let items: any[] = [];
    products.forEach(product => {
      items = [...items, { products: product }];
    });

    let contract: any = {};
    contract.code = contract_code;
    contract.start_at = start_at;
    contract.end_at = end_at;

    let co_sale: any = {};
    co_sale.department = department;
    co_sale.sale = sale;
    const newOrder = {
      ...infoOrder,
      contract: contract,
      customer: customer,
      co_sale,
      items: items,
      ref_order_id: Number(orderId),
      ref_order_idx: Number(orderIdx),
      quantity: 1,
      order_type: orderType,
    };
    newOrder.price = Number(newOrder.price);

    delete user.user_name;
    delete user.email;
    dispatch(users.actions.setData({ userId: order.customer_id, data: user }));
    dispatch(users.actions.updateUser());

    dispatch(orders.actions.setData(newOrder));
    dispatch(orders.actions.extendOrder());
  };

  const onFieldsChange = (changedFields, allFields) =>
    autoFillToDurationField(changedFields, allFields, form);

  useEffect(() => {
    dispatch(orders.actions.setData({ orderId }));
    dispatch(orders.actions.getOrder());
  }, [dispatch, orderId]);

  useEffect(() => {
    if (order) {
      dispatch(users.actions.setQuery(order.customer_id));
      dispatch(users.actions.loadUser());
      dispatch(orders.actions.contractLoaded({ current: order }));
      dispatch(orders.actions.setReview([]));
    }
    return () => {
      dispatch(users.actions.setUser(null));
      dispatch(orders.actions.contractLoaded({ current: null }));
      dispatch(orders.actions.setReview([]));
      dispatch(orders.actions.setMode(MODE_CREATE));
    };
  }, [order, dispatch]);

  useEffect(() => {
    if (noticeUser) {
      notification.success({
        message: noticeUser,
        placement: 'bottomRight',
        duration: 6,
      });
      dispatch(users.actions.setNotice(null));
    }
  }, [noticeUser, dispatch]);

  useEffect(() => {
    if (errorUser) {
      notification.error({
        message: errorUser,
        placement: 'bottomRight',
        duration: 6,
      });
      dispatch(users.actions.setError(null));
    }
  }, [errorUser, dispatch]);

  //fill values to form
  useEffect(() => {
    if (user || contract.current) {
      let values = { ...contract.current, ...contract.current?.co_sale };
      const { start_at, end_at } = values;

      if (start_at) values.start_at = moment(values.start_at);
      if (end_at) values.end_at = moment(values.end_at);

      values = { ...values, ...user };

      const { id_created_at } = values;
      if (id_created_at) values.id_created_at = moment(id_created_at);

      fillValuesToForm(values, form);
    }
  }, [contract.current, user, contract, form]);

  return (
    <Form
      form={form}
      name="editOrder"
      layout="vertical"
      {...layout}
      labelAlign="left"
      onFinish={onFinish}
      scrollToFirstError={true}
      onFieldsChange={(changedFields, allFields) =>
        onFieldsChange(changedFields, allFields)
      }
    >
      <Row gutter={0} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card
            title={t('Title.CUSTOMER_INFO')}
            bordered={false}
            style={{ height: '100%' }}
          >
            <UserFormBase mode={MODE_EDIT} userType={user?.user_type} />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={t('Title.SERVICE_INFO')}
            bordered={false}
            style={{ height: '100%' }}
          >
            <ContractFormBase mode={MODE_EDIT} />
          </Card>
        </Col>
      </Row>

      <SetPackage mode={MODE_EXTEND} />

      <Row justify="center" style={{ marginTop: 8 }}>
        <Space>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {t('constant:Button.CONFIRM')}
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="default"
              onClick={() => history.push('/dashboard/instances')}
            >
              {t('constant:Button.CANCEL')}
            </Button>
          </Form.Item>
        </Space>
      </Row>
    </Form>
  );
}
