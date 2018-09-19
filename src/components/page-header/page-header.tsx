import * as React from 'react';
import { Typography } from '@material-ui/core';

interface PageHeaderProps {
    title: string;
    subtitle: string;
}

export default class PageHeader extends React.Component<PageHeaderProps, {}> {
    public render() {
        return (
            <div className="page-header-component" style={{ marginBottom: '1.5rem' }}>
                <Typography variant="display2">{this.props.title}</Typography>
                <Typography variant="subheading">{this.props.subtitle}</Typography>
            </div>
        );
    }
}