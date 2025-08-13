// Centralized data for the e-commerce application
// This file contains all product and feature data used across components

const PRODUCTS_DATA = [
  {
    id: 1,
    title: "Gaming Controller",
    price: 99.99,
    rating: 4.5,
    reviews: 128,
    image: "../../assets/Images/gamepad.png"
  },
  {
    id: 2,
    title: "Laptop Computer",
    price: 199.99,
    rating: 4.3,
    reviews: 89,
    image: "../../assets/Images/laptop.png"
  },
  {
    id: 3,
    title: "Digital Camera",
    price: 49.99,
    rating: 4.7,
    reviews: 156,
    image: "../../assets/Images/camera.png"
  },
  {
    id: 4,
    title: "Stylish Jacket",
    price: 29.99,
    rating: 4.2,
    reviews: 203,
    image: "../../assets/Images/jacket.png"
  },
  {
    id: 5,
    title: "Running Shoes",
    price: 19.99,
    rating: 4.6,
    reviews: 312,
    image: "../../assets/Images/shoes.png"
  },
  {
    id: 6,
    title: "Kids Toy Car",
    price: 15.99,
    rating: 4.4,
    reviews: 98,
    image: "../../assets/Images/kids-car.png"
  },
  {
    id: 7,
    title: "Skincare Product",
    price: 79.99,
    rating: 4.1,
    reviews: 167,
    image: "../../assets/Images/skincare.png"
  },
  {
    id: 8,
    title: "Cesar Product",
    price: 149.99,
    rating: 4.8,
    reviews: 234,
    image: "../../assets/Images/cesar-product.png"
  }
];

const FEATURES_DATA = [
  {
    icon: "fa-truck",
    title: "Free and Fast Delivery",
    description: "free delivery on all orders over $140"
  },
  {
    icon: "fa-headset",
    title: "24/7 Customer Service",
    description: "friendly 24/7 customer support"
  },
  {
    icon: "fa-lock",
    title: "Money Back Guarantee",
    description: "we return money within 30 days"
  }
];


// Make data available globally
window.PRODUCTS_DATA = PRODUCTS_DATA;
window.FEATURES_DATA = FEATURES_DATA;
