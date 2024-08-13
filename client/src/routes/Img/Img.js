import React, { useEffect, useContext, useState } from "react";
import { Context } from "../../Store";
import "./styles.css";

export default (prop) => {
  const [state, dispatch] = useContext(Context);
  const [query, setQuery] = useState();
  const [image, setImage] = useState();
  const [searching, setSearching] = useState(false);

  const handleClick = async () => {
    setSearching(true);
    setImage(undefined);
    const response = await fetch(`${state.base}/api/image?query=${encodeURIComponent(query)}`);
    const encodedImage = await response.json();

    console.log(encodedImage.a)
    setImage(`data:image/png;base64,${encodedImage.a}`);
    setSearching(false);
  }

  return (
    <div className="home">
      <div className="banner__home">
        <div className="banner-heading__home">
          <h1>Clean Image
        <span className="banner-icon__home material-icons">
              image_search
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
        <div className="img-container">
          {
            query &&
            <div className="img-item">
              <img id="preview" src={query} />
              <h3>Input</h3>
            </div>
          }
          {
            image != undefined ?
              <div className="img-item">
                <img id="result" src={image} />
                <h3>Result</h3>
                <p>Consistent white region represents forged part of image</p>
              </div>
              :
              searching &&
              <div className="img-item">
                <div className="cssload-thecube">
                  <div className="cssload-cube cssload-c1"></div>
                  <div className="cssload-cube cssload-c2"></div>
                  <div className="cssload-cube cssload-c4"></div>
                  <div className="cssload-cube cssload-c3"></div>
                </div>

                <p>Consistent white region represents forged part of image</p>
              </div>
          }
        </div>
      </div>
    </div>
  )
}