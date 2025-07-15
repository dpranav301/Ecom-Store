import React, { useContext, useEffect, useState } from "react";
import CartContext from "./cartContext";
import UserContext from "./userContext";
import {
  addItemToCartService,
  getCartOfUserService,
  removeItemsFromCartService,
} from "../Services/cartServices";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  //Cart Will Only Load When User Is Login for This We need UserContext
  const { login, userData } = useContext(UserContext);
  useEffect(() => {
    console.log("Login Inside is ", login);
    if (login) {
      getCartOfUserInitially();
    }
  }, [login]);

  const getCartOfUserInitially = async () => {
    try {
      console.log("User Data ", userData);
      const data = await getCartOfUserService(userData.user.userId);
      setCart(data);
      console.log("Cart is ", data);
    } catch (error) {
      console.log(error);
      setCart({ cartItem: [] });
    }
  };

  const addItemToCart = async (productId, quantity, popUpMsg) => {
    try {
      if (!login) {
        Swal.fire({
          title: "<h1>Please Login First</h1>",
          html: `
    In Order To Add Items in Cart Please Login First
  `,
          icon: "warning",
          confirmButtonText: "Close",
          confirmButtonColor: "success",
        });
        return;
      }
      const data = await addItemToCartService(
        userData.user.userId,
        productId,
        quantity
      );
      setCart(data);
      popUpMsg();
    } catch (error) {
      console.log("Error While Items To Cart", error);
      toast.error(error.response.data.message);
    }
  };

  const removeItemFromCart = async (cartItemId, popUpMsg) => {
    try {
      const data = await removeItemsFromCartService(
        userData.user.userId,
        cartItemId
      );
      setCart(data);
      popUpMsg();
    } catch (error) {
      console.log("Error While Removing Items From Cart", error);
      toast.error("Error While Removing Items From Cart");
    }
  };
  return (
    <CartContext.Provider
      value={{
        cart,
        addItemToCart,
        removeItemFromCart,
        getCartOfUserInitially,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

//As We Want The Cart Data Tobe Visible At all Pages so we will wrap whole app.js inside this CartContext
export default CartProvider;
