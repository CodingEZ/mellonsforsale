import ReactDOM from "react-dom";
import React from "react";
import $ from "jquery";
import { ajaxFailure, getCSRFToken } from "./helpers";

class PersonalItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            obj: props.item_object,
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

    addNames() {
        const obj = this.props.item_object;
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

    delete() {
        if (confirm("Confirm to delete this item?")) {
            const { id } = this.state.obj;
            const { update } = this.state;
            $.ajax({
                url: `/delete_item/${id}`,
                data: {
                    csrfmiddlewaretoken: getCSRFToken()
                },
                type: "POST",
                dataType: "json"
            })
                .done((response) => {
                    if (response == "") {
                        console.log("Successful item deletion!");
                        update();
                    } else {
                        alert("Error occurred.");
                        console.log(response);
                    }
                })
                .fail(ajaxFailure);
        }
    }

    render() {
        const { obj } = this.state;

        if (obj.deletable) {
            return (
                <div className="card">
                    <div className="card-title centered-content">
                        <strong> Name: </strong>
                        <input id={`name_${obj.id}`} type="text" value={obj.name} onChange={(e) => this.handleChange("name", e)} />
                    </div>

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

                    <div className="card-footer">
                        <button id={`delete_${obj.id}`} className="item-delete" onClick={() => { this.delete(); }}>
                            {obj.delete_text}
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div id={`item${obj.id}`} className="card">
                <div className="card-title">
                    <strong>
                        Name:
                        {obj.name}
                    </strong>
                </div>
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
                <div className="card-footer">
                    <a />
                </div>
            </div>
        );
    }
}

class PersonalListing extends React.Component {
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

        this.interval = setInterval(() => {
            console.log(`Update at ${new Date().toISOString()}`);
            this.update();
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    update() {
        $.ajax({
            url: "/get-item-listing",
            data: {
                include_username: this.state.username,
                destroyable: true,
                csrfmiddlewaretoken: getCSRFToken()
            },
            type: "GET",
            dataType: "json"
        })
            .done((item_list) => {
                this.setState({ items: item_list });
                console.log("Successful own listing initialization!");
            })
            .fail(ajaxFailure);
    }

    render() {
        const grid = [];
        if (this.state.items.length > 0) {
            for (let i = 0; i < this.state.items.length;) {
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
                <h4>
                    Items owned by
                    {`${this.state.first_name} ${this.state.last_name}`}
                </h4>
                <div id="update" className="centered-content" />
                {grid}
            </div>
        );
    }
}

class InterestItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            obj: props.item_object
        };
    }

    addNames() {
        const obj = this.props.item_object;
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

    handleClick(id) {
        $.ajax({
            url: `/interested/${id}`,
            data: {
                csrfmiddlewaretoken: getCSRFToken()
            },
            type: "POST",
            dataType: "json"
        })
            .done((response) => {
                if (response == "") {
                    if ($(`#${id} button`)[0].id == "star") { $(`#${id} button`)[0].id = "star_yellow"; } else { $(`#${id} button`)[0].id = "star"; }
                } else {
                    response = JSON.parse(response);
                    console.log(`An error occurred. ${response.message}`);
                }
            })
            .fail(ajaxFailure);
    }

    render() {
        const obj = this.props.item_object;

        const body_component = (
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

        let interest_button_id;
        if (obj.me_interested) {
            interest_button_id = "star_yellow";
        } else {
            interest_button_id = "star";
        }
        const interest_component = (
            <div>
                <button id={interest_button_id} onClick={() => this.handleClick(obj.id)}>
                    <strong> Interested &#9734; </strong>
                </button>
            </div>
        );

        let deletable_component;
        if (obj.deletable) {
            deletable_component = (
                <a id="delete" href={obj.delete_url}>
                    {" "}
                    {obj.delete_text}
                    {" "}
                </a>
            );
        } else {
            deletable_component = <a />;
        }

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

class InterestListing extends React.Component {
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
                    <InterestItem key={obj.id.toString()} item_object={obj} />
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

function edit_item(item_id) {
    $.ajax({
        url: `/edit_item/${item_id}`,
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

$(document).ready(() => {
    ReactDOM.render(
        <PersonalListing />,
        document.getElementById("profile_items")
    );

    ReactDOM.render(
        <InterestListing />,
        document.getElementById("interest_items")
    );
});
