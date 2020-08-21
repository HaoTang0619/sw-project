import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Table,
  Modal,
  Space,
  Button,
  Input,
  Tooltip,
  message,
  DatePicker,
  Select,
  Tag,
} from "antd";
import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  SearchOutlined,
  UndoOutlined,
} from "@ant-design/icons";

import { CONCAT_SERVER_URL } from "../../utils";
import "./List.css";
import { format } from "date-fns";
import { selectUser } from "../../redux/userSlice";

export default function List(props) {
  const { refresh, setRefresh } = props;
  const { apiToken } = useSelector(selectUser);
  const initialSearchText = useMemo(
    () => ({
      id: "",
      name: "",
      email: "",
      roles: [],
      created_at: ["", ""],
      deleted_at: ["", ""],
      updated_at: ["", ""],
    }),
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState(initialSearchText);
  const [filter, setFilter] = useState({
    ...initialSearchText,
    page: 1,
    size: 10,
  });

  const handleSearchTextChange = (key) => (event) =>
    setSearchText({ ...searchText, [key]: event.target.value });

  const handleSearchArrayChange = useCallback(
    (key) => (value) =>
      setSearchText((prevSearchText) => ({ ...prevSearchText, [key]: value })),
    []
  );

  const [data, setData] = useState({
    info: [],
    length: 0,
  });

  const [allRoles, setAllRoles] = useState([]);

  useEffect(() => {
    if (apiToken === null) return;
    axios
      .get(CONCAT_SERVER_URL("/api/v1/superUser/allRoles"), {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      })
      .then((res) => setAllRoles(res.data));
  }, [apiToken]);

  const tableColumns = useMemo(
    () => [
      {
        title: "Id",
        dataIndex: "id",
        key: "id",
        width: 70,
        sorter: (a, b) => Number(a.id > b.id),
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 120,
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        sorter: (a, b) => a.email.localeCompare(b.email),
      },
      {
        title: "Roles",
        dataIndex: "roles",
        key: "roles",
        sorter: (a, b) =>
          a.roles
            .map((role) => role.name)
            .join(", ")
            .localeCompare(b.roles.map((role) => role.name).join(", ")),
        render: (roles) => roles.map((role) => role.name).join(", "),
        renderSearch: (
          <Select
            className="BOUser-select"
            mode="multiple"
            placeholder="Roles..."
            allowClear
            onChange={handleSearchArrayChange("roles")}
            tagRender={({ label, closable, onClose }) => (
              <Tag
                closable={closable}
                onClose={onClose}
                style={{ borderRadius: 5 }}
              >
                {label}
              </Tag>
            )}
            style={{
              width: 250,
              margin: 8,
            }}
            dropdownStyle={{
              borderRadius: "15px",
            }}
          >
            {allRoles.map((role) => (
              <Select.Option key={role}>{role}</Select.Option>
            ))}
          </Select>
        ),
      },
      {
        title: "Create Time",
        dataIndex: "created_at",
        key: "created_at",
        sorter: (a, b) => a.created_at.localeCompare(b.created_at),
        timeFormat: "yyyy-MM-dd HH:mm:ss",
        timeZone: "Asia/Taipei",
      },
      {
        title: "Delete Time",
        dataIndex: "deleted_at",
        key: "deleted_at",
        sorter: (a, b) => a.deleted_at.localeCompare(b.deleted_at),
        timeFormat: "yyyy-MM-dd HH:mm:ss",
        timeZone: "Asia/Taipei",
      },
      {
        title: "Update Time",
        dataIndex: "updated_at",
        key: "updated_at",
        sorter: (a, b) => a.updated_at.localeCompare(b.updated_at),
        timeFormat: "yyyy-MM-dd HH:mm:ss",
        timeZone: "Asia/Taipei",
      },
    ],
    [allRoles, handleSearchArrayChange]
  );

  const handleDeleteUser = (event) => {
    const id = event.currentTarget.value;
    const modal = Modal.confirm({
      title: "Do you want to delete this user?",
      content: `(User id = ${id})`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        modal.update({ cancelButtonProps: { disabled: true } });
        setIsLoading(true);
        axios
          .delete(CONCAT_SERVER_URL(`/api/v1/superUser/${id}`), {
            headers: {
              Authorization: `Bearer ${apiToken}`,
            },
          })
          .then(() => {
            message.success(`Deleted successfully. (User id = ${id})`);
            setRefresh();
          })
          .catch((err) => {
            setIsLoading(false);
            message.destroy();
            if (err.response && err.response.status === 403)
              message.error("Permission denied.");
            else message.error("Deleted failed. Please try again later.");
          });
      },
    });
  };

  const handleRecoverUser = (event) => {
    const id = event.currentTarget.value;
    const modal = Modal.confirm({
      title: "Do you want to recover this user?",
      icon: <ExclamationCircleOutlined />,
      content: `(User id = ${id})`,
      onOk() {
        modal.update({ cancelButtonProps: { disabled: true } });
        setIsLoading(true);
        axios
          .put(
            CONCAT_SERVER_URL(`/api/v1/superUser/${id}`),
            {},
            {
              headers: {
                Authorization: `Bearer ${apiToken}`,
              },
            }
          )
          .then(() => {
            message.success(`Recovered successfully. (User id = ${id})`);
            setRefresh();
          })
          .catch((err) => {
            setIsLoading(false);
            message.destroy();
            if (err.response && err.response.status === 403)
              message.error("Permission denied.");
            else message.error(`Deleted failed. Please try again later.`);
          });
      },
    });
  };

  const columns = [
    ...tableColumns,
    {
      title: "Options",
      onHeaderCell: () => ({
        style: {
          background: "#fafafa",
          boxShadow: "-2px 0px 3px -1.5px #ddd",
          position: "sticky",
          right: "0",
        },
      }),
      onCell: () => ({
        style: {
          background: "#fff",
          boxShadow: "-2px 0px 3px -1.5px #ddd",
          position: "sticky",
          right: "0",
        },
      }),
      render: (_, row) => (
        <div style={{ textAlign: "center" }}>
          {row.deleted_at === "" ? (
            <Tooltip title="Delete">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteUser}
                shape="circle"
                size="small"
                type="primary"
                value={row.id}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Recover">
              <Button
                icon={<UndoOutlined />}
                onClick={handleRecoverUser}
                shape="circle"
                size="small"
                type="primary"
                value={row.id}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (apiToken === null) return;
    setIsLoading(true);
    axios
      .get(CONCAT_SERVER_URL("/api/v1/superUser"), {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        params: {
          ...filter,
          ...Object.fromEntries(
            tableColumns
              .filter(
                (col) => initialSearchText[col.dataIndex] instanceof Array
              )
              .map((col) => {
                if (col.hasOwnProperty("timeFormat"))
                  return [
                    col.dataIndex,
                    filter[col.dataIndex] === null
                      ? initialSearchText[col.dataIndex]
                      : filter[col.dataIndex].map((item) =>
                          item === "" || item === null ? "" : item.format()
                        ),
                  ];
                return [
                  col.dataIndex,
                  filter[col.dataIndex] === null
                    ? initialSearchText[col.dataIndex]
                    : filter[col.dataIndex],
                ];
              })
          ),
        },
      })
      .then((res) => {
        if (res.data.data !== null) {
          if (res.data.length !== 0) {
            setData({
              info: res.data.data.map((item) => ({
                ...item,
                ...Object.fromEntries(
                  tableColumns
                    .filter((col) => col.hasOwnProperty("timeFormat"))
                    .map(({ dataIndex, timeFormat, timeZone }) => [
                      dataIndex,
                      item[dataIndex] === null
                        ? ""
                        : format(new Date(item[dataIndex]), timeFormat, {
                            timeZone,
                          }),
                    ])
                ),
              })),
              length: res.data.total,
            });
          }
        }
      })
      .catch((err) => {
        message.destroy();
        if (err.response && err.response.status === 403)
          message.error("Permission denied.");
        else message.error("There are some problems during loading.");
      })
      .finally(() => setIsLoading(false));
  }, [refresh, filter, tableColumns, apiToken, initialSearchText]);

  const handleSearch = () => {
    setFilter((prevFilter) => ({
      ...searchText,
      page: 1,
      size: prevFilter.size,
    }));
  };

  const handleReset = () => {
    setSearchText(initialSearchText);
    setFilter((prevFilter) => ({
      ...initialSearchText,
      page: 1,
      size: prevFilter.size,
    }));
  };

  const searchFields = tableColumns.map((col) => {
    if (col.hasOwnProperty("renderSearch")) return col.renderSearch;
    if (col.hasOwnProperty("timeFormat"))
      return (
        <DatePicker.RangePicker
          key={col.dataIndex}
          placeholder={["Search", col.title]}
          allowEmpty={[true, true]}
          value={searchText[col.dataIndex]}
          onChange={handleSearchArrayChange(col.dataIndex)}
          showTime
          style={{
            width: 250,
            margin: 8,
            borderRadius: "15px",
          }}
        />
      );
    return (
      <Input
        key={col.dataIndex}
        placeholder={`Search ${col.title}`}
        value={searchText[col.dataIndex]}
        onChange={handleSearchTextChange(col.dataIndex)}
        onPressEnter={handleSearch}
        style={{
          width: 188,
          margin: 8,
          display: "inline",
          borderRadius: "15px",
        }}
      />
    );
  });

  return (
    <>
      <div style={{ padding: 8 }}>
        {searchFields}
        <Space style={{ margin: "8px" }}>
          <Button
            onClick={handleReset}
            size="small"
            style={{
              width: 90,
              height: "30px",
              borderRadius: "15px",
              marginRight: "10px",
            }}
          >
            Reset
          </Button>
          <Button
            type="primary"
            onClick={handleSearch}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, height: "30px", borderRadius: "15px" }}
          >
            Search
          </Button>
        </Space>
      </div>
      <Table
        dataSource={data.info}
        pagination={{
          current: filter.page,
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["10", "20", "30"],
          total: data.length,
          showTotal: (total) => `Total result: ${total} `,
          onChange: (page, pageSize) => {
            if (filter.size === pageSize) {
              setFilter({ ...filter, page: page });
            } else {
              setFilter({ ...filter, page: 1, size: pageSize });
            }
          },
        }}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        loading={isLoading}
        rowKey={(record) => record.id}
      />
    </>
  );
}
