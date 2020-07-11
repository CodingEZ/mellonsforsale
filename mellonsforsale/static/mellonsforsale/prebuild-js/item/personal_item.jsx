import React from "react";
import BaseItem from "./base_item.jsx";

class PersonalItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            obj: props.item_object,
            item: new BaseItem(props)
        };
    }

    make_body_component() {
        const obj = this.state.obj;
        return (
            <div className="card-body">
                <strong> Description: </strong>
                {obj.description}
                <br />

                <strong> Location: </strong>
                {obj.street + ", " + obj.city + ", " + obj.state + " " + obj.zipcode}
                <br />

                <strong> Price: </strong>
                {"$" + obj.price}
                <br />

                <strong> Seller: </strong>
                <a href={"/profiles/" + obj.seller.id}>
                    {obj.seller.first_name + " " + obj.seller.last_name}
                </a>
                <br />

                <strong> Interested: </strong>
                <br />
                <div>{this.addNames()}</div>
            </div>
        );
    }

    make_deletable_component() {
        return this.state.item.make_deletable_component();
    }

    make_interest_component() {
        // personal items don't need an interest button
        return <a />;
    }

    addNames() {
        const obj = this.state.obj;
        const strongs = [];

        if (obj.interested_users.length > 0) {
            for (let i = 0; i < obj.interested_users.length; i++) {
                const user = obj.interested_users[i];
                const result = (
                    <div key={`item_${obj.id}_user_${user.id}`}>
                        <a href={"/profiles/" + user.id}>
                            {user.first_name + " " + user.last_name}
                        </a>
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
        return strongs;
    }

    render() {
        const obj = this.state.obj;
        const body_component = this.make_body_component();
        const deletable_component = this.make_deletable_component();

        return (
            <div id={obj.id} className="card">
                <div className="card-title centered-content">
                    <strong>
                        {"Name: " + obj.name}
                    </strong>
                </div>
                {body_component}
                <div className="card-footer">
                    {deletable_component}
                </div>
            </div>
        );
    }
}

export default PersonalItem;
