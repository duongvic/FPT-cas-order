import { Form, InputNumber, Select, Table } from 'antd';
import empty from 'is-empty';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectContract,
  selectData,
  selectInstance,
  selectLoading,
  selectOs,
} from './selectors';
import { actions } from './slice';
import './styles.less';

const { Option } = Select;

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async e => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <InputNumber
          type="number"
          min={0}
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default function InfoInstance() {
  const dispatch = useDispatch();
  const { t } = useTranslation(['translation', 'constant']);

  const contract = useSelector(selectContract);
  const data = useSelector(selectData);
  const dataSource = useSelector(selectInstance);
  const os = useSelector(selectOs);
  const loadingInstance = useSelector(selectLoading)?.instance;
  const loadingOs = useSelector(selectLoading)?.os;

  useEffect(() => {
    dispatch(actions.loadOs());
  }, [dispatch]);

  useEffect(() => {
    if (contract.current) {
      dispatch(actions.loadInstance());
    }
  }, [contract, dispatch]);

  const handleChangeOs = value => {
    dispatch(actions.setCurrentOs(value));
  };

  const handleSave = row => {
    const newData = [...dataSource];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    dispatch(actions.setInstance(newData));
    dispatch(actions.setData({ ...data, items: [{ products: newData }] }));
  };

  const defaultColumns = [
    {
      title: t('constant:Title.NAME'),
      dataIndex: 'name',
      width: '30%',
    },
    {
      title: t('constant:Title.AMOUNT'),
      dataIndex: 'quantity',
      editable: true,
    },
    {
      title: t('constant:Title.UNIT'),
      dataIndex: 'unit',
    },
  ];
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  const optionOs =
    !empty(os) &&
    os.map(item => (
      <Option key={item.id} value={item.name}>
        {item.name}
      </Option>
    ));
  return (
    <div>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        pagination={false}
        dataSource={dataSource}
        columns={columns}
        loading={loadingInstance}
      />
      <Form
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
        style={{ marginTop: 8 }}
      >
        <Form.Item name="os" label={t('constant:Label.OS')}>
          <Select
            onChange={handleChangeOs}
            loading={loadingOs}
            placeholder={t('Placeholder.OS')}
            allowClear
          >
            {optionOs}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
}
