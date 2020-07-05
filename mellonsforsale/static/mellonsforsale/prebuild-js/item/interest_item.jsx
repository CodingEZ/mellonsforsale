import React from "react";
import $ from "jquery";
import { ajaxFailure, getCSRFToken } from "../helpers.js";
import BaseItem from "./base_item.jsx";

class InterestItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            obj: props.item_object,
            item: new BaseItem(props.item_object)
        };
    }

    make_body_component() {
        return this.state.item.make_body_component();
    }

    make_deletable_component() {
        return this.state.item.make_deletable_component();
    }

    make_interest_component() {
        const obj = this.state.obj;
        let interest_button_id;
        if (obj.me_interested) {
            interest_button_id = "star_yellow";
        } else {
            interest_button_id = "star";
        }
        return (
            <div>
                <button id={interest_button_id} onClick={() => this.handleClick(obj.id)}>
                    <strong> Interested &#9734; </strong>
                </button>
            </div>
        );
    }

    handleClick(id) {
        $.ajax({
            url: `/item-interest/${id}`,
            data: {
                csrfmiddlewaretoken: getCSRFToken()
            },
            type: "POST",
            dataType: "json"
        })
            .done((response) => {
                if (response == "") {
                    if ($(`#${id} button`)[0].id == "star") {
                        $(`#${id} button`)[0].id = "star_yellow";
                    } else {
                        $(`#${id} button`)[0].id = "star";
                    }
                } else {
                    response = JSON.parse(response);
                    console.log(`An error occurred. ${response.message}`);
                }
            })
            .fail(ajaxFailure);
    }

    render() {
        const obj = this.state.obj;
        const body_component = this.make_body_component();
        const interest_component = this.make_interest_component();
        const deletable_component = this.make_deletable_component();

        return (
            <div id={obj.id} className="card">
                <div className="card-title">
                    <strong>
                        Name:
                        {obj.name}
                    </strong>
                </div>
                {body_component}
                <div className="card-footer">
                    {deletable_component}
                    {interest_component}
                </div>
            </div>
        );
    }
}

export default InterestItem;
