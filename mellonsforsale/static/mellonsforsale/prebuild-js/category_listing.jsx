import React from "react";

class CategoryListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = { obj: props.category_list_object };
    }

    render() {
        const { obj } = this.state;
        return (
            <div className="category">
                <h5>{obj.category}</h5>
                {
                    obj.labels.map((label) => (
                        <div className="label" key={label.id} data-label={label.id}>
                            <input type="checkbox" />
                            <span>{label.name}</span>
                        </div>
                    ))
                }
            </div>
        );
    }
}

export default CategoryListing;
