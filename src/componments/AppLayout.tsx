import React, {Component} from 'react';
import {DownOutlined} from '@ant-design/icons';
import {Avatar, Dropdown, Layout, Menu} from 'antd';
import LeftBar from "./LeftBar";
import SubTitle from "./SubTitle";
import {AdminStore} from "../store/AdminStore";
import {inject, observer} from "mobx-react";
import '../static/css/header.css'
import PermissionStore from "../store/PermissionStore";
import {matchPath, RouteComponentProps, withRouter} from "react-router-dom";

import LeftBarStore from "../store/LeftBarStore";

import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
  } from '@ant-design/icons';
const {Header, Content} = Layout;

interface IProps extends RouteComponentProps {
    adminStore?: AdminStore
    permissionStore?: PermissionStore
    LeftBarStore?: LeftBarStore
}

interface IState {
    auth: boolean
}

@inject('adminStore', 'permissionStore','LeftBarStore')
@observer
class AppLayout extends Component<IProps, IState> {


    constructor(props: IProps, context: any) {
        super(props, context);
        this.state = {
            auth: false
        }
    }

    static getDerivedStateFromProps(props: Readonly<IProps>, state: Readonly<IState>) {
        if (props.permissionStore?.state === 'success') {
            let auth: boolean = false
            // console.log(11111111,props.permissionStore.permissionList)
            for (let permission of props.permissionStore.permissionList) {
                // console.log("props.location.pathname",props.location.pathname)
                // console.log("permission",permission)
                // console.log("permission.path",permission.path)
                let match = matchPath(props.location.pathname, {path: permission.path})
                if (match !== null && match.isExact) {
                    auth = true
                    break
                }
            }
            if (!auth) {
                // 跳转 或者提示 没有权限 跳转到用户的第一个权限（就是URL地址）
            }
            return {auth: auth};
        }
        return null;
    }

    logout = () => {
        this.props.adminStore?.logout()
        window.location.href = '/login'
    }
    toggle = () => {
        this.props.LeftBarStore?.changeCollapsed(!this.props.LeftBarStore?.collapsed)
    };
    render() {
        if (this.props.permissionStore?.state === 'loading') {
            // console.log("this.props.permissionStore?",this.props.permissionStore)
            // console.log("this.props.permissionStore?.state",this.props.permissionStore?.state)
            return (
                <>
                    loading11
                </>
            )
        }
        if (!this.state.auth) {
            return (
                <>
                    no auth
                </>
            )
        }
        return (
            <Layout>
                {/* <Header className="header">
                    <div className="logo"/>
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item key="1" onClick={this.logout}>
                                    退出
                                </Menu.Item>
                            </Menu>
                        }
                        className={'admin'}
                    >
                        <div>
                            <Avatar
                                src={this.props.adminStore?.admin?.avatar}
                            />

                            <span className={'admin-name'}>
                                {this.props.adminStore?.admin.name}
                            </span>
                            <DownOutlined/>
                        </div>
                    </Dropdown>
                </Header> */}
                <Layout>
                    <LeftBar/>

                    <Layout className="site-layout">
                            <Header className="site-layout-background" style={{ padding: 0 }}>
                                <div className="collapsedtab">
                                      {React.createElement(this.props.LeftBarStore?.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                        className: 'trigger',
                                        onClick: this.toggle,
                                    })}
                                </div>
                              

                                    <div className="logo"/>
                                    <Dropdown
                                        overlay={
                                            <Menu>
                                                <Menu.Item key="1" onClick={this.logout}>
                                                    退出
                                                </Menu.Item>
                                            </Menu>
                                        }
                                        className={'admin'}
                                    >
                                        <div>
                                            <Avatar
                                                src={this.props.adminStore?.admin?.avatar}
                                            />

                                            <span className={'admin-name'}>
                                                {this.props.adminStore?.admin.name}
                                            </span>
                                            <DownOutlined/>
                                        </div>
                                    </Dropdown>
                            </Header>
                            <Content
                                    className="site-layout-background"
                                    style={{
                                        padding: 24,
                                        margin: 0,
                                        minHeight: 280,
                                    }}
                                >
                                    {this.props.children}
                                </Content>
                    </Layout>
                    {/* <Layout style={{padding: '0 24px 24px'}}>
                        <SubTitle/>
                         <Content
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}
                        >
                            {this.props.children}
                        </Content> 
                    </Layout> */}
                </Layout>
            </Layout>
        );
    }
}

export default withRouter(AppLayout);

