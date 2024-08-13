
import React, { useEffect, useContext, useState } from "react";
import { Context } from "../../Store";
import "./styles.css";

const loadingTexts = ['Collecting Reviews', 'Analyzing Reviews', 'Finalizing Results'];
let intervalDots, intervalIndex;
export default (prop) => {
  const [state, dispatch] = useContext(Context);
  const [query, setQuery] = useState();
  const [reviews, setReviews] = useState([]);
  const [productimg,setProductimg] = useState()
  const [productname,setProductname] = useState();
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState();

  let dots = 0;
  let index = 0;

  const handleClick = async () => {
    setSearching(true);
    const response = await fetch(`${state.base}/api/ecomm?query=${encodeURIComponent(query)}`);
    const req_reviews = await response.json(); 

    //console.log(req_reviews.ecomm_reviews);
    setReviews(req_reviews.ecomm_reviews);
    setProductname(req_reviews.ecomm_reviews[0].product_title);
    setProductimg(req_reviews.ecomm_reviews[0].img_url);
    setSearching(false);
  }

  useEffect(() => {
    console.log(reviews);
  },[reviews]);

  if (!intervalDots) {
    intervalDots = setInterval(() => {
      dots = (dots + 1)%4;
      setLoading(loadingTexts[index] + ".".repeat(dots));
    }, 500);
  
    intervalIndex = setInterval(() => {
      index = (index + 1)%3;
    }, 4000);
  }

  const Card = ({review}) => {
    return (
      <div className="result-card__results">
        <span className="result-title__results">
            {review.review_title}
        </span>
        
        <span className="result-metadata__results">
        <span className="result-date__results">
            <span className="material-icons">signal_cellular_alt</span>
            <span style={{ marginLeft: "2px" }}>{review.sentiment}</span>
        </span>
        <span className={`result-date__results ${review.authenticity === "Fake" ? "fake" : "genuine"}`}>
            <span className="material-icons">{review.authenticity === "Fake" ? "gpp_maybe" : "gpp_good"}</span>
            <span style={{ marginLeft: "2px" }}>
                {review.authenticity === "Fake" ? "Potentially Fake" : "Verified News"}
            </span>
            </span>
        </span>
        
        <p className="result-desc__results">
        <b>Review: </b>
        {review.review_body}
        </p>
    </div>
    );
  }
  return (
    <div className="home">
      <div className="banner__home">
        <div className="banner-heading__home">
          <h1>Clean Reviews (Ecomm)
        <span className="banner-icon__home material-icons">
          shopping_bag
        </span>
          </h1>
        </div>

        <div className="search__home">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button onClick={handleClick}>
            <span className="material-icons">
              search
            </span>
          </button>
        </div>
        <div className="img-con">
          {
            
            reviews.length != 0 ?
            (
              <>
                <img src = {productimg}/>
                <h2>{productname}</h2>
                {
                  reviews.map((review,index) =>
                    <Card review={review} key={index}/>   
                  )
                }
              </>
            )
              :
              searching &&
              <div style={{ color: "#fff" }}>
                <div style={{ padding: "25px" }}>
                    <div className="cssload-thecube">
                        <div className="cssload-cube cssload-c1"></div>
                        <div className="cssload-cube cssload-c2"></div>
                        <div className="cssload-cube cssload-c4"></div>
                        <div className="cssload-cube cssload-c3"></div>
                    </div>
                    <div className="loading">{loading}</div>
                </div>
              </div>
          }
        </div>
      </div>
    </div>
  )
}