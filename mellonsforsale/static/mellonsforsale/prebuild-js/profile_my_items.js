import ReactDOM from "react-dom";
import React from "react";
import $ from "jquery";
import PersonalItemListing from "./personal_item_listing.jsx";
import PersonalInterestItemListing from "./personal_interest_item_listing.jsx";

$(document).ready(() => {
    ReactDOM.render(
        <PersonalItemListing />,
        document.getElementById("profile_items")
    );

    ReactDOM.render(
        <PersonalInterestItemListing />,
        document.getElementById("interest_items")
    );
});
