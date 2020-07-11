import React from "react";
import InterestItem from "./interest_item.jsx";

class StorefrontItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            obj: props.item_object,
            item: new InterestItem(props)
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
        if (obj.is_interested) {
            interest_button_id = "star_yellow";
        } else {
            interest_button_id = "star";
        }
        return (
            <div>
                <button id={interest_button_id} onClick={() => this.handleClick(this, InterestItem, obj.id)}>
                    <strong> Interested &#9734; </strong>
                </button>
            </div>
        );
    }

    handleClick(item_component, ItemClass, id) {
        InterestItem.handleClick(item_component, ItemClass, id);
    }

    render() {
        const obj = this.state.obj;
        const body_component = this.make_body_component();
        const interest_component = this.make_interest_component();

        return (
            <div id={obj.id} className="card">
                <span className="card-title centered-content">
                    <strong>
                        {"Name: " + obj.name}
                    </strong>
                </span>
                {body_component}
                <div className="card-footer">
                    {interest_component}
                </div>
            </div>
        );
    }
}

export default StorefrontItem;
