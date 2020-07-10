import React from "react";
import $ from "jquery";
import { ajaxFailure, getCSRFToken } from "../helpers.js";
import BaseItem from "./base_item.jsx";

function edit_item(item_id) {
    $.ajax({
        url: `/items/${item_id}/update`,
        data: {
            name: document.getElementById(`name_${item_id}`).value,
            description: document.getElementById(`description_${item_id}`).value,
            state: document.getElementById(`state_${item_id}`).value,
            city: document.getElementById(`city_${item_id}`).value,
            street: document.getElementById(`street_${item_id}`).value,
            zip: document.getElementById(`zip_${item_id}`).value,
            price: document.getElementById(`price_${item_id}`).value.replace(/[^0-9.]/g, ""),
            csrfmiddlewaretoken: getCSRFToken()
        },
        type: "POST",
        dataType: "json"
    })
        .done((response) => {
            if (response == "") {
                console.log("Successful update!");
                $("#update")[0].innerHTML = "<a> Updated ! </a> <br/>";

                setTimeout(() => {
                    $("#update")[0].innerHTML = "";
                }, 1000);
            } else {
                response = JSON.parse(response);
                console.log(`Error occurred during update. ${response.message}`);
            }
        })
        .fail(ajaxFailure);
}

class PersonalItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            obj: props.item_object,
            item: new BaseItem(props),

            update: props.update,

            info_is_updated: false,
            last_update: new Date()
        };
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            const now = new Date();
            if (this.state.info_is_updated && now - this.state.last_update > 10000) {
                this.setState({
                    info_is_updated: false,
                    last_update: now
                });

                const item_id = this.state.obj.id;
                edit_item(item_id);
            }
        }, 2000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    handleChange(label, e) {
        switch (label) {
        case "name":
            this.state.obj.name = e.target.value;
            break;
        case "description":
            this.state.obj.description = e.target.value;
            break;
        case "street":
            this.state.obj.street = e.target.value;
            break;
        case "city":
            this.state.obj.city = e.target.value;
            break;
        case "state":
            this.state.obj.state = e.target.value;
            break;
        case "zip":
            this.state.obj.zip = e.target.value;
            break;
        case "price":
            this.state.obj.price = e.target.value;
            break;
        default:
            throw "No case for label. Potential new field not added to React UI.";
        }

        this.setState({
            info_is_updated: true,
            obj: this.state.obj
        });
    }

    make_body_component() {
        const obj = this.state.obj;
        return (
            <div className="card-body">
                <div className="form-section">
                    <div><strong> Description: </strong></div>
                    <div>
                        <input id={`description_${obj.id}`} type="text" value={obj.description} onChange={(e) => this.handleChange("description", e)} />
                    </div>
                </div>

                <div className="form-section">
                    <div>
                        {" "}
                        <strong> Location: </strong>
                        {" "}
                    </div>
                    <div>
                        <label id="location" htmlFor="street">Street: </label>
                    </div>
                    <div>
                        <input name="street" id={`street_${obj.id}`} type="text" value={obj.street} onChange={(e) => this.handleChange("street", e)} />
                    </div>

                    <div>
                        <label id="location" htmlFor="city">City: </label>
                    </div>
                    <div>
                        <input name="city" id={`city_${obj.id}`} type="text" value={obj.city} onChange={(e) => this.handleChange("city", e)} />
                    </div>

                    <div>
                        <label id="location" htmlFor="state">State :  </label>
                    </div>
                    <div>
                        <input name="state" id={`state_${obj.id}`} type="text" value={obj.state} onChange={(e) => this.handleChange("state", e)} />
                    </div>

                    <div>
                        <label id="location" htmlFor="zip">Zip : </label>
                    </div>
                    <div>
                        <input name="zip" id={`zip_${obj.id}`} type="text" value={obj.zip} onChange={(e) => this.handleChange("zip", e)} />
                    </div>
                </div>

                <div className="form-section">
                    <div><strong> Price ($): </strong></div>
                    <div>
                        <input id={`price_${obj.id}`} type="text" value={obj.price} onChange={(e) => this.handleChange("price", e)} />
                    </div>
                </div>

                <div className="form-section">
                    <div>
                        {" "}
                        <strong> Seller: </strong>
                        {" "}
                        <a href={obj.seller_id}>
                            {" "}
                            {obj.seller_name}
                            {" "}
                        </a>
                        {" "}
                    </div>
                    <div>
                        {" "}
                        <strong> Interested: </strong>
                        {" "}
                        {this.addNames()}
                        {" "}
                    </div>
                </div>
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
                    <strong> Name: </strong>
                    <input id={`name_${obj.id}`} type="text" value={obj.name} onChange={(e) => this.handleChange("name", e)} />
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
