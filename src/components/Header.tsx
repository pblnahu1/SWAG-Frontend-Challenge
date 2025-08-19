import { Link } from 'react-router-dom';
import './Header.css';
import { useCart } from './CartContext';

const Header = () => {
  const { totalItems } = useCart();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <div className="logo-icon"><span className="material-icons">store</span></div>
            <span className="logo-text p1-medium">SWAG Challenge</span>
          </Link>

          <nav className="nav">
            <Link to="/" className="nav-link l1">
              <span className="material-icons">home</span>
              Catálogo
            </Link>
            <Link to="/cart" className="nav-link l1">
              <span className="material-icons">shopping_cart</span>
              Carrito ({totalItems})
            </Link>
          </nav>

          <div className="header-actions">
            <button className="btn btn-secondary cta1">
              <span className="material-icons">person</span>
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
