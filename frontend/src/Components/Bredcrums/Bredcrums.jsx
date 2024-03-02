import React from 'react'
import './Bredcrum.css'
import arrow_icon from "../Assets/breadcrum_arrow.png"
const Bredcrums = (props) => {
    const {product} = props;
  return (
    <div className='Bredcrum'>
        HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt=""/>
            {product.category} <img src={arrow_icon} alt="" /> {product.name}
    </div>
  )
}

export default Bredcrums