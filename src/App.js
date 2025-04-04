import React from 'react';
import './styles.css';

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

class App extends React.Component{
  constructor(props){
    super(props);

    this.state={
      cart:[],
      productQuantities:{},
      showGifMessage:false
    };
    
    const initialQuantities={};
    PRODUCTS.forEach(product=>{
      initialQuantities[product.id]=1;
    });
    this.state.productQuantities=initialQuantities;
    this.addToCart=this.addToCart.bind(this);
    this.updateCartItem=this.updateCartItem.bind(this);
    this.removeFromCart=this.removeFromCart.bind(this);
    this.updateProductQuantity=this.updateProductQuantity.bind(this);
  }
  getSubtotal(){
    return this.state.cart.reduce((total,item)=>total+(item.price* item.quantity),0);
  }
  componentDidUpdate(prevProps,prevState){
    const subtotal=this.getSubtotal();
    const hasFreeGift=this.state.cart.some(item=>item.id===FREE_GIFT.id);
    if (subtotal>=THRESHOLD && !hasFreeGift){
      this.setState(prevState=>({
        cart: [...prevState.cart,{...FREE_GIFT,quantity: 1}],
        showGifMessage:true
      }));
      setTimeout(()=>{
        this.setState({showGifMessage: false});

      },3000);
    }else if (subtotal < THRESHOLD&& hasFreeGift){
      this.setState(prevState=>({cart:prevState.cart.filter(item=>item.id!==FREE_GIFT.id)}));
    }
  }
  addToCart(productId){
    const product=PRODUCTS.find(p=>p.id===productId);
    const existingItem=this.state.cart.find(item=>item.id===productId);
    if (existingItem){
      this.setState(prevState=>({
        cart: prevState.cart.map(item=>item.id===productId ? {...item,quantity:item.quantity+prevState.productQuantities[productId]}: item)
      }));

    }else{
      this.setState(prevState=>({
        cart: [...prevState.cart, {...product, quantity: prevState.productQuantities[productId]}]
      }));
    }
  }
  updateCartItem(productId,newQuantity){
    if (newQuantity<=0){
      this.removeFromCart(productId);
      return;
    }
    this.setState(prevState=>({
      cart: prevState.cart.map(item=>item.id===productId?{...item,quantity:newQuantity}: item)
    }));
  }
  removeFromCart(productId){
    this.setState(prevState=>({
      cart:prevState.cart.filter(item=>item.id!==productId)
    }));
  }
  updateProductQuantity(productId,change){
    this.setState(prevState=>{
    const newQuantity=Math.max(1,prevState.productQuantities[productId]+change);
    return {
      productQuantities: {
        ...prevState.productQuantities,
        [productId]:newQuantity
      }
    };
  });
  }
  render(){
    const subtotal=this.getSubtotal();
    const progress=Math.min(subtotal,THRESHOLD);
    const progressPercentage=(progress/THRESHOLD)*100;
    return (
      <div className="app">
        <h1>Shopping Cart App</h1>
        <section className='products'>
          <h2>products</h2>
          <div className='product-list'>
            {PRODUCTS.map(product=>(
              <div key={product.id} className="product">
                <h3>{product.name}</h3>
                <p>${product.price}</p>
                <div className='quantity-selector'>
                  <button onClick={()=>this.updateProductQuantity(product.id,-1)}>-</button>
                  <span>{this.state.productQuantities[product.id] || 1}</span>
                  <button onClick={()=>this.updateProductQuantity(product.id,1)}>+</button>
                </div>
                <button className='add-to-cart' onClick={()=>this.addToCart(product.id)}>Add to Cart</button>
              </div>
            ))}
          </div>
        </section>
        <section className='cart'>
          <h2>Cart Summary</h2>
          {
            this.state.showGifMessage&&(
              <div className='gift-message'>
                You got a free {FREE_GIFT.name}!
              </div>
            )
          }
          <div className='progress-bar'>
            <div className='progress' style={{width: `${progressPercentage}%`}}>

            </div>
            <span className='progress-text'>
              {subtotal<THRESHOLD ? 'Add ${THRESHOLD-subtotal} more to get a FREE ${FREE_GIFT.name}!': 'You have unlocked the free ${FREE_GIFT.name}!'}
            </span>

          </div>
          <div className='subtotal'>
            <strong>Subtotal:</strong> ${subtotal}
          </div>
          {this.state.cart.length===0 ? (
            <p className='empty-cart'>Your cart is empty, Add some products to see them here!</p>
          ):(
            <div className='cart-items'>
              <h3>Cart Items</h3>
              {this.state.cart.map(item=>(
                <div key={item.id} className='cart-item'>
                  <div className='item-info'>
                    <span>{item.name}</span>
                    {item.id===FREE_GIFT.id && <span className='free-tag'>FREE GIFT</span>}

                  </div>
                  <div className='item-controls'>
                    {item.id===FREE_GIFT.id && (
                      <>
                      <button onClick={()=>this.updateCartItem(item.id,item.quantity-1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={()=>this.updateCartItem(item.id,item.quantity+1)}>+</button>
                      </>
                    )
                    }
                    <span className='item-total'>
                      ${item.price} x {item.quantity} = ${item.quantity}
                    </span>
                    {
                      item.id !== FREE_GIFT.id && (
                        <button className='remove' onClick={()=>this.removeFromCart(item.id)}>Remove</button>
                      )
                    }

                  </div>
                  </div>
              ))}
            </div>
          )}
          
        </section>
      </div>
    );
  }
    
}
export default App