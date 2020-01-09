import React, {Component} from 'react';
import ReactQuill from 'react-quill'; 

import '../../css/text_editor_style.css';

class Editable_Area extends Component{

    constructor(props){
        super(props);  

        this.state = {
            modules: {
                toolbar: [
                    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                    [{size: []}],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{'list': 'ordered'}, {'list': 'bullet'}, 
                     {'indent': '-1'}, {'indent': '+1'}],
                    ['link', 'image', 'video'],
                    ['clean']
              ]
            },
            formats: [
                'header', 'font', 'size',
                'bold', 'italic', 'underline', 'strike', 'blockquote',
                'list', 'bullet', 'indent',
                'link', 'image', 'video'
              ],
            clipboard: {
                matchVisual: false,
            }
        }
    }

  
    render(){
        return (
            <div className="text-editor" >
                <ReactQuill
                value={this.props.value}
                onChange={this.props.changeContent}
                modules={this.state.modules}
                formats={this.state.formats}
                theme={"snow"} // pass false to use minimal theme
                />
          </div>
        );
    }
}

export default Editable_Area;