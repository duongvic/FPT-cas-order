import { DownloadOutlined } from '@ant-design/icons';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button } from 'antd';
import ButtonDeleteBase from 'app/components/ButtonDeleteBase';
import { columnsOrders } from 'app/components/constant';
import { selectAccount } from 'app/containers/Auth/selectors';
import * as instancesSlice from 'app/containers/Compute/Instances/slice';
import { Status } from 'app/containers/Orders/constants';
import ModalSelectZones from 'app/containers/Orders/ModalSelectZones';
import {
  selectData,
  selectLoading,
  selectOrders,
  selectPagination,
  selectParams,
} from 'app/containers/Orders/selectors';
import ModalDowloadCSV from 'app/components/ModalDowloadCSV';
import { actions, defaultState } from 'app/containers/Orders/slice';
import { localPath } from 'path/local';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useHistory, useRouteMatch } from 'react-router-dom';
import { fillValuesToForm, formatDateInTable } from 'utils/common';

export interface TableListOrder {
  id: number;
  code: string;
  region_name: string;
  customer_id: string;
  order_type: string;
  created_at: number;
  total: string;
  duration: number;
  status: string;
  start_at: number;
  end_at: number;
  approval_step: number;
}

export default function DataviewOrders() {
  const [visible, setVisible] = useState(false);
  const [visibleDownloadModal, setVisibleDownloadModal] = useState(false);

  const loading = useSelector(selectLoading)?.orders;
  const orders = useSelector(selectOrders);
  const pagination = useSelector(selectPagination);
  const account = useSelector(selectAccount);
  const data = useSelector(selectData);
  const paramsRedux = useSelector(selectParams);

  const history = useHistory();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const ref: any = useRef({});
  const { t } = useTranslation(['constant', 'translation']);

  const formRef = useRef<any>();

  const dataSource = formatDateInTable(orders);
  const closeModal = () => {
    setVisible(false);
  };

  const handleClickReload = () => {
    dispatch(actions.setPagination({ ...defaultState.pagination }));
    dispatch(actions.loadOrders());
  };

  const handleClickDeploy = (record, index) => {
    setVisible(true);
    ref.current = { record, index };
  };

  const handleClickApprove = (record, index) => {
    dispatch(
      actions.setData({
        orderId: record.id,
        newInfo: { is_approved: true },
        approve: index,
      }),
    );
    dispatch(actions.approveOrder());
  };

  const deployCompute = zone => {
    const { record, index } = ref.current;
    dispatch(
      actions.setData({
        data: { order_id: record.id, zone: zone },
        deploy: index,
        order: record,
      }),
    );
    dispatch(actions.deployOrder());
    setVisible(false);
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
      dispatch(actions.queryOrders());
    } else {
      dispatch(actions.loadOrders());
    }
  };

  const handleClickDelete = (record, index) => {
    dispatch(actions.setData({ delete: index, orderId: record.id }));
    dispatch(actions.deleteOrder());
  };

  const handleClickContractCode = contract_code => {
    dispatch(
      instancesSlice.actions.setParams({ contract_code: contract_code }),
    );
    dispatch(
      instancesSlice.actions.setPagination({ ...defaultState.pagination }),
    );
    dispatch(instancesSlice.actions.queryInstancesByContractCode());
  };

  const hadleClickCustomerEmail = () => {
    dispatch(actions.setParams(defaultState.params));
  };

  const columns: ProColumns<TableListOrder>[] = [
    {
      title: t('Title.ORDER_ID'),
      key: 'id',
      dataIndex: 'id',
      width: 60,
      search: false,
    },
    {
      title: t('Title.REGION'),
      key: 'region',
      dataIndex: 'region_name',
      width: 70,
      search: false,
    },
    {
      title: t('Title.SALE_CARE'),
      width: 140,
      render: (text, record: any, index) => record.sale_care,
      ellipsis: true,
    },
    {
      title: t('Title.ORDER_TYPE'),
      key: 'order_type',
      dataIndex: 'order_type',
      width: 75,
    },
    {
      title: t('Title.ORDER_CODE'),
      key: 'code',
      dataIndex: 'code',
      render: (text, record: any, index) => (
        <Link to={localPath.orders.order.replace(':orderId', record.id)}>
          {text}
        </Link>
      ),
      width: 180,
    },
    {
      title: t('Title.CONTRACT_CODE'),
      key: 'contract_code',
      dataIndex: 'contract_code',
      render: (text, record: any, index) => {
        return (
          <NavLink
            onClick={() => handleClickContractCode(text)}
            to={localPath.instances.instances}
          >
            {text}
          </NavLink>
        );
      },
      width: 140,
    },
    {
      title: t('Title.CUSTOMER_NAME'),
      width: 140,
      key: 'customer_name',
      search: false,
      render: (text, record: any, index) => record.order_dtl.name,
      // ellipsis: true,
    },
    {
      title: t('Title.CUSTOMER_EMAIL'),
      width: 140,
      render: (text: any, record: any, index) => {
        return (
          <NavLink
            onClick={hadleClickCustomerEmail}
            to={`/dashboard/users/${record?.customer_id}#orders`}
          >
            {record.order_dtl?.email}
          </NavLink>
        );
      },
      key: 'email',
      search: false,
    },
    {
      title: t('Title.CREATED_AT'),
      width: 110,
      key: 'create_at',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      sorter: (a, b) => a.created_at - b.created_at,
      search: false,
    },
    {
      title: t('Title.TOTAL'),
      key: 'total',
      dataIndex: 'total',
      width: 130,
      search: false,
    },
    {
      title: t('Title.START_DATE'),
      width: 100,
      key: 'start_at',
      dataIndex: 'start_at',
      valueType: 'date',
      sorter: (a, b) => a.start_at - b.start_at,
      search: false,
    },
    {
      title: t('Title.END_DATE'),
      width: 100,
      key: 'end_at',
      dataIndex: 'end_at',
      valueType: 'date',
      sorter: (a, b) => a.end_at - b.end_at,
      search: false,
    },
    {
      title: t('Title.USER_ID'),
      hideInTable: true,
      key: 'customer_id',
    },
    {
      title: t('Title.STATUS'),
      key: 'status',
      ellipsis: true,
      dataIndex: 'status',
      filters: true,
      valueEnum: { ...Status },
      width: 140,
    },
    {
      title: t('Title.ACTIONS'),
      width: 280,
      key: 'option',
      valueType: 'option',
      render: (text, record, index) => {
        return [
          ['ADMIN', 'IT_ADMIN'].includes(account.role) && (
            <Button
              key="1"
              type="primary"
              size="small"
              disabled={
                record.approval_step === 0 || record.status === 'DEPLOYED'
              }
              danger
              loading={data ? index === data.deploy : false}
              onClick={() => handleClickDeploy(record, index)}
            >
              {t('Button.DEPLOY')}
            </Button>
          ),
          ['ADMIN', 'SALE_ADMIN'].includes(account.role) && (
            <>
              <Button
                key="2"
                type="primary"
                size="small"
                disabled={record.approval_step >= 1}
                onClick={() => handleClickApprove(record, index)}
                loading={data ? index === data.approve : false}
              >
                {t('Button.APPROVE')}
              </Button>
              <ButtonDeleteBase
                onConfirm={() => handleClickDelete(record, index)}
                loading={data ? index === data.delete : false}
                size="small"
                key="3"
              />
            </>
          ),
        ];
      },
    },
  ];

  const onReset = () => {
    dispatch(actions.setParams(null));
    handleClickReload();
  };

  const onSubmit = params => {
    if (Object.keys(params).length > 0) {
      dispatch(actions.setPagination({ ...defaultState.pagination }));
      dispatch(actions.setParams(params));
      dispatch(actions.queryOrders());
    }
  };

  const hideDowloadModal = () => {
    setVisibleDownloadModal(false);
  };

  useEffect(() => {
    if (
      !orders.length &&
      window.location.pathname === localPath.orders.orders
    ) {
      dispatch(actions.loadOrders());
    }
  }, [dispatch]);

  useEffect(() => {
    fillValuesToForm(paramsRedux, formRef.current);
  }, [paramsRedux?.customer_id]);

  return (
    <>
      <ProTable<TableListOrder>
        formRef={formRef}
        className="DataViewOrders"
        columns={columns}
        tableStyle={{ overflow: 'scroll' }}
        dataSource={orders ? dataSource : []}
        loading={loading}
        onReset={onReset}
        onSubmit={params => onSubmit(params)}
        rowKey={record => String(record.id)}
        options={{
          reload: () => handleClickReload(),
          fullScreen: false,
        }}
        onChange={e => handleChangeCurrentPage(e)}
        pagination={{
          showQuickJumper: true,
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }}
        search={{
          layout: 'vertical',
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <DownloadOutlined
            key="download-csv"
            style={{ fontSize: 18 }}
            onClick={() => setVisibleDownloadModal(true)}
          />,
        ]}
        dateFormatter="string"
        toolbar={{
          title: (
            <Button
              type="primary"
              key="launchInstance"
              onClick={() => {
                history.push(`${match.url}/create`);
              }}
            >
              {t('Button.CREATE')}
            </Button>
          ),
        }}
      />
      <ModalSelectZones
        visible={visible}
        deployCompute={deployCompute}
        closeModal={closeModal}
      />
      <ModalDowloadCSV
        visible={visibleDownloadModal}
        arr={columnsOrders}
        data={orders.map((item: any) => {
          return { ...item.order_dtl, ...item };
        })}
        filename="Orders Report.csv"
        onCancel={hideDowloadModal}
      />
    </>
  );
}
