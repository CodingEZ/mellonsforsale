import ReactDOM from "react-dom";
import React from "react";
import $ from "jquery";
import { ajaxFailure } from "./helpers.js";

class Item extends React.Component {
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

class Listing extends React.Component {
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
        }, 30000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    update() {
        $.ajax({
            url: "/get-item-listing",
            data: {
                include_username: this.state.username,
                destroyable: false,
                csrfmiddlewaretoken: getCSRFToken()
            },
            type: "GET",
            dataType: "json"
        })
            .done((item_list) => {
                this.setState({ items: item_list });
                console.log("Successful item listing initialization!");
            })
            .fail(ajaxFailure);
    }

    render() {
        const grid = [];
        if (this.state.items.length > 0) {
            for (let i = 0; i < this.state.items.length;) {
                const obj = this.state.items[i];
                grid.push(
                    <Item key={obj.id.toString()} item_object={obj} />
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
                {grid}
            </div>
        );
    }
}

$(document).ready(() => {
    ReactDOM.render(
        <Listing {...context} />,
        document.getElementById("profile_items")
    );
});
