import React from "react";
import { ajaxFailure, getCSRFToken } from "./helpers.js";
import CategoryListing from "./category_listing.jsx";

class FilterListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter_list: [],
            location_value: 0
        };
    }

    componentDidMount() {
        this.update();
    }

    update() {
        $.ajax({
            url: "/get-filter-listing",
            data: {
                csrfmiddlewaretoken: getCSRFToken()
            },
            type: "GET",
            dataType: "json"
        })
            .done((res) => {
                const new_filter_list = res.categories;
                this.setState({ filter_list: new_filter_list });
            })
            .fail(ajaxFailure);
    }

    handleChange(e) {
        this.setState({
            location_value: e.target.value
        });
    }

    render() {
        return (
            <form id="filter_list">
                <h4>Filters</h4>
                {
                    this.state.filter_list.map((obj) => <CategoryListing key={obj.id} category_list_object={obj} />)
                }
                <span> Within (x) distance from my location (km): </span>
                <span>
                    <input id="id_location_input" type="number" value={this.state.location_value} onChange={(e) => this.handleChange(e)} />
                </span>

                <input type="hidden" name="csrfmiddlewaretoken" value={getCSRFToken()} />
                <div>
                    <button id="id_filter_submit">Submit</button>
                </div>
            </form>
        );
    }
}

export default FilterListing;
