import React, { useContext } from 'react'
import {useParams} from 'react-router';
import {ShopContext} from '../Context/ShopContext'
import Bredcrums from '../Components/Bredcrums/Bredcrums';
import { Productdisplay } from '../Components/ProductDisplay/Productdisplay';
import { Descriptionbox } from '../Components/DescriptionBox/Descriptionbox';
import { Relatedproducts } from '../Components/RelatedProducts/Relatedproducts';
export const Product = () => {
  const {all_product} = useContext(ShopContext);
  const {productId} = useParams();
  // Since our productid was in strings format and e.id was in number format. So we have to change productid to number format.
  const product = all_product.find((e)=> e.id === Number(productId));
  return (
    <div>
        <Bredcrums product = {product}/>
        <Productdisplay product = {product}/>
        <Descriptionbox/>
        <Relatedproducts/>
    </div>
  )
}
