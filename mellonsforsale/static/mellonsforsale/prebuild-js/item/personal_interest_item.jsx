import React from "react";
import InterestItem from "./interest_item.jsx";

class PersonalInterestItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            obj: props.item_object,
            item: new InterestItem(props)
        };
    }

    make_body_component() {
        const obj = this.state.obj;

        return (
            <div className="card-body">
                <strong> Description:  </strong>
                {" "}
                {obj.description}
                {" "}
                <br />
                <strong> Location: </strong>
                {" "}
                {obj.location}
                {" "}
                <br />
                <strong> Price: </strong>
                {" "}
                $
                {obj.price}
                {" "}
                <br />
                <strong> Seller: </strong>
                {" "}
                <a href={obj.seller_id}>
                    {" "}
                    {obj.seller_name}
                    {" "}
                </a>
                {" "}
                <br />
                <strong> Interested: </strong>
                {" "}
                {this.addNames()}
                {" "}
                <br />
            </div>
        );
    }

    make_deletable_component() {
        return this.state.item.make_deletable_component();
    }

    make_interest_component() {
        return this.state.item.make_interest_component();
    }

    addNames() {
        const obj = this.state.obj;
        const strongs = [];

        if (obj.interested_users.length > 0) {
            for (let i = 0; i < obj.interested_users.length; i++) {
                const user = obj.interested_users[i];
                const result = (
                    <div key={`item_${obj.id}_user_${user.id}`}>
                        <a href={user.link}>{user.name}</a>
                    </div>
                );
                strongs.push(result);
            }
        } else {
            strongs.push(
                <div key={`item_${obj.id}_user_none`}>
                    <a> No one has indicated interest for this item </a>
                </div>
            );
        }
        return (strongs);
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

export default PersonalInterestItem;
