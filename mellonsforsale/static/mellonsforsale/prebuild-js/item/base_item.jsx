import React from "react";

function delete_item(id) {
    if (confirm("Confirm to delete this item?")) {
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

class BaseItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            obj: props.item_object
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
                {obj.street + ", " + obj.city + " " + obj.state + ", " + obj.zipcode}
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
                <a href={obj.seller.id}>
                    {" "}
                    {obj.seller.first_name + " " + obj.seller.last_name}
                    {" "}
                </a>
                {" "}
                <br />
            </div>
        );
    }

    make_deletable_component() {
        const obj = this.state.obj;
        if (!obj.is_deletable) {
            return <a />;
        }
        const button = (
            <button>Delete</button>
        );
        button.onclick = () => {
            delete_item(this.state.obj.id);
        };
        return button;
    }

    render() {
        const obj = this.props.item_object;
        const body_component = this.make_body_component();
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
                </div>
            </div>
        );
    }
}

export default BaseItem;
