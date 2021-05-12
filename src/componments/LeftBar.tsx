import React, {Component} from 'react';
import {Layout, Menu, Button} from "antd";


import {Link, matchPath, RouteComponentProps, withRouter} from "react-router-dom";
import router, {IRouter, leftRouter} from "../router";
import {inject, observer} from "mobx-react";

import PermissionStore from "../store/PermissionStore";
import LeftBarStore from "../store/LeftBarStore";

const {SubMenu} = Menu;
const {Sider} = Layout;

interface IState {
    defaultOpenKeys: string[]
    defaultSelectedKeys: string[]
    collapsed: boolean
}

interface IProps extends RouteComponentProps {
    permissionStore?: PermissionStore
    LeftBarStore?: LeftBarStore
}

@inject('permissionStore','LeftBarStore')



@observer

class LeftBar extends Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
        this.state = {
            defaultOpenKeys: [],
            defaultSelectedKeys: [],
            collapsed: false
        }
    }

    componentDidMount() {
        console.log("this.props",this.props)
        this.heightMenu(leftRouter)
    }
    componentWillReceiveProps(nextProps: any) {
        console.log("nextProps",nextProps)
    }
    heightMenu = (leftRoutes: IRouter[]) => {
        let path = this.props.location.pathname
        for (let r of leftRoutes) {
            let match = matchPath(path, {path: r.path})
            if (match) {
                if (match.isExact) {
                    this.setState({
                        defaultSelectedKeys: [r.key]
                    })
                } else {
                    this.setState({defaultOpenKeys: [r.key]})
                }
            }
            if (r.children) {
                this.heightMenu(r.children)
            }
        }
    }
    generateMenu = (props: IProps,routerList?: IRouter[]) => {
        props.permissionStore?.permissionList.map(item => {
            console.log(11,item.path)
            console.log(999,routerList)
            routerList?.map(r => {
                if(r.path == item.path) {
                    r.show = true
                }
                if(r.children) {
                    r.children.map(r1 => {
                        if(r1.path == item.path) {
                            r1.show = true
                            r.show = true
                        }
                    })
                }
            })
        })

   
        console.log("routerList",routerList)
        return (
            <>
                {
                    routerList?.map(r => {
                        if (r.show && r.children) {
                            return (
                                <SubMenu key={r.key} icon={r.icon} title={r.title}>
                                    {this.generateMenu(this.props,r.children)}
                                </SubMenu>
                            )
                        }
                        if(r.show) {
                            return (
                                <Menu.Item key={r.key} icon={r.icon}>
                                    <Link to={r.path}>{r.title}</Link>
                                </Menu.Item>
                            )   
                        }
                       
                    })
                }
            </>
        )
    }
    render() {
        return (
            <>

        <Sider trigger={null} collapsible collapsed={this.props.LeftBarStore?.collapsed}>
          <div className="logo" />
          {
            this.state.defaultSelectedKeys.length > 0 ?
                <Menu
                    mode="inline"
                    defaultSelectedKeys={this.state.defaultSelectedKeys}
                    defaultOpenKeys={this.state.defaultOpenKeys}
                    style={{height: '100%', borderRight: 0}}
                >
                    {this.generateMenu(this.props,router)}
                </Menu>
                :
                null
            }
        </Sider>


                {/* <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
                    {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
                </Button>
                <Sider width={200} className="site-layout-background" collapsed={this.state.collapsed}>
                    {
                        this.state.defaultSelectedKeys.length > 0 ?
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={this.state.defaultSelectedKeys}
                                defaultOpenKeys={this.state.defaultOpenKeys}
                                style={{height: '100%', borderRight: 0}}
                            >
                                {this.generateMenu(this.props,router)}
                            </Menu>
                            :
                            null
                    }
                </Sider> */}

            </>
        );
    }
}

export default withRouter(LeftBar);
