import React from 'react'
import PageTitle from 'component/page-title/index.jsx'
import Pagination from 'util/pagination/index.jsx'
import TableList from 'util/table-list/index.jsx'
import Order from 'service/order-service.jsx'
import ListSearch from './index-list-search.jsx'
import MUtil from 'util/mm.jsx'
import { Link } from 'react-router-dom'

const _order = new Order()
const _mm = new MUtil()

class OrderList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            list: [],
            pageNum: 1,
            listType: 'list',
            orderNumber: ''
        }
    }
    componentDidMount(){
        this.loadOrderList()
    }
    loadOrderList(){
        let listParam = {}
        listParam.listType = this.state.listType
        listParam.pageNum = this.state.pageNum
        if(this.state.listType === 'search'){
            listParam.orderNo = this.state.orderNumber
        }
        _order.getOrderList(listParam).then(res => {
            this.setState(res)
        }, err => {
            this.setState({
                list: []
            })
            _mm.errorTips(err)
        })
    }
    onSearch(orderNumber){
        let listType = orderNumber === '' ? 'list' : 'search'
        this.setState({
            listType: listType,
            pageNum: 1,
            orderNumber: orderNumber
        }, () => {
            this.loadOrderList()
        })
    }
    onPageNumChange(pageNum){
        this.setState({
            pageNum: pageNum
        }, () => {
            this.loadOrderList()
        })
    }
    render(){
        let tableHeads = ['订单号', '收件人', '订单状态', '订单总价', '创建时间', '操作']
        return (
            <div id="page-wrapper">
                <PageTitle title="订单列表" />
                <ListSearch onSearch={(orderNumber) => {this.onSearch(orderNumber)}}/>
                <TableList tableHeads={tableHeads}>
                    {
                        this.state.list.map((order, index) => (
                            <tr key={index}>
                                <td>
                                    <Link to={`/order/detail/${order.orderNo}`}>{order.orderNo}</Link>
                                </td>
                                <td>{order.receiverName}</td>
                                <td>{order.statusDesc}</td>
                                <td>￥{order.payment}</td>
                                <td>{order.createTime}</td>
                                <td>
                                    <Link to={`/order/detail/${order.orderNo}`}>查看详情</Link>
                                </td>
                            </tr>
                        ))
                    }
                </TableList>
                <Pagination current={this.state.pageNum} 
                    total={this.state.total} 
                    onChange={(pageNum) => {this.onPageNumChange(pageNum)}}/>
            </div>
        )
    }
}

export default OrderList