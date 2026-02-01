import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateCartBackend } from "../features/cart/cartSlice";
const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  const cartItem = cartItems.find((i) => i._id === product._id);

  return (
    <div
      onClick={() => navigate(`/products/${product.category}/${product._id}`)}
      className="border rounded p-3"
    >
      <img src={product.image[0]} alt={product.name} />

      {/* {!cartItem ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(
              syncCartQuantity({
                productId: product._id,
                quantity: 1,
              }),
            );
          }}
        >
          Add
        </button>
      ) : (
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(
                syncCartQuantity({
                  productId: product._id,
                  quantity: cartItem.quantity - 1,
                }),
              );
            }}
          >
            -
          </button>

          <span>{cartItem.quantity}</span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(
                syncCartQuantity({
                  productId: product._id,
                  quantity: cartItem.quantity + 1,
                }),
              );
            }}
          >
            +
          </button>
        </div>
      )} */}

      {!cartItem ? (
        <button
          onClick={() =>
            dispatch(updateCartBackend({ productId: product._id, quantity: 1 }))
          }
        >
          Add
        </button>
      ) : (
        <div>
          <button
            onClick={() =>
              dispatch(
                updateCartBackend({
                  productId: product._id,
                  quantity: cartItem.quantity + 1,
                }),
              )
            }
          >
            +
          </button>

          <span>{cartItem.quantity}</span>

          <button onClick={() => dispatch(removeCartItemBackend(product._id))}>
            -
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
