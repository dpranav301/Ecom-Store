// import { React, useContext } from "react";
// import { ListGroup } from "react-bootstrap";
// import { NavLink } from "react-router-dom";
// const SideMenu = () => {
//   return (
//     <div>
//       <ListGroup className="list-group-item.active.background-color=warning">
//         <ListGroup.Item as={NavLink} to="/admin/home" action>
//           Home
//         </ListGroup.Item>
//         <ListGroup.Item as={NavLink} to="/admin/add-category" action>
//           Add Category
//         </ListGroup.Item>
//         <ListGroup.Item as={NavLink} to="/admin/categories" action>
//           View Category
//         </ListGroup.Item>
//         <ListGroup.Item as={NavLink} to="/admin/addProduct" action>
//           Add Product
//         </ListGroup.Item>
//         <ListGroup.Item as={NavLink} to="/admin/products" action>
//           View Products
//         </ListGroup.Item>
//         <ListGroup.Item as={NavLink} to="/admin/orders" action>
//           Orders
//         </ListGroup.Item>
//         <ListGroup.Item as={NavLink} to="/admin/users" action>
//           Users
//         </ListGroup.Item>
//         {/* <ListGroup.Item as={NavLink} to="/admin/home" action>Dashboard</ListGroup.Item> */}
//         <ListGroup.Item action>Logout</ListGroup.Item>
//       </ListGroup>
//     </div>
//   );
// };

// export default SideMenu;

import { NavLink } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import {
  FaHome,
  FaPlus,
  FaList,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";
import { RiHomeWifiFill } from "react-icons/ri";
import { useContext } from "react";
import UserContext from "../../context/userContext";

const SideMenu = () => {
  const { logoutFun } = useContext(UserContext);
  return (
    <div className="sidebar sticky-top">
      <ListGroup className="side-menu">
        <ListGroup.Item
          as={NavLink}
          to="/admin/home"
          action
          className="menu-item"
        >
          <RiHomeWifiFill className="menu-icon" /> Home
        </ListGroup.Item>
        <ListGroup.Item
          as={NavLink}
          to="/admin/add-category"
          action
          className="menu-item"
        >
          <FaPlus className="menu-icon" /> Add Category
        </ListGroup.Item>
        <ListGroup.Item
          as={NavLink}
          to="/admin/categories"
          action
          className="menu-item"
        >
          <FaList className="menu-icon" /> View Categories
        </ListGroup.Item>
        <ListGroup.Item
          as={NavLink}
          to="/admin/addProduct"
          action
          className="menu-item"
        >
          <FaPlus className="menu-icon" /> Add Product
        </ListGroup.Item>
        <ListGroup.Item
          as={NavLink}
          to="/admin/products"
          action
          className="menu-item"
        >
          <FaBox className="menu-icon" /> View Products
        </ListGroup.Item>
        <ListGroup.Item
          as={NavLink}
          to="/admin/orders"
          action
          className="menu-item"
        >
          <FaShoppingCart className="menu-icon" /> Orders
        </ListGroup.Item>
        <ListGroup.Item
          as={NavLink}
          to="/admin/users"
          action
          className="menu-item"
        >
          <FaUsers className="menu-icon" /> Users
        </ListGroup.Item>
        <ListGroup.Item
          action
          className="menu-item logout"
          onClick={(event) => logoutFun()}
        >
          <FaSignOutAlt className="menu-icon" />
          Logout
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default SideMenu;
