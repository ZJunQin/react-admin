import React from 'react'

class ListSearch extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            orderNumber: ''
        }
    }
    onValueChange(e){
        let value = e.target.value.trim()
        this.setState({
            orderNumber: value
        })
    }
    onSearch(){
        this.props.onSearch(this.state.orderNumber)
    }
    onSearchKeywordKeyup(e){
        if(e.keyCode === 13){
            this.onSearch()
        }
    }
    render(){
        return (
            <div className="row search-wrap">
                <div className="col-md-12">
                    <div className="form-inline">
                        <div className="form-group">
                            <select className="form-control">
                                <option value="productId">按订单号查询</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <input type="text" 
                                name="searchKeyword"   
                                className="form-control" 
                                placeholder="请输入订单号"
                                onKeyUp={(e) => this.onSearchKeywordKeyup(e)}
                                onChange={(e) => this.onValueChange(e)}
                            />
                        </div>
                        <button className="btn btn-primary" 
                            onClick={e => this.onSearch(e)}>搜索</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ListSearch