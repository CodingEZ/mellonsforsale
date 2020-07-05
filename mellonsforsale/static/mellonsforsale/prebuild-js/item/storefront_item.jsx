import React from "react";
import InterestItem from "./interest_item.jsx";

class StorefrontItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            obj: props.item_object
        };
    }

    make_body_component() {
        return InterestItem.make_body_component();
    }

    make_deletable_component() {
        return InterestItem.make_deletable_component();
    }

    make_interest_component() {
        return InterestItem.make_interest_component();
    }

    render() {
        const { obj } = this.state;
        const body_component = this.make_body_component();
        const interest_component = this.make_interest_component();

        return (
            <div id={obj.id} className="card">
                <span className="card-title centered-content">
                    <strong>
                        Name:
                        {obj.name}
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
