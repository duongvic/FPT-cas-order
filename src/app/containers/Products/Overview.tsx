import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, Typography } from 'antd';
import ButtonDeleteBase from 'app/components/ButtonDeleteBase';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { fillValuesToForm } from 'utils/common';
import { formatPrice } from 'utils/formatPrice';
import {
  selectData,
  selectLoading,
  selectPagination,
  selectParams,
  selectProducts,
} from './selectors';
import { actions, defaultState } from './slice';

export interface PropductsInterFace {
  id: number;
  user_name: string;
  email: string;
  role: string;
  status: string;
  created_at: number;
}

export default function Overview() {
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const formRef = useRef<any>();
  const { t } = useTranslation(['translation', 'constant']);

  const products = useSelector(selectProducts);
  const loading = useSelector(selectLoading)?.get;
  const pagination = useSelector(selectPagination);
  const data = useSelector(selectData);
  const paramsRedux = useSelector(selectParams);

  useEffect(() => {
    if (!products) {
      dispatch(actions.loadProducts());
    }
  }, []);

  useEffect(() => {
    if (paramsRedux) {
      fillValuesToForm(paramsRedux, formRef.current);
    }
  }, []);

  const deleteProduct = (record, index) => {
    dispatch(actions.setData({ productId: record.id, tableIndex: index }));
    dispatch(actions.deleteProduct());
  };

  const handleClickReload = () => {
    dispatch(actions.setPagination({ ...defaultState.pagination }));
    dispatch(actions.loadProducts());
  };

  const handleChangeCurrentPage = params => {
    dispatch(
      actions.setPagination({
        ...pagination,
        current: params.current,
        pageSize: params.pageSize,
      }),
    );
    if (paramsRedux) {
      dispatch(actions.queryProducts());
    } else {
      dispatch(actions.loadProducts());
    }
  };

  const onReset = () => {
    dispatch(actions.setParams(null));
    handleClickReload();
  };

  const onSubmit = params => {
    if (Object.keys(params).length > 0) {
      dispatch(actions.setPagination({ ...defaultState.pagination }));
      dispatch(actions.setParams(params));
      dispatch(actions.queryProducts());
    }
  };
  const columns: ProColumns<PropductsInterFace>[] = [
    {
      title: t('constant:Title.ID'),
      search: false,
      dataIndex: 'id',
      width: 48,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record, index) => (
        <Link
          to={`${match.url}/${record.id}`}
          onClick={() => dispatch(actions.setProduct(record))}
        >
          {text}
        </Link>
      ),
    },
    {
      title: t('constant:Label.TYPE'),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: t('constant:Label.CN'),
      dataIndex: 'cn',
      key: 'cn',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text, record, index) => (
        <Typography.Text>{formatPrice(text)}</Typography.Text>
      ),
    },
    {
      title: 'Unit',
      // dataIndex: 'unit',
      render: (text, record: any, index) => (
        <Typography.Text>{record.unit?.name}</Typography.Text>
      ),
    },
    {
      title: 'Action',
      width: 100,
      valueType: 'option',
      render: (text: any, record, index) => [
        <ButtonDeleteBase
          key="2"
          loading={data ? index === data.tableIndex : false}
          onConfirm={() => deleteProduct(record, index)}
        />,
      ],
    },
  ];

  return (
    <ProTable<PropductsInterFace>
      formRef={formRef}
      columns={columns}
      tableStyle={{ overflow: 'scroll' }}
      dataSource={products}
      onReset={onReset}
      onSubmit={params => onSubmit(params)}
      loading={loading}
      rowKey={record => String(record.id)}
      options={{
        reload: () => handleClickReload(),
        fullScreen: false,
      }}
      onChange={e => handleChangeCurrentPage(e)}
      pagination={{
        current: pagination.current,
        showQuickJumper: true,
        pageSize: pagination.pageSize,
        total: pagination.total,
      }}
      search={{
        layout: 'vertical',
        defaultCollapsed: false,
      }}
      toolbar={{
        title: (
          <Button
            type="primary"
            key="createProducts"
            onClick={() => history.push(`${match.url}/create`)}
          >
            {t('constant:Button.CREATE')}
          </Button>
        ),
      }}
      dateFormatter="string"
    />
  );
}
