import React from 'react'
import Link from '@material-ui/core/Link'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const Issues = ({child}) => {
  const newIssueTitle = encodeURIComponent(child.get('name') + ' [enter more here]'),
        newIssueBody = encodeURIComponent(
          `[enter details about the issue with ${child.get('name')} here]\n\n` +
          `Leave this link here: http://localhost:3000/destiny-child-tools/childs/${child.get('id')}/`)
  return (
    <React.Fragment>
      <Box pt={4} pb={2} ml={0}>
        <Paper>
          <Box px={2} py={1}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h5">
                  {child.get('name')} Issues
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography align="right">
                  <Button
                    href={`https://github.com/LokiCoder/destiny-child-tools/issues/new?title=${newIssueTitle}&body=${newIssueBody}`}
                    target="_blank"
                    variant="contained">
                    Report an Issue {child.get('name') == '?' ? '' : 'with ' + child.get('name')}
                  </Button>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
      <Paper>
        <Box p={2}>
          <Typography>
            Live list of issues {child.get('name') == '?' ? '' : 'with ' + child.get('name')} coming soon. For now, see the {' '}
            <Link href={`https://github.com/LokiCoder/destiny-child-tools/issues?q=is%3Aissue+is%3Aopen+${child.get('id')}`} target="_blank">
              list on GitHub
            </Link>
            .
          </Typography>
        </Box>
      </Paper>
    </React.Fragment>
  )
}
export default Issues