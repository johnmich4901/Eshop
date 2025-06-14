import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import './Cart.css'


export default function Cart() {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/cart')
      .then(res => setCart(res.data))
      .catch(err => {
        if (err.response?.status===401) navigate('/login');
      });
  }, [navigate]);

  const remove = (id) => {
    axios.delete('/cart/remove', { data:{ productId:id } })
      .then(() => setCart(c=>({
        items: c.items.filter(i=>i.productId._id!==id),
        totalPrice: c.items.filter(i=>i.productId._id!==id)
                     .reduce((sum,i)=>sum+i.price*i.quantity,0)
      })))
      .catch(console.error);
  };

  const updateQuantity = (id, quantity) => {
    axios.put('/cart/update', { productId: id, quantity })
      .then(res => setCart(res.data))
      .catch(console.error);
  };

  const checkout = () => {
    axios.post('/orders/checkout', {
      totalPrice: cart.totalPrice
    })
      .then(() => {
        alert('Order placed');
        navigate('/');
      })
      .catch(console.error);
  };

  return (
    <div className="cart-wrapper">
      <h1>Your Cart</h1>
      {cart.items.length===0
        ? <p>Cart is empty</p>
        : <div>
            {cart.items.map(i=>(
             <div key={`${i.productId._id}-${i.quantity}`} className="cart-item">
                <strong>{i.productId.name}</strong> x{i.quantity} = ${i.price*i.quantity}
                <button  className="cart-button" onClick={() => updateQuantity(i.productId._id, i.quantity - 1)} >
                  −
                </button>
                <button  className="cart-button" onClick={() => updateQuantity(i.productId._id, i.quantity + 1)}>
                  +
                </button>
                <button  className="cart-button" onClick={()=>remove(i.productId._id)} >
                  Remove
                </button>
              </div>
            ))}
            <h2>Total: ${cart.totalPrice.toFixed(2)}</h2>
            <button  className="cart-button" onClick={checkout}>Checkout</button>
          </div>
      }
    </div>
  );
}
