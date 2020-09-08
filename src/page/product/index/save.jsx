import React from 'react'
import PageTitle from 'component/page-title/index.jsx'
import CategorySelector from 'page/product/index/category-selector.jsx'
import Product from 'service/product-service.jsx'
import MUtil from 'util/mm.jsx'
import FileUploader from 'util/file-uploader/index.jsx'
import RichEditor from 'util/rich-editor/index.jsx'
import './save.scss'

const _product = new Product()
const _mm = new MUtil()

class ProductSave extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            id: this.props.match.params.pid,
            name: '',
            subtitle: '',
            categoryId: 0,
            parentCategoryId: 0,
            subImages: [],
            price: '',
            stock: '',
            detail: '',
            status: 1  //商品状态1为在售
        }
    }
    componentDidMount(){
        this.loadProduct()
    }
    loadProduct(){
        if(this.state.id){
            _product.getProduct(this.state.id).then(res => {
                let images = res.subImages.split(',')
                res.subImages = images.map((imgUri) => {
                    return {
                        uri: imgUri,
                        url: res.imageHost + imgUri
                    }
                })
                res.defaultDetail = res.detail
                this.setState(res)
            }, err => {
                _mm.errorTips(err)
            })
        }
    }
    onValueChange(e){
        let name = e.target.name,
            value = e.target.value.trim()
        this.setState({
            [name]: value
        })
    }
    onCategoryChange(categoryId, parentCategoryId){
        this.setState({
            categoryId: categoryId,
            parentCategoryId: parentCategoryId
        })
    }
    onUploadSuccess(res){
        let subImages = this.state.subImages
        subImages.push(res)
        this.setState({
            subImages: subImages
        })
    }
    onUploadError(err){
        _mm.errorTips(err)
    }
    onImageDelete(e){
        let index = parseInt(e.target.getAttribute('index')),
            subImages = this.state.subImages
        subImages.splice(index, 1)
        this.setState({
            subImages: subImages
        })
    }
    onDetailValueChange(value){
        this.setState({
            detail: value
        })
    }
    getSubImagesString(){
        return this.state.subImages.map((image) => image.url).join(',')
    }
    onSubmit(e){
        let product = {
            name: this.state.name,
            subtitle: this.state.subtitle,
            categoryId: parseInt(this.state.categoryId),
            subImages: this.getSubImagesString(),
            detail: this.state.detail,
            price: parseFloat(this.state.price),
            stock: parseInt(this.state.stock),
            status: this.state.status
        }
        let productCheckResult = _product.checkProduct(product)
        if(this.state.id){
            product.id = this.state.id
        }
        if(productCheckResult.status){
            _product.saveProduct(product).then((res) => {
                _mm.successTips(res)
                this.props.history.push('/product/index')
            }, (err) => {
                _mm.errorTips(err)
            })
        }else{
            _mm.errorTips(productCheckResult.msg)
        }
    }
    render(){
        return (
            <div id="page-wrapper">
                <PageTitle title="添加商品"/>
                <div className="form-horizontal">
                    <div className="form-group">
                        <label className="col-md-2 control-label">商品名称</label>
                        <div className="col-md-5">
                            <input type="text" 
                                name="name"
                                value={this.state.name}
                                className="form-control" 
                                placeholder="请输入商品名称" 
                                onChange={(e) => this.onValueChange(e)}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-2 control-label">商品描述</label>
                        <div className="col-md-5">
                            <input type="text" 
                                name="subtitle"
                                value={this.state.subtitle}
                                className="form-control" 
                                placeholder="请输入商品描述" 
                                onChange={(e) => this.onValueChange(e)}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-2 control-label">所属分类</label>
                        <CategorySelector 
                            categoryId={this.state.categoryId}
                            parentCategoryId={this.state.parentCategoryId}
                            onCategoryChange={(categoryId, parentCategoryId) => this.onCategoryChange(categoryId, parentCategoryId)}/>
                    </div>
                    <div className="form-group">
                        <label className="col-md-2 control-label">商品价格</label>
                        <div className="col-md-3">
                            <div className="input-group">
                                <input type="number" 
                                    name="price"
                                    value={this.state.price}
                                    className="form-control" 
                                    placeholder="请输入商品价格" 
                                    onChange={(e) => this.onValueChange(e)}/>
                                <span className="input-group-addon">元</span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-2 control-label">库存</label>
                        <div className="col-md-3">
                            <div className="input-group">
                                <input type="number" 
                                    name="stock"
                                    value={this.state.stock}
                                    className="form-control" 
                                    placeholder="请输入商品库存" 
                                    onChange={(e) => this.onValueChange(e)}/>
                                <span className="input-group-addon">件</span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-2 control-label">商品图片</label>
                        <div className="col-md-10">
                            {
                                this.state.subImages.length > 0 ? this.state.subImages.map((image, index) => (
                                    <div className="img-con" key={index}>
                                        <img className="img" src={image.url} />
                                        <i className="fa fa-close" index={index} onClick={(e) => this.onImageDelete(e)}></i>
                                    </div>
                                )) : (<div>请上传图片</div>)
                            }
                        </div>
                        <div className="col-md-offset-2 col-md-10 file-upload-con">
                            <FileUploader onSuccess={(res) => this.onUploadSuccess(res)} onError={(err) => this.onUploadError(err)}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-2 control-label">商品详情</label>
                        <div className="col-md-10">
                            <RichEditor 
                                detail={this.state.detail}
                                defaultDetail={this.state.defaultDetail}
                                onValueChange={(value) => this.onDetailValueChange(value)}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-md-offset-2 col-md-10">
                            <button type="submit" className="btn btn-primary" onClick={(e) => this.onSubmit(e)}>添加</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProductSave