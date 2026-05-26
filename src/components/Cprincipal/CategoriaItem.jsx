// CategoriaItem.jsx
import React from 'react';
import '../../pages/principal/principal.css'

const CategoriaItem = ({ titulo, img }) => {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
      <article className="category-card">
        <div className="card-image-wrapper">
          <img src={img} alt={titulo} className="category-image" />
        </div>
        <h3 className="category-title">{titulo}</h3>
      </article>
    </div>
  );
};

export default CategoriaItem;