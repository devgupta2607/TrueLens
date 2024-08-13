import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../Store";
import "./styles.css";

export default (prop) => {

  return (
    <div className="home">
      <div className="banner__home">
        <div className="banner-heading__home">
          <h1>Clean News
        <span className="banner-icon__home material-icons">
        policy
        </span>
          </h1>
        </div>

        <div className="search__home" id="link-box">
          <Link to="/nc/"><div className="nav-btns">Clean Bulletin<span className="banner-icon__home material-icons">
            article
          </span></div></Link>
          <Link to="/ia/"><div className="nav-btns">Clean Image<span className="banner-icon__home material-icons">
            image_search
        </span></div></Link>
        <Link to="/ecomm/"><div className="nav-btns">Clean Reviews (Ecomm)<span className="banner-icon__home material-icons">
            shopping_bag
        </span></div></Link>
        </div>

      </div>
    </div>
  )
}