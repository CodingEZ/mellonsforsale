import React from "react";
import $ from "jquery";
import { ajaxFailure, getCSRFToken } from "./helpers.js";
import PersonalInterestItem from "./item/personal_interest_item.jsx";

class PersonalInterestItemListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: props.first_name,
            last_name: props.last_name,
            username: props.username,
            items: []
        };
    }

    componentDidMount() {
        this.update();
    }

    update() {
        $.ajax({
            url: "/get-item-listing",
            data: {
                interest_username: this.state.username,
                destroyable: false,
                csrfmiddlewaretoken: getCSRFToken()
            },
            type: "GET",
            dataType: "json"
        })
            .done((item_list) => {
                this.setState({ items: item_list });
                console.log("Successful interest listing initialization!");
            })
            .fail(ajaxFailure);
    }

    render() {
        const grid = [];
        if (this.state.items.length > 0) {
            for (let i = 0; i < this.state.items.length;) {
                const obj = this.state.items[i];
                grid.push(
                    <PersonalInterestItem key={obj.id.toString()} item_object={obj} />
                );
            }
        } else {
            grid.push(<p key="none">Currently not interested in any items.</p>);
        }

        return (
            <div id="item_listing">
                <h4>
                    Items of expressed interested from
                    {`${this.state.first_name} ${this.state.last_name}`}
                </h4>
                {grid}
            </div>
        );
    }
}

export default PersonalInterestItemListing;
