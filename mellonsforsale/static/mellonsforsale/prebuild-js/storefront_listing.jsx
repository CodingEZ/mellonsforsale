import React from "react";
import $ from "jquery";
import { ajaxFailure, getCSRFToken } from "./helpers.js";
import StorefrontItem from "./item/storefront_item.jsx";

let user_pos;

function getUserLat() {
    if (user_pos) {
        return user_pos.lat;
    }
}

function getUserLng() {
    if (user_pos) {
        return user_pos.lng;
    }
}

class StorefrontListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            continue_ajax: true,
            items: [],
            queryLabels: []
        };
    }

    componentDidMount() {
        this.update();

        this.interval = setInterval(() => {
            console.log(`Update at ${new Date().toISOString()}`);
            if (this.state.queryLabels.length > 0 && this.state.continue_ajax) {
                this.updateWithQueryLabels(this.state.queryLabels);
            } else {
                this.update();
            }
        }, 30000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    update() {
        $.ajax({
            url: "/get-storefront-listing",
            data: {
                csrfmiddlewaretoken: getCSRFToken()
            },
            type: "GET",
            dataType: "json"
        })
            .done((res) => {
                const item_list = res.items;
                this.setState({ items: item_list });
            })
            .fail((res) => {
                this.setState({
                    continue_ajax: false
                });
                console.log(res);
            });
    }

    updateWithQueryLabels(queryLabels) {
        if (queryLabels.length == 0) {
            this.update();
        } else {
            $.ajax({
                url: "/filter-item-listing",
                data: {
                    query_labels: JSON.stringify(queryLabels),
                    csrfmiddlewaretoken: getCSRFToken(),
                    user_lng: getUserLng(),
                    user_lat: getUserLat()
                },
                type: "GET",
                dataType: "json"
            })
                .done((item_list) => {
                    this.setState({
                        items: item_list,
                        queryLabels
                    });
                })
                .fail(ajaxFailure);
        }
    }

    render() {
        const grid = [];
        if (this.state.items.length > 0) {
            for (let i = 0; i < this.state.items.length; i++) {
                const obj = this.state.items[i];
                grid.push(
                    <StorefrontItem key={obj.id.toString()} item_object={obj} />
                );
            }
        } else {
            grid.push(<p key="none">Currently, no one else has items up for sale.</p>);
        }

        return (
            <div id="item_listing">
                <h4>Item Listing</h4>
                {grid}
            </div>
        );
    }
}

export default StorefrontListing;
