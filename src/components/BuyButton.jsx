import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BuyButton({ course }) {
  const navigate = useNavigate();

  const handleBuy = () => {
    navigate(`/checkout/${course._id}`);
  };

  return (
    <button
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      onClick={handleBuy}
    >
      Buy Now (${course.price})
    </button>
  );
}
