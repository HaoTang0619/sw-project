import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Table, Modal, Avatar } from "antd";
import { Link } from "react-router-dom";
import styles from "./List.less";

const { confirm } = Modal;

// @withI18n()
class List extends PureComponent {
  handleMenuClick = (record, e) => {
    const { onDeleteItem, onEditItem, i18n } = this.props;

    if (e.key === "1") {
      onEditItem(record);
    } else if (e.key === "2") {
      confirm({
        title: i18n.t`Are you sure delete this record?`,
        onOk() {
          onDeleteItem(record.id);
        },
      });
    }
  };

  render() {
    const { onDeleteItem, onEditItem, i18n, ...tableProps } = this.props;

    const columns = [
      {
        title: "Avatar",
        dataIndex: "avatar",
        key: "avatar",
        //width: 72,
        //fixed: "left",
        render: (text) => <Avatar style={{ marginLeft: 8 }} src={text} />,
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text, record) => <Link to={`user/${record.id}`}>{text}</Link>,
      },
      {
        title: "NickName",
        dataIndex: "nickName",
        key: "nickName",
      },
      {
        title: "Age",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "CreateTime",
        dataIndex: "createTime",
        key: "createTime",
      },
      {
        title: "LastLoginTime",
        dataIndex: "lastloginTime",
        key: "lastloginTime",
      },
      {
        title: "LastLogoutTime",
        dataIndex: "lastlogoutTime",
        key: "lastlogoutTime",
      },
      {
        title: "Operation",
        key: "operation",
        fixed: "right",
        render: (text, record) => {
          return "HaHaHagergwergwergewrg";
        },
      },
    ];

    const data = [
      {
        avatar: "/pictures/avatar.jpeg",
        name: "erwrwer",
        nickName: "rrjwierjw",
        age: "rrjwierjw",
        email: "rrjwierjw",
        createTime: "rrjwierjw",
        lastloginTime: "rrjwierjw",
        lastlogoutTime: "rrjwierjw",
      },
    ];

    return (
      <Table
        dataSource={data}
        className={styles.table}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        rowKey={(record) => record.id}
      />
    );
  }
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
};

export default List;