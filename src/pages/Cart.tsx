import { useCart } from "../components/CartContext";

useCart

const Cart = () => {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.basePrice * item.quantity,
    0
  );

  if (cart.length === 0) return <div>Tu carrito está vacío</div>;

  return (
    <div className="cart-container">
      <h2>Carrito de Compras</h2>
      <ul>
        {cart.map(item => (
          <li key={item.id}>
            {item.name} - ${item.basePrice.toLocaleString('es-CL')} x {item.quantity}
            <button onClick={() => removeFromCart(item.id)}>-</button>
            <button onClick={() => addToCart(item)}>+</button>
          </li>
        ))}
      </ul>
      <p>Total: ${totalPrice.toLocaleString('es-CL')}</p>
      <button onClick={clearCart}>Vaciar carrito</button>
    </div>
  );
};

export default Cart;
