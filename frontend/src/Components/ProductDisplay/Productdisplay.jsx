import React, { useContext } from 'react'
import './Productdisplay.css'
import star_icon from "../Assets/star_icon.png"
import star_dull_icon from "../Assets/star_dull_icon.png"
import { ShopContext } from '../../Context/ShopContext'
export const Productdisplay = (props) => {
    const {product} = props;
    const {addtocart} = useContext(ShopContext)
  return (
    <div className='productDisplay'>
        <div class="productDisplay-left">

            <div class="productDisplay-imageList">
            <img src={product.image} alt="" />
            <img src={product.image} alt="" />
            <img src={product.image} alt="" />
            <img src={product.image} alt="" />
            </div>


    
        <div class="productDisplay-img">
            <img class='productDisplay-main-img' src={product.image} alt="" />
        </div>
        </div>
    
        <div className="productDisplay-right">
            <h1>{product.name}</h1>
            <div className="productDisplay-right-star">
                <img src={star_icon} alt="" />
                <img src={star_icon} alt="" />
                <img src={star_icon} alt="" />
                <img src={star_icon} alt="" />
                <img src={star_dull_icon} alt="" />
                <p>(122)</p>
            </div>
            <div className="productDisplay-right-prices">
                <div className="productDisplay-right-price-old">
                    ${product.old_price}
                </div>
                <div className="productDisplay-right-price-new">
                    ${product.new_price}
                </div>

            </div>
            <div className="productDisplay-right-description">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est nostrum necessitatibus, minus sequi ea dolorum, laboriosam voluptatem atque voluptatum fuga facilis nemo asperiores eum perspiciatis officiis. Accusantium consectetur hic ullam.
            </div>
            <div className="productDisplay-right-size">
                <p>Select Size</p>
                <div className="productDisplay-right-sizes">
                    <div>S</div>
                    <div>M</div>
                    <div>L</div>
                    <div>XL</div>
                    <div>XXL</div>
                </div>
            </div>
            <button onClick={()=>{addtocart(product.id)}}>ADD TO CART</button>
            <p className='productDisplay-right-category'><span>Category :</span>Women, T-shirt, Crop TOP</p>
            <p className='productDisplay-right-category'><span>Tags :</span>Modern, Latest</p>
        </div>
    </div>
  )
}
