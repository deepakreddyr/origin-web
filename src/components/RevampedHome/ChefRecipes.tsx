import React from 'react';

const ChefRecipes = () => {
  return (
    <section className="section-pad texture-paper">
      <div className="wrap">
        <div data-reveal="true" style={{ marginBottom: '40px' }}>
          <span className="eyebrow">Recipes by Our Partner Chefs</span>
        </div>
        <div className="grid grid-2" data-reveal="true">
          <article className="card">
            <div className="media media--16-9 media--video">
              <iframe
                src="https://www.youtube-nocookie.com/embed/WEAQ1G6audI"
                title="Grilled Peach — Chef Rhea"
                referrerPolicy="strict-origin-when-cross-origin"
                frameBorder="0"
                allow="accelerometer; autoPlay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
            <div className="card__body">
              <p className="card__title">Grilled Peach</p>
              <p className="card__meta">by Chef Rhea from Klaa Kitchen</p>
            </div>
          </article>
          <article className="card">
            <div className="media media--16-9 media--video">
              <iframe
                src="https://www.youtube-nocookie.com/embed/YUxUvo75tUw"
                title="Berry Salad — Chef Sanjana"
                referrerPolicy="strict-origin-when-cross-origin"
                frameBorder="0"
                allow="accelerometer; autoPlay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
            <div className="card__body">
              <p className="card__title">Berry Salad</p>
              <p className="card__meta">by Chef Sanjana from Urban Fork</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ChefRecipes;
