import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, Col, Form, Input, Row, Space } from 'antd';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MODE_EDIT, MODE_EXTEND } from '../Users/constants';
import { selectUser } from '../Users/selectors';
import {
  selectContract,
  selectLoading,
  selectProducts,
  selectRegion,
  selectReview,
} from './selectors';
import { actions } from './slice';

const { TextArea } = Input;

export interface TableListOrderInstance {
  id: number;
  CPU: number;
  MEMORY: number;
  DISK: number;
  NET: number;
  IP: number;
  Snapshot: number;
  Backup: number;
  OS: string;
}
interface Props {
  mode?: string;
}

export default function ReviewInstance({ mode }: Props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const noteRef: any = useRef(null);
  const { t } = useTranslation('constant');

  const dataSource = useSelector(selectReview);
  const user = useSelector(selectUser);
  const contract = useSelector(selectContract);
  const products = useSelector(selectProducts);
  const loading = useSelector(selectLoading).order;
  const region = useSelector(selectRegion);

  const handleClickDelete = index => {
    const newData = [...dataSource];
    const newProducts = [...products];

    newProducts.splice(index, 1);
    newData.splice(index, 1);
    dispatch(actions.setReview(newData));
    dispatch(actions.setProducts(newProducts));
  };

  const handleClickCreate = () => {
    let items: any[] = [];
    products.forEach(product => {
      items = [...items, { products: product }];
    });

    const { current } = contract;
    let newContract: any = {};
    newContract.code = current.contract_code;
    newContract.start_at = current.start_at;
    newContract.end_at = current.end_at;

    let co_sale: any = {};
    co_sale.department = current.department;
    co_sale.sale = current.sale;

    const newData = {
      ...current,
      contract: newContract,
      customer: user,
      remark: noteRef.current.state.value,
      items: items,
      quantity: 1,
      co_sale,
      region_id: region,
    };
    newData.price = Number(newData.price);
    delete newData.department;
    delete newData.end_at;
    delete newData.sale;
    delete newData.start_at;
    delete newData.contract_code;

    dispatch(actions.setData(newData));
    dispatch(actions.createOrder());
  };

  const columns: ProColumns<TableListOrderInstance>[] = [
    {
      title: t('Title.NO'),
      valueType: 'indexBorder',
      width: 48,
      key: 'NO',
    },
    {
      title: t('Title.CPU_WITH_SUFFIX'),
      dataIndex: 'CPU',
      key: 'CPU',
      sorter: (a, b) => a.CPU - b.CPU,
    },
    {
      title: t('Title.MEMORY_WITH_SUFFIX'),
      dataIndex: 'MEMORY',
      key: 'MEMORY',
      sorter: (a, b) => a.MEMORY - b.MEMORY,
    },
    {
      title: t('Title.DISK_WITH_SUFFIX'),
      dataIndex: 'DISK',
      key: 'DISK',
      sorter: (a, b) => a.DISK - b.DISK,
    },
    {
      title: t('Title.NET_WITH_SUFFIX'),
      dataIndex: 'NET',
      key: 'NET',
      sorter: (a, b) => a.NET - b.NET,
    },
    {
      title: t('Title.IPS_WITH_SUFFIX'),
      dataIndex: 'IP',
      key: 'IP',
      sorter: (a, b) => a.IP - b.IP,
    },
    {
      title: t('Title.SNAPSHOT_WITH_SUFFIX'),
      dataIndex: 'Snapshot',
      key: 'Snapshot',
      sorter: (a, b) => a.Snapshot - b.Snapshot,
    },
    {
      title: t('Title.BACKUP_WITH_SUFFIX'),
      dataIndex: 'Backup',
      key: 'Backup',
      sorter: (a, b) => a.Backup - b.Backup,
    },
    {
      title: t('Title.OS'),
      key: 'OS',
      dataIndex: 'OS',
    },
    {
      title: t('Title.ACTIONS'),
      width: 180,
      key: 'option',
      valueType: 'option',
      render: (text, record, index) => [
        <Button
          key="button"
          disabled={mode === MODE_EDIT}
          type="primary"
          danger
          onClick={() => handleClickDelete(index)}
        >
          {t('Button.DELETE')}
        </Button>,
      ],
    },
  ];
  return (
    <>
      <ProTable<TableListOrderInstance>
        columns={columns}
        dataSource={dataSource}
        tableStyle={{ overflow: 'scroll' }}
        rowKey={record => String(record.id)}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        search={false}
        dateFormatter="string"
        options={false}
      />
      <Row style={{ marginTop: 16 }}>
        <Col span={12}></Col>
        <Col span={12}>
          <Form.Item name="remark" label={t('Label.NOTES')}>
            <TextArea ref={noteRef} rows={8} />
          </Form.Item>
        </Col>
      </Row>
      {mode !== MODE_EDIT && mode !== MODE_EXTEND && (
        <Row justify="center">
          <Space>
            <Button
              loading={loading}
              type="primary"
              onClick={handleClickCreate}
            >
              {t('Button.CREATE')}
            </Button>
            <Button onClick={() => history.push('/dashboard/orders')}>
              {t('Button.CANCEL')}
            </Button>
          </Space>
        </Row>
      )}
    </>
  );
}
