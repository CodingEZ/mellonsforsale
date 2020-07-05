import ReactDOM from "react-dom";
import React from "react";
import $ from "jquery";
import { alertModified } from "./helpers";
import StorefrontListing from "./storefront_listing.jsx";
import FilterListing from "./filter_listing.jsx";

$(document).ready(() => {
    // set up as variables to be updated later
    ReactDOM.render(
        <FilterListing />,
        document.getElementById("storefront_filter_list")
    );
    const item_listing = ReactDOM.render(
        <StorefrontListing />,
        document.getElementById("storefront_item_listing")
    );

    $("#id_filter_submit").on("click", (event) => {
        event.preventDefault();
        const query_labels = new Array();

        const form_list = document.getElementById("filter_list");
        const categories = form_list.getElementsByClassName("category");
        for (let i = 0; i < categories.length; i++) {
            const labels = categories[i].getElementsByClassName("label");
            for (let j = 0; j < labels.length; j++) {
                const label_value = labels[j].getAttribute("data-label");
                if (label_value == null) {
                    alertModified("Label has no value.");
                    return;
                }

                // Safety check if string is a number
                const label_key = parseInt(label_value);
                if (isNaN(label_key)) {
                    alertModified("Attempted to pass non-integer data to the server.");
                    return;
                }

                if (labels[j].getElementsByTagName("input")[0].checked) {
                    query_labels.push(["key", label_key]);
                }
            }
        }

        // location input
        const input_box = document.getElementById("id_location_input");
        if (input_box != null) {
            const value = parseFloat(input_box.value);
            if (value == 0) {
                query_labels.push(["distance", 1000]);
            } else if (!isNaN(value) && value > 0) {
                if (value > 1000000) {
                    alert("Filter distance value too large! Try again.");
                    return;
                }
                query_labels.push(["distance", value]);
            } else {
                alert("Filter distance value in not a positive number! Try again.");
                return;
            }
        }

        item_listing.updateWithQueryLabels(query_labels);
    });
});
