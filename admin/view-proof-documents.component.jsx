import React from 'react'
import { Box } from 'admin-bro'

const Panel = (props) => {
    console.log('props', props);
    return (
        <Box>
            <Documents documents={props.record.populated.documents} />
        </Box>
    )
}
class Document extends React.Component {
    render() {
        return (
            <li >
                <a href={this.props.document.uri} target="_blank">{this.props.document.uri}</a>
            </li>
        )
    }
}
class Documents extends React.Component {
    generateLinks() {
        let container = [];
        for (let d of this.props.documents) {
            container.push(
                <Document key={d.params.id} document={d.params} />
            )
        }
        return container;
    }
    render() {
        return (
            <ul>
                {this.generateLinks()}
            </ul>
        );
    }
}

export default Panel
