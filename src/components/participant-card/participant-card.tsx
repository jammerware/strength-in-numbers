import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

export default class ParticipantCard extends React.Component<{}, {}> {
    public render() {
        return (
            <Card>
                <CardContent>
                <Typography gutterBottom variant="headline" component="h2">
                    Lizard
                </Typography>
                <Typography component="p">
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                    across all continents except Antarctica
                </Typography>
                </CardContent>
            </Card>
        );
    }
}