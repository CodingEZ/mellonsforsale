import React from "react";
import $ from "jquery";
import { ajaxFailure, getCSRFToken } from "./helpers.js";
import PersonalItem from "./item/personal_item.jsx";

class PersonalItemListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        };
    }

    componentDidMount() {
        this.update();

        this.interval = setInterval(() => {
            console.log(`Update at ${new Date().toISOString()}`);
            this.update();
        }, 30000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    update() {
        $.ajax({
            url: "/get-personal-listing",
            data: {
                csrfmiddlewaretoken: getCSRFToken()
            },
            type: "GET",
            dataType: "json"
        })
            .done((res) => {
                const item_list = res.items;
                this.setState({ items: item_list });
                console.log("Successful own listing initialization!");
            })
            .fail(ajaxFailure);
    }

    render() {
        const grid = [];
        if (this.state.items.length > 0) {
            for (let i = 0; i < this.state.items.length; i++) {
                const obj = this.state.items[i];
                grid.push(
                    <PersonalItem key={obj.id.toString()} item_object={obj} update={this.update.bind(this)} />
                );
            }
        } else {
            grid.push(<p key="none">Currently has no items up for sale.</p>);
        }

        return (
            <div id="item_listing">
                {grid}
            </div>
        );
    }
}

export default PersonalItemListing;
