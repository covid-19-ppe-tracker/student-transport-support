import React from 'react'
import { Box } from 'admin-bro'

const Dashboard = (props) => {
    console.log('props', props);
    return (
        <Box>
            <Documents docs={props.record.params.documents} />
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
        for (let d of this.props.docs) {
            container.push(
                <Document key={d.id} document={d} />
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

export default Dashboard
