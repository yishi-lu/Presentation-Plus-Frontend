import React, {Component} from 'react';
import { Dropdown } from 'react-bootstrap';

class Paging extends Component{

    constructor(props){
        super(props);

    }

    render(){

        let page_menu = [], index_first = 1, index_last = this.props.data_info.last_page;

        for(let i=index_first; i<=index_last; i++){
            page_menu.push(
            <Dropdown.Item key={i} name={this.props.data_info.path + "/?page=" + i} onClick={this.props.pagination}>Page: {i}</Dropdown.Item>
            )
        }

        // console.log(this.props);

        return(
            <nav aria-label="Page navigation">
                <ul className="pagination">
                    <li className="page-item">
                        <a className={this.props.styles.page_link + " page-link"} name={this.props.data_info.first_page_url} onClick={this.props.pagination}>First</a>
                    </li>
                    <li className="page-item">
                        {this.props.data_info.current_page == 1?
                            <a className="page-link">Prev</a>
                            :
                            <a className={this.props.styles.page_link + " page-link"} name={this.props.data_info.prev_page_url} onClick={this.props.pagination}>Prev</a>
                        }   
                    </li>
                    <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            Page: {this.props.data_info.current_page}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {page_menu}
                        </Dropdown.Menu>
                    </Dropdown>
                    <li className="page-item">
                        {this.props.data_info.current_page == index_last?
                            <a className="page-link">Next</a>
                            :
                            <a className={this.props.styles.page_link + " page-link"} name={this.props.data_info.next_page_url} onClick={this.props.pagination}>Next</a>
                        }  
                    </li>
                    <li className="page-item">
                        <a className={this.props.styles.page_link + " page-link"} name={this.props.data_info.last_page_url} onClick={this.props.pagination}>Last</a>
                    </li>
                </ul>
            </nav>
        );
    }
}

export default Paging;