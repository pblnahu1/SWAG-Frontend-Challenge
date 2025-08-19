
import { useCart } from "./CartContext";

const CartModal = ({ onClose }: { onClose: () => void }) => {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.basePrice * item.quantity,
    0
  );

  return (
    <div className="cart-modal">
      <div className="cart-header">
        <h2>Carrito de Compras</h2>
        <button className="close-btn" onClick={onClose}>
          X
        </button>
      </div>

      {cart.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map(item => (
              <li key={item.id} className="cart-item">
                <span>{item.name}</span>
                <span>${item.basePrice.toLocaleString("es-CL")}</span>
                <div className="item-actions">
                  <button onClick={() => removeFromCart(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addToCart(item)}>+</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <span>Total:</span>
            <span>${totalPrice.toLocaleString("es-CL")}</span>
          </div>

          <div className="cart-buttons">
            <button onClick={clearCart}>Vaciar carrito</button>
            <button>Finalizar compra</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartModal;
